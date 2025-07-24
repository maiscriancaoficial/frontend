export enum UserRole {
  ADMIN = 'admin',
  FUNCIONARIO = 'funcionario',
  CLIENTE = 'cliente',
  GUEST = 'guest'
}

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
  
  // Endereço
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  
  // Documento
  cpf?: string;
  cnpj?: string;
  razaoSocial?: string; // Se PJ
  
  // Controle
  ativo: boolean;
  emailVerificado: boolean;
  createdAt: Date;
  updatedAt: Date;
}