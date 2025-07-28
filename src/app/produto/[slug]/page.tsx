import { SiteLayout } from '@/components/layout/site-layout';
import { notFound } from 'next/navigation';
import { getProdutoBySlug } from '@/services/produto-service-single';
import { ProdutoGaleria } from '@/components/produto/produto-galeria';
import { ProdutoInfo } from '@/components/produto/produto-info';
import { ProdutoDescricao } from '@/components/produto/produto-descricao';
import { ProdutosRelacionados } from '@/components/produto/produtos-relacionados';
import { getProdutosDestaque } from '@/services/produto-service';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type ProdutoPageParams = {
  slug: string;
};

// Componente do servidor para produtos relacionados
async function ProdutosRelacionadosSection() {
  const produtos = await getProdutosDestaque(8); // Buscando 8 produtos relacionados
  return <ProdutosRelacionados 
    produtos={produtos}
    titulo="Produtos Relacionados"
  />;
}

export default async function ProdutoPage(
  { params }: { params: ProdutoPageParams }
) {
  const produto = await getProdutoBySlug(params.slug);
  
  // Se o produto não existir, retorna uma página 404
  if (!produto) {
    notFound();
  }
  
  // Extrair a primeira categoria (se existir) para breadcrumb
  const primeiraCategoria = produto.categorias && produto.categorias.length > 0 
    ? produto.categorias[0].categoria
    : null;

  return (
    <SiteLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-1" />
                  Início
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            
            {primeiraCategoria && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/categoria-livro/${primeiraCategoria.slug}`}>
                      {primeiraCategoria.titulo}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              </>
            )}
            
            <BreadcrumbItem>
              <BreadcrumbLink>
                {produto.titulo}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Conteúdo principal do produto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 pt-2 md:pt-0">
          {/* Galeria de imagens */}
          <div>
            <ProdutoGaleria 
              fotoPrincipal={produto.fotoPrincipal || '/produtos/produto-placeholder.jpg'}
              galeria={produto.galeria || []}
              titulo={produto.titulo}
            />
          </div>
          
          {/* Informações do produto */}
          <div>
            <ProdutoInfo produto={produto} />
          </div>
        </div>
        
        {/* Descrição completa e avaliações */}
        <ProdutoDescricao produto={produto} />
        
        {/* Produtos relacionados */}
        <ProdutosRelacionadosSection />
      </div>
    </SiteLayout>
  );
}
