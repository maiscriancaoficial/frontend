import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

// GET - Buscar livro por slug (nome)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Buscar todos os livros ativos e gerar slugs para comparação
    const livros = await prisma.livro.findMany({
      where: { ativo: true },
      include: {
        categoriasLink: {
          include: {
            categoria: true
          }
        },
        tagsLink: {
          include: {
            tag: true
          }
        },
        beneficios: {
          orderBy: { ordem: 'asc' }
        },
        paginas: {
          orderBy: { numero: 'asc' }
        },
        _count: {
          select: {
            personalizacoes: true,
            itensPedido: true,
            paginas: true
          }
        }
      }
    });

    // Encontrar o livro que corresponde ao slug
    const livroEncontrado = livros.find(livro => generateSlug(livro.nome) === slug);

    if (!livroEncontrado) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    // Formatar dados para o frontend
    const livroFormatado = {
      ...livroEncontrado,
      slug: generateSlug(livroEncontrado.nome),
      categorias: livroEncontrado.categoriasLink.map(link => ({
        categoria: link.categoria
      })),
      tags: livroEncontrado.tagsLink.map(link => link.tag),
      totalPersonalizacoes: livroEncontrado._count.personalizacoes,
      totalVendas: livroEncontrado._count.itensPedido,
      totalPaginas: livroEncontrado._count.paginas
    };

    return NextResponse.json({
      success: true,
      livro: livroFormatado
    });

  } catch (error) {
    console.error('Erro ao buscar livro por slug:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
