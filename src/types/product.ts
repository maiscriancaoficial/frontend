export interface Product {
  id: string;
  titulo: string;
  descricao: string;
  descricaoCompleta: string;
  sku: string;
  preco: number;
  precoPromocional?: number;
  
  // Físico
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  
  // Categoria e Marca
  categoriaId: string;
  marca: string;
  
  // Mídia
  imagemPrincipal: string;
  galeria: string[];
  
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoScore: number;
  slug: string;
  
  // Controle
  ativo: boolean;
  estoque: number;
  destaque: boolean;
  createdAt: Date;
  updatedAt: Date;
}