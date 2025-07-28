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

interface DadosCartao {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
  parcelas: number;
}

export async function POST(request: NextRequest) {
  try {
    const { valor, dadosCliente, dadosCartao, itens }: {
      valor: number;
      dadosCliente: DadosCliente;
      dadosCartao: DadosCartao;
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

    // Validar dados do cartão
    if (!dadosCartao.numero || !dadosCartao.nome || !dadosCartao.validade || !dadosCartao.cvv) {
      return NextResponse.json({
        success: false,
        error: 'Dados do cartão incompletos'
      }, { status: 400 });
    }

    // 1. Criar/buscar cliente no Asaas
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

    // 2. Processar dados do cartão
    const [mes, ano] = dadosCartao.validade.split('');
    const mesFormatado = dadosCartao.validade.substring(0, 2);
    const anoFormatado = '20' + dadosCartao.validade.substring(2, 4);

    // 3. Criar cobrança com cartão no Asaas
    const cobrancaData = {
      customer: clienteAsaas.id,
      billingType: 'CREDIT_CARD',
      value: valor,
      dueDate: new Date().toISOString().split('T')[0], // Data de hoje
      description: `Pedido - ${itens.map(item => item.livroNome).join(', ')}`,
      externalReference: `pedido_${Date.now()}`,
      installmentCount: dadosCartao.parcelas,
      installmentValue: valor / dadosCartao.parcelas,
      creditCard: {
        holderName: dadosCartao.nome,
        number: dadosCartao.numero,
        expiryMonth: mesFormatado,
        expiryYear: anoFormatado,
        ccv: dadosCartao.cvv
      },
      creditCardHolderInfo: {
        name: dadosCliente.nome,
        email: dadosCliente.email,
        cpfCnpj: dadosCliente.cpf?.replace(/\D/g, ''),
        postalCode: '00000000', // CEP padrão - pode ser melhorado
        addressNumber: '0',
        phone: dadosCliente.telefone.replace(/\D/g, '')
      },
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
      
      // Mapear erros específicos do cartão
      let errorMessage = 'Erro ao processar pagamento';
      if (errorData.errors) {
        const firstError = errorData.errors[0];
        if (firstError.code === 'invalid_credit_card') {
          errorMessage = 'Dados do cartão inválidos';
        } else if (firstError.code === 'credit_card_declined') {
          errorMessage = 'Cartão recusado pela operadora';
        } else if (firstError.code === 'insufficient_funds') {
          errorMessage = 'Saldo insuficiente';
        } else {
          errorMessage = firstError.description || errorMessage;
        }
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage
      }, { status: 400 });
    }

    const cobranca = await cobrancaResponse.json();

    // 4. Salvar pedido no banco de dados
    try {
      const pedido = await prisma.pedido.create({
        data: {
          numero: `PED-${Date.now()}`,
          status: cobranca.status === 'CONFIRMED' ? 'CONFIRMADO' : 'PENDENTE',
          valorTotal: valor,
          valorDesconto: 0,
          valorFrete: 0,
          metodoPagamento: 'CARTAO_CREDITO',
          statusPagamento: cobranca.status === 'CONFIRMED' ? 'PAGO' : 'PENDENTE',
          dadosCliente: dadosCliente as any,
          observacoes: `Pedido criado via Cartão - ID Asaas: ${cobranca.id} - ${dadosCartao.parcelas}x`,
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
              metodo: 'CARTAO_CREDITO',
              status: cobranca.status === 'CONFIRMED' ? 'CONFIRMADO' : 'PENDENTE',
              valor: valor,
              parcelas: dadosCartao.parcelas,
              valorParcela: valor / dadosCartao.parcelas,
              dataConfirmacao: cobranca.status === 'CONFIRMED' ? new Date() : null,
              dadosTransacao: {
                asaasPaymentId: cobranca.id,
                installmentCount: dadosCartao.parcelas,
                installmentValue: valor / dadosCartao.parcelas,
                creditCardBrand: cobranca.creditCard?.creditCardBrand,
                creditCardToken: cobranca.creditCard?.creditCardToken,
                confirmedAt: cobranca.status === 'CONFIRMED' ? new Date().toISOString() : null
              } as any,
            }
          }
        },
        include: {
          itens: true,
          pagamentos: true
        }
      });

      // Criar histórico do pedido
      await prisma.historicoPedido.create({
        data: {
          pedidoId: pedido.id,
          status: cobranca.status === 'CONFIRMED' ? 'CONFIRMADO' : 'PENDENTE',
          observacao: `Pagamento com cartão ${cobranca.status === 'CONFIRMED' ? 'confirmado' : 'pendente'} - ID: ${cobranca.id}`,
          criadoPor: 'SISTEMA'
        }
      });

      // 5. Retornar dados do pagamento
      return NextResponse.json({
        success: true,
        data: {
          id: cobranca.id,
          pedidoId: pedido.id,
          status: cobranca.status,
          value: valor,
          installmentCount: dadosCartao.parcelas,
          installmentValue: valor / dadosCartao.parcelas,
          creditCardBrand: cobranca.creditCard?.creditCardBrand,
          paymentDate: cobranca.paymentDate
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
    console.error('Erro geral na API Cartão:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
