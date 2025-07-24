import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    // Por segurança, sempre retornamos sucesso mesmo se o email não existir
    // para evitar enumeração de usuários
    if (!usuario) {
      return NextResponse.json(
        { sucesso: true, mensagem: 'Se o email estiver cadastrado, você receberá um link de recuperação.' },
        { status: 200 }
      );
    }

    // Cria token de recuperação
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

    // Remover tokens anteriores do mesmo usuário
    await prisma.tokenReset.deleteMany({
      where: { usuarioId: usuario.id }
    });
    
    // Salva o token no banco
    await prisma.tokenReset.create({
      data: {
        token,
        usuarioId: usuario.id,
        expiresAt
      }
    });

    // Aqui implementaríamos o envio de email
    // Por ora, apenas simulamos que o email foi enviado

    console.log(`Link de recuperação: ${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?token=${token}`);

    return NextResponse.json(
      { 
        sucesso: true, 
        mensagem: 'Link de recuperação enviado. Verifique seu email.',
        // Em ambiente de desenvolvimento, retornamos o token para testes
        ...(process.env.NODE_ENV === 'development' && { 
          linkRecuperacao: `/redefinir-senha?token=${token}` 
        })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro na API de recuperação de senha:', error);
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}
