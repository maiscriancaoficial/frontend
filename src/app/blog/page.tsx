import { SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, User, ArrowRight, Clock, Eye, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

// Função para buscar postagens da API
async function getPostagens() {
  try {
    const response = await fetch('http://localhost:3000/api/postagens?status=publicado', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API postagens:', response.status, response.statusText);
      const text = await response.text();
      console.error('Conteúdo da resposta:', text.substring(0, 200));
      return [];
    }
    
    const data = await response.json();
    return data.postagens || [];
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
    return [];
  }
}

// Função para buscar categorias da API
async function getCategoriasBlog() {
  try {
    const response = await fetch('http://localhost:3000/api/categorias-blog', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API categorias:', response.status, response.statusText);
      const text = await response.text();
      console.error('Conteúdo da resposta:', text.substring(0, 200));
      return [];
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Componente de Loading
function PostagensLoading() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden rounded-3xl border border-gray-100 animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-3 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Componente de Postagem Individual
function PostagemCard({ postagem }: { postagem: any }) {
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="group overflow-hidden rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-video overflow-hidden">
        {postagem.fotoCapa ? (
          <Image
            src={postagem.fotoCapa}
            alt={postagem.titulo}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#27b99a]/20 to-[#ff0080]/20 flex items-center justify-center">
            <div className="text-6xl text-gray-300">📝</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge da categoria */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full px-3 py-1 font-medium">
            {postagem.categoriaNome || 'Geral'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatarData(postagem.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{postagem.autor || 'Mais Criança'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{postagem.visualizacoes || 0}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#27b99a] transition-colors duration-300">
          {postagem.titulo}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {postagem.resumo}
        </p>
        
        {/* Tags */}
        {postagem.tags && postagem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {postagem.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-[#ff0080]/10 hover:text-[#ff0080] rounded-full">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <Link href={`/blog/${postagem.slug}`}>
          <Button className="w-full bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl font-medium transition-all duration-300 group/btn">
            Ler artigo completo
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function BlogPage() {
  const [postagens, categorias] = await Promise.all([
    getPostagens(),
    getCategoriasBlog()
  ]);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#27b99a]/5 via-transparent to-[#ff0080]/5" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Blog
                <span className="bg-gradient-to-r from-[#27b99a] to-[#ff0080] bg-clip-text text-transparent ml-3">
                  Mais Criança
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Descubra dicas, inspirações e novidades sobre flores, plantas e decoração. 
                Conteúdo exclusivo para transformar seus espaços em ambientes únicos e especiais.
              </p>
              
              {/* Barra de busca */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar artigos, dicas, inspirações..."
                  className="pl-12 pr-4 py-4 text-lg rounded-3xl border-2 border-gray-200 focus:border-[#27b99a] focus:ring-[#27b99a]/20 bg-white/80 backdrop-blur-sm"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#27b99a] hover:bg-[#239d84] text-white rounded-2xl px-6">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        {categorias.length > 0 && (
          <section className="py-12 border-b border-gray-100">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button variant="outline" className="rounded-full border-2 border-[#27b99a] text-[#27b99a] hover:bg-[#27b99a] hover:text-white transition-all duration-300">
                  Todas as categorias
                </Button>
                {categorias.slice(0, 6).map((categoria: any) => (
                  <Button
                    key={categoria.id}
                    variant="ghost"
                    className="rounded-full hover:bg-[#ff0080]/10 hover:text-[#ff0080] transition-all duration-300"
                  >
                    {categoria.nome}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grid de Postagens */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {postagens.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Últimos artigos
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore nossos conteúdos mais recentes e descubra tudo sobre o mundo das flores e plantas
                  </p>
                </div>
                
                <Suspense fallback={<PostagensLoading />}>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {postagens.map((postagem: any) => (
                      <PostagemCard key={postagem.id} postagem={postagem} />
                    ))}
                  </div>
                </Suspense>

                {/* Paginação */}
                <div className="flex justify-center mt-16">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-full">
                      Anterior
                    </Button>
                    <Button className="rounded-full bg-[#27b99a] text-white">1</Button>
                    <Button variant="outline" className="rounded-full">2</Button>
                    <Button variant="outline" className="rounded-full">3</Button>
                    <Button variant="outline" className="rounded-full">
                      Próximo
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Em breve, novos conteúdos!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Estamos preparando artigos incríveis sobre flores, plantas e decoração. 
                  Volte em breve para conferir!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
