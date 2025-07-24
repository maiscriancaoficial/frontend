"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { LivroProps } from "@/services/livro-service";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Heart } from "lucide-react";

interface LivrosDestaqueProps {
  titulo?: string;
  subtitulo?: string;
  livros: LivroProps[];
  mostrarVerMais?: boolean;
  verMaisUrl?: string;
}

export function LivrosDestaque({ 
  titulo = "Livros Digitais em Destaque", 
  subtitulo = "Nossa seleção exclusiva de livros digitais interativos para crianças", 
  livros, 
  mostrarVerMais = true, 
  verMaisUrl = "/livros" 
}: LivrosDestaqueProps) {
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
    <section className="py-12 bg-gray-50 dark:bg-gray-900/30 rounded-3xl my-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="space-y-2">
            <Badge variant="outline" className="border-[#ff0080] text-[#ff0080] mb-2">
              Livros Digitais
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{titulo}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">{subtitulo}</p>
          </div>
          
          {mostrarVerMais && (
            <Link href={verMaisUrl} className="group mt-4 md:mt-0 flex items-center text-[#ff0080] font-medium hover:text-[#ff0080]/80 transition-colors">
              Ver todos os livros
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
        >
          {livros.map((livro, index) => (
            <motion.div key={livro.id} variants={itemVariants} className="h-full">
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Aqui vai a lógica para adicionar aos favoritos
                    }}
                  >
                    <Heart className="h-4 w-4 text-[#ff0080] hover:fill-[#ff0080]" />
                  </button>
                  
                  {livro.precoPromocional && (
                    <Badge className="absolute top-3 left-3 bg-[#ff0080] hover:bg-[#ff0080]/90 rounded-full px-3 py-1 text-xs">
                      Oferta
                    </Badge>
                  )}
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
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-end gap-1">
                      {livro.precoPromocional ? (
                        <>
                          <span className="text-lg font-bold text-[#ff0080]">
                            {formatCurrency(livro.precoPromocional)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatCurrency(livro.preco)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(livro.preco)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs font-medium text-[#27b99a] dark:text-[#27b99a] bg-[#27b99a]/10 dark:bg-[#27b99a]/20 px-2 py-1 rounded-full">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>Digital</span>
                    </div>
                  </div>
                  <Link 
                    href={`/categoria/${livro.categorias && livro.categorias[0]?.categoria.slug || 'livros'}/livro/${livro.slug}`}
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
        </motion.div>
      </div>
    </section>
  );
}
