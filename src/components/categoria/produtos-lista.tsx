'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProdutoCard } from '../produto/produto-card';
import { ProdutoProps } from '@/services/produto-service';
import { PackageOpen } from 'lucide-react';

interface ProdutosListaProps {
  produtos: ProdutoProps[];
  emptyMessage?: string;
}

export function ProdutosLista({ 
  produtos, 
  emptyMessage = "Nenhum produto encontrado." 
}: ProdutosListaProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (produtos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700"
      >
        <PackageOpen className="h-16 w-16 text-[#f29798]/60 dark:text-[#f29798]/40 mb-4" />
        <h3 className="text-lg font-medium text-black dark:text-white mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {produtos.map((produto) => (
        <motion.div key={produto.id} variants={itemVariants}>
          <ProdutoCard produto={produto} />
        </motion.div>
      ))}
    </motion.div>
  );
}
