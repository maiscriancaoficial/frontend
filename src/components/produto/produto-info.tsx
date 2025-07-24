"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, Heart, Share2, Minus, Plus, Check, Star, StarHalf, Package, Zap
} from 'lucide-react';
import { ProdutoDetalhado } from '@/services/produto-service-single';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProdutoInfoProps {
  produto: ProdutoDetalhado;
}

export function ProdutoInfo({ produto }: ProdutoInfoProps) {
  const [quantidade, setQuantidade] = useState(1);
  const [adicionadoAoCarrinho, setAdicionadoAoCarrinho] = useState(false);
  const [favorito, setFavorito] = useState(false);
  
  // Formatar preço para exibição
  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Calcular desconto percentual
  const calcularDescontoPercentual = () => {
    if (produto.precoPromocional && produto.preco) {
      const desconto = ((produto.preco - produto.precoPromocional) / produto.preco) * 100;
      return Math.round(desconto);
    }
    return 0;
  };

  // Verificar disponibilidade no estoque
  const disponibilidade = produto.estoque > 0 
    ? { status: 'Em estoque', cor: 'text-green-600 dark:text-green-500' } 
    : { status: 'Fora de estoque', cor: 'text-red-600 dark:text-red-500' };

  // Incrementar quantidade
  const incrementarQuantidade = () => {
    if (quantidade < produto.estoque) {
      setQuantidade(prev => prev + 1);
    }
  };
  
  // Decrementar quantidade
  const decrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(prev => prev - 1);
    }
  };
  
  // Adicionar ao carrinho usando o serviço
  const adicionarAoCarrinho = () => {
    if (produto.estoque > 0) {
      setAdicionadoAoCarrinho(true);
      // Importar dinamicamente o serviço de carrinho para evitar erros de SSR
      import('@/services/carrinho-service').then(({ useCarrinhoStore }) => {
        const { adicionarAoCarrinho } = useCarrinhoStore.getState();
        adicionarAoCarrinho(produto, quantidade);
      });
      setTimeout(() => {
        setAdicionadoAoCarrinho(false);
      }, 2000);
    }
  };
  
  // Comprar agora - adiciona ao carrinho e redireciona para o checkout
  const comprarAgora = () => {
    if (produto.estoque > 0) {
      // Importar dinamicamente o serviço de carrinho
      import('@/services/carrinho-service').then(({ useCarrinhoStore }) => {
        const { adicionarAoCarrinho } = useCarrinhoStore.getState();
        adicionarAoCarrinho(produto, quantidade);
        window.location.href = '/carrinho';
      });
    }
  };
  
  // Renderiza as estrelas de avaliação
  const renderizarEstrelas = () => {
    if (!produto.avaliacoes || produto.avaliacoes.length === 0) {
      return null;
    }
    
    // Calcular média das avaliações
    const total = produto.avaliacoes.reduce((sum, av) => sum + av.avaliacao, 0);
    const media = total / produto.avaliacoes.length;
    
    const estrelas = [];
    const estrelasCompletas = Math.floor(media);
    const temMeiaEstrela = media % 1 >= 0.5;
    
    // Adicionar estrelas completas
    for (let i = 0; i < estrelasCompletas; i++) {
      estrelas.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    }
    
    // Adicionar meia estrela se necessário
    if (temMeiaEstrela) {
      estrelas.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    }
    
    // Adicionar estrelas vazias
    const estrelasVazias = 5 - estrelasCompletas - (temMeiaEstrela ? 1 : 0);
    for (let i = 0; i < estrelasVazias; i++) {
      estrelas.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" />);
    }
    
    return (
      <div className="flex items-center">
        <div className="flex mr-1">{estrelas}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({media.toFixed(1)}) {produto.avaliacoes.length} avaliações
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-2 md:px-0 pt-4 md:pt-0">
      {/* Título e badges */}
      <div>
        {produto.precoPromocional && (
          <Badge className="bg-[#ff0080]/10 hover:bg-[#ff0080]/10 text-[#ff0080] dark:bg-[#ff0080]/20 dark:text-[#ff0080] mb-2">
            {calcularDescontoPercentual()}% OFF
          </Badge>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold">{produto.titulo}</h1>
        
        {/* SKU e avaliações */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 space-y-3 sm:space-y-0">
          {produto.sku && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Package className="w-4 h-4 mr-1" /> SKU: {produto.sku}
            </p>
          )}
          {renderizarEstrelas()}
        </div>
      </div>
      
      {/* Preços */}
      <div className="flex items-baseline gap-3">
        {produto.precoPromocional ? (
          <>
            <p className="text-3xl font-bold text-[#ff0080] dark:text-[#ff0080]">
              {formatarPreco(produto.precoPromocional)}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 line-through">
              {formatarPreco(produto.preco)}
            </p>
          </>
        ) : (
          <p className="text-3xl font-bold">
            {formatarPreco(produto.preco)}
          </p>
        )}
      </div>
      
      {/* Descrição curta */}
      {produto.descricao && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {produto.descricao}
        </p>
      )}
      
      {/* Status de estoque */}
      <p className={cn("flex items-center text-sm font-medium", disponibilidade.cor)}>
        <span className={cn(
          "inline-block w-3 h-3 mr-2 rounded-full", 
          produto.estoque > 0 ? "bg-green-500" : "bg-red-500"
        )}></span>
        {disponibilidade.status}
        {produto.estoque > 0 && ` (${produto.estoque} unidades)`}
      </p>
      
      {/* Seletor de quantidade e botões de ação */}
      <div className="space-y-4">
        {/* Seletor de quantidade e botões de ação */}
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">Quantidade</span>
            <div className="flex items-center bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-full h-12 overflow-hidden">
              <button 
                onClick={decrementarQuantidade}
                disabled={quantidade <= 1}
                className="flex-none w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-12 flex items-center justify-center font-medium">
                {quantidade}
              </div>
              <button 
                onClick={incrementarQuantidade}
                disabled={quantidade >= produto.estoque}
                className="flex-none w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <TooltipProvider>
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full w-12 h-12 border-2 transition-all",
                      favorito ? "border-[#ff0080] text-[#ff0080] bg-[#ff0080]/10 dark:bg-[#ff0080]/20" : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => setFavorito(prev => !prev)}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        favorito ? "fill-[#ff0080] text-[#ff0080] scale-110" : "scale-100"
                      )}
                    />
                    <span className="sr-only">Favoritar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-12 h-12 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Compartilhar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartilhar produto</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={adicionarAoCarrinho}
            disabled={produto.estoque === 0}
            className="bg-[#ff0080] hover:bg-[#ff0080]/90 text-white relative overflow-hidden h-14 rounded-full shadow-lg shadow-[#ff0080]/20 disabled:opacity-70 disabled:shadow-none"
          >
            <AnimatePresence mode="wait">
              {adicionadoAoCarrinho ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-center text-base"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Adicionado!
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center justify-center text-sm md:text-base whitespace-nowrap px-2"
                >
                  <ShoppingCart className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />
                  <span className="hidden sm:inline">Adicionar ao</span>
                  <span>Carrinho</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          
          <Button 
            className="bg-[#27b99a] hover:bg-[#27b99a]/90 text-white h-14 rounded-full shadow-lg shadow-[#27b99a]/20 relative overflow-hidden group"
            onClick={comprarAgora}
            disabled={produto.estoque === 0}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center text-sm md:text-base group-hover:scale-105 transition-transform whitespace-nowrap px-2">
                <Zap className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />
                <span className="hidden sm:inline">Comprar</span>
                <span>Agora</span>
              </span>
            </span>
          </Button>
        </div>
      </div>
      </div>
      
      {/* Informações adicionais */}
      <div className="border-t pt-5 border-gray-200 dark:border-gray-700 space-y-3">
        {/* Categorias */}
        {produto.categorias && produto.categorias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Categorias:</span>
            {produto.categorias.map((cat, index) => (
              <Badge 
                key={cat.categoria.id}
                variant="secondary"
                className="rounded-full"
              >
                {cat.categoria.titulo}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Dimensões/peso */}
        {(produto.peso || produto.altura || produto.largura || produto.comprimento) && (
          <div className="mt-4 p-5 bg-gradient-to-r from-[#27b99a]/5 to-[#27b99a]/10 dark:from-[#27b99a]/10 dark:to-[#27b99a]/20 rounded-2xl border border-[#27b99a]/20 dark:border-[#27b99a]/30 shadow-sm">
            <h4 className="text-base font-medium mb-3 text-gray-800 dark:text-gray-200">Especificações do Produto</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {produto.peso && (
                <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-[#27b99a]/30 dark:hover:border-[#27b99a]/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#27b99a]/5 to-[#27b99a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-[#27b99a] dark:text-[#27b99a]/90 mb-1 text-sm font-semibold">Peso</span>
                  <span className="text-lg font-semibold">{produto.peso} kg</span>
                </div>
              )}
              {produto.altura && (
                <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-[#27b99a]/30 dark:hover:border-[#27b99a]/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#27b99a]/5 to-[#27b99a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-[#27b99a] dark:text-[#27b99a]/90 mb-1 text-sm font-semibold">Altura</span>
                  <span className="text-lg font-semibold">{produto.altura} cm</span>
                </div>
              )}
              {produto.largura && (
                <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-[#27b99a]/30 dark:hover:border-[#27b99a]/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#27b99a]/5 to-[#27b99a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-[#27b99a] dark:text-[#27b99a]/90 mb-1 text-sm font-semibold">Largura</span>
                  <span className="text-lg font-semibold">{produto.largura} cm</span>
                </div>
              )}
              {produto.comprimento && (
                <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-[#27b99a]/30 dark:hover:border-[#27b99a]/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#27b99a]/5 to-[#27b99a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-[#27b99a] dark:text-[#27b99a]/90 mb-1 text-sm font-semibold">Comprimento</span>
                  <span className="text-lg font-semibold">{produto.comprimento} cm</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
