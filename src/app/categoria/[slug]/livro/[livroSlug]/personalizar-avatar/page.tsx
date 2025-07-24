'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wand2, Loader2, ShoppingCart, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import { AvatarPreview } from './components/avatar-preview';
import { AvatarCustomizer } from './components/avatar-customizer';
import { AvatarFallback, ItemFallback, LoadingFallback, ImageFallback } from './components/avatar-fallbacks';
import { AvatarConfig, AvatarOptions } from './types';
import { getAvatarOptions, salvarAvatarPersonalizado } from './services/avatar-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Fallbacks são agora importados do componente avatar-fallbacks.tsx

export default function PersonalizarAvatarPage() {
  const params = useParams();
  const router = useRouter();
  const livroSlug = params.livroSlug as string;
  const categoriaSlug = params.slug as string;
  const [nome, genero] = (params.genero_nome as string)?.split('&nome=') || ['', ''];
  
  const [loading, setLoading] = useState(false);
  // Inicializando com um objeto vazio com arrays vazios para evitar erro "Cannot read properties of null"
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(null);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    nome: '',
    tipo: 'menino',
    pele: 'clara',
    olhos: undefined,
    cabelo: undefined,
    corCabelo: undefined,
    roupa: undefined,
    corRoupa: undefined,
    shorts: undefined,
    oculos: undefined,
    chapeu: undefined,
    bone: undefined,
    aderecos: []
  });

  // Carregar opções para personalização do avatar
  useEffect(() => {
    const options = getAvatarOptions();
    setAvatarOptions(options);
  }, []);

  // Restaurar avatar do localStorage se existir
  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem(`avatar_${livroSlug}`);
      if (savedAvatar) {
        const parsed = JSON.parse(savedAvatar);
        setAvatarConfig(current => ({
          ...parsed,
          nome: nome || parsed.nome,
          tipo: (genero === 'menino' || genero === 'menina') ? genero : parsed.tipo
        }));
        toast.success("Avatar carregado!", {
          description: "Seu avatar anterior foi restaurado"
        });
      } else if (nome || genero) {
        setAvatarConfig(current => ({
          ...current,
          nome: nome || current.nome,
          tipo: (genero === 'menino' || genero === 'menina') ? genero : current.tipo
        }));
      }
    } catch (error) {
      console.error('Erro ao restaurar avatar do localStorage:', error);
    }
  }, [livroSlug, nome, genero]);

  // Função para gerar avatar aleatório
  const generateRandomAvatar = () => {
    if (!avatarOptions) {
      toast.error("Não foi possível gerar o avatar", {
        description: "Aguarde o carregamento das opções"
      });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      // Função auxiliar para seleção segura de item aleatório
      const getRandomItem = <T extends { id: string }>(items: T[] | undefined): string => {
        if (!items || items.length === 0) return '';
        return items[Math.floor(Math.random() * items.length)].id;
      };
      
      const randomPele = getRandomItem(avatarOptions.peles);
      const randomCabelo = getRandomItem(avatarOptions.cabelos);
      const randomCorCabelo = getRandomItem(avatarOptions.coresCabelo);
      const randomOlhos = getRandomItem(avatarOptions.olhos);
      const randomRoupa = getRandomItem(avatarOptions.roupas);
      const randomCorRoupa = getRandomItem(avatarOptions.coresRoupa);
      const randomShorts = getRandomItem(avatarOptions.shorts);
      
      toast.success("Avatar aleatório gerado!", {
        description: "Personalize-o como desejar ou gere outro!"
      });
      
      setAvatarConfig(current => ({
        ...current,
        pele: randomPele || current.pele,
        cabelo: randomCabelo || current.cabelo,
        corCabelo: randomCorCabelo || current.corCabelo,
        olhos: randomOlhos || current.olhos,
        roupa: randomRoupa || current.roupa,
        corRoupa: randomCorRoupa || current.corRoupa,
        shorts: randomShorts || current.shorts
      }));
      
      setLoading(false);
    }, 600);
  };

  // Função para atualizar a configuração do avatar
  const updateAvatarConfig = (newConfig: Partial<AvatarConfig>) => {
    setAvatarConfig(current => ({
      ...current,
      ...newConfig
    }));
  };

  // Verifica se a configuração do avatar é válida para salvar
  const isConfigValid = () => {
    // Campos obrigatórios mínimos para o avatar ser válido
    const requiredFields = ['nome', 'tipo', 'pele'];
    const recommendedFields = ['cabelo', 'olhos', 'roupa'];
    
    // Verifica se todos os campos obrigatórios estão preenchidos
    const hasAllRequired = requiredFields.every(field => Boolean(avatarConfig[field as keyof AvatarConfig]));
    
    // Verifica se pelo menos um dos campos recomendados está preenchido
    const hasOneRecommended = recommendedFields.some(field => Boolean(avatarConfig[field as keyof AvatarConfig]));
    
    return hasAllRequired && hasOneRecommended;
  };

  // Função para salvar avatar
  const handleSalvarAvatar = async () => {
    try {
      // Verifica se o avatar é válido antes de salvar
      if (!isConfigValid()) {
        toast.error("Avatar incompleto", {
          description: "Por favor, complete pelo menos os campos básicos do avatar antes de continuar."
        });
        return false;
      }
      
      setLoading(true);
      
      // Certifica-se de que temos um nome válido
      const avatarToSave = {
        ...avatarConfig,
        nome: avatarConfig.nome || nome || "Avatar"
      };
      
      // Salva no localStorage com tratamento de erro
      try {
        localStorage.setItem('avatarConfig', JSON.stringify(avatarToSave));
        localStorage.setItem(`avatar_${livroSlug}`, JSON.stringify(avatarToSave));
      } catch (storageError) {
        console.error('Erro ao salvar no localStorage:', storageError);
        // Continua mesmo com erro de localStorage
      }
      
      toast.success("Avatar salvo com sucesso!", {
        description: "Seu avatar foi personalizado!"
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Erro ao salvar avatar localmente:', error);
      toast.error("Erro ao salvar avatar", {
        description: "Houve um problema ao salvar suas configurações"
      });
      setLoading(false);
      return true; // Retorna true mesmo com erro para continuar a navegação
    }
  };

  // Adicionar ao carrinho
  const handleAddToCart = async () => {
    if (!isConfigValid()) return;
    
    setLoading(true);
    try {
      // Salvamos o avatar primeiro
      await handleSalvarAvatar();
      
      // Aqui seria a lógica para adicionar ao carrinho
      // Por enquanto, apenas mostramos um toast
      setTimeout(() => {
        toast.success("Adicionado ao carrinho!", {
          description: "O livro personalizado foi adicionado ao seu carrinho"
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error("Erro ao adicionar ao carrinho", {
        description: "Não foi possível adicionar o item ao carrinho"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#27b99a]/20 via-blue-500/30 to-[#f29798]/30 overflow-x-hidden pb-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-96 -right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Top Navigation Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-sm"
      >
        <Link 
          href={`/categoria/${categoriaSlug}/livro/${livroSlug}`}
          className="text-white hover:text-gray-100 flex items-center gap-1 transition-all"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateRandomAvatar}
          className="px-4 py-2 bg-[#f29798] hover:bg-[#f29798]/80 rounded-full text-white font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 size={16} />}
          <span>Gerar Avatar Aleatório</span>
        </motion.button>
      </motion.div>

      {/* Título como Badge */}
      <div className="relative z-10 px-6 py-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-r-full border-l-4 border-yellow-300 shadow-lg"
        >
          <h1 className="text-white text-xl md:text-2xl font-bold">
            Crie um personagem único que representará {avatarConfig.nome || nome || "seu filho"} na história.
          </h1>
        </motion.div>
      </div>

      {/* Main Content - 60/40 Split */}
      <div className="flex flex-col lg:flex-row w-full relative z-10 px-4 lg:px-8">
        {/* Preview Column - 60% */}
        <div className="w-full lg:w-[60%] lg:pr-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
            <Card className="h-full bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-6 text-gray-800 self-start">Prévia do Avatar</h2>
                <div className="w-full h-full flex items-center justify-center">
                  <Suspense fallback={<LoadingFallback message="Carregando avatar..." />}>
                    {avatarConfig.pele || avatarConfig.cabelo || avatarConfig.olhos || avatarConfig.roupa ? (
                      <AvatarPreview 
                        config={avatarConfig}
                        fallback={<AvatarFallback tipo={avatarConfig.tipo as 'menino' | 'menina'} />}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <AvatarFallback tipo="menino" />
                        <p className="text-gray-500 text-center mt-4">
                          Comece a personalização ao lado para criar seu avatar
                        </p>
                      </div>
                    )}
                  </Suspense>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Customizer Column - 40% */}
        <div className="w-full lg:w-[40%] mt-4 lg:mt-0 lg:pl-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-full"
          >
            <Card className="h-full bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Personalização</h2>
                <Suspense fallback={<LoadingFallback />}>
                  {avatarOptions ? (
                    <AvatarCustomizer 
                      config={avatarConfig} 
                      onChange={updateAvatarConfig}
                      avatarOptions={avatarOptions}
                    />
                  ) : (
                    <div className="space-y-8">
                      <ItemFallback itemType="cabelo" /> 
                      <ItemFallback itemType="roupa" />
                      <ItemFallback itemType="pele" />
                    </div>
                  )}
                </Suspense>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md flex flex-col sm:flex-row gap-4 justify-between z-50 border-t border-gray-100 dark:border-gray-700 shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex gap-4">
          <Link href={`/categoria/${categoriaSlug}/livro/${livroSlug}`}>
            <Button
              variant="outline"
              className="rounded-full py-6 px-6 bg-white/95 hover:bg-gray-50 border border-gray-100 shadow-md hover:shadow-lg text-gray-700 font-medium transition-all"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          </Link>
          
          <Button
            onClick={handleAddToCart}
            disabled={!isConfigValid() || loading}
            className="rounded-full py-6 px-6 bg-[#f29798] hover:bg-[#f29798]/80 text-white font-medium shadow-md hover:shadow-lg transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Adicionando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Adicionar ao Carrinho</span>
              </div>
            )}
          </Button>
        </div>
        
        <Link href={`/categoria/${categoriaSlug}/livro/${livroSlug}/previa-livro`}>
          <Button
            disabled={!isConfigValid() || loading}
            className="rounded-full py-6 px-6 bg-[#27b99a] hover:bg-[#27b99a]/90 text-white font-medium w-full sm:w-auto"
            onClick={handleSalvarAvatar}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Salvando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>PRONTINHO? SIGA PARA O LIVRO</span>
                <ChevronRight className="h-5 w-5" />
              </div>
            )}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
