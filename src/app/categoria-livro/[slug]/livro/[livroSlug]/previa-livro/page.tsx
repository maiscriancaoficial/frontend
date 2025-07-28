'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Book, ShoppingCart, ArrowLeft, Heart, Star, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from "@/components/ui/sonner";
import { toast } from 'sonner';

interface Pagina {
  id: string;
  numero: number;
  arquivo: string;
  conteudo?: string;
  imagem?: string;
}

interface LivroCompleto {
  id: string;
  nome: string;
  titulo?: string;
  autor?: string;
  descricao?: string;
  preco: number;
  precoPromocional?: number;
  capa: string;
  imagemCapa?: string;
  paginas: Pagina[];
  avatar?: AvatarConfig;
}

interface AvatarConfig {
  nome: string;
  tipo: 'menino' | 'menina';
  pele: string;
  cabelo?: string;
  olhos?: string;
  roupa?: string;
  [key: string]: any;
}

export default function PreviaLivroPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const livroSlug = params.livroSlug as string;
  const categoriaSlug = params.slug as string;
  
  // Parâmetros da URL
  const avatarId = searchParams.get('avatar');
  const nomePersonagem = searchParams.get('nome') || 'Criança';
  
  const [loading, setLoading] = useState(true);
  const [livroData, setLivroData] = useState<LivroCompleto | null>(null);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Função para esconder o header e footer
  useEffect(() => {
    const esconderElementos = () => {
      const headers = document.querySelectorAll('header, [class*="header"], [id*="header"], nav, [class*="nav"], [id*="nav"]');
      headers.forEach(header => {
        if (header instanceof HTMLElement) {
          header.style.display = 'none';
        }
      });
      
      const footers = document.querySelectorAll('footer, [class*="footer"], [id*="footer"]');
      footers.forEach(footer => {
        if (footer instanceof HTMLElement) {
          footer.style.display = 'none';
        }
      });
      
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    };
    
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
  
  // Carregar dados reais do livro e avatar
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Buscar dados do livro com páginas
        const livroResponse = await fetch(`/api/livros/slug/${livroSlug}`);
        if (!livroResponse.ok) {
          throw new Error('Livro não encontrado');
        }
        const livroData = await livroResponse.json();
        
        if (!livroData.success) {
          throw new Error(livroData.error || 'Erro ao carregar livro');
        }
        
        console.log('📚 Dados do livro carregados:', livroData.livro);
        setLivroData(livroData.livro);
        
        // Tentar carregar avatar personalizado do banco (se usuário logado)
        // Por enquanto, vamos usar localStorage como fallback
        const savedAvatar = localStorage.getItem(`avatar_${livroSlug}`);
        if (savedAvatar) {
          try {
            const parsedAvatar = JSON.parse(savedAvatar);
            console.log('👤 Avatar carregado do localStorage:', parsedAvatar);
            setAvatarConfig(parsedAvatar);
          } catch (e) {
            console.error('Erro ao parsear avatar do localStorage:', e);
          }
        }
        
        // Se não tem avatar salvo, criar um padrão baseado nos parâmetros da URL
        if (!savedAvatar) {
          const avatarPadrao: AvatarConfig = {
            nome: nomePersonagem,
            tipo: avatarId === 'menina' ? 'menina' : 'menino',
            pele: 'pele1',
            cabelo: 'cabelo1',
            olhos: 'olhos1',
            roupa: 'roupa1'
          };
          console.log('👤 Avatar padrão criado:', avatarPadrao);
          setAvatarConfig(avatarPadrao);
        }
        
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [livroSlug, avatarId, nomePersonagem]);

  const [isFlipping, setIsFlipping] = useState(false);
  
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 0 && !isFlipping) {
      setIsFlipping(true);
      // Delay para a animação de flip
      setTimeout(() => {
        setPaginaAtual(paginaAtual - 2);
        setTimeout(() => setIsFlipping(false), 300);
      }, 200);
    }
  };

  const irParaProximaPagina = () => {
    if (livroData && paginaAtual < livroData.paginas.length - 1 && !isFlipping) {
      setIsFlipping(true);
      // Delay para a animação de flip
      setTimeout(() => {
        setPaginaAtual(paginaAtual + 2);
        setTimeout(() => setIsFlipping(false), 300);
      }, 200);
    }
  };

  const adicionarAoCarrinho = async () => {
    try {
      // Criar item do carrinho
      const itemCarrinho = {
        id: Date.now().toString(),
        livroId: livroData?.id,
        livroNome: livroData?.nome,
        livroPreco: livroData?.preco,
        livroPrecoPromocional: livroData?.precoPromocional,
        livroCapa: livroData?.capa || livroData?.imagemCapa,
        avatar: avatarConfig,
        nomePersonagem: avatarConfig?.nome || nomePersonagem,
        quantidade: 1,
        tipo: 'personalizado',
        adicionadoEm: new Date().toISOString()
      };
      
      // Salvar no localStorage
      const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho') || '[]');
      
      // Verificar se já existe um item similar
      const itemExistente = carrinhoAtual.find((item: any) => 
        item.livroId === itemCarrinho.livroId && 
        item.nomePersonagem === itemCarrinho.nomePersonagem
      );
      
      if (itemExistente) {
        // Atualizar quantidade
        itemExistente.quantidade += 1;
        itemExistente.adicionadoEm = new Date().toISOString();
      } else {
        // Adicionar novo item
        carrinhoAtual.push(itemCarrinho);
      }
      
      localStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
      console.log('🛍️ Item adicionado ao carrinho:', itemCarrinho);
      
      toast.success(
        `“${livroData?.nome}” foi adicionado ao carrinho!`, 
        {
          description: `Personagem: ${avatarConfig?.nome || nomePersonagem}`,
          duration: 3000
        }
      );
      
      // Redirecionar para carrinho após delay
      setTimeout(() => {
        router.push('/carrinho');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro ao carregar livro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href={`/categoria-livro/${categoriaSlug}/livro/${livroSlug}`}>
            <Button className="bg-[#27b99a] hover:bg-[#239d84] text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#ff007d]"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparando seu livro personalizado</h2>
          <p className="text-gray-600">Estamos colocando seu avatar na história...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Voltar */}
            <Link href={`/categoria-livro/${categoriaSlug}/livro/${livroSlug}/personalizar-avatar`}>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            {/* Título */}
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-[#ff007d]" />
              <h1 className="text-lg font-semibold text-gray-900">Prévia do Livro</h1>
            </div>
            
            {/* Avatar Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{avatarConfig?.nome || nomePersonagem}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Livro - 75% */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Livro Header */}
              <div className="bg-gradient-to-r from-[#ff007d]/10 to-[#27b99a]/10 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {livroData?.titulo || livroData?.nome || 'Livro Personalizado'}
                    </h2>
                    {livroData?.autor && (
                      <p className="text-gray-600">por {livroData.autor}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-yellow-100 rounded-full px-3 py-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-yellow-700">5.0</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 rounded-full">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Livro Content - Formato Realista */}
              <div className="p-8">
                <div className="relative mx-auto" style={{ maxWidth: '800px', aspectRatio: '4/3' }}>
                  {/* Livro Container com Sombra Realista */}
                  <div className="relative w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-2xl overflow-hidden" 
                       style={{ 
                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                       }}>
                    
                    {/* Lombada do Livro */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-800 to-gray-600 shadow-inner"></div>
                    
                    {livroData && livroData.paginas && livroData.paginas.length > 0 ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={paginaAtual}
                          className="w-full h-full flex ml-4"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          {/* Página Esquerda */}
                          <motion.div 
                            className="w-1/2 h-full bg-white relative overflow-hidden"
                            initial={{ rotateY: -15, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: 15, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{ 
                              transformOrigin: 'right center',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            {/* Conteúdo da Página Esquerda */}
                            <div className="w-full h-full relative">
                              <Image 
                                src={livroData.paginas[paginaAtual]?.arquivo || '/placeholder-livro.jpg'} 
                                alt={`Página ${paginaAtual + 1}`}
                                fill
                                className="object-cover"
                                style={{ objectPosition: 'center' }}
                              />
                              
                              {/* Avatar personalizado */}
                              {avatarConfig && (
                                <motion.div 
                                  className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full p-1 shadow-lg"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                                >
                                  <div className="w-full h-full bg-gradient-to-br from-[#ff007d]/20 to-[#27b99a]/20 rounded-full flex items-center justify-center">
                                    <span className="text-lg">
                                      {avatarConfig.tipo === 'menina' ? '👧' : '👦'}
                                    </span>
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* Número da Página */}
                              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white/80 rounded-full px-2 py-1">
                                {paginaAtual + 1}
                              </div>
                            </div>
                            
                            {/* Sombra interna da página */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/5 pointer-events-none"></div>
                          </motion.div>
                          
                          {/* Divisor Central (Costura do Livro) */}
                          <div className="w-1 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 shadow-inner"></div>
                          
                          {/* Página Direita */}
                          {paginaAtual + 1 < livroData.paginas.length && (
                            <motion.div 
                              className="w-1/2 h-full bg-white relative overflow-hidden"
                              initial={{ rotateY: 15, opacity: 0 }}
                              animate={{ rotateY: 0, opacity: 1 }}
                              exit={{ rotateY: -15, opacity: 0 }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              style={{ 
                                transformOrigin: 'left center',
                                transformStyle: 'preserve-3d'
                              }}
                            >
                              {/* Conteúdo da Página Direita */}
                              <div className="w-full h-full relative">
                                <Image 
                                  src={livroData.paginas[paginaAtual + 1]?.arquivo || '/placeholder-livro.jpg'} 
                                  alt={`Página ${paginaAtual + 2}`}
                                  fill
                                  className="object-cover"
                                  style={{ objectPosition: 'center' }}
                                />
                                
                                {/* Avatar personalizado */}
                                {avatarConfig && (
                                  <motion.div 
                                    className="absolute bottom-6 left-6 w-12 h-12 bg-white rounded-full p-1 shadow-lg"
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                                  >
                                    <div className="w-full h-full bg-gradient-to-br from-[#ff007d]/20 to-[#27b99a]/20 rounded-full flex items-center justify-center">
                                      <span className="text-lg">
                                        {avatarConfig.tipo === 'menina' ? '👧' : '👦'}
                                      </span>
                                    </div>
                                  </motion.div>
                                )}
                                
                                {/* Número da Página */}
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white/80 rounded-full px-2 py-1">
                                  {paginaAtual + 2}
                                </div>
                              </div>
                              
                              {/* Sombra interna da página */}
                              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5 pointer-events-none"></div>
                            </motion.div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center ml-4">
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          </motion.div>
                          <p className="text-gray-500">Carregando páginas...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Controles de Navegação */}
                <div className="flex items-center justify-center mt-8 space-x-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={irParaPaginaAnterior}
                      disabled={paginaAtual === 0 || isFlipping}
                      variant="outline"
                      size="lg"
                      className="rounded-full border-2 border-gray-200 hover:border-[#ff007d] hover:text-[#ff007d] hover:bg-[#ff007d]/5 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="ml-1 hidden sm:inline">Anterior</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-r from-[#ff007d]/10 to-[#27b99a]/10 rounded-full px-6 py-3 shadow-lg"
                    animate={isFlipping ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-semibold text-gray-800">
                      {isFlipping ? (
                        <span className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-[#ff007d] border-t-transparent rounded-full mr-2"
                          />
                          Virando...
                        </span>
                      ) : (
                        `Página ${Math.floor(paginaAtual / 2) + 1} de ${Math.ceil((livroData?.paginas?.length || 0) / 2)}`
                      )}
                    </span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={irParaProximaPagina}
                      disabled={!livroData?.paginas || paginaAtual >= livroData.paginas.length - 1 || isFlipping}
                      variant="outline"
                      size="lg"
                      className="rounded-full border-2 border-gray-200 hover:border-[#27b99a] hover:text-[#27b99a] hover:bg-[#27b99a]/5 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span className="mr-1 hidden sm:inline">Próxima</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Painel Lateral - 25% */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Avatar Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ff007d]/20 to-[#27b99a]/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-[#ff007d]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Seu Avatar</h3>
                    <p className="text-sm text-gray-500">Personalizado</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nome:</span>
                    <span className="text-sm font-medium text-gray-900">{avatarConfig?.nome || nomePersonagem}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{avatarConfig?.tipo || 'Padrão'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Pronto
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 rounded-full border-[#ff007d] text-[#ff007d] hover:bg-[#ff007d] hover:text-white"
                  onClick={() => router.push(`/categoria-livro/${categoriaSlug}/livro/${livroSlug}/personalizar-avatar`)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Editar Avatar
                </Button>
              </motion.div>
              
              {/* Livro Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#27b99a]/20 to-[#ff007d]/20 rounded-full flex items-center justify-center">
                    <Book className="h-6 w-6 text-[#27b99a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Detalhes</h3>
                    <p className="text-sm text-gray-500">Informações do livro</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Páginas:</span>
                    <p className="text-sm font-medium text-gray-900">{livroData?.paginas?.length || 0} páginas</p>
                  </div>
                  {livroData?.descricao && (
                    <div>
                      <span className="text-sm text-gray-600">Descrição:</span>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">{livroData.descricao}</p>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Ação Principal */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-[#27b99a] to-[#239d84] rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg mb-2">Gostou do Resultado?</h3>
                  <p className="text-sm text-white/80">Seu livro personalizado está pronto!</p>
                </div>
                
                <Button
                  onClick={adicionarAoCarrinho}
                  className="w-full bg-white text-[#27b99a] hover:bg-gray-50 rounded-full font-semibold py-3 shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  EU QUERO ESTE LIVRO!
                </Button>
                
                <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-white/80">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span>Qualidade Premium</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>Feito com Amor</span>
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
