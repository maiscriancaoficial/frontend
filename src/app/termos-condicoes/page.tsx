import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TermosCondicoesContent } from './components/termos-condicoes-content';

export const metadata: Metadata = {
  title: 'Termos e Condições | Mais Criança',
  description: 'Leia nossos termos e condições de uso. Transparência e clareza em todos os nossos serviços e produtos.',
  keywords: ['termos', 'condições', 'uso', 'legal', 'contrato', 'mais criança'],
};

export default function TermosCondicoesPage() {
  return (
    <>
      <Header />
      <TermosCondicoesContent />
      <Footer />
    </>
  );
}
