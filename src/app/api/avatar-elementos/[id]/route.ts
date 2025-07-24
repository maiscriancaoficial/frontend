import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar elemento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const elemento = await prisma.avatarElemento.findUnique({
      where: { id },
      include: {
        avatar: {
          select: {
            id: true,
            nome: true,
            tipo: true
          }
        }
      }
    });

    if (!elemento) {
      return NextResponse.json(
        { error: 'Elemento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      elemento
    });

  } catch (error) {
    console.error('Erro ao buscar elemento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar elemento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tipo, nome, arquivo, cor, ordem, ativo } = body;

    // Verificar se elemento existe
    const elementoExistente = await prisma.avatarElemento.findUnique({
      where: { id }
    });

    if (!elementoExistente) {
      return NextResponse.json(
        { error: 'Elemento não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar elemento
    const elemento = await prisma.avatarElemento.update({
      where: { id },
      data: {
        ...(tipo && { tipo }),
        ...(nome && { nome }),
        ...(arquivo && { arquivo }),
        ...(cor !== undefined && { cor }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo })
      },
      include: {
        avatar: {
          select: {
            id: true,
            nome: true,
            tipo: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      elemento
    });

  } catch (error) {
    console.error('Erro ao atualizar elemento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir elemento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se elemento existe
    const elemento = await prisma.avatarElemento.findUnique({
      where: { id }
    });

    if (!elemento) {
      return NextResponse.json(
        { error: 'Elemento não encontrado' },
        { status: 404 }
      );
    }

    // Excluir elemento
    await prisma.avatarElemento.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Elemento excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir elemento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
