export interface ShippingRule {
  id: string;
  nome: string;
  tipo: 'cep_range' | 'cep_specific' | 'cidade' | 'estado' | 'km';
  
  // Localização
  cepDe?: string;
  cepAte?: string;
  cepEspecifico?: string;
  cidade?: string;
  estado?: string;
  kmMaximo?: number;
  
  // Valores
  valorFrete: number;
  tempoEntrega: number; // em dias
  
  // Correção automática
  correcaoAutomatica: boolean;
  tempoCorrecao?: number; // em dias
  
  // Controle
  ativo: boolean;
  createdAt: Date;
}