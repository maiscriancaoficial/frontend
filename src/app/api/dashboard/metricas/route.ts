import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = parseInt(searchParams.get('periodo') || '30'); // Padrão 30 dias

    // Data de início baseada no período
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - periodo);

    // Data de início do período anterior (para comparação)
    const dataInicioAnterior = new Date();
    dataInicioAnterior.setDate(dataInicioAnterior.getDate() - (periodo * 2));

    // 1. VENDAS TOTAIS
    const vendasPeriodoAtual = await prisma.pedido.aggregate({
      where: {
        createdAt: {
          gte: dataInicio
        },
        status: {
          in: ['ENVIADO', 'ENTREGUE']
        }
      },
      _sum: {
        valorTotal: true
      }
    });

    const vendasPeriodoAnterior = await prisma.pedido.aggregate({
      where: {
        createdAt: {
          gte: dataInicioAnterior,
          lt: dataInicio
        },
        status: {
          in: ['ENVIADO', 'ENTREGUE']
        }
      },
      _sum: {
        valorTotal: true
      }
    });

    const vendaTotal = vendasPeriodoAtual._sum.valorTotal || 0;
    const vendaAnterior = vendasPeriodoAnterior._sum.valorTotal || 0;
    const crescimentoVendas = vendaAnterior > 0 ? ((vendaTotal - vendaAnterior) / vendaAnterior) * 100 : 0;

    // 2. LIVROS VENDIDOS
    const livrosVendidosAtual = await prisma.itemPedido.aggregate({
      where: {
        pedido: {
          createdAt: {
            gte: dataInicio
          },
          status: {
            in: ['ENVIADO', 'ENTREGUE']
          }
        },
        livroId: {
          not: null
        }
      },
      _sum: {
        quantidade: true
      }
    });

    const livrosVendidosAnterior = await prisma.itemPedido.aggregate({
      where: {
        pedido: {
          createdAt: {
            gte: dataInicioAnterior,
            lt: dataInicio
          },
          status: {
            in: ['ENVIADO', 'ENTREGUE']
          }
        },
        livroId: {
          not: null
        }
      },
      _sum: {
        quantidade: true
      }
    });

    const totalLivrosVendidos = livrosVendidosAtual._sum.quantidade || 0;
    const livrosVendidosAnt = livrosVendidosAnterior._sum.quantidade || 0;
    const crescimentoLivros = livrosVendidosAnt > 0 ? ((totalLivrosVendidos - livrosVendidosAnt) / livrosVendidosAnt) * 100 : 0;

    // 3. PRODUTOS VENDIDOS (incluindo livros e outros produtos)
    const produtosVendidosAtual = await prisma.itemPedido.aggregate({
      where: {
        pedido: {
          createdAt: {
            gte: dataInicio
          },
          status: {
            in: ['ENVIADO', 'ENTREGUE']
          }
        }
      },
      _sum: {
        quantidade: true
      }
    });

    const produtosVendidosAnterior = await prisma.itemPedido.aggregate({
      where: {
        pedido: {
          createdAt: {
            gte: dataInicioAnterior,
            lt: dataInicio
          },
          status: {
            in: ['ENVIADO', 'ENTREGUE']
          }
        }
      },
      _sum: {
        quantidade: true
      }
    });

    const totalProdutosVendidos = produtosVendidosAtual._sum.quantidade || 0;
    const produtosVendidosAnt = produtosVendidosAnterior._sum.quantidade || 0;
    const crescimentoProdutos = produtosVendidosAnt > 0 ? ((totalProdutosVendidos - produtosVendidosAnt) / produtosVendidosAnt) * 100 : 0;

    // 4. CLIENTES TOTAIS
    const clientesAtual = await prisma.usuario.count({
      where: {
        createdAt: {
          gte: dataInicio
        },
        role: 'CLIENTE'
      }
    });

    const clientesAnterior = await prisma.usuario.count({
      where: {
        createdAt: {
          gte: dataInicioAnterior,
          lt: dataInicio
        },
        role: 'CLIENTE'
      }
    });

    const totalClientes = await prisma.usuario.count({
      where: {
        role: 'CLIENTE'
      }
    });

    const crescimentoClientes = clientesAnterior > 0 ? ((clientesAtual - clientesAnterior) / clientesAnterior) * 100 : 0;

    // 5. AFILIADOS TOTAIS
    const afiliadosAtual = await prisma.usuario.count({
      where: {
        createdAt: {
          gte: dataInicio
        },
        role: 'AFILIADO'
      }
    });

    const afiliadosAnterior = await prisma.usuario.count({
      where: {
        createdAt: {
          gte: dataInicioAnterior,
          lt: dataInicio
        },
        role: 'AFILIADO'
      }
    });

    const totalAfiliados = await prisma.usuario.count({
      where: {
        role: 'AFILIADO'
      }
    });

    const crescimentoAfiliados = afiliadosAnterior > 0 ? ((afiliadosAtual - afiliadosAnterior) / afiliadosAnterior) * 100 : 0;

    // PEDIDOS RECENTES (últimos 5)
    const pedidosRecentes = await prisma.pedido.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        usuario: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    });

    // ESTATÍSTICAS ADICIONAIS
    const ticketMedio = totalProdutosVendidos > 0 ? vendaTotal / totalProdutosVendidos : 0;

    const metricas = {
      vendasTotais: {
        valor: vendaTotal,
        crescimento: Math.round(crescimentoVendas * 100) / 100
      },
      livrosVendidos: {
        valor: totalLivrosVendidos,
        crescimento: Math.round(crescimentoLivros * 100) / 100
      },
      produtosVendidos: {
        valor: totalProdutosVendidos,
        crescimento: Math.round(crescimentoProdutos * 100) / 100
      },
      clientes: {
        total: totalClientes,
        novos: clientesAtual,
        crescimento: Math.round(crescimentoClientes * 100) / 100
      },
      afiliados: {
        total: totalAfiliados,
        novos: afiliadosAtual,
        crescimento: Math.round(crescimentoAfiliados * 100) / 100
      },
      pedidosRecentes: pedidosRecentes.map(pedido => ({
        id: pedido.id,
        cliente: pedido.usuario?.nome || 'Cliente não encontrado',
        email: pedido.usuario?.email || '',
        valor: pedido.valorTotal,
        status: pedido.status,
        data: pedido.createdAt
      })),
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      periodo
    };

    return NextResponse.json({
      success: true,
      metricas
    });

  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
