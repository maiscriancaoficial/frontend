'use client';

import { AvatarConfig } from "../types";

// Função para salvar o avatar personalizado
export async function salvarAvatarPersonalizado(livroId: string, avatarConfig: AvatarConfig): Promise<boolean> {
  try {
    const response = await fetch('/api/avatar/personalizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        livroId,
        avatarConfig,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar o avatar');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Erro ao salvar avatar:', error);
    return false;
  }
}

// Dados de exemplo para as opções de avatar
// Em um ambiente de produção, essas informações viriam da API
export const getAvatarOptions = () => {
  return {
    peles: [
      { id: 'clara', imageUrl: '/avatares/pele/clara.png' },
      { id: 'media', imageUrl: '/avatares/pele/media.png' },
      { id: 'morena', imageUrl: '/avatares/pele/morena.png' },
      { id: 'negra', imageUrl: '/avatares/pele/negra.png' },
    ],
    olhos: [
      { id: 'azul', imageUrl: '/avatares/olhos/azul.png' },
      { id: 'verde', imageUrl: '/avatares/olhos/verde.png' },
      { id: 'castanho', imageUrl: '/avatares/olhos/castanho.png' },
      { id: 'preto', imageUrl: '/avatares/olhos/preto.png' },
    ],
    cabelos: [
      { id: 'liso', imageUrl: '/avatares/cabelo/liso.png' },
      { id: 'cacheado', imageUrl: '/avatares/cabelo/cacheado.png' },
      { id: 'crespo', imageUrl: '/avatares/cabelo/crespo.png' },
      { id: 'ondulado', imageUrl: '/avatares/cabelo/ondulado.png' },
    ],
    roupas: [
      { id: 'camiseta', imageUrl: '/avatares/roupa/camiseta.png' },
      { id: 'vestido', imageUrl: '/avatares/roupa/vestido.png' },
      { id: 'camisa', imageUrl: '/avatares/roupa/camisa.png' },
      { id: 'blusa', imageUrl: '/avatares/roupa/blusa.png' },
    ],
    shorts: [
      { id: 'shorts', imageUrl: '/avatares/shorts/shorts.png' },
      { id: 'calca', imageUrl: '/avatares/shorts/calca.png' },
      { id: 'saia', imageUrl: '/avatares/shorts/saia.png' },
    ],
    oculos: [
      { id: 'redondo', imageUrl: '/avatares/oculos/redondo.png' },
      { id: 'quadrado', imageUrl: '/avatares/oculos/quadrado.png' },
      { id: 'sol', imageUrl: '/avatares/oculos/sol.png' },
    ],
    chapeus: [
      { id: 'chapeu1', imageUrl: '/avatares/chapeu/chapeu1.png' },
      { id: 'chapeu2', imageUrl: '/avatares/chapeu/chapeu2.png' },
    ],
    bones: [
      { id: 'bone1', imageUrl: '/avatares/bone/bone1.png' },
      { id: 'bone2', imageUrl: '/avatares/bone/bone2.png' },
    ],
    coresCabelo: [
      { id: 'preto', colorValue: '#000000', label: 'Preto' },
      { id: 'castanho', colorValue: '#654321', label: 'Castanho' },
      { id: 'loiro', colorValue: '#FFD700', label: 'Loiro' },
      { id: 'ruivo', colorValue: '#B22222', label: 'Ruivo' },
      { id: 'rosa', colorValue: '#FF69B4', label: 'Rosa' },
      { id: 'azul', colorValue: '#1E90FF', label: 'Azul' },
    ],
    coresRoupa: [
      { id: 'azul', colorValue: '#1E90FF', label: 'Azul' },
      { id: 'rosa', colorValue: '#FF69B4', label: 'Rosa' },
      { id: 'verde', colorValue: '#32CD32', label: 'Verde' },
      { id: 'vermelho', colorValue: '#DC143C', label: 'Vermelho' },
      { id: 'amarelo', colorValue: '#FFD700', label: 'Amarelo' },
      { id: 'roxo', colorValue: '#8A2BE2', label: 'Roxo' },
    ],
    // Adicionando as propriedades faltantes
    tipos: ['menino', 'menina'],
    aderecos: [
      { id: 'adereco1', imageUrl: '/avatares/aderecos/adereco1.png' },
      { id: 'adereco2', imageUrl: '/avatares/aderecos/adereco2.png' },
    ],
  };
};
