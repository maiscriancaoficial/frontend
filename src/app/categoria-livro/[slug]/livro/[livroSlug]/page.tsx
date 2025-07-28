"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LivroGeneroForm } from '@/components/livro/livro-genero-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Heart, 
  Share2, 
  BookOpen, 
  Users, 
  Clock, 
  Award,
  ChevronLeft,
  Check,
  Sparkles
} from 'lucide-react';

// Interface para o livro completo
interface LivroCompleto {
  id: string;
  nome: string;
  slug: string;
  autor?: string;
  descricao?: string;
  descricaoCompleta?: string;
  faixaEtaria?: string;
  numeroPaginas?: number;
  preco: number;
  precoPromocional?: number;
  capa: string;
  imagemCapa?: string;
  sku?: string;
  emDestaque: boolean;
  categorias: Array<{
    categoria: {
      id: string;
      titulo: string;
      slug: string;
    }
  }>;
  beneficios: Array<{
    id: string;
    titulo: string;
    descricao: string;
    icone?: string;
    ordem: number;
  }>;
  tags?: Array<{
    id: string;
    nome: string;
    slug: string;
  }>;
  totalPersonalizacoes?: number;
  totalVendas?: number;
  totalPaginas?: number;
}

export default function LivroSinglePage() {
  const params = useParams();
  const categoriaSlug = params?.slug as string;
  const livroSlug = params?.livroSlug as string;
  
  const [livro, setLivro] = useState<LivroCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  
  useEffect(() => {
    const buscarLivro = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/livros/slug/${livroSlug}`);
        if (response.ok) {
          const data = await response.json();
          setLivro(data.livro);
        } else {
          console.error('Livro não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar livro:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    buscarLivro();
  }, [livroSlug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calcularDesconto = () => {
    if (!livro?.precoPromocional) return 0;
    return Math.round(((livro.preco - livro.precoPromocional) / livro.preco) * 100);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-40">
          <div className="text-center space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto rounded-full" />
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-6 w-2/3 mx-auto rounded-full" />
            <Skeleton className="h-96 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!livro) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Livro não encontrado</h1>
          <p className="text-gray-500 mb-6">O livro que você está procurando não existe ou foi removido.</p>
          <Button asChild className="rounded-full">
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-40">
        {/* Breadcrumb */}
        <nav className="mb-8 text-center">
          <div className="inline-flex items-center text-sm text-gray-500 space-x-2">
            <Link href="/" className="hover:text-[#ff0080] transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link 
              href={`/categoria-livro/${categoriaSlug}`} 
              className="hover:text-[#ff0080] transition-colors"
            >
              {livro.categorias[0]?.categoria.titulo || 'Livros'}
            </Link>
            <span>/</span>
            <span className="text-[#ff0080] font-medium">{livro.nome}</span>
          </div>
        </nav>

        {/* Formulário de Personalização - Primeira Seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="bg-[#ff0080]/5 rounded-full p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Personalize Seu Livro
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Crie uma história única e especial para sua criança
              </p>
            </div>
            
            <LivroGeneroForm 
              slug={livro.slug}
              categoriaSlug={categoriaSlug}
              livroNome={livro.nome}
              livroCapa={livro.imagemCapa || livro.capa}
              livroPreco={livro.precoPromocional || livro.preco}
              livroPrecoPromocional={livro.precoPromocional}
            />
          </div>
        </motion.div>

        {/* Informações do Livro - Segunda Seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          {/* Categoria */}
          {livro.categorias[0] && (
            <Badge variant="outline" className="text-[#ff0080] border-[#ff0080] rounded-full mb-6">
              {livro.categorias[0].categoria.titulo}
            </Badge>
          )}

          {/* Título e Autor */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {livro.nome}
            </h1>
            {livro.autor && (
              <p className="text-xl text-gray-600">
                por <span className="font-semibold">{livro.autor}</span>
              </p>
            )}
          </div>

          {/* Preços */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              {livro.precoPromocional ? (
                <>
                  <span className="text-4xl font-bold text-[#27b99a]">
                    {formatPrice(livro.precoPromocional)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(livro.preco)}
                  </span>
                  <Badge className="bg-red-500 text-white rounded-full">
                    -{calcularDesconto()}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(livro.preco)}
                </span>
              )}
            </div>
            <p className="text-gray-500">
              Livro digital personalizado • Entrega imediata
            </p>
          </div>

          {/* Descrição */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {livro.descricaoCompleta || livro.descricao}
            </p>
          </div>

          {/* Informações Adicionais */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 mb-8">
            {livro.faixaEtaria && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <Users className="h-5 w-5" />
                <span>{livro.faixaEtaria}</span>
              </div>
            )}
            {livro.numeroPaginas && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <BookOpen className="h-5 w-5" />
                <span>{livro.numeroPaginas} páginas</span>
              </div>
            )}
            {livro.totalVendas && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <Award className="h-5 w-5" />
                <span>{livro.totalVendas} vendas</span>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart className={`h-5 w-5 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Compartilhar
            </Button>
          </div>
        </motion.div>

        {/* Benefícios */}
        {livro.beneficios && livro.beneficios.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Por que escolher este livro?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {livro.beneficios.map((beneficio, index) => (
                <motion.div
                  key={beneficio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="bg-white border border-gray-100 rounded-full p-8 hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 bg-[#ff0080]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-8 w-8 text-[#ff0080]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      {beneficio.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {beneficio.descricao}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
