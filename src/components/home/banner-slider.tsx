'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Banner {
  id: string;
  titulo: string;
  descricao?: string;
  fotoDesktop: string;
  fotoMobile?: string;
  ordem: number;
  ativo: boolean;
  botao1Label?: string;
  botao1Link?: string;
  botao1Cor?: string;
  botao1CorFonte?: string;
  botao2Label?: string;
  botao2Link?: string;
  botao2Cor?: string;
  botao2CorFonte?: string;
}

export function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar banners ativos da API
  useEffect(() => {
    const carregarBanners = async () => {
      try {
        const response = await fetch('/api/banners/ativos');
        if (response.ok) {
          const data = await response.json();
          setBanners(data);
        }
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarBanners();
  }, []);

  // Auto-play do slider
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="relative rounded-3xl overflow-hidden mt-14 md:mt-8 mb-8 min-h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-4 w-96 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-12 w-32 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    // Fallback para quando não há banners - usar o banner padrão
    return (
      <div className="relative rounded-3xl overflow-hidden mt-14 md:mt-8 mb-8 min-h-[500px] flex items-center">
        <Image
          src="/bg-hero.png"
          alt="Livros infantis personalizados com seu filho como protagonista"
          fill
          className="object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
        
        <div className="relative z-20 max-w-xl p-8 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Histórias mágicas com seu filho como protagonista
          </h1>
          <p className="text-lg mb-6 text-gray-200">
            Livros infantis personalizados que despertam a imaginação e criam memórias inesquecíveis para as crianças.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full transition-all hover:scale-105">
              Ver coleção <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20 rounded-full transition-all hover:scale-105">
              Como funciona
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative rounded-3xl overflow-hidden mt-14 md:mt-8 mb-8 min-h-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-full min-h-[500px] flex items-center"
        >
          {/* Imagem de fundo */}
          <Image
            src={currentBanner.fotoDesktop}
            alt={currentBanner.titulo}
            fill
            className="object-cover z-0 hidden md:block"
            priority={currentIndex === 0}
          />
          
          {/* Imagem mobile (se disponível) */}
          {currentBanner.fotoMobile && (
            <Image
              src={currentBanner.fotoMobile}
              alt={currentBanner.titulo}
              fill
              className="object-cover z-0 block md:hidden"
              priority={currentIndex === 0}
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
          
          {/* Conteúdo */}
          <div className="relative z-20 max-w-xl p-8 text-white">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              {currentBanner.titulo}
            </motion.h1>
            
            {currentBanner.descricao && (
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg mb-6 text-gray-200"
              >
                {currentBanner.descricao}
              </motion.p>
            )}
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {/* Botão 1 */}
              {currentBanner.botao1Label && currentBanner.botao1Link && (
                <Button 
                  size="lg" 
                  className="rounded-full transition-all hover:scale-105"
                  style={{
                    backgroundColor: currentBanner.botao1Cor || '#ff0080',
                    color: currentBanner.botao1CorFonte || 'white'
                  }}
                  asChild
                >
                  <Link href={currentBanner.botao1Link}>
                    {currentBanner.botao1Label} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              
              {/* Botão 2 */}
              {currentBanner.botao2Label && currentBanner.botao2Link && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full transition-all hover:scale-105 border-white hover:bg-white/20"
                  style={{
                    backgroundColor: currentBanner.botao2Cor || 'transparent',
                    color: currentBanner.botao2CorFonte || 'white',
                    borderColor: currentBanner.botao2CorFonte || 'white'
                  }}
                  asChild
                >
                  <Link href={currentBanner.botao2Link}>
                    {currentBanner.botao2Label}
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles do slider (apenas se houver mais de 1 banner) */}
      {banners.length > 1 && (
        <>
          {/* Botões de navegação */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
