import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET - Buscar métricas gerais do dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || '30'; // dias
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    // Calcular datas
    let startDate: Date;
    let endDate: Date = new Date();

    if (dataInicio && dataFim) {
      startDate = new Date(dataInicio);
      endDate = new Date(dataFim);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(periodo));
    }

    // Período anterior para comparação
    const diasPeriodo = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const startDateAnterior = new Date(startDate);
    startDateAnterior.setDate(startDateAnterior.getDate() - diasPeriodo);
    const endDateAnterior = new Date(startDate);

    // 1. MÉTRICAS DE PEDIDOS
    const [
      totalPedidosAtual,
      totalPedidosAnterior,
      pedidosDetalhados,
      pedidosAnteriores
    ] = await Promise.all([
      // Total de pedidos no período atual
      prisma.pedido.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      // Total de pedidos no período anterior
      prisma.pedido.count({
        where: {
          createdAt: {
            gte: startDateAnterior,
            lt: startDate
          }
        }
      }),
      // Pedidos detalhados do período atual
      prisma.pedido.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          valorTotal: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      // Pedidos do período anterior para comparação
      prisma.pedido.findMany({
        where: {
          createdAt: {
            gte: startDateAnterior,
            lt: startDate
          }
        },
        select: {
          valorTotal: true
        }
      })
    ]);

    // 2. CÁLCULOS DE MÉTRICAS
    
    // Receita total
    const receitaAtual = pedidosDetalhados.reduce((acc, pedido) => acc + pedido.valorTotal, 0);
    const receitaAnterior = pedidosAnteriores.reduce((acc, pedido) => acc + pedido.valorTotal, 0);
    const crescimentoReceita = receitaAnterior > 0 ? ((receitaAtual - receitaAnterior) / receitaAnterior) * 100 : 0;

    // Ticket médio
    const ticketMedioAtual = totalPedidosAtual > 0 ? receitaAtual / totalPedidosAtual : 0;
    const ticketMedioAnterior = totalPedidosAnterior > 0 ? receitaAnterior / totalPedidosAnterior : 0;
    const crescimentoTicketMedio = ticketMedioAnterior > 0 ? ((ticketMedioAtual - ticketMedioAnterior) / ticketMedioAnterior) * 100 : 0;

    // Crescimento de pedidos
    const crescimentoPedidos = totalPedidosAnterior > 0 ? ((totalPedidosAtual - totalPedidosAnterior) / totalPedidosAnterior) * 100 : 0;

    // Status dos pedidos
    const statusCount = pedidosDetalhados.reduce((acc, pedido) => {
      acc[pedido.status] = (acc[pedido.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tempo médio de entrega (baseado na diferença entre criação e última atualização para pedidos entregues)
    const pedidosEntregues = pedidosDetalhados.filter(p => 
      p.status === 'ENTREGUE'
    );
    
    let tempoMedioEntrega = 0;
    if (pedidosEntregues.length > 0) {
      const somaTempos = pedidosEntregues.reduce((acc, pedido) => {
        const dias = Math.ceil((new Date(pedido.updatedAt).getTime() - new Date(pedido.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return acc + dias;
      }, 0);
      tempoMedioEntrega = somaTempos / pedidosEntregues.length;
    }

    // 3. MÉTRICAS DE PRODUTOS
    const [
      totalProdutos,
      produtosMaisVendidos,
      produtosSemEstoque
    ] = await Promise.all([
      prisma.produto.count({
        where: { ativo: true }
      }),
      prisma.itemPedido.groupBy({
        by: ['produtoId'],
        where: {
          pedido: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        _sum: {
          quantidade: true
        },
        _count: {
          id: true
        },
        orderBy: {
          _sum: {
            quantidade: 'desc'
          }
        },
        take: 10
      }),
      prisma.produto.count({
        where: {
          ativo: true,
          estoque: {
            lte: 0
          }
        }
      })
    ]);

    // Buscar detalhes dos produtos mais vendidos
    const produtoIds = produtosMaisVendidos.map(p => p.produtoId);
    const produtosDetalhes = await prisma.produto.findMany({
      where: {
        id: {
          in: produtoIds
        }
      },
      select: {
        id: true,
        titulo: true,
        preco: true,
        galeria: true
      }
    });

    const produtosMaisVendidosFormatados = produtosMaisVendidos.map(item => {
      const produto = produtosDetalhes.find(p => p.id === item.produtoId);
      return {
        id: item.produtoId,
        nome: produto?.titulo || 'Produto não encontrado',
        preco: produto?.preco || 0,
        imagem: produto?.galeria?.[0] || null,
        quantidadeVendida: item._sum.quantidade || 0,
        numeroVendas: item._count.id || 0,
        receita: (produto?.preco || 0) * (item._sum.quantidade || 0)
      };
    });

    // 4. MÉTRICAS DE USUÁRIOS
    const [
      totalUsuarios,
      usuariosAtivos,
      novosCadastros
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({
        where: {
          pedidos: {
            some: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      }),
      prisma.usuario.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })
    ]);

    // 5. FORMATAÇÃO DA RESPOSTA
    const metricas = {
      periodo: {
        inicio: startDate.toISOString(),
        fim: endDate.toISOString(),
        dias: diasPeriodo
      },
      pedidos: {
        total: totalPedidosAtual,
        crescimento: Math.round(crescimentoPedidos * 100) / 100,
        receita: {
          total: Math.round(receitaAtual * 100) / 100,
          crescimento: Math.round(crescimentoReceita * 100) / 100
        },
        ticketMedio: {
          valor: Math.round(ticketMedioAtual * 100) / 100,
          crescimento: Math.round(crescimentoTicketMedio * 100) / 100
        },
        tempoMedioEntrega: Math.round(tempoMedioEntrega * 10) / 10,
        status: {
          aguardandoPagamento: statusCount['AGUARDANDO_PAGAMENTO'] || 0,
          pagamentoAprovado: statusCount['PAGAMENTO_APROVADO'] || 0,
          emPreparacao: statusCount['EM_PREPARACAO'] || 0,
          enviado: statusCount['ENVIADO'] || 0,
          entregue: statusCount['ENTREGUE'] || 0,
          cancelado: statusCount['CANCELADO'] || 0,
          estornado: statusCount['ESTORNADO'] || 0
        }
      },
      produtos: {
        total: totalProdutos,
        semEstoque: produtosSemEstoque,
        maisVendidos: produtosMaisVendidosFormatados
      },
      usuarios: {
        total: totalUsuarios,
        ativos: usuariosAtivos,
        novosCadastros: novosCadastros
      }
    };

    return NextResponse.json({
      success: true,
      metricas
    });

  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
