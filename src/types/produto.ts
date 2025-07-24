// Definição dos tipos baseados no schema do Prisma
export interface ProdutoCard {
  id: number;
  titulo: string;
  descricao?: string;
  descricaoLonga?: string;
  slug: string;
  preco: number;
  precoPromocional?: number;
  sku?: string;
  estoque: number;
  fotoPrincipal?: string;
  galeria?: string[];
  peso?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  palavrasChave?: string;
  emDestaque: boolean;
  ativo: boolean;
  tamanho?: string;
}

export interface ProdutoDetalhado extends ProdutoCard {
  categorias?: string[];
  tags?: string[];
  metaTitulo?: string;
  metaDescricao?: string;
}
