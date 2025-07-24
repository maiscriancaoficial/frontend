import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// GET - Buscar categoria por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: {
          select: { produtosLink: true }
        }
      }
    });

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      categoria
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar categoria
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verificar se categoria existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id }
    });

    if (!categoriaExistente) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Validação
    if (!data.nome || !data.nome.trim()) {
      return NextResponse.json(
        { error: 'Nome da categoria é obrigatório' },
        { status: 400 }
      );
    }

    // Gerar slug único se o nome mudou
    let slug = categoriaExistente.slug;
    if (data.nome.trim() !== categoriaExistente.titulo) {
      slug = slugify(data.nome, { lower: true, strict: true });
      let counter = 1;

      while (await prisma.categoria.findFirst({ 
        where: { 
          slug,
          id: { not: id }
        } 
      })) {
        slug = `${slugify(data.nome, { lower: true, strict: true })}-${counter}`;
        counter++;
      }
    }

    // Atualizar categoria
    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        titulo: data.nome.trim(),
        slug,
        descricao: data.descricao?.trim() || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      categoria
    });

  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir categoria
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Verificar se categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: {
          select: { produtosLink: true }
        }
      }
    });

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se há produtos usando esta categoria
    if (categoria._count.produtosLink > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir categoria que possui produtos associados' },
        { status: 400 }
      );
    }

    // Excluir categoria
    await prisma.categoria.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Categoria excluída com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
