import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Busca rápida de livros para o header
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        livros: []
      });
    }

    // Buscar livros ativos que correspondem à query
    const livros = await prisma.livro.findMany({
      where: {
        ativo: true,
        OR: [
          { nome: { contains: query, mode: 'insensitive' } },
          { descricao: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      include: {
        categoriasLink: {
          include: {
            categoria: true
          },
          take: 1 // Pegar apenas a primeira categoria
        }
      },
      orderBy: [
        { emDestaque: 'desc' }, // Livros em destaque primeiro
        { createdAt: 'desc' }
      ]
    });

    // Função para gerar slug a partir do nome
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .trim()
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-'); // Remove hífens duplicados
    };

    // Formatar dados para o frontend
    const livrosFormatados = livros.map(livro => ({
      id: livro.id,
      nome: livro.nome,
      slug: generateSlug(livro.nome),
      descricao: livro.descricao,
      preco: livro.preco,
      precoPromocional: livro.precoPromocional,
      thumbnail: livro.imagemCapa || '/placeholder-book.jpg',
      categoria: livro.categoriasLink[0]?.categoria || null,
      emDestaque: livro.emDestaque,
      sku: livro.sku,
      autor: livro.autor,
      faixaEtaria: livro.faixaEtaria
    }));

    return NextResponse.json({
      success: true,
      livros: livrosFormatados
    });

  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
