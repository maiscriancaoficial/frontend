"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  Eye, 
  BarChart2, 
  Check, 
  X, 
  Star, 
  ChevronRight,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ProdutoProps {
  id: string;
  titulo: string;
  slug: string;
  descricao?: string | null;
  descricaoLonga?: string | null;
  preco: number;
  precoPromocional?: number | null;
  fotoPrincipal?: string | null;
  galeria?: string[];
  emDestaque: boolean;
  estoque: number;
  categorias?: { categoria: { titulo: string; slug: string } }[];
  ativo?: boolean; // Adicionado campo ativo que estava faltando
}

interface ProdutoCardProps {
  produto: ProdutoProps;
  variant?: 'default' | 'horizontal' | 'compact';
}

export function ProdutoCard({ produto, variant = 'default' }: ProdutoCardProps) {
  const [favoritos, setFavoritos] = useState<{ [key: string]: boolean }>({});
  const [adicionandoCarrinho, setAdicionandoCarrinho] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  
  // Carregar favoritos do localStorage
  useEffect(() => {
    try {
      const favoritosStorage = JSON.parse(localStorage.getItem('favoritos') || '[]');
      const favoritosMap: { [key: string]: boolean } = {};
      
      // Verificar se é um array, se não for, converter ou limpar
      if (Array.isArray(favoritosStorage)) {
        favoritosStorage.forEach((fav: any) => {
          if (fav && fav.id) {
            favoritosMap[fav.id] = true;
          }
        });
      } else if (typeof favoritosStorage === 'object' && favoritosStorage !== null) {
        // Se for objeto antigo, converter para array e salvar
        const favoritosArray: any[] = [];
        Object.keys(favoritosStorage).forEach(id => {
          if (favoritosStorage[id]) {
            favoritosMap[id] = true;
            // Não temos dados completos do objeto antigo, então só salvamos o ID
          }
        });
        // Limpar localStorage antigo
        localStorage.setItem('favoritos', JSON.stringify(favoritosArray));
      }
      
      setFavoritos(favoritosMap);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      // Em caso de erro, limpar localStorage e usar estado vazio
      localStorage.setItem('favoritos', '[]');
      setFavoritos({});
    }
  }, []);
  
  // Formatar preço
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  // Calcular porcentagem de desconto
  const calcularDesconto = () => {
    if (produto.precoPromocional && produto.preco > produto.precoPromocional) {
      const desconto = ((produto.preco - produto.precoPromocional) / produto.preco) * 100;
      return Math.round(desconto);
    }
    return null;
  };
  
  const desconto = calcularDesconto();
  const temDesconto = desconto !== null;
  const estaEmEstoque = produto.estoque > 0;
  
  // Adicionar ao carrinho
  const handleAddToCart = async () => {
    if (adicionandoCarrinho) return;
    
    setAdicionandoCarrinho(true);
    
    try {
      // Adicionar ao localStorage do carrinho
      const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho') || '[]');
      const itemExistente = carrinhoAtual.find((item: any) => item.id === produto.id);
      
      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        carrinhoAtual.push({
          id: produto.id,
          titulo: produto.titulo,
          preco: produto.precoPromocional || produto.preco,
          fotoPrincipal: produto.fotoPrincipal,
          slug: produto.slug,
          quantidade: 1,
          categoria: produto.categorias?.[0]?.categoria || { titulo: 'Geral', slug: 'geral' }
        });
      }
      
      localStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
      
      // Disparar evento para atualizar drawer do carrinho
      window.dispatchEvent(new Event('carrinho-atualizado'));
      
      // Toast de sucesso
      const { toast } = await import('sonner');
      toast.success(`${produto.titulo} adicionado ao carrinho!`);
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao adicionar produto ao carrinho');
    } finally {
      setAdicionandoCarrinho(false);
    }
  };
  
  // Alternar favorito
  const handleToggleFavorito = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos') || '[]');
      const jaEhFavorito = favoritosAtuais.some((fav: any) => fav.id === produto.id);
      
      if (jaEhFavorito) {
        // Remover dos favoritos
        const novosFavoritos = favoritosAtuais.filter((fav: any) => fav.id !== produto.id);
        localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
        setFavoritos(prev => ({ ...prev, [produto.id]: false }));
        
        const { toast } = await import('sonner');
        toast.success(`${produto.titulo} removido dos favoritos`);
      } else {
        // Adicionar aos favoritos
        const novoFavorito = {
          id: produto.id,
          titulo: produto.titulo,
          preco: produto.precoPromocional || produto.preco,
          fotoPrincipal: produto.fotoPrincipal,
          slug: produto.slug,
          categoria: produto.categorias?.[0]?.categoria || { titulo: 'Geral', slug: 'geral' }
        };
        
        favoritosAtuais.push(novoFavorito);
        localStorage.setItem('favoritos', JSON.stringify(favoritosAtuais));
        setFavoritos(prev => ({ ...prev, [produto.id]: true }));
        
        const { toast } = await import('sonner');
        toast.success(`${produto.titulo} adicionado aos favoritos!`);
      }
      
      // Disparar evento para atualizar drawer dos favoritos
      window.dispatchEvent(new Event('favoritos-atualizado'));
      
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao alterar favorito');
    }
  };
  
  return (
    <>
      {/* Card do Produto */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "group relative flex flex-col rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300",
          "border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900",
          variant === 'horizontal' ? "md:flex-row" : "",
          variant === 'compact' ? "p-3" : "p-4"
        )}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {temDesconto && (
            <Badge className="bg-[#ff0080] hover:bg-[#ff0080]/90 rounded-full px-2 py-1 text-xs font-semibold text-white">
              -{desconto}%
            </Badge>
          )}
          
          {produto.emDestaque && (
            <Badge className="bg-amber-500 hover:bg-amber-600 rounded-full px-2 py-1 text-xs font-semibold">
              Destaque
            </Badge>
          )}
        </div>
        
        {/* Botões de ação */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm",
                    favoritos[produto.id] ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"
                  )}
                  onClick={handleToggleFavorito}
                >
                  <Heart className={cn("h-4 w-4", favoritos[produto.id] ? "fill-red-500" : "")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favoritar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualização rápida</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comparar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Imagem do produto */}
        <Link href={`/produto/${produto.slug}`} className="relative aspect-square w-full overflow-hidden rounded-3xl mb-4">
          <div className="relative w-full h-full">
            <Image
              src={produto.fotoPrincipal || '/produtos/produto-placeholder.jpg'}
              alt={produto.titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </Link>

        {/* Conteúdo do card */}
        <div className="flex flex-col flex-grow">
          {/* Categorias */}
          {produto.categorias && produto.categorias.length > 0 && (
            <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {typeof produto.categorias[0] === 'string' 
                ? produto.categorias[0] 
                : produto.categorias[0]?.categoria?.titulo || 'Categoria'}
            </div>
          )}
          
          {/* Título */}
          <Link href={`/produto/${produto.slug}`} className="group-hover:text-[#ff0080] dark:group-hover:text-[#ff0080]">
            <h3 className="font-medium text-base mb-2 transition-colors duration-200 truncate whitespace-nowrap overflow-hidden" title={produto.titulo}>
              {produto.titulo}
            </h3>
          </Link>
          
          {/* Avaliações */}
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={cn(
                    "h-4 w-4", 
                    star <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"
                  )} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
          
          {/* Preços */}
          <div className="mb-4 mt-auto">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-semibold", 
                temDesconto ? "text-lg text-[#ff0080] dark:text-[#ff0080]" : "text-xl text-[#27b99a] dark:text-[#27b99a]"
              )}>
                {formatarPreco(temDesconto ? produto.precoPromocional! : produto.preco)}
              </span>
              
              {temDesconto && (
                <span className="text-sm text-gray-500 line-through">
                  {formatarPreco(produto.preco)}
                </span>
              )}
            </div>
            
            {/* Status de estoque */}
            <div className="flex items-center mt-1 text-xs">
              {estaEmEstoque ? (
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <Check className="h-3 w-3 mr-1" /> Em estoque
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 flex items-center">
                  <X className="h-3 w-3 mr-1" /> Esgotado
                </span>
              )}
            </div>
          </div>
          
          {/* Botão de compra removido */}
        </div>
      </motion.div>

      {/* Modal de Visualização Rápida */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-4xl rounded-3xl overflow-hidden p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Coluna da esquerda - Imagem do produto */}
            <div className="relative bg-gray-100 dark:bg-gray-800 p-6 flex items-center justify-center">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <Image
                  src={produto.fotoPrincipal || '/produtos/produto-placeholder.jpg'}
                  alt={produto.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            {/* Coluna da direita - Informações do produto */}
            <div className="p-6 flex flex-col h-full bg-white dark:bg-gray-950">
              <DialogHeader className="mb-4">
                <div className="flex flex-col">
                  {produto.categorias && produto.categorias.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {typeof produto.categorias[0] === 'string' 
                        ? produto.categorias[0] 
                        : produto.categorias[0]?.categoria?.titulo || 'Categoria'}
                    </span>
                  )}
                  <DialogTitle className="text-2xl font-bold mb-2 text-gray-900 dark:text-white hover:text-[#ff0080] dark:hover:text-[#ff0080] transition-colors">{produto.titulo}</DialogTitle>
                  
                  <div className="bg-[#27b99a]/10 hover:bg-[#27b99a]/20 rounded-full p-2 transition-colors">
                    <Eye className="h-5 w-5" />
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={cn(
                            "h-4 w-4", 
                            star <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"
                          )} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(4.0)</span>
                  </div>
                </div>
              </DialogHeader>
              
              {/* Descrição do produto */}
              <DialogDescription className="mb-6 text-gray-600 dark:text-gray-400 text-sm">
                {produto.descricao || "Sem descrição disponível."}
              </DialogDescription>
              
              {/* Preços */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-semibold text-2xl", 
                    temDesconto ? "text-[#ff0080] dark:text-[#ff0080]" : "text-[#27b99a] dark:text-[#27b99a]"
                  )}>
                    {formatarPreco(temDesconto ? produto.precoPromocional! : produto.preco)}
                  </span>
                  
                  {temDesconto && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-gray-500 dark:text-gray-400 line-through text-sm mr-2">
                        {formatarPreco(produto.preco)}
                      </span>
                      <span className="text-[#ff0080] dark:text-[#ff0080] font-medium">
                        {formatarPreco(produto.precoPromocional!)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status de estoque e entrega */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center text-sm">
                  {estaEmEstoque ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Em estoque
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 flex items-center">
                      <X className="h-4 w-4 mr-1" /> Esgotado
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Truck className="h-4 w-4 mr-1" /> Entrega em até 3 dias úteis
                </div>
              </div>
              
              {/* Botões de ação */}
              <div className="flex flex-col gap-3 mt-auto">
                <Button
                  className="rounded-full bg-[#ff0080] hover:bg-[#ff0080]/90 text-white flex items-center justify-center transition-all"
                  disabled={!estaEmEstoque}
                  onClick={() => {
                    handleAddToCart();
                    setOpenModal(false);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao carrinho
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-0 right-0 rounded-full flex items-center justify-center text-[#ff0080] hover:text-[#ff0080] hover:bg-[#ff0080]/10 dark:text-[#ff0080] dark:hover:bg-[#ff0080]/20"
                    onClick={handleToggleFavorito}
                  >
                    <Heart className={cn("h-4 w-4 mr-2", favoritos[produto.id] ? "fill-red-500 text-red-500" : "")} />
                    {favoritos[produto.id] ? "Favoritado" : "Favoritar"}
                  </Button>
                  
                  <Link href={`/produto/${produto.slug}`}>
                    <Button 
                      variant="outline"
                      className="rounded-full flex items-center justify-center w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </Link>
                </div>
              </div>
              
              <DialogFooter className="mt-6 sm:justify-start">
                <Link href={`/produto/${produto.slug}`} className="text-[#ff0080] dark:text-[#ff0080] text-sm font-medium flex items-center hover:underline">
                  Ver detalhes completos <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
