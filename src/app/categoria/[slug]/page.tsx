'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProdutosLista } from '@/components/categoria/produtos-lista';
import { LivrosLista } from '@/components/livro/livros-lista';
import { FiltroAvancado } from '@/components/categoria/filtro-avancado';
import { ProdutoProps } from '@/services/produto-service';
import { LivroProps } from '@/services/livro-service';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

export default function CategoriaPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [produtos, setProdutos] = useState<ProdutoProps[]>([]);
  const [livros, setLivros] = useState<LivroProps[]>([]);
  const [categoriaNome, setCategoriaNome] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [activeTab, setActiveTab] = useState('produtos');
  const [filtros, setFiltros] = useState({
    termo: '',
    precoMin: 0,
    precoMax: 1000,
    categorias: [] as string[],
    tags: [] as string[],
    cores: [] as string[],
    tamanhos: [] as string[]
  });

  useEffect(() => {
    // Carregamento de produtos e livros baseado na slug
    setIsLoading(true);
    
    // Converter a slug para um nome de categoria legível
    const nomeCategoria = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    setCategoriaNome(nomeCategoria);
    
    const buscarDados = async () => {
      try {
        // Buscando livros da categoria
        const response = await fetch(`/api/livros/categoria/${slug}`);
        if (response.ok) {
          const livrosData = await response.json();
          setLivros(livrosData);
          
          // Se existir pelo menos um livro, defina a aba ativa como 'livros'
          if (livrosData.length > 0) {
            setActiveTab('livros');
          }
        } else {
          // Simulação de dados
          const livrosMock: LivroProps[] = Array.from({ length: 6 }, (_, i) => ({
            id: `livro-${i + 1}`,
            nome: `Livro de ${nomeCategoria} ${i + 1}`,
            slug: `livro-${slug}-${i + 1}`,
            descricao: `Um fantástico livro digital personalizado sobre ${nomeCategoria.toLowerCase()}.`,
            capa: `https://source.unsplash.com/random/400x500?book,children,${encodeURIComponent(nomeCategoria.toLowerCase())}`,
            preco: 79.90 + (i * 10),
            precoPromocional: i % 2 === 0 ? 59.90 + (i * 5) : undefined,
            sku: `LIV-${slug.substring(0, 3).toUpperCase()}-${i+1}`,
            descricaoCompleta: `Um livro digital personalizado incrível sobre ${nomeCategoria.toLowerCase()} para crianças de todas as idades.`,
            capaVerso: `https://source.unsplash.com/random/400x500?book,cover,${encodeURIComponent(nomeCategoria.toLowerCase())}`,
            tipo: 'digital',
            estoque: 999,
            emDestaque: i < 2,
            ativo: true,
            categorias: [{ categoria: { titulo: nomeCategoria, slug } }],
            beneficios: [
              { id: `ben-${i}-1`, titulo: 'Digital', descricao: 'Entrega imediata', icone: 'zap' },
              { id: `ben-${i}-2`, titulo: 'Personalizado', descricao: 'Com o nome da criança', icone: 'smile' }
            ],
          }));
          
          setLivros(livrosMock);
          
          if (slug === 'aventura' || slug === 'educativo' || slug === 'fantasia' || slug === 'valores-e-emocoes') {
            setActiveTab('livros');
          }
        }
        
        // Buscando produtos da categoria
        const produtosResponse = await fetch(`/api/produtos/categoria/${slug}`);
        if (produtosResponse.ok) {
          const produtosData = await produtosResponse.json();
          setProdutos(produtosData);
        } else {
          // Produtos simulados para demonstração
          const produtosMock: ProdutoProps[] = Array.from({ length: 8 }, (_, i) => ({
            emDestaque: Math.random() > 0.7,
            estoque: Math.floor(Math.random() * 20),
            id: `${i + 1}`,
            titulo: `${nomeCategoria} ${i + 1}`,
            slug: `${slug}-${i + 1}`,
            preco: Math.floor(Math.random() * 200) + 89.9,
            precoPromocional: Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 59.9 : undefined,
            disponivel: Math.random() > 0.1,
            novo: Math.random() > 0.8,
            promocao: Math.random() > 0.7,
            vendido: Math.random() > 0.9,
            imagens: ['/placeholder.jpg'],
            categorias: [nomeCategoria],
            tags: ['Flores', 'Presentes', 'Decoração'].filter(() => Math.random() > 0.5),
            cores: ['Vermelho', 'Azul', 'Rosa', 'Branco'].filter(() => Math.random() > 0.5),
            tamanhos: ['Pequeno', 'Médio', 'Grande'].filter(() => Math.random() > 0.6),
          }));
          
          setProdutos(produtosMock);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setIsLoading(false);
      }
    };
    
    buscarDados();
  }, [slug]);

  const handleFiltroChange = (novoFiltro: any) => {
    setFiltros({ ...filtros, ...novoFiltro });
  };

  const produtosFiltrados = produtos.filter(produto => {
    // Filtro por termo de busca
    if (filtros.termo && !produto.titulo.toLowerCase().includes(filtros.termo.toLowerCase())) {
      return false;
    }
    
    // Filtro por preço
    if (
      (produto.precoPromocional || produto.preco) < filtros.precoMin ||
      (produto.precoPromocional || produto.preco) > filtros.precoMax
    ) {
      return false;
    }
    
    // Filtro por categorias (se selecionadas)
    if (filtros.categorias.length > 0 && !filtros.categorias.some(cat => 
      produto.categorias && produto.categorias.some(c => c === cat || (typeof c === 'object' && c.categoria && c.categoria.titulo === cat))
    )) {
      return false;
    }
    
    // Filtro por tags (se selecionadas)
    if (filtros.tags.length > 0 && !filtros.tags.some(tag => 
      produto.tags && produto.tags.includes(tag)
    )) {
      return false;
    }
    
    // Filtro por cores (se selecionadas)
    if (filtros.cores.length > 0 && !filtros.cores.some(cor => 
      produto.cores && produto.cores.includes(cor)
    )) {
      return false;
    }
    
    // Filtro por tamanhos (se selecionadas)
    if (filtros.tamanhos.length > 0 && !filtros.tamanhos.some(tamanho => 
      produto.tamanhos && produto.tamanhos.includes(tamanho)
    )) {
      return false;
    }
    
    return true;
  });
  
  // Filtrar livros
  const livrosFiltrados = livros.filter(livro => {
    // Filtro por termo de busca
    if (filtros.termo && !livro.nome.toLowerCase().includes(filtros.termo.toLowerCase())) {
      return false;
    }
    
    // Filtro por preço
    if (
      (livro.precoPromocional || livro.preco) < filtros.precoMin ||
      (livro.precoPromocional || livro.preco) > filtros.precoMax
    ) {
      return false;
    }
    
    // Filtro por categorias (se selecionadas)
    if (filtros.categorias.length > 0 && !filtros.categorias.some(cat => 
      livro.categorias && livro.categorias.some(c => c.categoria.titulo === cat)
    )) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-24 mt-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <Badge className="bg-[#27b99a]/10 hover:bg-[#27b99a]/10 text-[#27b99a] dark:bg-[#27b99a]/20 dark:text-[#27b99a] mb-3 mt-6">
            Categoria
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white pt-4 md:pt-0">
            {isLoading ? (
              <Skeleton className="h-10 w-48 bg-gray-200 dark:bg-gray-800" />
            ) : (
              categoriaNome
            )}
          </h1>
          {isLoading ? (
            <div className="mt-2">
              <Skeleton className="h-5 w-96 bg-gray-200 dark:bg-gray-800" />
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {activeTab === 'produtos' 
                ? `Encontramos ${produtosFiltrados.length} produtos nesta categoria` 
                : `Encontramos ${livrosFiltrados.length} livros nesta categoria`}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full gap-6">
        <div className="w-full">
          <FiltroAvancado 
            filtros={filtros}
            onFiltroChange={handleFiltroChange} 
            isOpen={filtroAberto}
            onToggle={() => setFiltroAberto(!filtroAberto)}
            categorias={['Buquê de Flores', 'Cestas de Flores', 'Arranjos de Flores', 'Aventura', 'Educativo', 'Fantasia']}
            tags={['Flores', 'Presentes', 'Decoração', 'Livros', 'Digital', 'Personalizado']}
            cores={['Vermelho', 'Rosa', 'Branco', 'Azul', 'Amarelo', 'Laranja', 'Roxo']}
            tamanhos={['Pequeno', 'Médio', 'Grande', 'Extra Grande']}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-[#ff0080]/5 dark:bg-[#ff0080]/10">
            <TabsTrigger 
              value="produtos" 
              className={`${activeTab === 'produtos' ? 'bg-white dark:bg-gray-800' : ''}`}
            >
              Produtos
              <Badge variant="outline" className="ml-2">
                {produtosFiltrados.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="livros" 
              className={`${activeTab === 'livros' ? 'bg-white dark:bg-gray-800' : ''}`}
            >
              Livros Digitais
              <Badge variant="outline" className="ml-2">
                {livrosFiltrados.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="produtos" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <Skeleton className="h-64 w-full bg-gray-200 dark:bg-gray-800" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-800 mb-2" />
                      <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProdutosLista 
                  produtos={produtosFiltrados}
                  emptyMessage={`Nenhum produto encontrado para os filtros selecionados.`}
                />
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="livros" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="rounded-xl overflow-hidden">
                    <Skeleton className="h-60 w-full bg-gray-200 dark:bg-gray-800" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-800 mb-2" />
                      <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
