'use client';

import { useCarrinhoStore, ItemCarrinho } from '@/services/carrinho-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingCart, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function CarrinhoItens() {
  const { itens, quantidade, removerDoCarrinho, atualizarQuantidade } = useCarrinhoStore();

  if (itens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 bg-[#27b99a]/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-4 bg-[#27b99a]/10 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart size={56} className="text-[#27b99a]" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Seu carrinho está vazio</h3>
        <p className="text-center text-gray-500 dark:text-gray-400 max-w-md">
          Parece que você ainda não adicionou nenhum item ao seu carrinho.
          Explore nossa coleção de flores e presentes para encontrar algo especial.
        </p>
        <Button asChild className="bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full shadow-md shadow-[#ff0080]/20">
          <Link href="/">
            Continuar Comprando
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-3xl">
      <div className="bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] p-6 border-b border-white/20 text-white shadow-sm rounded-t-3xl">
        <motion.div 
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-white/20 shadow-inner border border-white/30">
              <AvatarImage src="" />
              <AvatarFallback className="text-white">
                <ShoppingCart className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-lg">Itens do Carrinho</h3>
              <p className="text-sm text-white/80">Seus produtos selecionados</p>
            </div>
          </div>
          
          <Badge className="bg-white/30 hover:bg-white/40 text-white text-xs font-medium px-3 py-1">
            {quantidade} {quantidade === 1 ? 'item' : 'itens'}
          </Badge>
        </motion.div>
      </div>
      
      <ScrollArea className="max-h-[500px] overflow-auto">
        <AnimatePresence>
          {itens.map((item) => (
            <motion.div
              key={item.produto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="flex p-4 gap-4">
                {/* Imagem do produto */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-50">
                  <Image 
                    src={item.produto.fotoPrincipal || '/produtos/produto-placeholder.jpg'}
                    alt={item.produto.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Informações do produto */}
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-2">{item.produto.titulo}</h4>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span>SKU: {item.produto.sku || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex overflow-hidden shadow-sm">
                      <button
                        onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#27b99a]/10 text-gray-600 dark:text-gray-400 hover:text-[#27b99a] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center flex items-center justify-center font-medium">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#27b99a]/10 text-gray-600 dark:text-gray-400 hover:text-[#27b99a] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="font-semibold">
                        R$ {item.precoTotal.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => {
                          removerDoCarrinho(item.produto.id);
                          toast.success("Item removido do carrinho!");
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild className="text-[#27b99a] rounded-full border-[#27b99a]/20 hover:bg-[#27b99a]/10 hover:border-[#27b99a]/30">
            <Link href="/">
              <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
              Continuar Comprando
            </Link>
          </Button>
          <div className="text-sm text-gray-500">
            {quantidade} {quantidade === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </div>
    </Card>
  );
}
