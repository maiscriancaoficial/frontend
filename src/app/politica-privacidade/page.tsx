import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PoliticaPrivacidadeContent } from './components/politica-privacidade-content';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Mais Criança',
  description: 'Conheça nossa política de privacidade e como protegemos seus dados pessoais. Transparência e segurança em primeiro lugar.',
  keywords: ['política', 'privacidade', 'dados', 'lgpd', 'proteção', 'mais criança'],
};

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <Header />
      <PoliticaPrivacidadeContent />
      <Footer />
    </>
  );
}
