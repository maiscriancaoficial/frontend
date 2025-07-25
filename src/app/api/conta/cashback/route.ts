import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verificarToken } from '@/lib/auth/jwt'

// GET - Buscar transações de cashback do usuário
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

    // Buscar transações de cashback
    const transacoes = await prisma.transacaoCashback.findMany({
      where: { usuarioId: usuario.id },
      include: {
        pedido: {
          select: {
            numero: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calcular saldos
    const saldoAtual = transacoes
      .filter(t => t.status === 'APROVADO')
      .reduce((acc, t) => acc + (t.tipo === 'CREDITO' ? t.valor : -t.valor), 0)
    
    const totalGanho = transacoes
      .filter(t => t.tipo === 'CREDITO' && t.status === 'APROVADO')
      .reduce((acc, t) => acc + t.valor, 0)
    
    const totalUtilizado = transacoes
      .filter(t => t.tipo === 'DEBITO')
      .reduce((acc, t) => acc + t.valor, 0)
    
    const pendente = transacoes
      .filter(t => t.status === 'PENDENTE')
      .reduce((acc, t) => acc + t.valor, 0)

    // Formatar transações para o frontend
    const transacoesFormatadas = transacoes.map(transacao => ({
      id: transacao.id,
      tipo: transacao.tipo.toLowerCase(),
      descricao: transacao.descricao,
      valor: transacao.valor,
      status: transacao.status,
      data: transacao.createdAt.toISOString().split('T')[0],
      pedidoId: transacao.pedido?.numero || null,
      observacoes: transacao.observacoes
    }))

    return NextResponse.json({
      sucesso: true,
      saldos: {
        atual: saldoAtual,
        totalGanho,
        totalUtilizado,
        pendente
      },
      transacoes: transacoesFormatadas,
      total: transacoesFormatadas.length
    })

  } catch (error) {
    console.error('Erro ao buscar cashback:', error)
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar transação de cashback (uso interno/admin)
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

    // Verificar se é admin ou funcionário
    const usuario = await prisma.usuario.findUnique({
      where: { email: resultado.usuario.email }
    })

    if (!usuario || (usuario.role !== 'ADMIN' && usuario.role !== 'FUNCIONARIO')) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { 
      usuarioId, 
      tipo, 
      valor, 
      descricao, 
      pedidoId, 
      observacoes 
    } = await request.json()

    if (!usuarioId || !tipo || !valor || !descricao) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const usuarioDestino = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    })

    if (!usuarioDestino) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Criar transação de cashback
    const transacao = await prisma.transacaoCashback.create({
      data: {
        usuarioId,
        tipo: tipo.toUpperCase(),
        valor: parseFloat(valor),
        descricao,
        status: 'APROVADO', // Por padrão aprovado quando criado manualmente
        pedidoId: pedidoId || null,
        observacoes: observacoes || null,
        processadoEm: new Date()
      }
    })

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Transação de cashback criada com sucesso',
      transacao
    })

  } catch (error) {
    console.error('Erro ao criar transação de cashback:', error)
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
