"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, Eye, Zap, ShoppingCart, Sparkles, User } from 'lucide-react';
import { LivroProps } from '@/services/livro-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [modalCriacaoAberto, setModalCriacaoAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState<any>(null);
  const [nomePersonagem, setNomePersonagem] = useState("");
  const [generoSelecionado, setGeneroSelecionado] = useState<"menino" | "menina" | null>(null);
  const router = useRouter();

  const toggleFavorito = async (livro: LivroProps, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const isFavorito = favoritos[livro.id];
      
      if (isFavorito) {
        // Remover dos favoritos
        const response = await fetch('/api/favoritos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ livroId: livro.id })
        });
        
        if (response.ok) {
          setFavoritos(prev => ({ ...prev, [livro.id]: false }));
          toast.success('Removido dos favoritos');
        }
      } else {
        // Adicionar aos favoritos
        const response = await fetch('/api/favoritos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ livroId: livro.id })
        });
        
        if (response.ok) {
          setFavoritos(prev => ({ ...prev, [livro.id]: true }));
          toast.success('Adicionado aos favoritos!');
        }
      }
    } catch (error) {
      console.error('Erro ao gerenciar favorito:', error);
      toast.error('Erro ao atualizar favoritos');
    }
  };
  
  const adicionarCarrinho = (livro: LivroProps, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
      const itemExistente = carrinho.find((item: any) => item.livroId === livro.id);
      
      if (itemExistente) {
        toast.info('Este livro já está no carrinho');
        return;
      }
      
      const novoItem = {
        id: `${livro.id}-${Date.now()}`,
        livroId: livro.id,
        livroNome: livro.nome,
        livroPreco: livro.preco,
        livroPrecoPromocional: livro.precoPromocional,
        livroCapa: livro.capa || '',
        nomePersonagem: 'Criança',
        quantidade: 1,
        tipo: 'livro',
        adicionadoEm: new Date().toISOString()
      };
      
      const novoCarrinho = [...carrinho, novoItem];
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      
      toast.success('Livro adicionado ao carrinho!');
      
      // Disparar evento para atualizar contador do carrinho
      window.dispatchEvent(new Event('carrinhoAtualizado'));
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar ao carrinho');
    }
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
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <Badge className="mb-3 bg-[#ff0080]/10 hover:bg-[#ff0080]/10 text-[#ff0080] dark:bg-[#ff0080]/20 dark:text-[#ff0080] rounded-full">
            Destaques
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
        {livros.map((livro, index) => {
          // Alternar cores de fundo
          const bgColor = index % 2 === 0 ? 'bg-[#ff0080]' : 'bg-[#27b99a]';
          const bgColorDark = index % 2 === 0 ? 'dark:bg-[#ff0080]' : 'dark:bg-[#27b99a]';
          
          return (
            <motion.div key={livro.id} variants={itemVariants}>
              <div className={`relative overflow-visible rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group ${bgColor} ${bgColorDark}`}>
                {/* Seção superior colorida */}
                <div className="relative pt-8 pb-6 px-6">
                  {/* Badge de lançamento */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Lançamento
                    </span>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-10 w-10 p-0 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm ${
                        favoritos[livro.id] 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-white/90 hover:bg-white'
                      }`}
                      onClick={(e) => toggleFavorito(livro, e)}
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors ${
                          favoritos[livro.id] 
                            ? 'text-[#ff0080] fill-[#ff0080]' 
                            : 'text-black hover:text-[#ff0080]'
                        }`} 
                      />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-10 w-10 p-0 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                      onClick={(e) => adicionarCarrinho(livro, e)}
                    >
                      <ShoppingCart className="h-5 w-5 text-black hover:text-[#27b99a]" />
                    </Button>
                  </div>
                </div>
                
                {/* Capa do livro - saindo da seção colorida */}
                <div className="flex justify-center px-6 -mb-16 relative z-20">
                  <div className="relative w-48 h-64 rounded-xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                    {livro.capa ? (
                      <Image 
                        src={livro.capa} 
                        alt={livro.nome}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Seção branca inferior */}
                <div className="bg-white dark:bg-black rounded-t-2xl px-6 pt-20 pb-6 space-y-3 relative z-10">
                  {/* Categoria */}
                  <div className="text-center">
                    {livro.categorias && livro.categorias.length > 0 && (
                      <span className="inline-block bg-[#27b99a]/10 text-[#27b99a] px-4 py-2 rounded-full text-sm font-semibold border border-[#27b99a]/20">
                        {livro.categorias[0].categoria.titulo}
                      </span>
                    )}
                  </div>
                  
                  {/* Título do livro */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-2">
                      {livro.nome}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {livro.descricao}
                    </p>
                  </div>
                  
                  {/* Elementos inferiores com pouco espaço */}
                  <div className="space-y-2">
                    {/* Preço */}
                    <div className="text-center">
                      {livro.precoPromocional ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg font-bold text-[#27b99a]">R$ {livro.precoPromocional.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through">R$ {livro.preco.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-black dark:text-white">R$ {livro.preco.toFixed(2)}</span>
                      )}
                    </div>
                    
                    {/* Botão principal */}
                    <Link 
                      href={`/categoria-livro/${livro.categorias && livro.categorias[0]?.categoria.slug || 'lancamentos'}/livro/${livro.slug || `livro-lancamentos-${index + 1}`}`}
                      className="block"
                    >
                      <Button className="w-full bg-[#27b99a] hover:bg-[#27b99a]/90 text-white rounded-full font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                        COMPRA RÁPIDA
                      </Button>
                    </Link>
                    
                    {/* Botão secundário */}
                    <Dialog open={modalCriacaoAberto} onOpenChange={setModalCriacaoAberto}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="w-full border-2 border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080]/5 rounded-full font-medium py-2 transition-all duration-300"
                          onClick={() => {
                            setLivroSelecionado(livro);
                            setNomePersonagem("");
                            setGeneroSelecionado(null);
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          CRIAÇÃO RÁPIDA
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
                            Vamos criar seu personagem!
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          {/* Seleção de gênero */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold text-gray-700">
                              Escolha o gênero do personagem:
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                variant={generoSelecionado === "menino" ? "default" : "outline"}
                                className={`h-20 flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all ${
                                  generoSelecionado === "menino" 
                                    ? "bg-[#27b99a] hover:bg-[#27b99a]/90 text-white" 
                                    : "border-2 border-[#27b99a] text-[#27b99a] hover:bg-[#27b99a]/5"
                                }`}
                                onClick={() => setGeneroSelecionado("menino")}
                              >
                                <User className="h-8 w-8" />
                                <span className="font-semibold">Menino</span>
                              </Button>
                              <Button
                                variant={generoSelecionado === "menina" ? "default" : "outline"}
                                className={`h-20 flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all ${
                                  generoSelecionado === "menina" 
                                    ? "bg-[#ff0080] hover:bg-[#ff0080]/90 text-white" 
                                    : "border-2 border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080]/5"
                                }`}
                                onClick={() => setGeneroSelecionado("menina")}
                              >
                                <User className="h-8 w-8" />
                                <span className="font-semibold">Menina</span>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Input do nome */}
                          <div className="space-y-3">
                            <Label htmlFor="nome" className="text-base font-semibold text-gray-700">
                              Digite o nome do personagem:
                            </Label>
                            <Input
                              id="nome"
                              placeholder="Ex: Maria, João, Ana..."
                              value={nomePersonagem}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNomePersonagem(e.target.value)}
                              className="h-12 text-base rounded-2xl border-2 focus:border-[#27b99a] focus:ring-[#27b99a]"
                            />
                          </div>
                          
                          {/* Botão de continuar */}
                          <Button
                            className={`w-full h-12 text-white rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl ${
                              generoSelecionado === "menina" 
                                ? "bg-[#ff0080] hover:bg-[#ff0080]/90" 
                                : "bg-[#27b99a] hover:bg-[#27b99a]/90"
                            }`}
                            disabled={!generoSelecionado || !nomePersonagem.trim()}
                            onClick={() => {
                              if (livroSelecionado && generoSelecionado && nomePersonagem.trim()) {
                                // Redirecionar para página de edição do avatar
                                const slug = livroSelecionado.slug || `livro-${livroSelecionado.id}`;
                                const categoria = livroSelecionado.categorias?.[0]?.categoria?.slug || 'lancamentos';
                                router.push(`/categoria-livro/${categoria}/livro/${slug}/personalizar-avatar?nome=${encodeURIComponent(nomePersonagem)}&genero=${generoSelecionado}`);
                                setModalCriacaoAberto(false);
                                toast.success(`Personagem ${nomePersonagem} criado! Vamos personalizar!`);
                              }
                            }}
                          >
                            <Sparkles className="h-5 w-5 mr-2" />
                            Continuar Personalização
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </motion.div>
      </div>
    </section>
  );
}
