import { NextRequest, NextResponse } from 'next/server';
import { verificarToken } from './lib/auth/jwt';
import { Role } from './generated/prisma';


// Rotas públicas que não precisam de autenticação
const rotasPublicas = [
  '/',
  '/produtos',
  '/produto/.*',
  '/blog',
  `/carrinho`,
  `/checkout`,
  `/personalizar-avatar`,
  `/central-atendimento`,
  `/como-personalizar`,
  `/duvidas-frequentes`,
  `/formas-pagamento`,
  `/nossa-historia`,
  `/politica-privacidade`,
  `/politica-cookies`,
  `/politica-reembolso`,
  `/termos-condicoes`,
  `/quem-somos`,
  `/categoria-livro/.*`,
  '/blog/.*',
  '/contato',
  '/sobre',
  '/login',
  '/registro',
  
  // Apenas a página principal da conta é pública, as subpáginas precisam de autenticação
  '/conta',
  
  '/recuperar-senha',
  '/api/auth/login',
  '/api/auth/registro',
  '/api/auth/session',
  '/debug-auth',
  '/api/debug/.*',
  
  // APIs públicas do blog
  '/api/postagens',
  '/api/categorias-blog',
  
  // APIs públicas de livros
  '/api/livros/.*',
  '/api/categorias/.*',
  '/api/produtos/.*'
];

// Regras de redirecionamento baseadas em role
const regrasPorRole: Record<string, string> = {
  'ADMIN': '/dashboard/admin',
  'FUNCIONARIO': '/dashboard/funcionario',
  'CLIENTE': '/conta',
  'ASSINANTE': '/conta',
  'AFILIADO': '/dashboard/afiliado'
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  console.log(`[MIDDLEWARE] Processando rota: ${pathname}`);
  console.log(`[MIDDLEWARE] Token presente: ${token ? 'Sim' : 'Não'}`);
  
  // Verifica se a rota atual é pública
  const ehRotaPublica = rotasPublicas.some(rota => {
    if (rota.includes('.*')) {
      // Para padrões com curingas, removemos os marcadores ^ e $ para permitir correspondência parcial
      const pattern = rota.replace('.*', '').replace(/\$/g, '');
      return pathname.startsWith(pattern);
    } else {
      // Para rotas exatas, usamos comparação exata
      return pathname === rota;
    }
  });
  console.log(`[MIDDLEWARE] É rota pública: ${ehRotaPublica ? 'Sim' : 'Não'}`);
  
  // Rota '/conta' é pública, mas subpáginas como '/conta/pedidos' precisam de autenticação
  // A verificação já está coberta pelas rotasPublicas, não precisamos de lógica adicional aqui

  // Se for rota pública, permite acesso
  if (ehRotaPublica) {
    console.log(`[MIDDLEWARE] Permitindo acesso à rota pública: ${pathname}`);
    return NextResponse.next();
  }
  
  // Se não tem token, redireciona para login
  if (!token) {
    console.log(`[MIDDLEWARE] Token não encontrado, redirecionando para login`);
    const url = new URL('/login', request.url);
    url.searchParams.set('redirecionarPara', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Verifica validade do token
  const verificacao = await verificarToken(token);
  console.log(`[MIDDLEWARE] Verificação do token: valido=${verificacao.valido}, expirado=${verificacao.expirado}`);
  console.log(`[MIDDLEWARE] Usuário: ${verificacao.usuario ? JSON.stringify(verificacao.usuario) : 'não identificado'}`);

  // Se token for inválido ou expirado, redireciona para login
  if (!verificacao.valido || verificacao.expirado) {
    console.log(`[MIDDLEWARE] Token inválido ou expirado, redirecionando para login`);
    const resposta = NextResponse.redirect(new URL('/login', request.url));
    resposta.cookies.delete('token');
    return resposta;
  }
  
  // Verifica permissão baseada em role
  const { usuario } = verificacao;
  if (usuario) {
    // Se tentar acessar uma área que não tem permissão
    if (pathname.startsWith('/dashboard/admin') && usuario.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(regrasPorRole[usuario.role] || '/', request.url));
    }

    if (pathname.startsWith('/dashboard/funcionario') && 
        usuario.role !== 'ADMIN' && 
        usuario.role !== 'FUNCIONARIO') {
      return NextResponse.redirect(new URL(regrasPorRole[usuario.role] || '/', request.url));
    }

    if (pathname.startsWith('/dashboard/afiliado') && 
        usuario.role !== 'ADMIN' && 
        usuario.role !== 'AFILIADO') {
      return NextResponse.redirect(new URL(regrasPorRole[usuario.role] || '/', request.url));
    }
  }
  
  // Redireciona usuários autenticados para sua área apropriada se tentarem acessar login/registro
  if (pathname === '/login' || pathname === '/registro' || 
      pathname.startsWith('/auth/login') || pathname.startsWith('/auth/registro')) {
    // Se o usuário já estiver autenticado, redireciona para sua área apropriada
    if (token && verificacao.valido && !verificacao.expirado && usuario) {
      const destino = regrasPorRole[usuario.role] || '/conta';
      return NextResponse.redirect(new URL(destino, request.url));
    }
  }
  
  return NextResponse.next();
}

// Configurando em quais caminhos o middleware deve executar
export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos exceto:
     * 1. /_next (recursos estáticos do Next.js)
     * 2. /api/auth (rotas de API de autenticação)
     * 3. /assets
     * 4. /favicon.ico, /sitemap.xml, /robots.txt
     */
    '/((?!_next|assets|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
  // Removido runtime nodejs pois está usando jose que é compatível com Edge Runtime
};
