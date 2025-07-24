import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todas as tags do blog
export async function GET() {
  try {
    const tags = await prisma.tagBlog.findMany({
      orderBy: {
        nome: 'asc'
      },
      include: {
        _count: {
          select: {
            postagensLink: true
          }
        }
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Erro ao buscar tags do blog:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova tag do blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome } = body;

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
    while (await prisma.tagBlog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tag = await prisma.tagBlog.create({
      data: {
        nome,
        slug
      }
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tag do blog:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
