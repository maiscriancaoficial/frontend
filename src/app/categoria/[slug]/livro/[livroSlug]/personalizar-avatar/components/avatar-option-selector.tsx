'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarOptionSelectorProps {
  title: string;
  options: Array<{
    id: string;
    imageUrl: string;
    label?: string;
  }>;
  selectedOption: string | undefined;
  onSelect: (optionId: string) => void;
}

export function AvatarOptionSelector({
  title,
  options,
  selectedOption,
  onSelect
}: AvatarOptionSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-base mb-2 text-gray-700">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-full border-2 overflow-hidden",
              selectedOption === option.id
                ? "border-[#ff0080] ring-2 ring-[#ff0080]/30" 
                : "border-gray-200 hover:border-[#27b99a]/50"
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src={option.imageUrl}
                alt={option.label || option.id}
                fill
                className="object-cover"
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
