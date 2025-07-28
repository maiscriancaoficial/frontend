import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// Configuração do Asaas
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'; // Usar production: https://www.asaas.com/api/v3
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

interface ItemCarrinho {
  id: string;
  livroId: string;
  livroNome: string;
  livroPreco: number;
  livroPrecoPromocional?: number;
  livroCapa: string;
  avatar?: any;
  nomePersonagem: string;
  quantidade: number;
  tipo: string;
  adicionadoEm: string;
}

interface DadosCliente {
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { valor, dadosCliente, itens }: {
      valor: number;
      dadosCliente: DadosCliente;
      itens: ItemCarrinho[];
    } = await request.json();

    if (!ASAAS_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Chave da API do Asaas não configurada'
      }, { status: 500 });
    }

    // Validar dados obrigatórios
    if (!valor || !dadosCliente.nome || !dadosCliente.email || !itens.length) {
      return NextResponse.json({
        success: false,
        error: 'Dados obrigatórios não fornecidos'
      }, { status: 400 });
    }

    // 1. Criar cliente no Asaas (se não existir)
    let clienteAsaas;
    try {
      // Primeiro, tentar buscar cliente existente pelo email
      const buscarClienteResponse = await fetch(`${ASAAS_API_URL}/customers?email=${dadosCliente.email}`, {
        method: 'GET',
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      const clientesExistentes = await buscarClienteResponse.json();
      
      if (clientesExistentes.data && clientesExistentes.data.length > 0) {
        clienteAsaas = clientesExistentes.data[0];
      } else {
        // Criar novo cliente
        const criarClienteResponse = await fetch(`${ASAAS_API_URL}/customers`, {
          method: 'POST',
          headers: {
            'access_token': ASAAS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: dadosCliente.nome,
            email: dadosCliente.email,
            phone: dadosCliente.telefone.replace(/\D/g, ''),
            cpfCnpj: dadosCliente.cpf?.replace(/\D/g, ''),
            notificationDisabled: false,
          }),
        });

        if (!criarClienteResponse.ok) {
          const errorData = await criarClienteResponse.json();
          throw new Error(`Erro ao criar cliente: ${errorData.errors?.[0]?.description || 'Erro desconhecido'}`);
        }

        clienteAsaas = await criarClienteResponse.json();
      }
    } catch (error) {
      console.error('Erro ao gerenciar cliente:', error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao processar dados do cliente'
      }, { status: 500 });
    }

    // 2. Criar cobrança PIX no Asaas
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15); // 15 minutos

    const cobrancaData = {
      customer: clienteAsaas.id,
      billingType: 'PIX',
      value: valor,
      dueDate: new Date().toISOString().split('T')[0], // Data de hoje
      description: `Pedido - ${itens.map(item => item.livroNome).join(', ')}`,
      externalReference: `pedido_${Date.now()}`,
      pixAddressKey: null, // Usar chave PIX padrão da conta
      pixQrCodeId: null,
      callback: {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/sucesso`,
        autoRedirect: false
      }
    };

    const cobrancaResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cobrancaData),
    });

    if (!cobrancaResponse.ok) {
      const errorData = await cobrancaResponse.json();
      console.error('Erro na cobrança Asaas:', errorData);
      return NextResponse.json({
        success: false,
        error: `Erro ao criar cobrança: ${errorData.errors?.[0]?.description || 'Erro desconhecido'}`
      }, { status: 500 });
    }

    const cobranca = await cobrancaResponse.json();

    // 3. Gerar QR Code PIX
    const pixResponse = await fetch(`${ASAAS_API_URL}/payments/${cobranca.id}/pixQrCode`, {
      method: 'GET',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    let pixData = null;
    if (pixResponse.ok) {
      pixData = await pixResponse.json();
    }

    // 4. Salvar pedido no banco de dados
    try {
      const pedido = await prisma.pedido.create({
        data: {
          numero: `PED-${Date.now()}`,
          status: 'PENDENTE',
          valorTotal: valor,
          valorDesconto: 0,
          valorFrete: 0,
          metodoPagamento: 'PIX',
          statusPagamento: 'PENDENTE',
          dadosCliente: dadosCliente as any,
          observacoes: `Pedido criado via PIX - ID Asaas: ${cobranca.id}`,
          itens: {
            create: itens.map(item => ({
              livroId: item.livroId,
              quantidade: item.quantidade,
              precoUnitario: item.livroPrecoPromocional || item.livroPreco,
              precoTotal: (item.livroPrecoPromocional || item.livroPreco) * item.quantidade,
              dadosPersonalizacao: item.avatar ? {
                nomePersonagem: item.nomePersonagem,
                avatar: item.avatar
              } : null,
            }))
          },
          pagamentos: {
            create: {
              metodo: 'PIX',
              status: 'PENDENTE',
              valor: valor,
              dadosTransacao: {
                asaasPaymentId: cobranca.id,
                pixQrCode: pixData?.encodedImage,
                pixCopyAndPaste: pixData?.payload,
                expiresAt: expirationDate.toISOString()
              } as any,
            }
          }
        },
        include: {
          itens: true,
          pagamentos: true
        }
      });

      // 5. Retornar dados do PIX
      return NextResponse.json({
        success: true,
        data: {
          id: cobranca.id,
          pedidoId: pedido.id,
          status: cobranca.status,
          pixQrCode: pixData?.encodedImage,
          pixCopyAndPaste: pixData?.payload,
          expiresAt: expirationDate.toISOString(),
          value: valor
        }
      });

    } catch (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao salvar pedido no banco de dados'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro geral na API PIX:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Endpoint para consultar status do pagamento PIX
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

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
      return NextResponse.json({
        success: false,
        error: 'Erro ao consultar status do pagamento'
      }, { status: 500 });
    }

    const payment = await response.json();

    // Atualizar status no banco se necessário
    if (payment.status === 'CONFIRMED' || payment.status === 'RECEIVED') {
      try {
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
          }
        });

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
            status: 'CONFIRMADO',
            statusPagamento: 'PAGO',
          }
        });
      } catch (dbError) {
        console.error('Erro ao atualizar status no banco:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      status: payment.status,
      value: payment.value,
      paymentDate: payment.paymentDate
    });

  } catch (error) {
    console.error('Erro ao consultar status PIX:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
