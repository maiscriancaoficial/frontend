import { NextRequest, NextResponse } from 'next/server';

const PAGARME_API_KEY = process.env.PAGARME_SECRET_KEY;
const PAGARME_BASE_URL = 'https://api.pagar.me/core/v5';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!PAGARME_API_KEY) {
      return NextResponse.json(
        { error: 'Chave do Pagar.me não configurada' },
        { status: 500 }
      );
    }

    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID do pedido não fornecido' },
        { status: 400 }
      );
    }

    // Consultar status no Pagar.me
    const response = await fetch(`${PAGARME_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(PAGARME_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao consultar Pagar.me:', errorData);
      return NextResponse.json(
        { error: 'Erro ao consultar status' },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Retornar status simplificado
    return NextResponse.json({
      id: result.id,
      status: result.status, // 'pending', 'paid', 'canceled', etc.
      paid_at: result.charges[0]?.paid_at || null,
      amount: result.amount,
    });

  } catch (error) {
    console.error('Erro ao consultar status PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
