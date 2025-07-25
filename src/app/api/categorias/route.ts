import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// GET - Listar categorias
export async function GET() {
  try {
    const categoriasRaw = await prisma.categoria.findMany({
      orderBy: { titulo: 'asc' },
      include: {
        _count: {
          select: { produtosLink: true, livrosLink: true }
        }
      }
    });

    // Mapear titulo para nome para compatibilidade com frontend
    const categorias = categoriasRaw.map(categoria => ({
      ...categoria,
      nome: categoria.titulo
    }));

    return NextResponse.json({
      success: true,
      categorias
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar categoria
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validação
    if (!data.nome || !data.nome.trim()) {
      return NextResponse.json(
        { error: 'Nome da categoria é obrigatório' },
        { status: 400 }
      );
    }

    // Gerar slug único
    let slug = slugify(data.nome, { lower: true, strict: true });
    let counter = 1;

    while (await prisma.categoria.findFirst({ where: { slug } })) {
      slug = `${slugify(data.nome, { lower: true, strict: true })}-${counter}`;
      counter++;
    }

    // Criar categoria
    const categoriaRaw = await prisma.categoria.create({
      data: {
        titulo: data.nome.trim(),
        slug,
        descricao: data.descricao?.trim() || null
      }
    });

    // Mapear titulo para nome para compatibilidade
    const categoria = {
      ...categoriaRaw,
      nome: categoriaRaw.titulo
    };

    return NextResponse.json({
      success: true,
      categoria
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar categoria:', error);
    
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
