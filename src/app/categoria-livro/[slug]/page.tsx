'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LivrosLista } from '@/components/livro/livros-lista';
import { LivroProps } from '@/services/livro-service';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { BookOpen, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CategoriaLivroPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [livros, setLivros] = useState<LivroProps[]>([]);
  const [categoriaNome, setCategoriaNome] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalLivros, setTotalLivros] = useState(0);
  const [filtros, setFiltros] = useState({
    termo: '',
    ordenacao: 'nome'
  });

  useEffect(() => {
    setIsLoading(true);
    
    // Converter a slug para um nome de categoria legível
    const nomeCategoria = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    setCategoriaNome(nomeCategoria);
    
    const buscarLivros = async () => {
      try {
        // Buscando livros reais da categoria
        const response = await fetch(`/api/livros/categoria/${slug}`);
        if (response.ok) {
          const livrosData = await response.json();
          setLivros(livrosData);
          setTotalLivros(livrosData.length);
        } else {
          // Se não encontrar, deixar vazio
          setLivros([]);
          setTotalLivros(0);
        }
        
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
        setLivros([]);
        setTotalLivros(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    buscarLivros();
  }, [slug]);
  
  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };
  
  // Filtrar e ordenar livros
  const livrosFiltrados = livros
    .filter(livro => {
      const matchTermo = livro.nome.toLowerCase().includes(filtros.termo.toLowerCase()) ||
                        livro.descricao?.toLowerCase().includes(filtros.termo.toLowerCase());
      return matchTermo;
    })
    .sort((a, b) => {
      switch (filtros.ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'mais-recente':
          return a.id.localeCompare(b.id); // Usar ID como proxy para data
        default:
          return 0;
      }
    });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 pt-40">
        {/* Header da Categoria */}
        <div className="text-center mb-8">
          {/* Contador de livros */}
          <div className="mb-4">
            <Badge variant="outline" className="text-sm rounded-full">
              {isLoading ? 'Carregando...' : `${livrosFiltrados.length} ${livrosFiltrados.length === 1 ? 'livro encontrado' : 'livros encontrados'}`}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            {categoriaNome}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubra nossa coleção especial de livros digitais personalizados sobre {categoriaNome.toLowerCase()}.
          </p>
        </div>
        
        {/* Filtros simplificados */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título, autor ou descrição..."
                value={filtros.termo}
                onChange={(e) => handleFiltroChange('termo', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={filtros.ordenacao} onValueChange={(value) => handleFiltroChange('ordenacao', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome A-Z</SelectItem>
                <SelectItem value="mais-recente">Mais recente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Lista de livros */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <Skeleton className="h-60 w-full bg-gray-200 dark:bg-gray-800" />
                <div className="p-4">
                  <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-800 mb-2" />
                  <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : livrosFiltrados.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LivrosLista 
              livros={livrosFiltrados}
              emptyMessage={`Nenhum livro encontrado para os filtros selecionados.`}
            />
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Nenhum livro encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
              Não encontramos livros nesta categoria ainda. Que tal explorar outras categorias?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
