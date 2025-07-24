'use client';

import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import * as adventurerMale from '@dicebear/adventurer';
import * as adventurerFemale from '@dicebear/adventurer-neutral';
import * as avataaars from '@dicebear/avataaars';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface AvatarFallbackProps {
  tipo?: 'menino' | 'menina';
  name?: string;
  className?: string;
  width?: number;
  height?: number;
}

interface ItemFallbackProps {
  itemType: 'cabelo' | 'roupa' | 'olhos' | 'pele' | 'acessorio';
  itemId?: string;
  className?: string;
  width?: number;
  height?: number;
}

// Componente para fallback do avatar completo
export function AvatarFallback({ 
  tipo = 'menino', 
  name = 'avatar', 
  className = '',
  width = 200,
  height = 200
}: AvatarFallbackProps) {
  const seed = useMemo(() => {
    return `${name}-${Math.floor(Math.random() * 1000)}`;
  }, [name]);

  const avatarSvg = useMemo(() => {
    if (tipo === 'menino') {
      return createAvatar(adventurerMale, {
        seed,
        backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf'],
        size: 128,
        scale: 90,
        flip: false,
        radius: 50
      }).toDataUri();
    } else {
      return createAvatar(adventurerFemale, {
        seed,
        backgroundColor: ['ffd5dc', 'ffdfbf', 'd1d4f9'],
        size: 128,
        scale: 90,
        flip: false,
        radius: 50
      }).toDataUri();
    }
  }, [tipo, seed]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="bg-gradient-to-b from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full p-2 border-2 border-white dark:border-gray-700 shadow-lg animate-pulse">
        <Image
          src={avatarSvg}
          alt={`Avatar ${tipo === 'menino' ? 'masculino' : 'feminino'}`}
          width={width}
          height={height}
          className="rounded-full animate-fadeIn"
          style={{
            objectFit: 'cover',
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        />
      </div>
    </div>
  );
}

// Componente para fallback de itens individuais de personalização
export function ItemFallback({
  itemType,
  itemId = 'default',
  className = '',
  width = 60,
  height = 60
}: ItemFallbackProps) {
  const seed = useMemo(() => {
    return `${itemType}-${itemId}-${Math.floor(Math.random() * 100)}`;
  }, [itemType, itemId]);

  // Configurações específicas para cada tipo de item
  const itemConfig = useMemo(() => {
    const options: Record<string, any> = {
      cabelo: {
        style: 'avataaars',
        options: {
          top: ['shortHair', 'longHair', 'eyepatch', 'hat', 'hijab', 'turban'],
          topColor: ['#000', '#a55728', '#e0ac69', '#f1c27d', '#ffdbac', '#4b4b4b']
        }
      },
      roupa: {
        style: 'avataaars',
        options: {
          clothing: ['blazer', 'sweater', 'hoodie', 'overall', 'shirtCrewNeck']
        }
      },
      olhos: {
        style: 'avataaars',
        options: {
          eyes: ['default', 'happy', 'squint', 'wink'],
          eyesColor: ['#4b4b4b', '#5883a0', '#76778b', '#a55728', '#b1e2fa']
        }
      },
      pele: {
        style: 'avataaars',
        options: {
          skinColor: ['#614335', '#ae5d29', '#d08b5b', '#edb98a', '#ffdbb4', '#fd9841']
        }
      },
      acessorio: {
        style: 'avataaars',
        options: {
          accessories: ['eyepatch', 'kurt', 'prescription01', 'prescription02', 'round', 'wayfarers']
        }
      }
    };
    
    return options[itemType] || options.cabelo;
  }, [itemType]);

  const itemSvg = useMemo(() => {
    return createAvatar(avataaars, {
      seed,
      size: 64,
      radius: 30,
      ...itemConfig.options
    }).toDataUri();
  }, [seed, itemConfig]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <Image
          src={itemSvg}
          alt={`${itemType} ${itemId}`}
          width={width}
          height={height}
          className="rounded-full"
        />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-white dark:border-gray-800 shadow-sm">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

// Componente para fallback de carregamento com animação
export function LoadingFallback({ message = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-tr from-[#27b99a]/20 to-[#f29798]/20 rounded-full animate-pulse p-4">
          <Loader2 className="h-12 w-12 text-[#27b99a] animate-spin" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#f29798] rounded-full animate-ping opacity-75" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-center mt-4 font-medium">{message}</p>
    </div>
  );
}

// Componente para fallback de imagem com estilo moderno
export function ImageFallback({ tipo = 'menino' as 'menino' | 'menina', small = false }) {
  const styles = small 
    ? 'w-20 h-20 text-sm' 
    : 'w-full h-full max-w-[240px] max-h-[240px]';

  return (
    <div className={`flex items-center justify-center ${styles}`}>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-pink-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl animate-pulse" />
        
        <AvatarFallback 
          tipo={tipo} 
          width={small ? 60 : 180} 
          height={small ? 60 : 180}
        />
        
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-0.5 rounded-full shadow-sm">
          Prévia em carregamento
        </div>
      </div>
    </div>
  );
}
