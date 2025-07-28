import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DuvidasFrequentesContent } from './components/duvidas-frequentes-content';

export const metadata: Metadata = {
  title: 'Dúvidas Frequentes | Mais Criança',
  description: 'Encontre respostas para as principais dúvidas sobre nossos produtos e serviços. Estamos aqui para ajudar!',
  keywords: ['dúvidas', 'faq', 'perguntas', 'ajuda', 'suporte', 'mais criança'],
};

export default function DuvidasFrequentesPage() {
  return (
    <>
      <Header />
      <DuvidasFrequentesContent />
      <Footer />
    </>
  );
}
