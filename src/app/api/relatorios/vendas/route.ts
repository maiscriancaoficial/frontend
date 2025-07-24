import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET - Buscar dados de vendas para gráficos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || '30'; // dias
    const agrupamento = searchParams.get('agrupamento') || 'dia'; // dia, semana, mes
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

    // Buscar pedidos do período
    const pedidos = await prisma.pedido.findMany({
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
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Função para agrupar dados por período
    const agruparPorPeriodo = (data: Date, tipo: string): string => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');

      switch (tipo) {
        case 'dia':
          return `${ano}-${mes}-${dia}`;
        case 'semana':
          const inicioSemana = new Date(data);
          inicioSemana.setDate(data.getDate() - data.getDay());
          const semana = String(inicioSemana.getDate()).padStart(2, '0');
          const mesSemana = String(inicioSemana.getMonth() + 1).padStart(2, '0');
          return `${inicioSemana.getFullYear()}-${mesSemana}-${semana}`;
        case 'mes':
          return `${ano}-${mes}`;
        default:
          return `${ano}-${mes}-${dia}`;
      }
    };

    // Função para formatar label da data
    const formatarLabel = (dataStr: string, tipo: string): string => {
      const [ano, mes, dia] = dataStr.split('-');
      const data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

      switch (tipo) {
        case 'dia':
          return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        case 'semana':
          const fimSemana = new Date(data);
          fimSemana.setDate(data.getDate() + 6);
          return `${data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${fimSemana.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
        case 'mes':
          return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        default:
          return dataStr;
      }
    };

    // Agrupar vendas por período
    const vendasAgrupadas = pedidos.reduce((acc, pedido) => {
      const periodo = agruparPorPeriodo(new Date(pedido.createdAt), agrupamento);
      
      if (!acc[periodo]) {
        acc[periodo] = {
          periodo,
          totalVendas: 0,
          numeroVendas: 0,
          ticketMedio: 0,
          pedidosConfirmados: 0,
          pedidosCancelados: 0,
          receita: 0
        };
      }

      acc[periodo].totalVendas += pedido.valorTotal;
      acc[periodo].numeroVendas += 1;
      acc[periodo].receita += pedido.valorTotal;

      if (['PAGAMENTO_APROVADO', 'EM_PREPARACAO', 'ENVIADO', 'ENTREGUE'].includes(pedido.status)) {
        acc[periodo].pedidosConfirmados += 1;
      } else if (['CANCELADO', 'ESTORNADO'].includes(pedido.status)) {
        acc[periodo].pedidosCancelados += 1;
      }

      return acc;
    }, {} as Record<string, any>);

    // Calcular ticket médio
    Object.values(vendasAgrupadas).forEach((item: any) => {
      item.ticketMedio = item.numeroVendas > 0 ? item.totalVendas / item.numeroVendas : 0;
    });

    // Converter para array e ordenar
    const dadosVendas = Object.values(vendasAgrupadas)
      .sort((a: any, b: any) => a.periodo.localeCompare(b.periodo))
      .map((item: any) => ({
        ...item,
        label: formatarLabel(item.periodo, agrupamento),
        totalVendas: Math.round(item.totalVendas * 100) / 100,
        ticketMedio: Math.round(item.ticketMedio * 100) / 100,
        receita: Math.round(item.receita * 100) / 100
      }));

    // Buscar dados de comparação (mesmo período do ano anterior)
    const anoAnterior = new Date(startDate);
    anoAnterior.setFullYear(anoAnterior.getFullYear() - 1);
    const fimAnoAnterior = new Date(endDate);
    fimAnoAnterior.setFullYear(fimAnoAnterior.getFullYear() - 1);

    const pedidosAnoAnterior = await prisma.pedido.findMany({
      where: {
        createdAt: {
          gte: anoAnterior,
          lte: fimAnoAnterior
        }
      },
      select: {
        valorTotal: true,
        createdAt: true
      }
    });

    const receitaAnoAnterior = pedidosAnoAnterior.reduce((acc, pedido) => acc + pedido.valorTotal, 0);
    const receitaAtual = dadosVendas.reduce((acc, item) => acc + item.receita, 0);
    const crescimentoAnual = receitaAnoAnterior > 0 ? ((receitaAtual - receitaAnoAnterior) / receitaAnoAnterior) * 100 : 0;

    // Métricas resumidas
    const resumo = {
      totalVendas: dadosVendas.reduce((acc, item) => acc + item.numeroVendas, 0),
      receitaTotal: Math.round(receitaAtual * 100) / 100,
      ticketMedioGeral: dadosVendas.length > 0 ? Math.round((receitaAtual / dadosVendas.reduce((acc, item) => acc + item.numeroVendas, 0)) * 100) / 100 : 0,
      crescimentoAnual: Math.round(crescimentoAnual * 100) / 100,
      melhorDia: dadosVendas.length > 0 ? dadosVendas.reduce((max, item) => item.receita > max.receita ? item : max) : null,
      piorDia: dadosVendas.length > 0 ? dadosVendas.reduce((min, item) => item.receita < min.receita ? item : min) : null
    };

    return NextResponse.json({
      success: true,
      dados: {
        periodo: {
          inicio: startDate.toISOString(),
          fim: endDate.toISOString(),
          agrupamento
        },
        vendas: dadosVendas,
        resumo
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados de vendas:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
