import * as jose from 'jose';
import { TokenPayload, SessaoUsuario, VerificacaoToken } from './types';
import { Role } from '../../generated/prisma';

// Segredo utilizado para assinar os tokens JWT (ideal colocar no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'maiscrianca_segredo_temporario';
// Tempo de expiração do token (30 dias em segundos)
const JWT_EXPIRES_IN = 60 * 60 * 24 * 30;

/**
 * Gera um token JWT para o usuário autenticado
 */
export async function gerarToken(usuario: SessaoUsuario): Promise<string> {
  const payload: TokenPayload = {
    sub: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role
  };
  
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // 30 dias
    .sign(secret);
}

/**
 * Verifica se um token JWT é válido
 */
export async function verificarToken(token: string): Promise<VerificacaoToken> {
  if (!token) {
    console.log('[JWT] Token ausente');
    return { valido: false, expirado: false };
  }

  try {
    console.log('[JWT] Tentando verificar token com segredo:', JWT_SECRET.substring(0, 3) + '...');
    console.log('[JWT] Token a verificar (primeiros caracteres):', token.substring(0, 10) + '...');
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    console.log('[JWT] Token decodificado com sucesso:', JSON.stringify(payload));
    
    const usuario: SessaoUsuario = {
      id: payload.sub as string,
      nome: payload.nome as string,
      email: payload.email as string,
      role: payload.role as Role
    };
    console.log('[JWT] Usuário extraído:', JSON.stringify(usuario));

    return { 
      valido: true, 
      expirado: false, 
      usuario 
    };
  } catch (error) {
    console.log('[JWT] Erro ao verificar token:', (error as Error).name, (error as Error).message);
    
    if ((error as Error).message.includes('expired')) {
      return { valido: false, expirado: true };
    }

    return { valido: false, expirado: false };
  }
}

/**
 * Extrai o token JWT do cabeçalho de autorização
 */
export function extrairTokenDoCabecalho(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
}
