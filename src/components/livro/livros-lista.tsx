"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LivroProps } from '@/services/livro-service';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface LivrosListaProps {
  livros: LivroProps[];
  emptyMessage?: string;
}

export function LivrosLista({ livros, emptyMessage = "Nenhum livro encontrado." }: LivrosListaProps) {
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});

  const toggleFavorito = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoritos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (livros.length === 0) {
    return (
      <div className="w-full py-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {livros.map((livro) => (
        <motion.div
          key={livro.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 rounded-2xl border-[#ff0080]/10 dark:border-[#ff0080]/5">
            <div className="relative h-60 overflow-hidden group rounded-t-2xl">
              {livro.capa ? (
                <Image 
                  src={livro.capa} 
                  alt={livro.nome}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-[#ff0080]/10 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20">
                    {/* Padrão de fundo rosa */}
                    <div className="w-full h-full bg-[#ff0080]/30" 
                         style={{
                           backgroundImage: 
                             `radial-gradient(circle, #ff0080 0.5px, transparent 0.5px), 
                              radial-gradient(circle, #ff0080 0.5px, transparent 0.5px)`,
                           backgroundSize: '20px 20px',
                           backgroundPosition: '0 0, 10px 10px'
                         }}>
                    </div>
                  </div>
                  <div className="relative z-10 text-center p-4">
                    <BookOpen className="h-10 w-10 text-[#ff0080] mx-auto mb-2" />
                    <p className="text-[#ff0080] font-bold">{livro.nome}</p>
                  </div>
                </div>
              )}
              {/* Botão de favorito */}
              <button 
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all border-0 z-10 hover:scale-110 shadow-md"
                onClick={(e) => toggleFavorito(livro.id, e)}
              >
                <Heart 
                  className={`h-4 w-4 ${favoritos[livro.id] ? 'fill-[#ff0080] text-[#ff0080]' : 'text-[#ff0080] hover:fill-[#ff0080]'}`} 
                />
              </button>

            </div>
            <CardContent className="pt-4 flex-grow">
              <div className="mb-2">
                {livro.categorias && livro.categorias.map((cat, idx) => (
                  <Badge key={idx} variant="secondary" className="mr-1 mb-1 rounded-full px-2 py-0 text-xs">
                    {cat.categoria.titulo}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold text-xl mb-1 line-clamp-1">{livro.nome}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{livro.descricao}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="w-full flex justify-center items-center">
                <div className="flex items-center text-xs font-medium text-[#27b99a] dark:text-[#27b99a] bg-[#27b99a]/10 dark:bg-[#27b99a]/20 px-3 py-2 rounded-full">
                  <BookOpen className="h-3 w-3 mr-1" />
                  <span>Livro Digital</span>
                </div>
              </div>
              <Link 
                href={`/categoria-livro/${livro.categorias && livro.categorias[0]?.categoria.slug || 'livros'}/livro/${livro.slug}`}
                className="w-full"
              >
                <Button 
                  className="w-full bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full transition-all hover:scale-105"
                >
                  Personalizar
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
