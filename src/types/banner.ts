export interface Banner {
  id: string;
  titulo: string;
  fotoMobile: string;
  fotoDesktop: string;
  descricao: string;
  
  // Botões
  botao1Texto?: string;
  botao1Link?: string;
  botao1Cor?: string;
  botao1Fonte?: string;
  
  botao2Texto?: string;
  botao2Link?: string;
  botao2Cor?: string;
  botao2Fonte?: string;
  
  // Estilo
  corTitulo: string;
  fonteTitulo: string;
  alinhamentoHorizontal: 'left' | 'center' | 'right';
  alinhamentoVertical: 'top' | 'center' | 'bottom';
  
  // Controle
  ativo: boolean;
  ordem: number;
  dataInicio: Date;
  dataFim: Date;
}