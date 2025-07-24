"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProdutoDetalhado } from '@/services/produto-service-single';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';

interface ProdutosRelacionadosProps {
  produtos: Pick<ProdutoDetalhado, 'id' | 'titulo' | 'slug' | 'preco' | 'precoPromocional' | 'fotoPrincipal' | 'estoque'>[];
  titulo?: string;
}

export function ProdutosRelacionados({ 
  produtos, 
  titulo = "Produtos Relacionados" 
}: ProdutosRelacionadosProps) {
  // Formatar preço para exibição
  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Calcular desconto percentual
  const calcularDescontoPercentual = (precoOriginal: number, precoPromocional: number) => {
    const desconto = ((precoOriginal - precoPromocional) / precoOriginal) * 100;
    return Math.round(desconto);
  };
  
  if (!produtos || produtos.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">{titulo}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {produtos.map((produto) => (
          <motion.div 
            key={produto.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
          >
            {produto.precoPromocional && (
              <Badge className="absolute top-3 left-3 z-10 bg-[#f29798] hover:bg-[#f29798]/90">
                {calcularDescontoPercentual(produto.preco, produto.precoPromocional)}% OFF
              </Badge>
            )}
            
            <Link href={`/produto/${produto.slug}`}>
              <div className="relative aspect-square overflow-hidden">
                <Image 
                  src={produto.fotoPrincipal || '/produtos/produto-placeholder.jpg'}
                  alt={produto.titulo}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
            
            <div className="p-4">
              <Link href={`/produto/${produto.slug}`} className="block">
                <h3 className="font-medium line-clamp-2 group-hover:text-[#f29798] transition-colors">
                  {produto.titulo}
                </h3>
              </Link>
              
              <div className="mt-2 flex items-baseline gap-2">
                {produto.precoPromocional ? (
                  <>
                    <span className="text-lg font-bold text-[#f29798] dark:text-[#f29798]">
                      {formatarPreco(produto.precoPromocional)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatarPreco(produto.preco)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold">
                    {formatarPreco(produto.preco)}
                  </span>
                )}
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <span className={`text-xs font-medium ${
                  produto.estoque > 0 
                    ? "text-green-600 dark:text-green-500" 
                    : "text-red-600 dark:text-red-500"
                }`}>
                  {produto.estoque > 0 ? "Em estoque" : "Fora de estoque"}
                </span>
                
                <div className="flex items-center space-x-1">
                  <button 
                    className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Adicionar aos favoritos"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  
                  <button 
                    className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Visualizar produto"
                  >
                    <Link href={`/produto/${produto.slug}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </button>
                  
                  <button 
                    className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Adicionar ao carrinho"
                    disabled={produto.estoque <= 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
