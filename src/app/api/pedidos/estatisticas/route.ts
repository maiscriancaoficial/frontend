import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = parseInt(searchParams.get('periodo') || '30');
    
    // Data de início baseada no período
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - periodo);
    
    // Data de início do período anterior para comparação
    const dataInicioAnterior = new Date();
    dataInicioAnterior.setDate(dataInicioAnterior.getDate() - (periodo * 2));
    
    // Buscar estatísticas do período atual
    const [
      totalPedidos,
      totalVendas,
      totalReembolsos,
      valorReembolsado,
      pedidosPorStatus
    ] = await Promise.all([
      // Total de pedidos
      prisma.pedido.count({
        where: {
          createdAt: {
            gte: dataInicio
          }
        }
      }),
      
      // Total de vendas (pedidos com pagamento aprovado)
      prisma.pedido.aggregate({
        where: {
          statusPagamento: 'APROVADO',
          createdAt: {
            gte: dataInicio
          }
        },
        _sum: {
          valorTotal: true
        },
        _count: true
      }),
      
      // Total de reembolsos
      prisma.pedido.count({
        where: {
          statusPagamento: 'ESTORNADO',
          createdAt: {
            gte: dataInicio
          }
        }
      }),
      
      // Valor total reembolsado
      prisma.pedido.aggregate({
        where: {
          statusPagamento: 'ESTORNADO',
          createdAt: {
            gte: dataInicio
          }
        },
        _sum: {
          valorTotal: true
        }
      }),
      
      // Pedidos por status
      prisma.pedido.groupBy({
        by: ['status'],
        where: {
          createdAt: {
            gte: dataInicio
          }
        },
        _count: {
          id: true
        }
      })
    ]);
    
    // Buscar estatísticas do período anterior para comparação
    const [
      totalPedidosAnterior,
      totalVendasAnterior,
      totalReembolsosAnterior
    ] = await Promise.all([
      prisma.pedido.count({
        where: {
          createdAt: {
            gte: dataInicioAnterior,
            lt: dataInicio
          }
        }
      }),
      
      prisma.pedido.aggregate({
        where: {
          statusPagamento: 'APROVADO',
          createdAt: {
            gte: dataInicioAnterior,
            lt: dataInicio
          }
        },
        _sum: {
          valorTotal: true
        }
      }),
      
      prisma.pedido.count({
        where: {
          statusPagamento: 'ESTORNADO',
          createdAt: {
            gte: dataInicioAnterior,
            lt: dataInicio
          }
        }
      })
    ]);
    
    // Calcular crescimento
    const calcularCrescimento = (atual: number, anterior: number): number => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return ((atual - anterior) / anterior) * 100;
    };
    
    const crescimentoPedidos = calcularCrescimento(totalPedidos, totalPedidosAnterior);
    const crescimentoVendas = calcularCrescimento(
      totalVendas._sum.valorTotal || 0, 
      totalVendasAnterior._sum.valorTotal || 0
    );
    const crescimentoReembolsos = calcularCrescimento(totalReembolsos, totalReembolsosAnterior);
    
    // Formatar dados de status
    const statusFormatados = pedidosPorStatus.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>);
    
    const estatisticas = {
      totalPedidos,
      totalVendas: totalVendas._sum.valorTotal || 0,
      totalReembolsos,
      valorReembolsado: valorReembolsado._sum.valorTotal || 0,
      crescimentoPedidos: Math.round(crescimentoPedidos * 100) / 100,
      crescimentoVendas: Math.round(crescimentoVendas * 100) / 100,
      crescimentoReembolsos: Math.round(crescimentoReembolsos * 100) / 100,
      pedidosPorStatus: {
        AGUARDANDO_PAGAMENTO: statusFormatados.AGUARDANDO_PAGAMENTO || 0,
        PAGAMENTO_APROVADO: statusFormatados.PAGAMENTO_APROVADO || 0,
        EM_PREPARACAO: statusFormatados.EM_PREPARACAO || 0,
        ENVIADO: statusFormatados.ENVIADO || 0,
        ENTREGUE: statusFormatados.ENTREGUE || 0,
        CANCELADO: statusFormatados.CANCELADO || 0,
        ESTORNADO: statusFormatados.ESTORNADO || 0
      }
    };
    
    return NextResponse.json({
      success: true,
      estatisticas
    });
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas de pedidos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
