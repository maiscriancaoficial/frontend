import { NextRequest, NextResponse } from 'next/server';
import { autenticarUsuario } from '@/lib/auth/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const resultado = await autenticarUsuario(email, senha);

    if (!resultado.sucesso) {
      return NextResponse.json(
        { sucesso: false, mensagem: resultado.mensagem },
        { status: 401 }
      );
    }

    // Cria resposta com o token
    const response = NextResponse.json(
      { 
        sucesso: true, 
        usuario: resultado.usuario
      },
      { status: 200 }
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
    console.error('Erro na API de login:', error);
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}
