import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PoliticaReembolsoContent } from './components/politica-reembolso-content';

export const metadata: Metadata = {
  title: 'Política de Reembolso | Mais Criança',
  description: 'Conheça nossa política de reembolso, trocas e devoluções. Garantimos sua satisfação com transparência e agilidade.',
  keywords: ['política', 'reembolso', 'devolução', 'troca', 'garantia', 'mais criança'],
};

export default function PoliticaReembolsoPage() {
  return (
    <>
      <Header />
      <PoliticaReembolsoContent />
      <Footer />
    </>
  );
}
