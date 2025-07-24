"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LivroGeneroForm } from '@/components/livro/livro-genero-form';
import { Skeleton } from '@/components/ui/skeleton';
import type { LivroProps } from '@/types/livro';
import Link from 'next/link';

export default function LivroSinglePage() {
  const params = useParams();
  const categoriaSlug = params?.slug as string;
  const livroSlug = params?.livroSlug as string;
  
  const [livro, setLivro] = useState<LivroProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Função para buscar os dados do livro
    const buscarLivro = async () => {
      setIsLoading(true);
      try {
        // Tentar buscar da API real
        const response = await fetch(`/api/livros/${livroSlug}`);
        if (response.ok) {
          const data = await response.json();
          setLivro(data);
        } else {
          // Simulação de dados para desenvolvimento
          const livroMock: LivroProps = {
            id: `livro-${Math.random().toString(36).substring(7)}`,
            nome: `Livro de ${categoriaSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}`,
            slug: livroSlug,
            descricao: `Uma história incrível e personalizada para crianças, ambientada no mundo mágico de ${categoriaSlug.replace(/-/g, ' ')}.`,
            preco: 89.90,
            precoPromocional: 69.90,
            capa: `https://source.unsplash.com/random/600x800?book,children,${encodeURIComponent(categoriaSlug)}`,
            categorias: [
              { categoria: { titulo: categoriaSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '), slug: categoriaSlug } }
            ]
          };
          
          setLivro(livroMock);
        }
      } catch (error) {
        console.error('Erro ao buscar livro:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    buscarLivro();
  }, [categoriaSlug, livroSlug]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-12 w-3/4 bg-gray-200" />
          <Skeleton className="h-64 w-full bg-gray-200" />
          <Skeleton className="h-8 w-1/2 bg-gray-200" />
          <Skeleton className="h-8 w-1/3 bg-gray-200" />
        </div>
      </div>
    );
  }
  
  if (!livro) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Livro não encontrado</h1>
        <p className="mt-4 text-gray-500">O livro que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }
  
  return (
    <div className="pt-32 pb-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#e8094c]">Início</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/categoria/${categoriaSlug}`} className="text-gray-500 hover:text-[#e8094c]">
            {categoriaSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#e8094c] font-medium">{livro.nome}</span>
        </div>
        <header className="text-left mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            {livro.nome}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {livro.descricao}
          </p>
        </header>

        <div className="w-full mx-auto">
          <LivroGeneroForm 
            slug={livro.slug}
            categoriaSlug={categoriaSlug}
            livroNome={livro.nome || ''}
            livroCapa={livro.capa || ''}
            livroPreco={livro.preco || 0}
            livroPrecoPromocional={livro.precoPromocional}
          />
        </div>
      </div>
    </div>
  );
}
