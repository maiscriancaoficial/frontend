export interface Category {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  imagem: string;
  parentId?: string; // Para subcategorias
  ordem: number;
  ativo: boolean;
  
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}