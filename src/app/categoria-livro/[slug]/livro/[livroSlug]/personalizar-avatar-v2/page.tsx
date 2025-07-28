'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wand2, Loader2, ShoppingCart, Edit3, Check, X, Sparkles, Palette, User } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Types
interface AvatarConfig {
  tipo: 'menino' | 'menina';
  nome: string;
  pele?: string;
  cabelo?: string;
  corCabelo?: string;
  olhos?: string;
  roupa?: string;
  corRoupa?: string;
  shorts?: string;
  oculos?: string;
  chapeu?: string;
  bone?: string;
  aderecos?: string[];
}

interface AvatarOptions {
  tipos: string[];
  peles: Array<{ id: string; imageUrl: string }>;
  cabelos: Array<{ id: string; imageUrl: string }>;
  coresCabelo: Array<{ id: string; colorValue: string; label: string }>;
  olhos: Array<{ id: string; imageUrl: string }>;
  roupas: Array<{ id: string; imageUrl: string }>;
  coresRoupa: Array<{ id: string; colorValue: string; label: string }>;
  shorts: Array<{ id: string; imageUrl: string }>;
  oculos: Array<{ id: string; imageUrl: string }>;
  chapeus: Array<{ id: string; imageUrl: string }>;
  bones: Array<{ id: string; imageUrl: string }>;
  aderecos: Array<{ id: string; imageUrl: string }>;
}

export default function PersonalizarAvatarV2Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(null);
  const [fotosPrincipais, setFotosPrincipais] = useState<{[key: string]: string}>({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  
  // Avatar configuration
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    tipo: 'menino',
    nome: 'Personagem'
  });

  // Initialize from URL params
  useEffect(() => {
    const genero = searchParams.get('genero') as 'menino' | 'menina';
    const nome = searchParams.get('nome');
    
    if (genero && (genero === 'menino' || genero === 'menina')) {
      setAvatarConfig(prev => ({
        ...prev,
        tipo: genero,
        nome: nome || 'Personagem'
      }));
      setTempName(nome || 'Personagem');
    }
  }, [searchParams]);

  // Load avatar options
  useEffect(() => {
    const loadAvatarOptions = async () => {
      try {
        const response = await fetch('/api/avatares/opcoes');
        if (response.ok) {
          const data = await response.json();
          
          const opcoesConvertidas: AvatarOptions = {
            tipos: ['menino', 'menina'],
            peles: data.opcoes.peles.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            cabelos: data.opcoes.cabelos.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            coresCabelo: data.opcoes.coresCabelo.map((item: any) => ({
              id: item.id,
              colorValue: item.cor,
              label: item.nome
            })),
            olhos: data.opcoes.olhos.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            roupas: data.opcoes.roupas.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            coresRoupa: data.opcoes.coresRoupa.map((item: any) => ({
              id: item.id,
              colorValue: item.cor,
              label: item.nome
            })),
            shorts: data.opcoes.shorts.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            oculos: data.opcoes.oculos.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            chapeus: data.opcoes.chapeus.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            bones: data.opcoes.bones.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            })),
            aderecos: data.opcoes.aderecos.map((item: any) => ({
              id: item.id,
              imageUrl: item.arquivo
            }))
          };
          
          setAvatarOptions(opcoesConvertidas);
          setFotosPrincipais(data.fotosPrincipais || {});
        }
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
      }
    };

    loadAvatarOptions();
  }, []);

  const handleNameEdit = () => {
    if (isEditingName) {
      setAvatarConfig(prev => ({ ...prev, nome: tempName }));
      setIsEditingName(false);
    } else {
      setIsEditingName(true);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Avatar personalizado salvo com sucesso!');
      
      // Navigate to next step
      router.push(`/categoria-livro/${params.slug}/livro/${params.livroSlug}/checkout`);
    } catch (error) {
      toast.error('Erro ao salvar avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/categoria-livro/${params.slug}/livro/${params.livroSlug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Voltar</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#ff007d]" />
                <h1 className="text-xl font-bold text-gray-900">Personalizar Avatar</h1>
              </div>
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="bg-[#ff007d] hover:bg-[#ff007d]/90 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Continuar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-4 gap-8 h-[calc(100vh-120px)]">
          
          {/* Avatar Preview - 75% */}
          <div className="col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full p-8 flex flex-col">
              
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#27b99a] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Prévia do Avatar</h2>
                </div>
                
                {/* Name Editor */}
                <div className="flex items-center gap-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-40 h-9 text-sm border-gray-200 rounded-full"
                        placeholder="Nome do personagem"
                      />
                      <Button
                        size="sm"
                        onClick={handleNameEdit}
                        className="h-9 w-9 p-0 bg-[#27b99a] hover:bg-[#27b99a]/90 rounded-full"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingName(false);
                          setTempName(avatarConfig.nome);
                        }}
                        className="h-9 w-9 p-0 border-gray-200 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-700">{avatarConfig.nome}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleNameEdit}
                        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Display */}
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {avatarConfig.tipo && fotosPrincipais[avatarConfig.tipo] ? (
                    <div className="relative">
                      <div className="w-80 h-80 lg:w-96 lg:h-96 relative">
                        <Image
                          src={fotosPrincipais[avatarConfig.tipo]}
                          alt={`Avatar ${avatarConfig.tipo} - ${avatarConfig.nome}`}
                          fill
                          className="object-contain rounded-3xl shadow-2xl"
                          priority
                        />
                      </div>
                      
                      {/* Avatar Info Overlay */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-full px-6 py-3 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#ff007d] rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">
                              {avatarConfig.tipo === 'menino' ? 'Menino' : 'Menina'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gray-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                      <div className="text-8xl mb-4 opacity-50">
                        {avatarConfig.tipo === 'menina' ? '👧' : '👦'}
                      </div>
                      <p className="text-gray-500 text-center font-medium">
                        Carregando avatar...
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Type Selector */}
              <div className="flex justify-center mt-8">
                <div className="bg-gray-50 rounded-full p-1 flex">
                  {['menino', 'menina'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setAvatarConfig(prev => ({ ...prev, tipo: tipo as 'menino' | 'menina' }))}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                        avatarConfig.tipo === tipo
                          ? 'bg-white text-[#ff007d] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tipo === 'menino' ? '👦 Menino' : '👧 Menina'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customization Panel - 25% */}
          <div className="col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full overflow-hidden">
              
              {/* Panel Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-[#27b99a]" />
                  <h3 className="text-lg font-bold text-gray-900">Personalização</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">Customize seu avatar</p>
              </div>

              {/* Customization Options */}
              <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-100px)]">
                
                {/* Loading State */}
                {!avatarOptions ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-4 bg-gray-100 rounded-full animate-pulse"></div>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Peles */}
                    {avatarOptions.peles.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4 text-[#ff007d]" />
                          Pele
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {avatarOptions.peles.slice(0, 6).map((pele) => (
                            <button
                              key={pele.id}
                              onClick={() => setAvatarConfig(prev => ({ ...prev, pele: pele.id }))}
                              className={`aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                                avatarConfig.pele === pele.id
                                  ? 'border-[#ff007d] shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image
                                src={pele.imageUrl}
                                alt="Pele"
                                width={60}
                                height={60}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cabelos */}
                    {avatarOptions.cabelos.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Wand2 className="h-4 w-4 text-[#27b99a]" />
                          Cabelo
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {avatarOptions.cabelos.slice(0, 6).map((cabelo) => (
                            <button
                              key={cabelo.id}
                              onClick={() => setAvatarConfig(prev => ({ ...prev, cabelo: cabelo.id }))}
                              className={`aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                                avatarConfig.cabelo === cabelo.id
                                  ? 'border-[#27b99a] shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image
                                src={cabelo.imageUrl}
                                alt="Cabelo"
                                width={60}
                                height={60}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cores do Cabelo */}
                    {avatarOptions.coresCabelo.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Cor do Cabelo</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {avatarOptions.coresCabelo.slice(0, 8).map((cor) => (
                            <button
                              key={cor.id}
                              onClick={() => setAvatarConfig(prev => ({ ...prev, corCabelo: cor.id }))}
                              className={`aspect-square rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                                avatarConfig.corCabelo === cor.id
                                  ? 'border-[#ff007d] shadow-lg scale-110'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              style={{ backgroundColor: cor.colorValue }}
                              title={cor.label}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Olhos */}
                    {avatarOptions.olhos.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Olhos</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {avatarOptions.olhos.slice(0, 6).map((olho) => (
                            <button
                              key={olho.id}
                              onClick={() => setAvatarConfig(prev => ({ ...prev, olhos: olho.id }))}
                              className={`aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                                avatarConfig.olhos === olho.id
                                  ? 'border-[#ff007d] shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image
                                src={olho.imageUrl}
                                alt="Olhos"
                                width={60}
                                height={60}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Roupas */}
                    {avatarOptions.roupas.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Roupa</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {avatarOptions.roupas.slice(0, 6).map((roupa) => (
                            <button
                              key={roupa.id}
                              onClick={() => setAvatarConfig(prev => ({ ...prev, roupa: roupa.id }))}
                              className={`aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                                avatarConfig.roupa === roupa.id
                                  ? 'border-[#27b99a] shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image
                                src={roupa.imageUrl}
                                alt="Roupa"
                                width={60}
                                height={60}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
