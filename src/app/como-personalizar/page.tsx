import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ComoPersonalizarContent } from './components/como-personalizar-content';

export const metadata: Metadata = {
  title: 'Como Personalizar | Mais Criança',
  description: 'Aprenda como personalizar seus produtos passo a passo. Guia completo para criar peças únicas e especiais.',
  keywords: ['como personalizar', 'tutorial', 'passo a passo', 'guia', 'customização', 'mais criança'],
};

export default function ComoPersonalizarPage() {
  return (
    <>
      <Header />
      <ComoPersonalizarContent />
      <Footer />
    </>
  );
}
