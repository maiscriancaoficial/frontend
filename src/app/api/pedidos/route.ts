import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const status = searchParams.get('status');
    const metodoPagamento = searchParams.get('metodoPagamento');
    const statusPagamento = searchParams.get('statusPagamento');
    const busca = searchParams.get('busca');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const afiliadoId = searchParams.get('afiliadoId');
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Construir filtros
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
    
    // Buscar pedidos com relacionamentos
    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              fotoPerfil: true
            }
          },
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  titulo: true,
                  galeria: true
                }
              },
              livro: {
                select: {
                  id: true,
                  nome: true,
                  capa: true
                }
              },
              livroPersonalizado: {
                select: {
                  id: true,
                  nomePersonagem: true,
                  dadosPersonalizados: true
                }
              }
            }
          },
          cupom: {
            select: {
              id: true,
              codigo: true,
              titulo: true
            }
          },
          afiliado: {
            select: {
              id: true,
              codigoAfiliado: true,
              usuario: {
                select: {
                  nome: true,
                  email: true
                }
              }
            }
          },
          pagamentos: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      
      prisma.pedido.count({ where })
    ]);
    
    // Formatar dados dos pedidos
    const pedidosFormatados = pedidos.map(pedido => ({
      id: pedido.id,
      numero: pedido.numero,
      status: pedido.status,
      statusPagamento: pedido.statusPagamento,
      metodoPagamento: pedido.metodoPagamento,
      subtotal: pedido.subtotal,
      valorDesconto: pedido.valorDesconto,
      valorFrete: pedido.valorFrete,
      valorTotal: pedido.valorTotal,
      dataPagamento: pedido.dataPagamento,
      dataVencimento: pedido.dataVencimento,
      createdAt: pedido.createdAt,
      updatedAt: pedido.updatedAt,
      usuario: pedido.usuario,
      itens: pedido.itens.map(item => ({
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        quantidade: item.quantidade,
        subtotal: item.subtotal,
        tipo: item.produtoId ? 'produto' : 'livro',
        produto: item.produto,
        livro: item.livro,
        livroPersonalizado: item.livroPersonalizado,
        nomePersonagem: item.nomePersonagem,
        arquivosDigitais: item.arquivosDigitais,
        linkDownload: item.linkDownload,
        dataLiberacao: item.dataLiberacao
      })),
      cupom: pedido.cupom,
      afiliado: pedido.afiliado,
      pagamentoRecente: pedido.pagamentos[0] || null,
      observacoes: pedido.observacoes,
      codigoCupom: pedido.codigoCupom,
      codigoAfiliado: pedido.codigoAfiliado
    }));
    
    return NextResponse.json({
      success: true,
      pedidos: pedidosFormatados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      usuarioId,
      itens,
      cupomId,
      afiliadoId,
      metodoPagamento,
      enderecoEntrega,
      observacoes
    } = body;
    
    // Validações básicas
    if (!usuarioId || !itens || itens.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados obrigatórios não fornecidos' 
        },
        { status: 400 }
      );
    }
    
    // Gerar número do pedido
    const ultimoPedido = await prisma.pedido.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { numero: true }
    });
    
    const proximoNumero = ultimoPedido 
      ? (parseInt(ultimoPedido.numero) + 1).toString().padStart(6, '0')
      : '000001';
    
    // Calcular valores dos itens
    let subtotal = 0;
    const itensFormatados = [];
    
    for (const item of itens) {
      const itemSubtotal = item.preco * item.quantidade;
      subtotal += itemSubtotal;
      
      itensFormatados.push({
        produtoId: item.produtoId || null,
        livroId: item.livroId || null,
        livroPersonalizadoId: item.livroPersonalizadoId || null,
        nome: item.nome,
        descricao: item.descricao || null,
        preco: item.preco,
        quantidade: item.quantidade,
        subtotal: itemSubtotal,
        nomePersonagem: item.nomePersonagem || null,
        avatarPersonalizado: item.avatarPersonalizado || null
      });
    }
    
    // Aplicar cupom de desconto se fornecido
    let valorDesconto = 0;
    let cupomAplicado = null;
    
    if (cupomId) {
      cupomAplicado = await prisma.cupom.findUnique({
        where: { id: cupomId }
      });
      
      if (cupomAplicado && cupomAplicado.ativo) {
        if (cupomAplicado.tipoDesconto === 'PORCENTAGEM') {
          valorDesconto = (subtotal * cupomAplicado.valor) / 100;
        } else {
          valorDesconto = cupomAplicado.valor;
        }
        
        // Aplicar valor máximo de desconto se definido
        if (cupomAplicado.valorMaximo && valorDesconto > cupomAplicado.valorMaximo) {
          valorDesconto = cupomAplicado.valorMaximo;
        }
      }
    }
    
    const valorTotal = subtotal - valorDesconto;
    
    // Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        numero: proximoNumero,
        usuarioId,
        subtotal,
        valorDesconto,
        valorFrete: 0, // Produtos digitais não têm frete
        valorTotal,
        metodoPagamento,
        cupomId: cupomAplicado?.id || null,
        codigoCupom: cupomAplicado?.codigo || null,
        afiliadoId,
        codigoAfiliado: afiliadoId ? (await prisma.afiliado.findUnique({
          where: { id: afiliadoId },
          select: { codigoAfiliado: true }
        }))?.codigoAfiliado : null,
        enderecoEntrega,
        observacoes,
        itens: {
          create: itensFormatados
        }
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        itens: true
      }
    });
    
    // Registrar no histórico
    await prisma.historicoPedido.create({
      data: {
        pedidoId: pedido.id,
        statusNovo: 'AGUARDANDO_PAGAMENTO',
        observacao: 'Pedido criado'
      }
    });
    
    return NextResponse.json({
      success: true,
      pedido
    });
    
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
