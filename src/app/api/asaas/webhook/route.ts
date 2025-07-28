import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// Configuração do Asaas
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'; // Usar production: https://www.asaas.com/api/v3
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

interface AsaasWebhookPayload {
  event: string;
  payment: {
    object: string;
    id: string;
    dateCreated: string;
    customer: string;
    paymentLink?: string;
    value: number;
    netValue: number;
    originalValue?: number;
    interestValue?: number;
    description: string;
    billingType: string;
    status: string;
    pixTransaction?: any;
    confirmedDate?: string;
    paymentDate?: string;
    clientPaymentDate?: string;
    installmentNumber?: number;
    invoiceUrl?: string;
    invoiceNumber?: string;
    externalReference?: string;
    dueDate: string;
    originalDueDate: string;
    paymentFee?: number;
    deleted: boolean;
    anticipated: boolean;
    anticipable: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AsaasWebhookPayload = await request.json();
    
    console.log('Webhook Asaas recebido:', {
      event: body.event,
      paymentId: body.payment?.id,
      status: body.payment?.status
    });

    if (!body.payment?.id) {
      console.error('Webhook sem ID de pagamento');
      return NextResponse.json({ success: false, error: 'ID de pagamento não fornecido' }, { status: 400 });
    }

    const paymentId = body.payment.id;
    const event = body.event;
    const payment = body.payment;

    // Processar diferentes tipos de eventos
    switch (event) {
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_RECEIVED':
        await processarPagamentoConfirmado(paymentId, payment);
        break;
        
      case 'PAYMENT_OVERDUE':
        await processarPagamentoVencido(paymentId, payment);
        break;
        
      case 'PAYMENT_DELETED':
        await processarPagamentoCancelado(paymentId, payment);
        break;
        
      case 'PAYMENT_REFUNDED':
        await processarPagamentoReembolsado(paymentId, payment);
        break;
        
      default:
        console.log(`Evento não processado: ${event}`);
    }

    return NextResponse.json({ success: true, message: 'Webhook processado com sucesso' });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function processarPagamentoConfirmado(paymentId: string, payment: any) {
  try {
    console.log(`Processando pagamento confirmado: ${paymentId}`);

    // Atualizar pagamento no banco
    const pagamentosAtualizados = await prisma.pagamentoPedido.updateMany({
      where: {
        dadosTransacao: {
          path: ['asaasPaymentId'],
          equals: paymentId
        }
      },
      data: {
        status: 'CONFIRMADO',
        dataConfirmacao: new Date(),
        dadosTransacao: {
          asaasPaymentId: paymentId,
          paymentDate: payment.paymentDate,
          confirmedDate: payment.confirmedDate,
          clientPaymentDate: payment.clientPaymentDate,
          netValue: payment.netValue,
          paymentFee: payment.paymentFee,
          confirmedAt: new Date().toISOString()
        } as any,
      }
    });

    console.log(`${pagamentosAtualizados.count} pagamento(s) atualizado(s)`);

    // Atualizar pedido
    const pedidosAtualizados = await prisma.pedido.updateMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      },
      data: {
        status: 'CONFIRMADO',
        statusPagamento: 'PAGO',
      }
    });

    console.log(`${pedidosAtualizados.count} pedido(s) atualizado(s)`);

    // Buscar pedidos para criar histórico
    const pedidos = await prisma.pedido.findMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      },
      include: {
        itens: {
          include: {
            livro: true
          }
        }
      }
    });

    // Criar histórico para cada pedido
    for (const pedido of pedidos) {
      await prisma.historicoPedido.create({
        data: {
          pedidoId: pedido.id,
          status: 'CONFIRMADO',
          observacao: `Pagamento confirmado via webhook - ID: ${paymentId} - Valor: R$ ${payment.value}`,
          criadoPor: 'SISTEMA'
        }
      });

      // TODO: Enviar email de confirmação para o cliente
      console.log(`Email de confirmação deveria ser enviado para pedido ${pedido.numero}`);
      
      // TODO: Enviar email de notificação para admin
      console.log(`Notificação admin deveria ser enviada para pedido ${pedido.numero}`);
    }

  } catch (error) {
    console.error('Erro ao processar pagamento confirmado:', error);
    throw error;
  }
}

async function processarPagamentoVencido(paymentId: string, payment: any) {
  try {
    console.log(`Processando pagamento vencido: ${paymentId}`);

    // Atualizar pagamento no banco
    await prisma.pagamentoPedido.updateMany({
      where: {
        dadosTransacao: {
          path: ['asaasPaymentId'],
          equals: paymentId
        }
      },
      data: {
        status: 'EXPIRADO',
        dadosTransacao: {
          asaasPaymentId: paymentId,
          expiredAt: new Date().toISOString()
        } as any,
      }
    });

    // Atualizar pedido
    await prisma.pedido.updateMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      },
      data: {
        status: 'EXPIRADO',
        statusPagamento: 'EXPIRADO',
      }
    });

    // Criar histórico
    const pedidos = await prisma.pedido.findMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      }
    });

    for (const pedido of pedidos) {
      await prisma.historicoPedido.create({
        data: {
          pedidoId: pedido.id,
          status: 'EXPIRADO',
          observacao: `Pagamento expirado via webhook - ID: ${paymentId}`,
          criadoPor: 'SISTEMA'
        }
      });
    }

  } catch (error) {
    console.error('Erro ao processar pagamento vencido:', error);
    throw error;
  }
}

async function processarPagamentoCancelado(paymentId: string, payment: any) {
  try {
    console.log(`Processando pagamento cancelado: ${paymentId}`);

    // Atualizar pagamento no banco
    await prisma.pagamentoPedido.updateMany({
      where: {
        dadosTransacao: {
          path: ['asaasPaymentId'],
          equals: paymentId
        }
      },
      data: {
        status: 'CANCELADO',
        dadosTransacao: {
          asaasPaymentId: paymentId,
          cancelledAt: new Date().toISOString()
        } as any,
      }
    });

    // Atualizar pedido
    await prisma.pedido.updateMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      },
      data: {
        status: 'CANCELADO',
        statusPagamento: 'CANCELADO',
      }
    });

    // Criar histórico
    const pedidos = await prisma.pedido.findMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      }
    });

    for (const pedido of pedidos) {
      await prisma.historicoPedido.create({
        data: {
          pedidoId: pedido.id,
          status: 'CANCELADO',
          observacao: `Pagamento cancelado via webhook - ID: ${paymentId}`,
          criadoPor: 'SISTEMA'
        }
      });
    }

  } catch (error) {
    console.error('Erro ao processar pagamento cancelado:', error);
    throw error;
  }
}

async function processarPagamentoReembolsado(paymentId: string, payment: any) {
  try {
    console.log(`Processando pagamento reembolsado: ${paymentId}`);

    // Atualizar pagamento no banco
    await prisma.pagamentoPedido.updateMany({
      where: {
        dadosTransacao: {
          path: ['asaasPaymentId'],
          equals: paymentId
        }
      },
      data: {
        status: 'REEMBOLSADO',
        dadosTransacao: {
          asaasPaymentId: paymentId,
          refundedAt: new Date().toISOString(),
          refundValue: payment.value
        } as any,
      }
    });

    // Atualizar pedido
    await prisma.pedido.updateMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      },
      data: {
        status: 'REEMBOLSADO',
        statusPagamento: 'REEMBOLSADO',
      }
    });

    // Criar histórico
    const pedidos = await prisma.pedido.findMany({
      where: {
        pagamentos: {
          some: {
            dadosTransacao: {
              path: ['asaasPaymentId'],
              equals: paymentId
            }
          }
        }
      }
    });

    for (const pedido of pedidos) {
      await prisma.historicoPedido.create({
        data: {
          pedidoId: pedido.id,
          status: 'REEMBOLSADO',
          observacao: `Pagamento reembolsado via webhook - ID: ${paymentId} - Valor: R$ ${payment.value}`,
          criadoPor: 'SISTEMA'
        }
      });
    }

  } catch (error) {
    console.error('Erro ao processar pagamento reembolsado:', error);
    throw error;
  }
}

// Endpoint GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Webhook Asaas está funcionando',
    timestamp: new Date().toISOString()
  });
}
