import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar categoria por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoria = await prisma.categoriaBlog.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            postagens: true
          }
        }
      }
    });

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nome, descricao, ativo } = body;

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se categoria existe
    const categoriaExistente = await prisma.categoriaBlog.findUnique({
      where: { id: params.id }
    });

    if (!categoriaExistente) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Gerar novo slug se nome mudou
    let slug = categoriaExistente.slug;
    if (nome !== categoriaExistente.nome) {
      const baseSlug = nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      slug = baseSlug;
      let counter = 1;

      // Verificar se slug já existe (excluindo a categoria atual)
      while (await prisma.categoriaBlog.findFirst({ 
        where: { 
          slug,
          id: { not: params.id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const categoria = await prisma.categoriaBlog.update({
      where: { id: params.id },
      data: {
        nome,
        slug,
        descricao,
        ativo
      }
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir categoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se categoria existe
    const categoria = await prisma.categoriaBlog.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            postagens: true
          }
        }
      }
    });

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se há postagens vinculadas
    if (categoria._count.postagens > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir categoria com postagens vinculadas' },
        { status: 400 }
      );
    }

    await prisma.categoriaBlog.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
