import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro (mesmos da API principal)
    const status = searchParams.get('status');
    const metodoPagamento = searchParams.get('metodoPagamento');
    const statusPagamento = searchParams.get('statusPagamento');
    const busca = searchParams.get('busca');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const afiliadoId = searchParams.get('afiliadoId');
    const formato = searchParams.get('formato') || 'csv'; // csv ou json
    
    // Construir filtros (mesmo código da API principal)
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (metodoPagamento) {
      where.metodoPagamento = metodoPagamento;
    }
    
    if (statusPagamento) {
      where.statusPagamento = statusPagamento;
    }
    
    if (afiliadoId) {
      where.afiliadoId = afiliadoId;
    }
    
    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) {
        where.createdAt.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.createdAt.lte = new Date(dataFim);
      }
    }
    
    if (busca) {
      where.OR = [
        { numero: { contains: busca, mode: 'insensitive' } },
        { usuario: { nome: { contains: busca, mode: 'insensitive' } } },
        { usuario: { email: { contains: busca, mode: 'insensitive' } } },
        { codigoCupom: { contains: busca, mode: 'insensitive' } },
        { codigoAfiliado: { contains: busca, mode: 'insensitive' } }
      ];
    }
    
    // Buscar todos os pedidos que atendem aos filtros
    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
        usuario: {
          select: {
            nome: true,
            email: true,
            telefone: true,
            cpfCnpj: true
          }
        },
        itens: {
          include: {
            produto: {
              select: {
                titulo: true
              }
            },
            livro: {
              select: {
                nome: true
              }
            }
          }
        },
        cupom: {
          select: {
            codigo: true,
            titulo: true
          }
        },
        afiliado: {
          select: {
            codigoAfiliado: true,
            usuario: {
              select: {
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (formato === 'json') {
      // Exportar como JSON
      const dadosExportacao = pedidos.map(pedido => ({
        numero: pedido.numero,
        status: pedido.status,
        statusPagamento: pedido.statusPagamento,
        metodoPagamento: pedido.metodoPagamento,
        valorTotal: pedido.valorTotal,
        valorDesconto: pedido.valorDesconto,
        dataCriacao: pedido.createdAt,
        dataPagamento: pedido.dataPagamento,
        cliente: {
          nome: pedido.usuario.nome,
          email: pedido.usuario.email,
          telefone: pedido.usuario.telefone,
          documento: pedido.usuario.cpfCnpj
        },
        itens: pedido.itens.map(item => ({
          nome: item.nome,
          produto: item.produto?.titulo || item.livro?.nome,
          preco: item.preco,
          quantidade: item.quantidade,
          subtotal: item.subtotal,
          nomePersonagem: item.nomePersonagem
        })),
        cupom: pedido.cupom ? {
          codigo: pedido.cupom.codigo,
          titulo: pedido.cupom.titulo
        } : null,
        afiliado: pedido.afiliado ? {
          codigo: pedido.afiliado.codigoAfiliado,
          nome: pedido.afiliado.usuario.nome
        } : null,
        observacoes: pedido.observacoes,
        codigoRastreamento: pedido.codigoRastreamento
      }));
      
      return NextResponse.json({
        success: true,
        dados: dadosExportacao,
        total: pedidos.length
      });
      
    } else {
      // Exportar como CSV
      const headers = [
        'Número',
        'Status',
        'Status Pagamento',
        'Método Pagamento',
        'Cliente',
        'Email',
        'Telefone',
        'Documento',
        'Valor Total',
        'Valor Desconto',
        'Data Criação',
        'Data Pagamento',
        'Itens',
        'Cupom',
        'Afiliado',
        'Observações',
        'Código Rastreamento'
      ];
      
      const linhas = pedidos.map(pedido => [
        pedido.numero,
        pedido.status,
        pedido.statusPagamento,
        pedido.metodoPagamento || '',
        pedido.usuario.nome,
        pedido.usuario.email,
        pedido.usuario.telefone || '',
        pedido.usuario.cpfCnpj || '',
        pedido.valorTotal.toFixed(2),
        pedido.valorDesconto.toFixed(2),
        pedido.createdAt.toISOString().split('T')[0],
        pedido.dataPagamento ? pedido.dataPagamento.toISOString().split('T')[0] : '',
        pedido.itens.map(item => 
          `${item.nome} (${item.quantidade}x R$ ${item.preco.toFixed(2)})`
        ).join('; '),
        pedido.cupom ? `${pedido.cupom.codigo} - ${pedido.cupom.titulo}` : '',
        pedido.afiliado ? `${pedido.afiliado.codigoAfiliado} - ${pedido.afiliado.usuario.nome}` : '',
        pedido.observacoes || '',
        pedido.codigoRastreamento || ''
      ]);
      
      // Converter para CSV
      const csvContent = [
        headers.join(','),
        ...linhas.map(linha => 
          linha.map(campo => 
            typeof campo === 'string' && campo.includes(',') 
              ? `"${campo.replace(/"/g, '""')}"` 
              : campo
          ).join(',')
        )
      ].join('\n');
      
      // Retornar CSV como download
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="pedidos_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }
    
  } catch (error) {
    console.error('Erro ao exportar pedidos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
