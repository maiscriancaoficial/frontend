"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProdutoCard, ProdutoProps as ProdutoCardProps } from './produto-card';
import { ProdutoProps as ProdutoServiceProps } from '@/services/produto-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { motion } from 'framer-motion';

interface ProdutosDestaqueProps {
  titulo?: string;
  subtitulo?: string;
  produtos: ProdutoServiceProps[];
  mostrarVerMais?: boolean;
  verMaisUrl?: string;
}



export function ProdutosDestaque({ 
  titulo = "Livros em Destaque", 
  subtitulo = "Conheça nossa coleção exclusiva de livros infantis personalizados", 
  produtos, 
  mostrarVerMais = true, 
  verMaisUrl = "/produtos" 
}: ProdutosDestaqueProps) {
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

  return (
    <section className="py-16">
      <div className="mb-10">
        <Badge className="mb-3 bg-[#ff0080]/10 hover:bg-[#ff0080]/10 text-[#ff0080] dark:bg-[#ff0080]/20 dark:text-[#ff0080]">
          Histórias Favoritas
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black dark:text-white hover:text-[#ff0080] dark:hover:text-[#ff0080] transition-colors">
          {titulo}
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mb-4 md:mb-0">
            {subtitulo}
          </p>
          
          {mostrarVerMais && (
            <Button variant="outline" className="border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 dark:border-[#ff0080]/30 dark:text-[#ff0080] dark:hover:bg-[#ff0080]/20 whitespace-nowrap rounded-full transition-all hover:scale-105">
              <Link href={verMaisUrl} className="flex items-center">
                Ver todos os livros <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {produtos.map((produto, index) => (
          <motion.div key={produto.id} variants={itemVariants}>
            <ProdutoCard 
              produto={{
                ...produto,
                // Garantir compatibilidade de tipo com ProdutoCard
                categorias: Array.isArray(produto.categorias) && typeof produto.categorias[0] === 'string' 
                  ? [] // Se for array de strings, passa array vazio de objetos
                  : produto.categorias as { categoria: { titulo: string; slug: string } }[] | undefined
              }} 
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
