import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// GET - Listar tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: {
          select: { produtosLink: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      tags
    });
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar tag
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validação
    if (!data.nome || !data.nome.trim()) {
      return NextResponse.json(
        { error: 'Nome da tag é obrigatório' },
        { status: 400 }
      );
    }

    // Gerar slug único
    let slug = slugify(data.nome, { lower: true, strict: true });
    let counter = 1;

    while (await prisma.tag.findFirst({ where: { slug } })) {
      slug = `${slugify(data.nome, { lower: true, strict: true })}-${counter}`;
      counter++;
    }

    // Criar tag
    const tag = await prisma.tag.create({
      data: {
        nome: data.nome.trim(),
        slug,
        cor: data.cor || '#27b99a'
      }
    });

    return NextResponse.json({
      success: true,
      tag
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar tag:', error);
    
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
