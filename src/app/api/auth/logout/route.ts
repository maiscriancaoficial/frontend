import { NextRequest, NextResponse } from 'next/server';
import { invalidarSessao } from '@/lib/auth/auth-service';

export async function POST(request: NextRequest) {
  try {
    // Obtém o token do cookie
    const token = request.cookies.get('token')?.value;
    
    if (token) {
      // Invalida a sessão no banco de dados
      await invalidarSessao(token);
    }

    // Cria resposta com cookie limpo
    const resposta = NextResponse.json(
      { sucesso: true, mensagem: 'Logout realizado com sucesso!' },
      { status: 200 }
    );

    // Remove o cookie do token
    resposta.cookies.delete('token');

    return resposta;
  } catch (error) {
    console.error('Erro na API de logout:', error);
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}
