export interface LivroProps {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  capa: string;
  capaVerso?: string;
  categorias?: {
    categoria: {
      titulo: string;
      slug: string;
    }
  }[];
  beneficios?: {
    id: string;
    titulo: string;
    descricao: string;
    icone?: string;
  }[];
  sku?: string;
}
