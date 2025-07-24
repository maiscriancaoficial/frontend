import { SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, Home } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostNotFound() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto rounded-3xl border border-gray-100 shadow-xl">
            <CardContent className="p-12 text-center">
              {/* Ícone ilustrativo */}
              <div className="text-8xl mb-8">🔍</div>
              
              {/* Título */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Artigo não encontrado
              </h1>
              
              {/* Descrição */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Ops! O artigo que você está procurando não existe ou pode ter sido removido. 
                Que tal explorar outros conteúdos incríveis do nosso blog?
              </p>
              
              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/blog">
                  <Button className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-2xl px-8 py-3 font-medium transition-all duration-300 hover:shadow-lg">
                    <Search className="w-5 h-5 mr-2" />
                    Explorar blog
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="rounded-2xl px-8 py-3 font-medium border-2 hover:bg-gray-50 transition-all duration-300">
                    <Home className="w-5 h-5 mr-2" />
                    Página inicial
                  </Button>
                </Link>
              </div>
              
              {/* Link de voltar */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <button 
                  onClick={() => window.history.back()}
                  className="text-gray-500 hover:text-[#27b99a] transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar à página anterior
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
