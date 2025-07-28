'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Palette, User, Heart, Shirt, Eye, Sparkles } from 'lucide-react';
import { ItemCarrinho } from '@/services/carrinho-service';

interface DetalhesPersonalizacaoProps {
  item: ItemCarrinho;
}

export function DetalhesPersonalizacao({ item }: DetalhesPersonalizacaoProps) {
  if (!item.personalizacao) return null;

  const { personalizacao } = item;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-3xl border-[#ff0080]/20 bg-gradient-to-br from-[#ff0080]/5 to-[#ff0080]/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 bg-[#ff0080]/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#ff0080]" />
            </div>
            <div>
              <span className="text-[#ff0080]">Livro Personalizado</span>
              <p className="text-sm font-normal text-gray-600 mt-1">
                {item.produto.titulo}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Informações do Personagem */}
          <div className="bg-white/80 rounded-2xl p-4 border border-[#ff0080]/10">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-5 w-5 text-[#27b99a]" />
              <h4 className="font-semibold text-gray-900">Personagem</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nome</label>
                <p className="font-medium text-gray-900">{personalizacao.nomePersonagem}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Gênero</label>
                <Badge 
                  variant="outline" 
                  className={`mt-1 ${
                    personalizacao.genero === 'menino' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-pink-50 text-pink-700 border-pink-200'
                  }`}
                >
                  {personalizacao.genero === 'menino' ? '👦 Menino' : '👧 Menina'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Avatar Personalizado */}
          {personalizacao.avatar && (
            <div className="bg-white/80 rounded-2xl p-4 border border-[#ff0080]/10">
              <div className="flex items-center gap-3 mb-3">
                <Palette className="h-5 w-5 text-[#27b99a]" />
                <h4 className="font-semibold text-gray-900">Personalização do Avatar</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {personalizacao.avatar.pele && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-200 border border-gray-300"></div>
                    <span className="text-gray-600">Tom de pele selecionado</span>
                  </div>
                )}
                
                {personalizacao.avatar.cabelo && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-600 border border-gray-300"></div>
                    <span className="text-gray-600">Estilo de cabelo</span>
                  </div>
                )}
                
                {personalizacao.avatar.corCabelo && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: personalizacao.avatar.corCabelo }}
                    ></div>
                    <span className="text-gray-600">Cor do cabelo</span>
                  </div>
                )}
                
                {personalizacao.avatar.olhos && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Cor dos olhos</span>
                  </div>
                )}
                
                {personalizacao.avatar.roupa && (
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">Roupa selecionada</span>
                  </div>
                )}
                
                {personalizacao.avatar.corRoupa && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: personalizacao.avatar.corRoupa }}
                    ></div>
                    <span className="text-gray-600">Cor da roupa</span>
                  </div>
                )}
                
                {personalizacao.avatar.acessorios && personalizacao.avatar.acessorios.length > 0 && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-gray-600">Acessórios:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {personalizacao.avatar.acessorios.map((acessorio, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {acessorio}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="bg-gradient-to-r from-[#27b99a]/10 to-[#27b99a]/5 rounded-2xl p-4 border border-[#27b99a]/20">
            <div className="flex items-center justify-center gap-2 text-sm text-[#27b99a]">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">
                Este livro será criado especialmente para {personalizacao.nomePersonagem}!
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
