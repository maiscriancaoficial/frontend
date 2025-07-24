'use client';

import { useState } from 'react';
import { NavConfiguracoes } from './components/nav-configuracoes';
import { ConfigGeraisTab } from './components/config-gerais-tab';
import { ConfigPerfilTab } from './components/config-perfil-tab';
import { ConfigAparenciaTab } from './components/config-aparencia-tab';
import { ConfigSeoTab } from './components/config-seo-tab';
import { ConfigNotificacoesTab } from './components/config-notificacoes-tab';
import { ConfigPagamentosTab } from './components/config-pagamentos-tab';
import { Settings, Save } from 'lucide-react';

export default function AdminConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('gerais');

  // Renderização dinâmica da aba ativa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'gerais':
        return <ConfigGeraisTab />;
      case 'perfil':
        return <ConfigPerfilTab />;
      case 'aparencia':
        return <ConfigAparenciaTab />;
      case 'seo':
        return <ConfigSeoTab />;
      case 'notificacoes':
        return <ConfigNotificacoesTab />;
      case 'pagamentos':
        return <ConfigPagamentosTab />;
      // Outras abas serão implementadas posteriormente
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-900 rounded-[20px] shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Esta seção será implementada em breve!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-pink-800 dark:text-pink-300">
          Configurações
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Personalize as configurações do seu site e conta de administrador
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Menu lateral */}
        <div className="md:col-span-1">
          <NavConfiguracoes activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Conteúdo principal */}
        <div className="md:col-span-3">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}
