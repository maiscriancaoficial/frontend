import { Metadata } from 'next';

// Metadata estático para evitar problemas de renderização
export const metadata: Metadata = {
  title: 'Login | Mais criança',
  description: 'Acesse sua conta para gerenciar pedidos e preferências',
};

// Desativa viewport dinâmico para evitar o erro de geração no servidor
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
