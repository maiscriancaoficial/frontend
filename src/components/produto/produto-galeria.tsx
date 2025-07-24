"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

interface ProdutoGaleriaProps {
  fotoPrincipal: string;
  galeria: string[];
  titulo: string;
}

export function ProdutoGaleria({ fotoPrincipal, galeria, titulo }: ProdutoGaleriaProps) {
  const [fotoSelecionada, setFotoSelecionada] = useState<string>(fotoPrincipal);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [indiceModal, setIndiceModal] = useState<number>(0);

  // Garante que todas as imagens estão disponíveis em um único array
  const todasFotos = galeria.includes(fotoPrincipal) 
    ? galeria 
    : [fotoPrincipal, ...galeria];

  // Abre o modal com a foto selecionada
  const abrirModal = (foto: string) => {
    const indice = todasFotos.indexOf(foto);
    setIndiceModal(indice >= 0 ? indice : 0);
    setModalAberto(true);
  };

  // Navega para a próxima foto no modal
  const proximaFoto = () => {
    setIndiceModal((prev) => (prev + 1) % todasFotos.length);
  };

  // Navega para a foto anterior no modal
  const fotoAnterior = () => {
    setIndiceModal((prev) => (prev - 1 + todasFotos.length) % todasFotos.length);
  };

  return (
    <div className="w-full">
      {/* Foto principal */}
      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-gray-100 dark:bg-gray-900">
        <div className="absolute inset-0">
          <Image 
            src={fotoSelecionada} 
            alt={titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover hover:scale-105 transition-transform duration-300"
            onClick={() => abrirModal(fotoSelecionada)}
          />
        </div>
        
        <Button 
          size="icon"
          variant="ghost" 
          className="absolute top-2 right-2 bg-white/70 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
          onClick={() => abrirModal(fotoSelecionada)}
        >
          <ZoomIn className="h-5 w-5" />
          <span className="sr-only">Ampliar imagem</span>
        </Button>
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-5 gap-2">
        {todasFotos.map((foto, index) => (
          <button
            key={index}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg border-2",
              fotoSelecionada === foto 
                ? "border-pink-500 ring-2 ring-pink-500/20" 
                : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => setFotoSelecionada(foto)}
          >
            <Image 
              src={foto}
              alt={`${titulo} - imagem ${index + 1}`}
              fill
              sizes="(max-width: 768px) 20vw, 10vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Modal de visualização ampliada */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative w-full max-h-[80vh] aspect-square bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={indiceModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <Image 
                  src={todasFotos[indiceModal]}
                  alt={`${titulo} - visualização ampliada`}
                  fill
                  priority
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* Botões de navegação */}
            <Button 
              size="icon"
              variant="ghost" 
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
              onClick={fotoAnterior}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Foto anterior</span>
            </Button>

            <Button 
              size="icon"
              variant="ghost" 
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
              onClick={proximaFoto}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Próxima foto</span>
            </Button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {indiceModal + 1} / {todasFotos.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
