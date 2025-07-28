import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { QuemSomosContent } from './components/quem-somos-content';

export const metadata: Metadata = {
  title: 'Quem Somos | Mais Criança',
  description: 'Conheça nossa história, missão e valores. Somos uma empresa dedicada a criar momentos especiais para as crianças e suas famílias.',
  keywords: ['quem somos', 'história', 'missão', 'valores', 'empresa', 'mais criança'],
};

export default function QuemSomosPage() {
  return (
    <>
      <Header />
      <QuemSomosContent />
      <Footer />
    </>
  );
}
