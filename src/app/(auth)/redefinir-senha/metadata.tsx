import { Metadata } from 'next';

// Metadata estático para evitar problemas de renderização
export const metadata: Metadata = {
  title: 'Redefinir Senha | Mais criança',
  description: 'Redefina sua senha para acessar sua conta',
};

// Desativa viewport dinâmico para evitar o erro de geração no servidor
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
