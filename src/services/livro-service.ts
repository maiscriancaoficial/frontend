import { prisma } from '@/lib/prisma';

export interface LivroProps {
  id: string;
  nome: string;
  descricao: string | null;
  descricaoCompleta?: string | null;
  preco: number;
  precoPromocional?: number | null;
  sku: string | null;
  capa: string;
  capaVerso?: string | null;
  tipo: string;
  estoque: number;
  emDestaque: boolean;
  ativo: boolean;
  categorias?: { categoria: { titulo: string; slug: string } }[];
  categoriasLink?: { categoria: { titulo: string; slug: string } }[];
  beneficios?: {
    id?: string;
    titulo: string;
    descricao: string;
    icone?: string | null;
  }[];
  paginas?: {
    id?: string;
    numero: number;
    arquivo: string;
    conteudo?: string | null;
  }[];
  slug?: string;
}

/**
 * Retorna os livros em destaque
 */
export async function getLivrosDestaque(limite?: number): Promise<LivroProps[]> {
  try {
    const livros = await prisma.livro.findMany({
      where: { 
        ativo: true
      },
      take: limite || undefined,
      select: {
        id: true,
        nome: true,
        descricao: true,
        sku: true,
        capa: true,
        preco: true,
        precoPromocional: true,
        tipo: true,
        estoque: true,
        emDestaque: true,
        ativo: true,
        categoriasLink: {
          select: {
            categoria: {
              select: {
                titulo: true,
                slug: true
              }
            }
          }
        },
        beneficios: {
          select: {
            titulo: true,
            descricao: true,
            icone: true
          }
        },
        paginas: {
          select: {
            numero: true,
            arquivo: true,
            conteudo: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Mapear categoriasLink para categorias para manter compatibilidade
    return livros.map(livro => ({
      ...livro,
      categorias: livro.categoriasLink,
      slug: gerarSlug(livro.nome)
    }));
  } catch (error) {
    console.error('Erro ao buscar livros em destaque:', error);
    
    // Livros fictícios para fallback
    return Array.from({ length: limite || 4 }).map((_, index) => ({
      id: `livro-${index + 1}`,
      nome: `Livro Digital ${index + 1}`,
      descricao: `Descrição do livro ${index + 1}`,
      preco: 29.99 + index * 5,
      precoPromocional: index % 2 === 0 ? 24.99 + index * 5 : null,
      sku: `LIVRO-DIG-00${index + 1}`,
      capa: `https://source.unsplash.com/random/300x400?book,children,${index + 1}`,
      tipo: "virtual",
      estoque: 999,
      emDestaque: true,
      ativo: true,
      slug: `livro-digital-${index + 1}`,
      categorias: [{ categoria: { titulo: 'Educativo', slug: 'educativo' } }]
    }));
  }
}

// Função para buscar livros por categoria
export async function getLivrosPorCategoria(categoriaSlug: string, limite?: number): Promise<LivroProps[]> {
  try {
    const livros = await prisma.livro.findMany({
      where: { 
        ativo: true,
        categoriasLink: {
          some: {
            categoria: {
              slug: categoriaSlug
            }
          }
        } 
      },
      take: limite || undefined,
      select: {
        id: true,
        nome: true,
        descricao: true,
        sku: true,
        capa: true,
        preco: true,
        precoPromocional: true,
        tipo: true,
        estoque: true,
        emDestaque: true,
        ativo: true,
        categoriasLink: {
          select: {
            categoria: {
              select: {
                titulo: true,
                slug: true
              }
            }
          }
        },
        beneficios: {
          select: {
            titulo: true,
            descricao: true,
            icone: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Mapear categoriasLink para categorias para manter compatibilidade
    return livros.map(livro => ({
      ...livro,
      categorias: livro.categoriasLink,
      slug: gerarSlug(livro.nome)
    }));
  } catch (error) {
    console.error('Erro ao buscar livros por categoria:', error);
    
    // Livros fictícios para fallback
    return Array.from({ length: limite || 4 }).map((_, index) => ({
      id: `livro-${index + 1}`,
      nome: `Livro Digital ${index + 1}`,
      descricao: `Descrição do livro ${index + 1}`,
      preco: 29.99 + index * 5,
      precoPromocional: index % 2 === 0 ? 24.99 + index * 5 : null,
      sku: `LIVRO-DIG-00${index + 1}`,
      capa: `https://source.unsplash.com/random/300x400?book,children,${index + 1}`,
      tipo: "virtual",
      estoque: 999,
      emDestaque: true,
      ativo: true,
      slug: `livro-digital-${index + 1}`,
      categorias: [{ categoria: { titulo: 'Educativo', slug: 'educativo' } }]
    }));
  }
}

/**
 * Gera um slug a partir do nome do livro
 */
function gerarSlug(texto: string): string {
  return texto
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
