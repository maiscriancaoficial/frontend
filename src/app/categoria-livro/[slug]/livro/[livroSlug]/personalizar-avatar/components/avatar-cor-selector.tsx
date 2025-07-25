'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarCorSelectorProps {
  title: string;
  colors: Array<{
    id: string;
    colorValue: string;
    label?: string;
  }>;
  selectedColor: string | undefined;
  onSelect: (colorId: string) => void;
}

export function AvatarCorSelector({
  title,
  colors,
  selectedColor,
  onSelect
}: AvatarCorSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-base mb-2 text-gray-700">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <motion.button
            key={color.id}
            onClick={() => onSelect(color.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-8 h-8 rounded-full",
              selectedColor === color.id
                ? "ring-2 ring-offset-2 ring-[#ff0080]"
                : "hover:ring-1 hover:ring-offset-1 hover:ring-[#27b99a]"
            )}
            style={{ backgroundColor: color.colorValue }}
            title={color.label || color.id}
          />
        ))}
      </div>
    </div>
  );
}
