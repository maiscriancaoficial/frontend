'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AvatarConfig } from '../types';
import { AvatarFallback } from './avatar-fallbacks';

interface AvatarPreviewProps {
  config: AvatarConfig;
}

export function AvatarPreview({ config }: AvatarPreviewProps) {
  // Estados para controlar erros de carregamento de imagem
  const [baseImageError, setBaseImageError] = useState(false);
  const [olhosError, setOlhosError] = useState(false);
  const [cabeloError, setCabeloError] = useState(false);
  const [roupaError, setRoupaError] = useState(false);
  const [shortsError, setShortsError] = useState(false);
  const [oculosError, setOculosError] = useState(false);
  const [chapeuError, setChapeuError] = useState(false);
  
  // Se não há configuração de base ou se a base falhou ao carregar, mostra o fallback
  if (!config.pele || baseImageError) {
    return (
      <div className="relative flex items-center justify-center h-full">
        <AvatarFallback 
          tipo={(config.tipo === 'menino' || config.tipo === 'menina') ? config.tipo : 'menino'} 
          name={config.nome || 'avatar'} 
        />
      </div>
    );
  }
  
  return (
    <div className="relative flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-72 h-72 md:w-96 md:h-96"
      >
        {/* Base do avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image 
            src={`/avatares/pele/${config.pele}.png`}
            alt="Avatar base"
            width={350}
            height={350}
            className="object-contain"
            priority
            onError={() => setBaseImageError(true)}
          />
        </div>
        
        {/* Olhos */}
        {config.olhos && !olhosError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={`/avatares/olhos/${config.olhos}.png`}
              alt="Olhos do avatar"
              width={350}
              height={350}
              className="object-contain"
              onError={() => setOlhosError(true)}
            />
          </div>
        )}
        
        {/* Cabelo */}
        {config.cabelo && !cabeloError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={`/avatares/cabelo/${config.cabelo}.png`}
              alt="Cabelo do avatar"
              width={350}
              height={350}
              className="object-contain"
              onError={() => setCabeloError(true)}
            />
          </div>
        )}
        
        {/* Roupa */}
        {config.roupa && !roupaError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={`/avatares/roupa/${config.roupa}.png`}
              alt="Roupa do avatar"
              width={350}
              height={350}
              className="object-contain"
              onError={() => setRoupaError(true)}
            />
          </div>
        )}
        
        {/* Shorts/Calças */}
        {config.shorts && !shortsError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={`/avatares/shorts/${config.shorts}.png`}
              alt="Shorts/Calças do avatar"
              width={350}
              height={350}
              className="object-contain"
              onError={() => setShortsError(true)}
            />
          </div>
        )}
        
        {/* Óculos (opcional) */}
        {config.oculos && !oculosError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={`/avatares/oculos/${config.oculos}.png`}
              alt="Óculos do avatar"
              width={350}
              height={350}
              className="object-contain"
              onError={() => setOculosError(true)}
            />
          </div>
        )}
        
        {/* Chapéu (opcional) */}
        {config.chapeu && !chapeuError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={`/avatares/chapeu/${config.chapeu}.png`}
              alt="Chapéu do avatar"
              width={350}
              height={350}
              className="object-contain"
              onError={() => setChapeuError(true)}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
