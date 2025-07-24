import { SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Eye, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram,
  ArrowLeft,
  ArrowRight,
  Tag,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Função para buscar postagem por slug
async function getPostagem(slug: string) {
  try {
    const response = await fetch('http://localhost:3000/api/postagens', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API postagens:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    const postagem = data.postagens?.find((p: any) => p.slug === slug && p.ativo);
    return postagem || null;
  } catch (error) {
    console.error('Erro ao buscar postagem:', error);
    return null;
  }
}

// Função para buscar postagens relacionadas
async function getPostagensRelacionadas(categoriaId: string, postagemAtualId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/postagens?categoria=${categoriaId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API postagens relacionadas:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data.postagens?.filter((p: any) => p.id !== postagemAtualId && p.ativo).slice(0, 3) || [];
  } catch (error) {
    console.error('Erro ao buscar postagens relacionadas:', error);
    return [];
  }
}

// Componente de compartilhamento social (Client Component)
function CompartilhamentoSocial({ titulo, url }: { titulo: string; url: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Compartilhar:</span>
      <div className="flex gap-2">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full w-10 h-10 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
        >
          <Facebook className="w-4 h-4" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full w-10 h-10 border border-gray-200 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600 transition-colors"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${titulo} - ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full w-10 h-10 border border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

// Componente de postagem relacionada
function PostagemRelacionada({ postagem }: { postagem: any }) {
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        {postagem.fotoCapa ? (
          <Image
            src={postagem.fotoCapa}
            alt={postagem.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#27b99a]/20 to-[#ff0080]/20 flex items-center justify-center">
            <div className="text-4xl text-gray-300">📝</div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Calendar className="w-3 h-3" />
          <span>{formatarData(postagem.createdAt)}</span>
        </div>
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#27b99a] transition-colors">
          {postagem.titulo}
        </h4>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {postagem.resumo}
        </p>
        <Link href={`/blog/${postagem.slug}`}>
          <Button size="sm" variant="outline" className="w-full rounded-xl hover:bg-[#27b99a] hover:text-white hover:border-[#27b99a]">
            Ler mais
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const postagem = await getPostagem(params.slug);
  
  if (!postagem) {
    notFound();
  }

  const postagensRelacionadas = await getPostagensRelacionadas(postagem.categoriaBlogId, postagem.id);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calcularTempoLeitura = (conteudo: string) => {
    const palavras = conteudo.replace(/<[^>]*>/g, '').split(' ').length;
    const tempoLeitura = Math.ceil(palavras / 200); // 200 palavras por minuto
    return tempoLeitura;
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#27b99a] transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#27b99a] transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{postagem.titulo}</span>
            </div>
          </div>
        </div>

        {/* Artigo */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header do artigo */}
              <header className="mb-12 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Badge className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full px-4 py-2 font-medium">
                    {postagem.categoriaNome || 'Geral'}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {postagem.titulo}
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {postagem.resumo}
                </p>
                
                {/* Meta informações */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{postagem.autor || 'Mais Criança'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatarData(postagem.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{calcularTempoLeitura(postagem.conteudo)} min de leitura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{postagem.visualizacoes || 0} visualizações</span>
                  </div>
                </div>

                {/* Compartilhamento */}
                <div className="flex justify-center">
                  <CompartilhamentoSocial 
                    titulo={postagem.titulo} 
                    url={`http://localhost:3000/blog/${postagem.slug}`} 
                  />
                </div>
              </header>

              {/* Imagem de capa */}
              {postagem.fotoCapa && (
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
                  <Image
                    src={postagem.fotoCapa}
                    alt={postagem.titulo}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Conteúdo do artigo */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: postagem.conteudo }}
                />
              </div>

              {/* Tags */}
              {postagem.tags && postagem.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                    {postagem.tags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-gray-100 text-gray-600 hover:bg-[#ff0080]/10 hover:text-[#ff0080] rounded-full cursor-pointer transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações do artigo */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-center">
                  <CompartilhamentoSocial 
                    titulo={postagem.titulo} 
                    url={`http://localhost:3000/blog/${postagem.slug}`} 
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Postagens relacionadas */}
        {postagensRelacionadas.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Artigos relacionados
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {postagensRelacionadas.map((postagem: any) => (
                    <PostagemRelacionada key={postagem.id} postagem={postagem} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Navegação entre posts */}
        <section className="py-8 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <Link href="/blog">
                  <Button variant="outline" className="rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao blog
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full">
                    Ver mais artigos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
