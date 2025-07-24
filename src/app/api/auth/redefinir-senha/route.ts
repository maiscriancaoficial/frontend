import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, novaSenha } = body;

    if (!token || !novaSenha) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Token e nova senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Busca o token no banco de dados
    const tokenRecuperacao = await prisma.tokenReset.findUnique({
      where: { token }
    });

    // Verifica se o token existe
    if (!tokenRecuperacao) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Token inválido' },
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
        { sucesso: false, mensagem: 'Token expirado' },
        { status: 400 }
      );
    }

    // Hash da nova senha com Argon2
    const senhaHash = await argon2.hash(novaSenha);

    // Atualiza a senha do usuário
    await prisma.usuario.update({
      where: { id: tokenRecuperacao.usuarioId },
      data: { senha: senhaHash }
    });

    // Remove o token utilizado
    await prisma.tokenReset.delete({
      where: { token }
    });

    // Invalida todas as sessões ativas do usuário para forçar novo login
    await prisma.sessao.deleteMany({
      where: { usuarioId: tokenRecuperacao.usuarioId }
    });

    return NextResponse.json(
      { sucesso: true, mensagem: 'Senha redefinida com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro na API de redefinição de senha:', error);
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao redefinir senha' },
      { status: 500 }
    );
  }
}
