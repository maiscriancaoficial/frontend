import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// GET - Buscar produto por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categoriasLink: {
          include: {
            categoria: true
          }
        },
        tagsLink: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar produto
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verificar se produto existe
    const produtoExistente = await prisma.produto.findUnique({
      where: { id }
    });

    if (!produtoExistente) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Gerar novo slug se título mudou
    let slug = produtoExistente.slug;
    if (data.titulo && data.titulo !== produtoExistente.titulo) {
      let baseSlug = slugify(data.titulo, { lower: true, strict: true });
      slug = baseSlug;
      let counter = 1;

      while (await prisma.produto.findFirst({ 
        where: { 
          slug,
          id: { not: id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Verificar SKU se fornecido
    if (data.sku && data.sku !== produtoExistente.sku) {
      const existingSku = await prisma.produto.findFirst({
        where: {
          sku: data.sku,
          id: { not: id }
        }
      });
      if (existingSku) {
        return NextResponse.json(
          { error: `SKU '${data.sku}' já está em uso` },
          { status: 400 }
        );
      }
    }

    // Atualizar produto
    const produto = await prisma.produto.update({
      where: { id },
      data: {
        titulo: data.titulo,
        slug,
        sku: data.sku,
        descricao: data.descricao,
        descricaoLonga: data.descricaoLonga,
        preco: data.preco,
        precoPromocional: data.precoPromocional || null,
        fotoPrincipal: data.fotoPrincipal,
        galeria: data.galeria || data.fotos || [],
        ativo: data.ativo !== undefined ? data.ativo : (data.status === 'publicado' ? true : false),
        emDestaque: data.emDestaque !== undefined ? data.emDestaque : (data.destaque || false),
        palavrasChave: data.palavrasChave,
        estoque: data.estoque !== undefined ? data.estoque : 0,
        peso: data.peso,
        altura: data.altura,
        largura: data.largura,
        comprimento: data.comprimento,
        tamanho: data.tamanho,
        pontuacaoSEO: data.pontuacaoSEO,
        updatedAt: new Date()
      },
      include: {
        categoriasLink: {
          include: {
            categoria: true
          }
        },
        tagsLink: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, produto });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verificar se produto existe
    const produto = await prisma.produto.findUnique({
      where: { id }
    });

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Excluir produto (relacionamentos serão removidos automaticamente se configurado no schema)
    await prisma.produto.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Produto excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
