import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// GET - Buscar tag por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { produtosLink: true }
        }
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tag
    });
  } catch (error) {
    console.error('Erro ao buscar tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar tag
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verificar se tag existe
    const tagExistente = await prisma.tag.findUnique({
      where: { id }
    });

    if (!tagExistente) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    // Validação
    if (!data.nome || !data.nome.trim()) {
      return NextResponse.json(
        { error: 'Nome da tag é obrigatório' },
        { status: 400 }
      );
    }

    // Gerar slug único se o nome mudou
    let slug = tagExistente.slug;
    if (data.nome.trim() !== tagExistente.nome) {
      slug = slugify(data.nome, { lower: true, strict: true });
      let counter = 1;

      while (await prisma.tag.findFirst({ 
        where: { 
          slug,
          id: { not: id }
        } 
      })) {
        slug = `${slugify(data.nome, { lower: true, strict: true })}-${counter}`;
        counter++;
      }
    }

    // Atualizar tag
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        nome: data.nome.trim(),
        slug,
        cor: data.cor || '#27b99a',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      tag
    });

  } catch (error: any) {
    console.error('Erro ao atualizar tag:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe uma tag com este nome' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir tag
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Verificar se tag existe
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { produtosLink: true }
        }
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se há produtos usando esta tag
    if (tag._count.produtosLink > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir tag que possui produtos associados' },
        { status: 400 }
      );
    }

    // Excluir tag
    await prisma.tag.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Tag excluída com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
