'use client';

import { useState } from 'react';
import { 
  Globe, 
  Palette, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Image, 
  Type, 
  ToggleLeft, 
  Store 
} from 'lucide-react';

interface NavConfiguracoesProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavConfiguracoes({ activeTab, onTabChange }: NavConfiguracoesProps) {
  const tabs = [
    {
      id: 'gerais',
      label: 'Gerais',
      icon: Settings,
    },
    {
      id: 'perfil',
      label: 'Perfil Admin',
      icon: ShieldCheck,
    },
    {
      id: 'aparencia',
      label: 'Aparência',
      icon: Palette,
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: Globe,
    },
    {
      id: 'media',
      label: 'Mídia e Uploads',
      icon: Image,
    },
    {
      id: 'notificacoes',
      label: 'Notificações',
      icon: Bell,
    },
    {
      id: 'fontes',
      label: 'Fontes e Tipografia',
      icon: Type,
    },
    {
      id: 'loja',
      label: 'Status da Loja',
      icon: Store,
    },
    {
      id: 'modos',
      label: 'Modos de Exibição',
      icon: ToggleLeft,
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[20px] shadow-md overflow-hidden">
      <div className="p-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-[10px] flex items-center mb-1 transition-colors
              ${
                activeTab === tab.id
                  ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
          >
            <tab.icon 
              className={`mr-3 h-5 w-5 ${
                activeTab === tab.id 
                  ? 'text-pink-500 dark:text-pink-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} 
            />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
