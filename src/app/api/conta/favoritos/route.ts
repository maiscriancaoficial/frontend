import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verificarToken } from '@/lib/auth/jwt'

// GET - Buscar favoritos do usuário
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

    // Buscar favoritos com dados dos produtos/livros
    const favoritos = await prisma.favorito.findMany({
      where: { usuarioId: usuario.id },
      include: {
        produto: {
          include: {
            categoriasLink: {
              include: {
                categoria: true
              }
            }
          }
        },
        livro: {
          include: {
            categoriasLink: {
              include: {
                categoria: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Formatar dados para o frontend
    const favoritosFormatados = favoritos.map(favorito => {
      if (favorito.produto) {
        return {
          id: favorito.id,
          tipo: 'produto',
          item: {
            id: favorito.produto.id,
            titulo: favorito.produto.titulo,
            descricao: favorito.produto.descricao,
            preco: favorito.produto.preco,
            precoPromocional: favorito.produto.precoPromocional,
            fotoPrincipal: favorito.produto.fotoPrincipal,
            categoria: favorito.produto.categoriasLink[0]?.categoria?.titulo || 'Sem categoria',
            estoque: favorito.produto.estoque,
            ativo: favorito.produto.ativo
          },
          dataFavorito: favorito.createdAt
        }
      } else if (favorito.livro) {
        return {
          id: favorito.id,
          tipo: 'livro',
          item: {
            id: favorito.livro.id,
            titulo: favorito.livro.nome,
            descricao: favorito.livro.descricao,
            preco: favorito.livro.preco,
            precoPromocional: favorito.livro.precoPromocional,
            fotoPrincipal: favorito.livro.capa,
            categoria: favorito.livro.categoriasLink[0]?.categoria?.titulo || 'Sem categoria',
            autor: favorito.livro.autor,
            faixaEtaria: favorito.livro.faixaEtaria,
            ativo: favorito.livro.ativo
          },
          dataFavorito: favorito.createdAt
        }
      }
      return null
    }).filter(Boolean)

    return NextResponse.json({
      sucesso: true,
      favoritos: favoritosFormatados,
      total: favoritosFormatados.length
    })

  } catch (error) {
    console.error('Erro ao buscar favoritos:', error)
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Adicionar/remover favorito
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

    const { tipo, itemId } = await request.json()

    if (!tipo || !itemId) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Tipo e ID do item são obrigatórios' },
        { status: 400 }
      )
    }

    if (tipo !== 'produto' && tipo !== 'livro') {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Tipo deve ser "produto" ou "livro"' },
        { status: 400 }
      )
    }

    // Verificar se o item existe
    if (tipo === 'produto') {
      const produto = await prisma.produto.findUnique({
        where: { id: itemId }
      })
      if (!produto) {
        return NextResponse.json(
          { sucesso: false, mensagem: 'Produto não encontrado' },
          { status: 404 }
        )
      }
    } else {
      const livro = await prisma.livro.findUnique({
        where: { id: itemId }
      })
      if (!livro) {
        return NextResponse.json(
          { sucesso: false, mensagem: 'Livro não encontrado' },
          { status: 404 }
        )
      }
    }

    // Verificar se já existe nos favoritos
    const favoritoExistente = await prisma.favorito.findFirst({
      where: {
        usuarioId: usuario.id,
        ...(tipo === 'produto' ? { produtoId: itemId } : { livroId: itemId })
      }
    })

    if (favoritoExistente) {
      // Remover dos favoritos
      await prisma.favorito.delete({
        where: { id: favoritoExistente.id }
      })

      return NextResponse.json({
        sucesso: true,
        mensagem: 'Item removido dos favoritos',
        acao: 'removido'
      })
    } else {
      // Adicionar aos favoritos
      const novoFavorito = await prisma.favorito.create({
        data: {
          usuarioId: usuario.id,
          ...(tipo === 'produto' ? { produtoId: itemId } : { livroId: itemId })
        }
      })

      return NextResponse.json({
        sucesso: true,
        mensagem: 'Item adicionado aos favoritos',
        acao: 'adicionado',
        favorito: novoFavorito
      })
    }

  } catch (error) {
    console.error('Erro ao gerenciar favorito:', error)
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
