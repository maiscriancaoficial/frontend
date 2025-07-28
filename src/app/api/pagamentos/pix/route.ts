import { NextRequest, NextResponse } from 'next/server';

// Configuração do Pagar.me
const PAGARME_API_KEY = process.env.PAGARME_SECRET_KEY;
const PAGARME_BASE_URL = 'https://api.pagar.me/core/v5';

export async function POST(request: NextRequest) {
  try {
    if (!PAGARME_API_KEY) {
      return NextResponse.json(
        { error: 'Chave do Pagar.me não configurada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, customer, metadata } = body;

    // Validar dados obrigatórios
    if (!amount || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Criar transação PIX no Pagar.me
    const pixData = {
      amount: amount, // Valor em centavos
      payment_method: 'pix',
      pix: {
        expires_in: 900, // 15 minutos
      },
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        document: customer.document || '',
        type: customer.type || 'individual',
      },
      metadata: metadata || {},
    };

    const response = await fetch(`${PAGARME_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(PAGARME_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pixData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro do Pagar.me:', errorData);
      return NextResponse.json(
        { error: 'Erro ao criar PIX', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Extrair dados do PIX
    const pixInfo = {
      id: result.id,
      qr_code: result.charges[0]?.last_transaction?.qr_code || '',
      qr_code_url: result.charges[0]?.last_transaction?.qr_code_url || '',
      expires_at: result.charges[0]?.last_transaction?.expires_at || '',
      status: result.status,
    };

    return NextResponse.json(pixInfo);

  } catch (error) {
    console.error('Erro ao processar PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Verificar status do pagamento PIX
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID do pedido não fornecido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${PAGARME_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(PAGARME_API_KEY + ':').toString('base64')}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao consultar status' },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      id: result.id,
      status: result.status,
      paid_at: result.charges[0]?.paid_at || null,
    });

  } catch (error) {
    console.error('Erro ao consultar status PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
