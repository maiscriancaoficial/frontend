"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CTARedondoProps {
  titulo: string;
  descricao: string;
  botaoTexto: string;
  botaoUrl: string;
  className?: string;
  varianteCor?: 'rosa' | 'verde' | 'azul';
}

export function CTARedondo({
  titulo,
  descricao,
  botaoTexto,
  botaoUrl,
  className,
  varianteCor = 'rosa'
}: CTARedondoProps) {
  // Mapeamento de variantes de cores
  const variantesCores = {
    rosa: {
      bg: 'bg-gradient-to-br from-[#ff0080] via-[#ff0060] to-[#d6006d]',
      borda: 'border-white/20',
      botao: 'bg-white hover:bg-white/90 text-[#ff0080]',
      titulo: 'text-white',
    },
    verde: {
      bg: 'bg-[#27b99a]/10 dark:bg-[#27b99a]/20',
      borda: 'border-[#27b99a]/20 dark:border-[#27b99a]/30',
      botao: 'bg-[#27b99a] hover:bg-[#27b99a]/90 text-white',
      titulo: 'text-[#27b99a] dark:text-[#27b99a]',
    },
    azul: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30',
      borda: 'border-blue-200 dark:border-blue-800',
      botao: 'bg-blue-500 hover:bg-blue-600 text-white',
      titulo: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500',
    }
  };
  
  const cores = variantesCores[varianteCor];
  
  return (
    <section className="py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={cn(
          "rounded-[30px] border p-12 md:p-20 shadow-lg relative overflow-hidden",
          cores.bg,
          cores.borda,
          className
        )}
      >
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[15%] w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-[20%] right-[15%] w-60 h-60 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute top-[40%] right-[25%] w-20 h-20 rounded-full bg-white/20"></div>
          <div className="absolute bottom-[35%] left-[20%] w-16 h-16 rounded-full bg-white/20"></div>
        </div>
        
        {/* Padrão geométrico moderno */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Formas geométricas abstratas */}
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          
          {/* Linhas curvas */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,30 Q50,0 100,30 V100 H0 Z" fill="rgba(255,255,255,0.03)" />
            <path d="M0,50 Q50,20 100,50 V100 H0 Z" fill="rgba(255,255,255,0.04)" />
            <path d="M0,70 Q50,40 100,70 V100 H0 Z" fill="rgba(255,255,255,0.05)" />
          </svg>
          
          {/* Pontos decorativos */}
          <div className="absolute top-[25%] left-[10%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[30%] left-[15%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[28%] left-[20%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[75%] right-[10%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[80%] right-[15%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[78%] right-[20%] w-1 h-1 bg-white/60 rounded-full"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={cn("text-3xl md:text-5xl font-bold mb-6", cores.titulo)}>
            {titulo}
          </h2>
          
          <p className="text-white/80 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
            {descricao}
          </p>
          
          <Link 
            href={botaoUrl}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-10 py-4 font-medium transition-all shadow-md hover:shadow-lg text-base hover:scale-105",
              cores.botao
            )}
          >
            {botaoTexto}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
