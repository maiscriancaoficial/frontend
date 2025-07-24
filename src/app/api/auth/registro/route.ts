import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import * as argon2 from 'argon2';
import { autenticarUsuario } from '@/lib/auth/auth-service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, senha, confirmarSenha } = body;

    // Validação básica
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (senha !== confirmarSenha) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'As senhas não conferem' },
        { status: 400 }
      );
    }

    // Verifica se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Este email já está em uso' },
        { status: 409 }
      );
    }

    // Hash da senha com Argon2
    const senhaHash = await argon2.hash(senha);

    // Cria o usuário no banco de dados (como CLIENTE por padrão)
    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role: 'CLIENTE',
        ativo: true
      }
    });

    // Autentica o usuário recém-criado
    const resultado = await autenticarUsuario(email, senha);

    if (!resultado.sucesso) {
      return NextResponse.json(
        { sucesso: true, mensagem: 'Registro realizado com sucesso! Faça login para continuar.' },
        { status: 201 }
      );
    }

    // Cria resposta com o token
    const response = NextResponse.json(
      { 
        sucesso: true, 
        mensagem: 'Registro realizado com sucesso!',
        usuario: resultado.usuario
      },
      { status: 201 }
    );

    // Define o cookie com o token JWT
    response.cookies.set({
      name: 'token',
      value: resultado.token!,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erro na API de registro:', error);
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}
