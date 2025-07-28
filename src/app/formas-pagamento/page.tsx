import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FormasPagamentoContent } from './components/formas-pagamento-content';

export const metadata: Metadata = {
  title: 'Formas de Pagamento | Mais Criança',
  description: 'Conheça todas as formas de pagamento disponíveis. Oferecemos opções seguras e convenientes para você.',
  keywords: ['pagamento', 'cartão', 'pix', 'boleto', 'parcelamento', 'mais criança'],
};

export default function FormasPagamentoPage() {
  return (
    <>
      <Header />
      <FormasPagamentoContent />
      <Footer />
    </>
  );
}
