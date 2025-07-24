export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  conteudo: string;
  imagemCapa: string;
  
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoScore: number;
  
  // Relacionamentos
  postsRelacionados: string[];
  
  // Controle
  publicado: boolean;
  autorId: string;
  visualizacoes: number;
  createdAt: Date;
  updatedAt: Date;
}