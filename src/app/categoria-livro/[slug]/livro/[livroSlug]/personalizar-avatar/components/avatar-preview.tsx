'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AvatarConfig } from '../types';

interface AvatarPreviewProps {
  config: AvatarConfig;
  fotoPrincipal?: string; // Foto principal vinda da API
}

export function AvatarPreview({ config, fotoPrincipal }: AvatarPreviewProps) {
  const [imageError, setImageError] = useState(false);
  
  // Se não há foto principal ou erro na imagem, mostra placeholder
  if (!fotoPrincipal || imageError) {
    return (
      <div className="relative flex items-center justify-center h-full">
        <div className="w-72 h-72 md:w-96 md:h-96 bg-gray-100 rounded-3xl flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">
            {config.tipo === 'menina' ? '👧' : '👦'}
          </div>
          <p className="text-gray-500 text-center">
            {config.nome || 'Personagem'}
          </p>
        </div>
      </div>
    );
  }
  
  // Mostrar foto principal do avatar
  return (
    <div className="relative flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-72 h-72 md:w-96 md:h-96"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image 
            src={fotoPrincipal}
            alt={`Avatar ${config.tipo} - ${config.nome || 'Personagem'}`}
            width={350}
            height={350}
            className="object-contain rounded-3xl shadow-lg"
            priority
            onError={() => setImageError(true)}
          />
        </div>
        
        {/* Overlay com nome do personagem */}
        {config.nome && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {config.nome}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
