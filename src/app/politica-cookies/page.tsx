import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PoliticaCookiesContent } from './components/politica-cookies-content';

export const metadata: Metadata = {
  title: 'Política de Cookies | Mais Criança',
  description: 'Entenda como utilizamos cookies para melhorar sua experiência. Transparência no uso de tecnologias de rastreamento.',
  keywords: ['política', 'cookies', 'rastreamento', 'navegação', 'experiência', 'mais criança'],
};

export default function PoliticaCookiesPage() {
  return (
    <>
      <Header />
      <PoliticaCookiesContent />
      <Footer />
    </>
  );
}
