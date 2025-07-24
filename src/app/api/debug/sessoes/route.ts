import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { verificarToken } from '@/lib/auth/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtém o token do cookie
    const token = request.cookies.get('token')?.value;

    // Status do token
    const tokenStatus = token ? verificarToken(token) : { valido: false, expirado: false };
    
    // Consulta sessões no banco de dados
    const sessoes = await prisma.sessao.findMany({
      take: 5, // Limita a 5 sessões para não sobrecarregar
      orderBy: { createdAt: 'desc' },
      include: { usuario: { select: { id: true, email: true, nome: true, role: true } } }
    });

    // Sessão atual se o token existir
    let sessaoAtual = null;
    if (token) {
      sessaoAtual = await prisma.sessao.findUnique({
        where: { token },
        include: { usuario: { select: { id: true, email: true, nome: true, role: true } } }
      });
    }

    return NextResponse.json({
      debug: true,
      temToken: !!token,
      tokenStatus,
      sessaoAtualEncontrada: !!sessaoAtual,
      sessaoAtual,
      contagemSessoes: await prisma.sessao.count(),
      sessoes
    });
  } catch (error) {
    console.error('Erro na API de debug de sessões:', error);
    return NextResponse.json({
      erro: 'Erro ao buscar informações de sessões',
      detalhes: (error as Error).message
    }, { status: 500 });
  }
}
