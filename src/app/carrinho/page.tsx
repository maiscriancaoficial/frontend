// Em src/app/carrinho/page.tsx
import { SiteLayout } from '@/components/layout/site-layout';
import { CarrinhoTitulo } from './components/carrinho-titulo';
import { CarrinhoItens } from './components/carrinho-itens';
import { CarrinhoResumo } from './components/carrinho-resumo';

export default function CarrinhoPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          <CarrinhoTitulo />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="lg:col-span-2">
              <CarrinhoItens />
            </div>
            
            {/* Resumo da compra */}
            <div>
              <CarrinhoResumo />
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}