import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// Configuração do Asaas
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'; // Usar production: https://www.asaas.com/api/v3
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;

    if (!paymentId) {
      return NextResponse.json({
        success: false,
        error: 'ID do pagamento é obrigatório'
      }, { status: 400 });
    }

    if (!ASAAS_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Chave da API do Asaas não configurada'
      }, { status: 500 });
    }

    // Consultar status no Asaas
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao consultar Asaas:', errorData);
      return NextResponse.json({
        success: false,
        error: 'Erro ao consultar status do pagamento'
      }, { status: 500 });
    }

    const payment = await response.json();

    // Mapear status do Asaas para nosso sistema
    let statusSistema = 'PENDENTE';
    let statusPagamento = 'PENDENTE';

    switch (payment.status) {
      case 'PENDING':
        statusSistema = 'PENDENTE';
        statusPagamento = 'PENDENTE';
        break;
      case 'CONFIRMED':
      case 'RECEIVED':
        statusSistema = 'CONFIRMADO';
        statusPagamento = 'PAGO';
        break;
      case 'OVERDUE':
        statusSistema = 'EXPIRADO';
        statusPagamento = 'EXPIRADO';
        break;
      case 'REFUNDED':
        statusSistema = 'REEMBOLSADO';
        statusPagamento = 'REEMBOLSADO';
        break;
      default:
        statusSistema = 'PENDENTE';
        statusPagamento = 'PENDENTE';
    }

    // Atualizar status no banco se necessário
    if (payment.status === 'CONFIRMED' || payment.status === 'RECEIVED') {
      try {
        // Atualizar pagamento
        await prisma.pagamentoPedido.updateMany({
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
              confirmedAt: new Date().toISOString()
            } as any,
          }
        });

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

        console.log(`Status atualizado para ${pedidosAtualizados.count} pedido(s)`);

        // Criar histórico do pedido
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
              status: 'CONFIRMADO',
              observacao: `Pagamento PIX confirmado - ID: ${paymentId}`,
              criadoPor: 'SISTEMA'
            }
          });
        }

      } catch (dbError) {
        console.error('Erro ao atualizar status no banco:', dbError);
        // Não falhar a requisição por erro no banco
      }
    }

    return NextResponse.json({
      success: true,
      status: payment.status,
      statusSistema,
      statusPagamento,
      value: payment.value,
      paymentDate: payment.paymentDate,
      dueDate: payment.dueDate,
      description: payment.description
    });

  } catch (error) {
    console.error('Erro ao consultar status PIX:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
