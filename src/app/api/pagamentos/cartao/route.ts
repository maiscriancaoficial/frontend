import { NextRequest, NextResponse } from 'next/server';

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
    const { amount, card, customer, installments = 1, metadata } = body;

    // Validar dados obrigatórios
    if (!amount || !card || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Criar transação de cartão no Pagar.me
    const cardData = {
      amount: amount, // Valor em centavos
      payment_method: 'credit_card',
      credit_card: {
        installments: installments,
        statement_descriptor: 'MAISCRIANCA',
        card: {
          number: card.number,
          holder_name: card.holder_name,
          exp_month: parseInt(card.exp_month),
          exp_year: parseInt(card.exp_year),
          cvv: card.cvv,
        },
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
      body: JSON.stringify(cardData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro do Pagar.me:', errorData);
      
      // Tratar erros específicos do cartão
      let errorMessage = 'Erro ao processar pagamento';
      
      if (errorData.errors) {
        const errors = errorData.errors;
        if (errors.some((e: any) => e.message?.includes('invalid card'))) {
          errorMessage = 'Dados do cartão inválidos';
        } else if (errors.some((e: any) => e.message?.includes('insufficient funds'))) {
          errorMessage = 'Cartão sem limite disponível';
        } else if (errors.some((e: any) => e.message?.includes('expired'))) {
          errorMessage = 'Cartão expirado';
        }
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: 400 }
      );
    }

    const result = await response.json();
    
    // Extrair informações da transação
    const transactionInfo = {
      id: result.id,
      status: result.status, // 'paid', 'refused', 'pending', etc.
      amount: result.amount,
      installments: installments,
      authorization_code: result.charges[0]?.last_transaction?.authorization_code || '',
      tid: result.charges[0]?.last_transaction?.tid || '',
      nsu: result.charges[0]?.last_transaction?.nsu || '',
      paid_at: result.charges[0]?.paid_at || null,
      refuse_reason: result.charges[0]?.last_transaction?.refuse_reason || null,
    };

    return NextResponse.json(transactionInfo);

  } catch (error) {
    console.error('Erro ao processar pagamento com cartão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
