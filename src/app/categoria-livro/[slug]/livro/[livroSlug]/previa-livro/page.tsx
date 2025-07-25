'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Book, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Toaster } from "@/components/ui/sonner";

export default function PreviaLivroPage() {
  const params = useParams();
  const router = useRouter();
  const livroSlug = params.livroSlug as string;
  const categoriaSlug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [livroData, setLivroData] = useState<any>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);
  
  // Função para esconder o header e footer
  useEffect(() => {
    // Função para esconder elementos indesejados
    const esconderElementos = () => {
      // Esconde o header
      const headers = document.querySelectorAll('header, [class*="header"], [id*="header"], nav, [class*="nav"], [id*="nav"]');
      headers.forEach(header => {
        if (header instanceof HTMLElement) {
          header.style.display = 'none';
        }
      });
      
      // Esconde o footer
      const footers = document.querySelectorAll('footer, [class*="footer"], [id*="footer"]');
      footers.forEach(footer => {
        if (footer instanceof HTMLElement) {
          footer.style.display = 'none';
        }
      });
      
      // Ajusta o body e o html para ocupar toda a tela
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      // Permitimos o scroll vertical, mas bloqueamos o horizontal
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    };
    
    // Executa várias vezes para garantir que pegue elementos carregados após o primeiro render
    esconderElementos();
    const timer1 = setTimeout(esconderElementos, 100);
    const timer2 = setTimeout(esconderElementos, 500);
    const timer3 = setTimeout(esconderElementos, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  // Efeito para carregar os dados do livro personalizado
  useEffect(() => {
    // Carrega as configurações do avatar do localStorage
    const avatarConfigStr = localStorage.getItem('avatarConfig');
    let avatarConfig = null;
    
    if (avatarConfigStr) {
      try {
        avatarConfig = JSON.parse(avatarConfigStr);
      } catch (e) {
        console.error('Erro ao carregar configurações do avatar:', e);
      }
    }
    
    // Em um cenário real, faríamos uma chamada à API para buscar os dados do livro personalizado
    // Aqui estamos simulando um carregamento
    const timer = setTimeout(() => {
      setLivroData({
        titulo: 'Aventura na Floresta Mágica',
        paginas: [
          {
            id: 1,
            conteudo: 'Era uma vez uma criança muito especial chamada [Nome]...',
            imagem: '/paginas/pagina1.jpg'
          },
          {
            id: 2,
            conteudo: '[Nome] adorava explorar a natureza e fazer novos amigos...',
            imagem: '/paginas/pagina2.jpg'
          },
          {
            id: 3,
            conteudo: 'Um dia, [Nome] encontrou uma porta mágica no meio da floresta...',
            imagem: '/paginas/pagina3.jpg'
          },
          {
            id: 4,
            conteudo: 'Do outro lado da porta, havia um mundo maravilhoso cheio de criaturas fantásticas...',
            imagem: '/paginas/pagina4.jpg'
          },
          {
            id: 5,
            conteudo: 'E assim começou a incrível aventura de [Nome] na Floresta Mágica...',
            imagem: '/paginas/pagina5.jpg'
          }
        ],
        // Usa as configurações do avatar do localStorage ou valores padrão
        avatar: avatarConfig || {
          nome: 'Criança',
          tipo: 'menino',
          pele: 'clara',
          olhos: 'azul',
          cabelo: 'liso',
          roupa: 'camiseta'
        }
      });
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 0) {
      setPaginaAtual(paginaAtual - 1);
    }
  };
  
  const irParaProximaPagina = () => {
    if (livroData && paginaAtual < livroData.paginas.length - 1) {
      setPaginaAtual(paginaAtual + 1);
    }
  };
  
  const adicionarAoCarrinho = () => {
    // Salva as configurações do avatar e do livro (em um cenário real, seria feito via API)
    const livroInfo = {
      id: livroSlug,
      titulo: livroData?.titulo || 'Livro Personalizado',
      avatarConfig: livroData?.avatar || {},
      adicionadoEm: new Date().toISOString()
    };
    
    // Em um cenário real, enviaríamos isso para uma API
    try {
      localStorage.setItem('livroNoCarrinho', JSON.stringify(livroInfo));
    } catch (e) {
      console.error('Erro ao salvar informações do livro:', e);
    }
    
    // Redireciona para a página do carrinho
    router.push('/carrinho');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#27b99a]/20 via-blue-500/30 to-[#f29798]/30">
        <div className="text-center">
          <div className="relative w-40 h-40 mx-auto mb-4 animate-pulse">
            <Image 
              src="/loading-book.gif" 
              alt="Carregando livro" 
              fill 
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparando seu livro personalizado</h2>
          <p className="text-gray-600">Estamos colocando seu avatar na história...</p>
        </div>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-96 -right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#27b99a]/20 via-blue-500/30 to-[#f29798]/30 overflow-x-hidden pb-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-96 -right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Botão para voltar */}
      <div className="absolute top-6 left-6 z-10">
        <Link href={`/categoria/${categoriaSlug}/livro/${livroSlug}/personalizar-avatar`}>
          <Button variant="ghost" className="bg-white/40 backdrop-blur-sm hover:bg-white/60 text-gray-800 rounded-full shadow-md">
            <ChevronLeft size={18} className="mr-2" />
            Voltar ao Avatar
          </Button>
        </Link>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        {/* Área de edição à direita */}
        <div className="absolute right-8 top-24 w-64 z-10">
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-4">
            <h3 className="font-medium text-gray-800 mb-4">Área de edição</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nome:</p>
                <p className="text-sm font-medium text-green-600 flex items-center">
                  {livroData.avatar.nome}
                  <span className="ml-auto text-green-500">✓</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Capa personalizada:</p>
                <p className="text-sm font-medium text-green-600 flex items-center">
                  Escolha uma capa
                  <span className="ml-auto text-green-500">✓</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Dedicatória:</p>
                <p className="text-sm font-medium text-green-600 flex items-center">
                  Escreva uma dedicatória
                  <span className="ml-auto text-green-500">✓</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Livro */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
              {livroData.titulo}
            </h1>
            
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-white mx-auto aspect-[3/2]">
              {/* Visualização do livro em formato de duas páginas */}
              <div className="w-full h-full flex">
                <AnimatePresence mode="wait">
                  {paginaAtual % 2 === 0 ? (
                    <motion.div 
                      key={`spread-${Math.floor(paginaAtual/2)}`}
                      className="w-full h-full flex flex-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300, 
                        damping: 30,
                        duration: 0.5 
                      }}
                    >
                      {/* Página esquerda */}
                      <div className="w-1/2 h-full bg-white relative border-r border-gray-100 shadow-inner">
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <Image 
                              src={livroData.paginas[paginaAtual].imagem || '/placeholder-livro.jpg'} 
                              alt={`Página ${paginaAtual + 1}`}
                              fill
                              className="object-contain"
                            />
                            
                            {/* Avatar personalizado */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-24">
                              <Image 
                                src="/avatares/avatar-exemplo.png" 
                                alt="Avatar personalizado"
                                width={96}
                                height={96}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                          {paginaAtual + 1}
                        </div>
                      </div>
                      
                      {/* Página direita */}
                      <div className="w-1/2 h-full bg-white relative">
                        <div className="w-full h-full flex items-center justify-center p-6">
                          {paginaAtual + 1 < livroData.paginas.length ? (
                            <div className="relative w-full h-full rounded-lg overflow-hidden">
                              <Image 
                                src={livroData.paginas[paginaAtual + 1].imagem || '/placeholder-livro.jpg'} 
                                alt={`Página ${paginaAtual + 2}`}
                                fill
                                className="object-contain"
                              />
                              
                              {/* Avatar personalizado */}
                              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-24">
                                <Image 
                                  src="/avatares/avatar-exemplo.png" 
                                  alt="Avatar personalizado"
                                  width={96}
                                  height={96}
                                  className="object-contain"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <p className="text-gray-400">Fim do livro</p>
                            </div>
                          )}
                        </div>
                        {paginaAtual + 1 < livroData.paginas.length && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                            {paginaAtual + 2}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={`spread-${Math.floor(paginaAtual/2)}`}
                      className="w-full h-full flex flex-row"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300, 
                        damping: 30, 
                        duration: 0.5 
                      }}
                    >
                      {/* Página esquerda */}
                      <div className="w-1/2 h-full bg-white relative border-r border-gray-100 shadow-inner">
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <Image 
                              src={livroData.paginas[paginaAtual - 1].imagem || '/placeholder-livro.jpg'} 
                              alt={`Página ${paginaAtual}`}
                              fill
                              className="object-contain"
                            />
                            
                            {/* Avatar personalizado */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-24">
                              <Image 
                                src="/avatares/avatar-exemplo.png" 
                                alt="Avatar personalizado"
                                width={96}
                                height={96}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                          {paginaAtual}
                        </div>
                      </div>
                      
                      {/* Página direita */}
                      <div className="w-1/2 h-full bg-white relative">
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <Image 
                              src={livroData.paginas[paginaAtual].imagem || '/placeholder-livro.jpg'} 
                              alt={`Página ${paginaAtual + 1}`}
                              fill
                              className="object-contain"
                            />
                            
                            {/* Avatar personalizado */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-24">
                              <Image 
                                src="/avatares/avatar-exemplo.png" 
                                alt="Avatar personalizado"
                                width={96}
                                height={96}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                          {paginaAtual + 1}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Controles de navegação */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 items-center">
                <Button 
                  onClick={irParaPaginaAnterior} 
                  disabled={paginaAtual === 0}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:bg-white"
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <div className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-sm text-gray-700">
                  {Math.floor(paginaAtual / 2) + 1} de {Math.ceil(livroData.paginas.length / 2)}
                </div>
                
                <Button 
                  onClick={irParaProximaPagina} 
                  disabled={paginaAtual >= livroData.paginas.length - 1}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:bg-white"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            {/* Botão para comprar */}
            <div className="mt-12 flex justify-center">
              <Button 
                className="flex items-center justify-center gap-3 bg-[#27b99a] hover:bg-[#239d84] text-white px-16 py-7 rounded-full text-xl font-bold shadow-xl transition-all duration-200 transform hover:scale-105 min-w-[280px]"
                onClick={adicionarAoCarrinho}
              >
                <ShoppingCart size={24} />
                EU QUERO!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
