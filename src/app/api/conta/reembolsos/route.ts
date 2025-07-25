import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verificarToken } from '@/lib/auth/jwt'

// GET - Buscar solicitações de reembolso do usuário
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const resultado = await verificarToken(token)
    if (!resultado.valido || !resultado.usuario) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Token inválido' },
        { status: 401 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: resultado.usuario.email }
    })

    if (!usuario) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar solicitações de reembolso
    const solicitacoes = await prisma.solicitacaoReembolso.findMany({
      where: { usuarioId: usuario.id },
      include: {
        pedido: {
          select: {
            numero: true,
            createdAt: true,
            valorTotal: true
          }
        },
        itemPedido: {
          select: {
            nome: true,
            preco: true,
            quantidade: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calcular estatísticas
    const totalSolicitacoes = solicitacoes.length
    const totalReembolsado = solicitacoes
      .filter(s => s.status === 'CONCLUIDO')
      .reduce((acc, s) => acc + s.valor, 0)
    const emAnalise = solicitacoes.filter(s => s.status === 'EM_ANALISE').length

    // Formatar solicitações para o frontend
    const solicitacoesFormatadas = solicitacoes.map(solicitacao => ({
      id: solicitacao.id,
      pedidoNumero: solicitacao.pedido.numero,
      item: solicitacao.itemPedido?.nome || 'Pedido completo',
      motivo: solicitacao.motivo,
      descricao: solicitacao.descricao,
      valor: solicitacao.valor,
      status: solicitacao.status,
      dataSolicitacao: solicitacao.createdAt,
      dataAnalise: solicitacao.dataAnalise,
      dataProcessamento: solicitacao.dataProcessamento,
      observacoesAdmin: solicitacao.observacoesAdmin,
      metodoPagamento: solicitacao.metodoPagamento
    }))

    return NextResponse.json({
      sucesso: true,
      estatisticas: {
        totalSolicitacoes,
        totalReembolsado,
        emAnalise
      },
      solicitacoes: solicitacoesFormatadas,
      total: solicitacoesFormatadas.length
    })

  } catch (error) {
    console.error('Erro ao buscar reembolsos:', error)
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova solicitação de reembolso
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const resultado = await verificarToken(token)
    if (!resultado.valido || !resultado.usuario) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Token inválido' },
        { status: 401 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: resultado.usuario.email }
    })

    if (!usuario) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const { 
      pedidoId, 
      itemPedidoId, 
      motivo, 
      descricao, 
      valor 
    } = await request.json()

    if (!pedidoId || !motivo || !valor) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Pedido, motivo e valor são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o pedido pertence ao usuário
    const pedido = await prisma.pedido.findFirst({
      where: {
        id: pedidoId,
        usuarioId: usuario.id
      },
      include: {
        itens: true
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Pedido não encontrado ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    // Se especificou um item, verificar se pertence ao pedido
    if (itemPedidoId) {
      const itemPedido = pedido.itens.find(item => item.id === itemPedidoId)
      if (!itemPedido) {
        return NextResponse.json(
          { sucesso: false, mensagem: 'Item do pedido não encontrado' },
          { status: 404 }
        )
      }
    }

    // Verificar se já existe uma solicitação para este pedido/item
    const solicitacaoExistente = await prisma.solicitacaoReembolso.findFirst({
      where: {
        pedidoId,
        itemPedidoId: itemPedidoId || null,
        status: {
          notIn: ['REJEITADO', 'CANCELADO']
        }
      }
    })

    if (solicitacaoExistente) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Já existe uma solicitação de reembolso para este item' },
        { status: 400 }
      )
    }

    // Criar solicitação de reembolso
    const solicitacao = await prisma.solicitacaoReembolso.create({
      data: {
        usuarioId: usuario.id,
        pedidoId,
        itemPedidoId: itemPedidoId || null,
        motivo,
        descricao: descricao || null,
        valor: parseFloat(valor),
        status: 'SOLICITADO'
      }
    })

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Solicitação de reembolso criada com sucesso',
      solicitacao
    })

  } catch (error) {
    console.error('Erro ao criar solicitação de reembolso:', error)
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
