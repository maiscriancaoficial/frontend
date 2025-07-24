"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ShoppingCart, Trash2, Check, ShoppingBag, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface ProdutoFavorito {
  id: string;
  titulo: string;
  preco: number;
  precoPromocional?: number | null;
  imagem: string;
  slug: string;
  disponivel: boolean;
}

interface FavoritosDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  produtos: ProdutoFavorito[];
  onRemoveFavorito?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export function FavoritosDrawer({
  isOpen,
  onClose,
  produtos = [],
  onRemoveFavorito,
  onAddToCart
}: FavoritosDrawerProps) {
  
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com blur effect */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 0.6, backdropFilter: 'blur(2px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer com animação suave */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 1.2 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col rounded-l-[2rem]"
          >
            {/* Cabeçalho com design refinado */}
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-[#ff0080] to-[#ff0080]/90 text-white rounded-bl-3xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-full shadow-inner">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Meus Favoritos
                    <Badge className="bg-white/30 hover:bg-white/40 text-white text-xs rounded-full px-2.5">
                      {produtos.length}
                    </Badge>
                  </h2>
                  <p className="text-sm opacity-90 mt-0.5">
                    {produtos.length > 0 ? `${produtos.length} ${produtos.length === 1 ? 'item' : 'itens'} salvos` : 'Nenhum favorito'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Conteúdo principal */}
            <div className="flex-grow overflow-y-auto p-4">
              {produtos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900 rounded-3xl shadow-inner mx-4 my-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-md mb-6">
                    <Heart className="w-16 h-16 text-[#f29798]/40 dark:text-[#f29798]/30" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Sua lista está vazia</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                    Adicione itens aos seus favoritos para encontrá-los facilmente depois.
                  </p>
                  <Button onClick={onClose} className="bg-[#f29798] hover:bg-[#f29798]/80 text-white">
                    Explorar produtos
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">Itens favoritos</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-sm text-gray-500 hover:text-pink-600"
                    >
                      Ver todos
                    </Button>
                  </div>
                  
                  {/* Lista de produtos */}
                  <div className="space-y-3">
                    {produtos.map((produto) => (
                      <motion.div 
                        key={produto.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="group flex gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {/* Imagem */}
                        <Link 
                          href={`/produto/${produto.slug}`}
                          className="block relative h-20 w-20 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          <Image
                            src={produto.imagem || '/placeholder-product.png'}
                            alt={produto.titulo}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          
                          {!produto.disponivel && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs rounded-full px-2.5">Indisponível</Badge>
                            </div>
                          )}
                        </Link>

                        {/* Informações */}
                        <div className="flex-grow flex flex-col">
                          <Link href={`/produto/${produto.slug}`} className="font-medium text-sm mb-1 hover:text-[#27b99a] dark:hover:text-[#27b99a] line-clamp-2">
                            {produto.titulo}
                          </Link>
                          
                          <div className="mt-auto">
                            {produto.precoPromocional ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#27b99a] dark:text-[#27b99a]">
                                  {formatarPreco(produto.precoPromocional)}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  {formatarPreco(produto.preco)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {formatarPreco(produto.preco)}
                              </span>
                            )}
                          </div>
                          
                          {/* Ações */}
                          <div className="flex gap-2 mt-2">
                            {produto.disponivel && (
                              <Button 
                                onClick={() => onAddToCart && onAddToCart(produto.id)}
                                variant="outline" 
                                size="sm"
                                className="h-8 text-xs flex-1 rounded-full border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 hover:border-[#27b99a]/50 dark:border-[#27b99a]/30 dark:text-[#27b99a] dark:hover:bg-[#27b99a]/20 shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Comprar
                              </Button>
                            )}
                            
                            <Button 
                              onClick={() => onRemoveFavorito && onRemoveFavorito(produto.id)}
                              variant="ghost" 
                              size="sm"
                              className="h-8 text-xs px-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 dark:hover:text-red-400 hover:shadow-sm transition-all duration-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Rodapé com ações */}
            {produtos.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                <Button className="bg-[#27b99a] hover:bg-[#27b99a]/90 text-white w-full py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Ver todos os favoritos
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
