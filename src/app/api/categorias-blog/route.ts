import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todas as categorias do blog
export async function GET() {
  try {
    const categorias = await prisma.categoriaBlog.findMany({
      orderBy: {
        nome: 'asc'
      },
      include: {
        _count: {
          select: {
            postagens: true
          }
        }
      }
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias do blog:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova categoria do blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, ativo = true } = body;

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Gerar slug único
    const baseSlug = nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Verificar se slug já existe e criar um único
    while (await prisma.categoriaBlog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const categoria = await prisma.categoriaBlog.create({
      data: {
        nome,
        slug,
        descricao,
        ativo
      }
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria do blog:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
