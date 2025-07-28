import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PersonalizacaoContent } from './components/personalizacao-content';

export const metadata: Metadata = {
  title: 'Personalização | Mais Criança',
  description: 'Crie produtos únicos e especiais com nosso serviço de personalização. Transforme suas ideias em realidade!',
  keywords: ['personalização', 'customização', 'produtos únicos', 'design', 'mais criança'],
};

export default function PersonalizacaoPage() {
  return (
    <>
      <Header />
      <PersonalizacaoContent />
      <Footer />
    </>
  );
}
