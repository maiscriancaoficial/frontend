import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtém o token da query string
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valido: false, mensagem: 'Token não informado' },
        { status: 400 }
      );
    }

    // Busca o token no banco de dados
    const tokenRecuperacao = await prisma.tokenReset.findUnique({
      where: { token },
      include: { usuario: true }
    });

    // Verifica se o token existe
    if (!tokenRecuperacao) {
      return NextResponse.json(
        { valido: false, mensagem: 'Token inválido' },
        { status: 400 }
      );
    }

    // Verifica se o token expirou
    const agora = new Date();
    if (tokenRecuperacao.expiresAt < agora) {
      await prisma.tokenReset.delete({
        where: { token }
      });

      return NextResponse.json(
        { valido: false, mensagem: 'Token expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        valido: true, 
        usuarioId: tokenRecuperacao.usuarioId,
        email: tokenRecuperacao.usuario.email
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro na API de verificação de token:', error);
    return NextResponse.json(
      { valido: false, mensagem: 'Erro ao verificar token' },
      { status: 500 }
    );
  }
}
