"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, Eye } from 'lucide-react';
import { LivroProps } from '@/services/livro-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LivrosDestaqueProps {
  titulo?: string;
  subtitulo?: string;
  livros: LivroProps[];
  mostrarVerMais?: boolean;
  verMaisUrl?: string;
}

export function ProdutosDestaque({ 
  titulo = "Livros em Destaque", 
  subtitulo = "Conheça nossa coleção exclusiva de livros infantis personalizados", 
  livros, 
  mostrarVerMais = true, 
  verMaisUrl = "/categoria-livro/lancamentos" 
}: LivrosDestaqueProps) {
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [quickViewLivro, setQuickViewLivro] = useState<LivroProps | null>(null);

  const toggleFavorito = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoritos(prev => ({ ...prev, [id]: !prev[id] }));
  };
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
        {livros.map((livro, index) => (
          <motion.div key={livro.id} variants={itemVariants}>
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 rounded-2xl group p-0">
              <div className="relative h-60 overflow-hidden rounded-t-2xl">
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
                    <BookOpen className="h-10 w-10 text-[#ff0080]" />
                  </div>
                )}
                
                {/* Botões de ação */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all border-0 z-10 hover:scale-110 shadow-md"
                    onClick={(e) => toggleFavorito(livro.id, e)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${favoritos[livro.id] ? 'fill-[#ff0080] text-[#ff0080]' : 'text-[#ff0080] hover:fill-[#ff0080]'}`} 
                    />
                  </button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all border-0 z-10 hover:scale-110 shadow-md"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewLivro(livro);
                        }}
                      >
                        <Eye className="h-4 w-4 text-[#ff0080]" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{livro.nome}</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative h-80 rounded-xl overflow-hidden">
                          {livro.capa ? (
                            <Image 
                              src={livro.capa} 
                              alt={livro.nome}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#ff0080]/10 flex items-center justify-center">
                              <BookOpen className="h-16 w-16 text-[#ff0080]" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            {livro.categorias && livro.categorias.map((cat, idx) => (
                              <span key={idx} className="inline-block mr-1 mb-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                {cat.categoria.titulo}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{livro.descricao}</p>
                          <div className="flex items-center text-sm font-medium text-[#27b99a] dark:text-[#27b99a] bg-[#27b99a]/10 dark:bg-[#27b99a]/20 px-4 py-3 rounded-full w-fit">
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>Livro Digital</span>
                          </div>
                          <Link 
                            href={`/categoria-livro/${livro.categorias && livro.categorias[0]?.categoria.slug || 'lancamentos'}/livro/${livro.slug || `livro-lancamentos-${index + 1}`}`}
                            className="w-full block"
                          >
                            <Button className="w-full bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <CardContent className="pt-4 flex-grow">
                <div className="mb-2">
                  {livro.categorias && livro.categorias.map((cat, idx) => (
                    <span key={idx} className="inline-block mr-1 mb-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {cat.categoria.titulo}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-xl mb-1 line-clamp-1">{livro.nome}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{livro.descricao}</p>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-3 pb-4">
                <div className="w-full flex justify-center items-center">
                  <div className="flex items-center text-xs font-medium text-[#27b99a] dark:text-[#27b99a] bg-[#27b99a]/10 dark:bg-[#27b99a]/20 px-4 py-2 rounded-full">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>Livro Digital</span>
                  </div>
                </div>
                <Link 
                  href={`/categoria-livro/${livro.categorias && livro.categorias[0]?.categoria.slug || 'lancamentos'}/livro/${livro.slug || `livro-lancamentos-${index + 1}`}`}
                  className="w-full mb-2"
                >
                  <Button className="w-full bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full transition-all hover:scale-105">
                    Personalizar
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
