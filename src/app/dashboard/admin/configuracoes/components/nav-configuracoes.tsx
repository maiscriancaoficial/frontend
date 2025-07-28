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
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-2xl flex items-center mb-1 transition-all duration-300
              ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#27b99a]/10 to-[#ff0080]/10 text-[#27b99a] font-medium border border-[#27b99a]/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
          >
            <tab.icon 
              className={`mr-3 h-5 w-5 ${
                activeTab === tab.id 
                  ? 'text-[#27b99a]' 
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
