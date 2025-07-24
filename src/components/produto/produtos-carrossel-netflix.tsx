"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProdutoCard } from './produto-card';
import type { ProdutoProps } from './produto-card';

interface ProdutosCarrosselNetflixProps {
  titulo?: string;
  subtitulo?: string;
  badgeTexto?: string;
  produtos: ProdutoProps[];
}

export function ProdutosCarrosselNetflix({
  titulo = "Livros Personalizados",
  subtitulo = "Nossas histórias exclusivas para despertar a imaginação do seu pequeno",
  badgeTexto = "Histórias Especiais",
  produtos
}: ProdutosCarrosselNetflixProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Verificar tamanho da tela para ajustes responsivos
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Verificar botões de navegação
  const checkScrollButtons = () => {
    if (carrosselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carrosselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [produtos]);

  // Função de scroll do carrossel
  const scroll = (direction: 'left' | 'right') => {
    if (carrosselRef.current) {
      const cardWidth = carrosselRef.current.querySelector('.produto-card')?.clientWidth || 280;
      const scrollAmount = cardWidth * (isMobile ? 1 : 2); // Scroll de 2 cards por vez em desktop
      
      const newScrollLeft = direction === 'left'
        ? carrosselRef.current.scrollLeft - scrollAmount
        : carrosselRef.current.scrollLeft + scrollAmount;
      
      carrosselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Verificar botões após a rolagem
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Container animation
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // Item animation
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 overflow-x-hidden">
      <div className="container mx-auto px-4 mb-6">
        <Badge className="mb-3 bg-[#27b99a]/10 hover:bg-[#27b99a]/10 text-[#27b99a] dark:bg-[#27b99a]/20 dark:text-[#27b99a]">
          {badgeTexto}
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black dark:text-white hover:text-[#ff0080] dark:hover:text-[#ff0080] transition-colors">
          {titulo}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          {subtitulo}
        </p>
      </div>
      
      <div className="relative">
        {/* Botão de navegação esquerda */}
        <button 
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={cn(
            "absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 md:p-3 bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-[#ff0080]",
            !canScrollLeft && "opacity-0 pointer-events-none"
          )}
          aria-label="Navegar para a esquerda"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-[#ff0080] dark:text-[#ff0080]/80" />
        </button>
        
        {/* Botão de navegação direita */}
        <button 
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={cn(
            "absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 md:p-3 bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-[#ff0080]",
            !canScrollRight && "opacity-0 pointer-events-none"
          )}
          aria-label="Navegar para a direita"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-[#ff0080] dark:text-[#ff0080]/80" />
        </button>
        
        {/* Container do carrossel - estende além do container para efeito Netflix */}
        <div className="mx-auto max-w-[100vw] overflow-hidden">
          <motion.div
            ref={carrosselRef}
            className="flex px-4 md:px-8 gap-4 md:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-6"
            onScroll={checkScrollButtons}
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-20%" }}
          >
            {/* Espaço inicial para dar efeito de expansão */}
            <div className="shrink-0 w-[5vw] md:w-[10vw] xl:hidden"></div>
            
            {produtos.map((produto, index) => (
              <motion.div
                key={produto.id}
                className="produto-card shrink-0 snap-start"
                variants={itemAnimation}
                style={{
                  width: isMobile ? "85%" : "300px"
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={cn(
                  "transition-all duration-300 relative",
                  hoveredIndex === index && "scale-105 z-10 shadow-xl"
                )}>
                  <ProdutoCard 
                    produto={produto} 
                    variant={hoveredIndex === index ? 'default' : 'compact'}
                  />
                </div>
              </motion.div>
            ))}
            
            {/* Espaço final para dar efeito de expansão */}
            <div className="shrink-0 w-[5vw] md:w-[10vw] xl:hidden"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
