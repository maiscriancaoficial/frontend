'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarTipoSelectorProps {
  selectedTipo: string;
  onSelect: (tipo: string) => void;
}

export function AvatarTipoSelector({ selectedTipo, onSelect }: AvatarTipoSelectorProps) {
  return (
    <div className="flex items-center justify-center mb-6 gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('menino')}
        className={cn(
          "py-3 px-6 rounded-full flex items-center justify-center transition-all duration-200",
          selectedTipo === 'menino'
            ? "bg-[#27b99a] text-white font-medium"
            : "bg-white border border-[#27b99a]/30 text-gray-700 hover:bg-[#27b99a]/10"
        )}
      >
        Menino
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('menina')}
        className={cn(
          "py-3 px-6 rounded-full flex items-center justify-center transition-all duration-200",
          selectedTipo === 'menina'
            ? "bg-[#ff0080] text-white font-medium"
            : "bg-white border border-[#ff0080]/30 text-gray-700 hover:bg-[#ff0080]/10"
        )}
      >
        Menina
      </motion.button>
    </div>
  );
}
