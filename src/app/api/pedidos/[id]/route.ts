import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            fotoPerfil: true,
            cpfCnpj: true,
            cep: true,
            rua: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            estado: true
          }
        },
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                titulo: true,
                galeria: true,
                ativo: true
              }
            },
            livro: {
              select: {
                id: true,
                nome: true,
                capa: true,
                ativo: true
              }
            },
            livroPersonalizado: {
              select: {
                id: true,
                nomePersonagem: true,
                dadosPersonalizados: true,
                status: true
              }
            }
          }
        },
        cupom: {
          select: {
            id: true,
            codigo: true,
            titulo: true,
            tipoDesconto: true,
            valor: true
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
          }
        },
        historico: {
          include: {
            usuario: {
              select: {
                nome: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!pedido) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pedido não encontrado' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      pedido
    });
    
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      status,
      statusPagamento,
      metodoPagamento,
      observacoes,
      observacoesInternas,
      codigoRastreamento,
      transportadora,
      usuarioId // ID do usuário que está fazendo a alteração
    } = body;
    
    // Buscar pedido atual
    const pedidoAtual = await prisma.pedido.findUnique({
      where: { id },
      select: { 
        status: true, 
        statusPagamento: true,
        metodoPagamento: true
      }
    });
    
    if (!pedidoAtual) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pedido não encontrado' 
        },
        { status: 404 }
      );
    }
    
    // Preparar dados para atualização
    const dadosAtualizacao: any = {};
    
    if (status !== undefined) {
      dadosAtualizacao.status = status;
    }
    
    if (statusPagamento !== undefined) {
      dadosAtualizacao.statusPagamento = statusPagamento;
      
      // Se pagamento foi aprovado, definir data
      if (statusPagamento === 'APROVADO' && pedidoAtual.statusPagamento !== 'APROVADO') {
        dadosAtualizacao.dataPagamento = new Date();
      }
    }
    
    if (metodoPagamento !== undefined) {
      dadosAtualizacao.metodoPagamento = metodoPagamento;
    }
    
    if (observacoes !== undefined) {
      dadosAtualizacao.observacoes = observacoes;
    }
    
    if (observacoesInternas !== undefined) {
      dadosAtualizacao.observacoesInternas = observacoesInternas;
    }
    
    if (codigoRastreamento !== undefined) {
      dadosAtualizacao.codigoRastreamento = codigoRastreamento;
      
      // Se código de rastreamento foi adicionado, marcar como enviado
      if (codigoRastreamento && pedidoAtual.status !== 'ENVIADO') {
        dadosAtualizacao.status = 'ENVIADO';
        dadosAtualizacao.dataEnvio = new Date();
      }
    }
    
    if (transportadora !== undefined) {
      dadosAtualizacao.transportadora = transportadora;
    }
    
    // Atualizar pedido
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: dadosAtualizacao,
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
    
    // Registrar mudanças no histórico
    const historicoPromises = [];
    
    if (status && status !== pedidoAtual.status) {
      historicoPromises.push(
        prisma.historicoPedido.create({
          data: {
            pedidoId: id,
            statusAnterior: pedidoAtual.status,
            statusNovo: status,
            observacao: `Status alterado de ${pedidoAtual.status} para ${status}`,
            usuarioId
          }
        })
      );
    }
    
    if (statusPagamento && statusPagamento !== pedidoAtual.statusPagamento) {
      historicoPromises.push(
        prisma.historicoPedido.create({
          data: {
            pedidoId: id,
            statusAnterior: pedidoAtual.status,
            statusNovo: pedidoAtualizado.status,
            observacao: `Status de pagamento alterado de ${pedidoAtual.statusPagamento} para ${statusPagamento}`,
            usuarioId
          }
        })
      );
    }
    
    if (codigoRastreamento) {
      historicoPromises.push(
        prisma.historicoPedido.create({
          data: {
            pedidoId: id,
            statusAnterior: pedidoAtual.status,
            statusNovo: pedidoAtualizado.status,
            observacao: `Código de rastreamento adicionado: ${codigoRastreamento}`,
            usuarioId
          }
        })
      );
    }
    
    await Promise.all(historicoPromises);
    
    return NextResponse.json({
      success: true,
      pedido: pedidoAtualizado
    });
    
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      select: { 
        status: true,
        statusPagamento: true
      }
    });
    
    if (!pedido) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pedido não encontrado' 
        },
        { status: 404 }
      );
    }
    
    // Verificar se pedido pode ser excluído
    if (pedido.statusPagamento === 'APROVADO') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Não é possível excluir pedidos com pagamento aprovado' 
        },
        { status: 400 }
      );
    }
    
    // Excluir pedido (cascade irá excluir itens e histórico)
    await prisma.pedido.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Pedido excluído com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
