import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar elementos do avatar
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const ativo = searchParams.get('ativo');

    // Verificar se avatar existe
    const avatar = await prisma.avatar.findUnique({
      where: { id }
    });

    if (!avatar) {
      return NextResponse.json(
        { error: 'Avatar não encontrado' },
        { status: 404 }
      );
    }

    // Construir filtros
    const where: any = { avatarId: id };

    if (tipo) {
      where.tipo = tipo;
    }

    if (ativo !== null && ativo !== '') {
      where.ativo = ativo === 'true';
    }

    // Buscar elementos
    const elementos = await prisma.avatarElemento.findMany({
      where,
      orderBy: [{ tipo: 'asc' }, { ordem: 'asc' }, { nome: 'asc' }]
    });

    return NextResponse.json({
      success: true,
      elementos
    });

  } catch (error) {
    console.error('Erro ao buscar elementos do avatar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Adicionar elemento ao avatar
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tipo, nome, arquivo, cor, ordem = 0, ativo = true } = body;

    // Validações
    if (!tipo || !nome || !arquivo) {
      return NextResponse.json(
        { error: 'Tipo, nome e arquivo são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se avatar existe
    const avatar = await prisma.avatar.findUnique({
      where: { id }
    });

    if (!avatar) {
      return NextResponse.json(
        { error: 'Avatar não encontrado' },
        { status: 404 }
      );
    }

    // Criar elemento
    const elemento = await prisma.avatarElemento.create({
      data: {
        avatarId: id,
        tipo,
        nome,
        arquivo,
        cor,
        ordem,
        ativo
      }
    });

    return NextResponse.json({
      success: true,
      elemento
    });

  } catch (error) {
    console.error('Erro ao criar elemento do avatar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
