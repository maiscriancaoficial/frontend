export interface Coupon {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  
  // Desconto
  tipoDesconto: 'percentual' | 'valor';
  valorDesconto: number;
  
  // Limites
  valorMinimo?: number;
  quantidadeMaxima?: number;
  quantidadePorUsuario?: number;
  
  // Validade
  dataInicio: Date;
  dataFim: Date;
  
  // Controle
  ativo: boolean;
  usos: number;
  createdAt: Date;
}