import { prisma } from '@/lib/prisma';

export interface ProdutoProps {
  id: string;
  titulo: string;
  slug: string;
  descricao?: string | null;
  descricaoLonga?: string | null;
  preco: number;
  precoPromocional?: number | null;
  fotoPrincipal?: string | null;
  galeria?: string[];
  imagens?: string[];
  emDestaque: boolean;
  estoque: number;
  disponivel?: boolean;
  novo?: boolean;
  promocao?: boolean;
  vendido?: boolean;
  categorias?: { categoria: { titulo: string; slug: string } }[] | string[];
  tags?: string[];
  cores?: string[];
  tamanhos?: string[];
}

export async function getProdutosDestaque(limite?: number): Promise<ProdutoProps[]> {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        ativo: true,
        // Removido filtro de emDestaque para mostrar todos os produtos
      },
      select: {
        id: true,
        titulo: true,
        slug: true,
        descricao: true,
        descricaoLonga: true,
        preco: true,
        precoPromocional: true,
        fotoPrincipal: true,
        estoque: true,
        emDestaque: true,
        categoriasLink: {
          select: {
            categoria: {
              select: {
                titulo: true,
                slug: true,
              }
            }
          }
        }
      },
      take: limite || 10,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return produtos.map(produto => ({
      ...produto,
      categorias: produto.categoriasLink,
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    
    // Produtos fictícios para fallback
    return Array.from({ length: 10 }).map((_, index) => ({
      id: `produto-${index + 1}`,
      titulo: `Produto ${index + 1}`,
      slug: `produto-${index + 1}`,
      descricao: `Descrição do produto ${index + 1}`,
      preco: 99.99 + index * 10,
      precoPromocional: index % 2 === 0 ? 79.99 + index * 10 : null,
      fotoPrincipal: `/produtos/produto-${(index % 5) + 1}.jpg`,
      estoque: 10 + index,
      emDestaque: true
    }));
  }
}
