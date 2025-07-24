'use client';

import { ShoppingCart } from "lucide-react";
import { useCarrinhoStore } from '@/services/carrinho-service';

export function CarrinhoTitulo() {
  const { quantidade } = useCarrinhoStore();
  
  return (
    <div className="flex items-center space-x-4">
      <div className="h-14 w-14 rounded-full bg-[#27b99a] hover:bg-[#27b99a]/90 flex items-center justify-center text-white shadow-md">
        <ShoppingCart size={24} />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight pt-3 md:pt-0">Seu Carrinho</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {quantidade} {quantidade === 1 ? 'item' : 'itens'} em seu carrinho
        </p>
      </div>
    </div>
  );
}
