import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NossaHistoriaContent } from './components/nossa-historia-content';

export const metadata: Metadata = {
  title: 'Nossa História | Mais Criança',
  description: 'Conheça a trajetória completa da Mais Criança. Uma história de amor, dedicação e momentos especiais criados para famílias.',
  keywords: ['nossa história', 'trajetória', 'origem', 'fundação', 'jornada', 'mais criança'],
};

export default function NossaHistoriaPage() {
  return (
    <>
      <Header />
      <NossaHistoriaContent />
      <Footer />
    </>
  );
}
