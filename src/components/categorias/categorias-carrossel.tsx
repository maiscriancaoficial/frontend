"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Ícones SVG personalizados para categorias - Melhorados e mais temáticos
const IconesCategorias = {
  floresNaturais: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M12 3c-.9 2.3-2 3.7-3 5 1-1 3.5-1 5-1-1 3-4 5-4 5v10" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 6c0 3 4 6 4 6s4-3 4-6c0-2-1-3-2-3.5.5 1 .8 2 0 3-1-1-2.5-1-3-3-1.5.5-3 1-3 3.5z" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  arranjos: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M12 22v-4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 3c0 3 3 4 3 4s3-1 3-4-3-2-3-2-3-1-3 2z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 8c0 3 5 5 5 5s5-2 5-5c0-2-2-3-5-3s-5 1-5 3z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 14c0 2 4 4 4 4s4-2 4-4c0-3-3-5-4-5-1 0-4 2-4 5z" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  plantasInterna: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M12 22v-4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 10c-3 0-5-2-5-5s4-4 4 0 3 4 3 0c0-4 4-5 4-1s-3 6-6 6z" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="9" y="17" width="6" height="4" rx="1" strokeWidth="1.5" />
      <path d="M12 13v4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  suculentas: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M12 22v-2" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 20c-3 0-6-1-6-5 0-3 3-4 3-4s-1-3 0-5c1-1 3-1 3 1 0-2 2-2 3-1 1 2 0 5 0 5s3 1 3 4c0 4-3 5-6 5z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 13c-1-1-2-1-2-3s2-2 2 0c0-2 2-2 2 0s-1 2-2 3z" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  cestas: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M3 10h18l-2 10H5l-2-10z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 10V7c0-3 2-5 5-5s5 2 5 5v3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12a2 3 0 004 0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  vasosDecorativos: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M7 3h10l1 3H6l1-3z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 6l1 14H6l1-14" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 10a4 4 0 004 0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 14a4 4 0 004 0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  florPerpetuada: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 9c0-3 3-6 0-6-3 0 0 3 0 6z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 12c3 0 6 3 6 0s-3 0-6 0z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15c0 3-3 6 0 6 3 0 0-3 0-6z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 12c-3 0-6-3-6 0s3 0 6 0z" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  eventosEspeciais: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M8 21h8m-4-4v4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 6h4m-2-2v4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 17c-3 0-7-2-7-6 0-3 1-5 3-7h8c2 2 3 4 3 7 0 4-4 6-7 6z" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 11c0 2 3 3 3 0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  bonsai: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M12 22v-2" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8" y="18" width="8" height="2" rx="1" strokeWidth="1.5" />
      <path d="M12 16c-2 0-5-1-5-7 0-3 1-5 3-7 1 1 2 3 2 6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 16c2 0 5-1 5-7 0-3-1-5-3-7-1 1-2 3-2 6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 10c1-1 2-1 2-3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12c-1-1-2-1-3-2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  acessorios: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path d="M5 4v10c0 4 3 7 7 7s7-3 7-7V4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 4c0-1 3-2 7-2s7 1 7 2" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 8v6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 8v6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 12h8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export interface CategoriaItem {
  id: string;
  titulo: string;
  slug: string;
  icone: keyof typeof IconesCategorias;
  cor: string;
}

export interface CategoriasCarrosselProps {
  titulo?: string;
  subtitulo?: string;
  badgeTexto?: string;
  categorias: CategoriaItem[];
}

export default function CategoriasCarrossel({
  titulo = "Categorias de Livros",
  subtitulo = "Explore nossa seleção exclusiva de livros infantis personalizados",
  badgeTexto = "Livros Infantis",
  categorias = [
    {
      id: '1',
      titulo: 'Aventura',
      slug: 'aventura',
      icone: 'plantasInterna',
      cor: '#27b99a'
    },
    {
      id: '2',
      titulo: 'Educativo',
      slug: 'educativo',
      icone: 'vasosDecorativos',
      cor: '#ff0080'
    },
    {
      id: '3',
      titulo: 'Fantasia',
      slug: 'fantasia',
      icone: 'floresNaturais',
      cor: '#27b99a'
    },
    {
      id: '4',
      titulo: 'Super-Heróis',
      slug: 'super-herois',
      icone: 'bonsai',
      cor: '#ff0080'
    },
    {
      id: '5',
      titulo: 'Contos Clássicos',
      slug: 'contos-classicos',
      icone: 'arranjos',
      cor: '#27b99a'
    },
    {
      id: '6',
      titulo: 'Animais',
      slug: 'animais',
      icone: 'florPerpetuada',
      cor: '#ff0080'
    },
    {
      id: '7',
      titulo: 'Valores e Emoções',
      slug: 'valores-e-emocoes',
      icone: 'suculentas',
      cor: '#27b99a'
    },
    {
      id: '8',
      titulo: 'Para Bebês',
      slug: 'para-bebes',
      icone: 'cestas',
      cor: '#ff0080'
    },
    {
      id: '9',
      titulo: 'Autoestima',
      slug: 'autoestima',
      icone: 'eventosEspeciais',
      cor: '#27b99a'
    },
    {
      id: '10',
      titulo: 'Alfabeto e Números',
      slug: 'alfabeto-e-numeros',
      icone: 'suculentas',
      cor: '#ff0080'
    },
    {
      id: '11',
      titulo: 'Mitologia',
      slug: 'mitologia',
      icone: 'floresNaturais',
      cor: '#27b99a'
    },
    {
      id: '12',
      titulo: 'Música e Sons',
      slug: 'musica-e-sons',
      icone: 'vasosDecorativos',
      cor: '#ff0080'
    },
    {
      id: '13',
      titulo: 'Ciências',
      slug: 'ciencias',
      icone: 'bonsai',
      cor: '#27b99a'
    },
    {
      id: '14',
      titulo: 'Jogos e Atividades',
      slug: 'jogos-e-atividades',
      icone: 'arranjos',
      cor: '#ff0080'
    }
  ]
}: CategoriasCarrosselProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (carrosselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carrosselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [categorias]);

  const scroll = (direction: 'left' | 'right') => {
    if (carrosselRef.current) {
      const scrollAmount = carrosselRef.current.clientWidth / 2;
      const newScrollLeft = direction === 'left'
        ? carrosselRef.current.scrollLeft - scrollAmount
        : carrosselRef.current.scrollLeft + scrollAmount;
      
      carrosselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Verificar os botões após a rolagem
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <Badge className="mb-3 bg-[#ff0080]/10 hover:bg-[#ff0080]/10 text-[#ff0080] dark:bg-[#ff0080]/20 dark:text-[#ff0080]">
            {badgeTexto}
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black dark:text-white">
            {titulo}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-4">
            {subtitulo}
          </p>
        </div>
        
        <div className="relative">
          {/* Botões de navegação */}
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-[#ff0080] -translate-x-2",
              !canScrollLeft && "opacity-0 pointer-events-none"
            )}
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="h-5 w-5 text-[#ff0080] dark:text-[#ff0080]/80" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-[#ff0080] translate-x-2",
              !canScrollRight && "opacity-0 pointer-events-none"
            )}
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="h-5 w-5 text-[#ff0080] dark:text-[#ff0080]/80" />
          </button>
          
          {/* Carrossel */}
          <div 
            ref={carrosselRef}
            className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory py-2 px-1"
            onScroll={checkScrollButtons}
          >
            {categorias.map((categoria) => (
              <motion.div
                key={categoria.id}
                className="shrink-0 snap-start mx-2 first:ml-0 last:mr-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, margin: "-20px" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/categoria/${categoria.slug}`}
                  className={cn(
                    "flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 p-4 rounded-[20px] transition-all", 
                    "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md",
                    "border border-gray-100 dark:border-gray-700",
                    "group"
                  )}
                >
                  <div 
                    className={cn(
                      "mb-3 p-3 rounded-full transition-colors", 
                      "bg-[#27b99a]/10 dark:bg-[#27b99a]/20 text-[#27b99a] dark:text-[#27b99a]",
                      "group-hover:bg-[#ff0080]/10 dark:group-hover:bg-[#ff0080]/20 group-hover:text-[#ff0080] dark:group-hover:text-[#ff0080]"
                    )}
                  >
                    {IconesCategorias[categoria.icone]}
                  </div>
                  <span className="text-center text-sm font-medium text-black dark:text-white line-clamp-1" title={categoria.titulo}>
                    {categoria.titulo}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Adicionar estilo para esconder a barra de rolagem mas manter a funcionalidade
// É necessário adicionar isso ao seu CSS global
const CssEsconderScrollbar = `
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
`;

// Você pode usar isso para mostrar como adicionar o CSS ao seu arquivo global
