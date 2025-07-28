import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CentralAtendimentoContent } from './components/central-atendimento-content';

export const metadata: Metadata = {
  title: 'Central de Atendimento | Mais Criança',
  description: 'Entre em contato conosco. Nossa equipe está pronta para ajudar você com carinho e dedicação.',
  keywords: ['atendimento', 'suporte', 'contato', 'ajuda', 'mais criança'],
};

export default function CentralAtendimentoPage() {
  return (
    <>
      <Header />
      <CentralAtendimentoContent />
      <Footer />
    </>
  );
}
