import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verificarToken } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ sucesso: false, mensagem: 'Token não fornecido' }, { status: 401 })
    }

    const resultado = await verificarToken(token)
    if (!resultado.valido || !resultado.usuario) {
      return NextResponse.json({ sucesso: false, mensagem: 'Token inválido' }, { status: 401 })
    }

    // Buscar usuário no banco
    const usuario = await prisma.usuario.findUnique({
      where: { email: resultado.usuario.email }
    })

    if (!usuario) {
      return NextResponse.json({ sucesso: false, mensagem: 'Usuário não encontrado' }, { status: 404 })
    }

    // Buscar pedidos do usuário
    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId: usuario.id
      },
      include: {
        itensPedido: {
          include: {
            produto: {
              select: {
                titulo: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      sucesso: true,
      pedidos: pedidos.map(pedido => ({
        id: pedido.id,
        codigo: pedido.numero,
        status: pedido.status,
        valorTotal: pedido.valorTotal,
        dataPedido: pedido.createdAt.toISOString().split('T')[0],
        dataEntrega: pedido.dataEntrega ? pedido.dataEntrega.toISOString().split('T')[0] : null,
        itens: pedido.itensPedido.map((item: any) => ({
          id: item.id,
          produto: {
            titulo: item.produto.titulo
          },
          quantidade: item.quantidade,
          valorTotal: item.valorTotal
        }))
      }))
    })

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
