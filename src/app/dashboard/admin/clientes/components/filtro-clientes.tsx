'use client';

import { useState } from 'react';
import { Search, Filter, RefreshCw, Download, BadgeCheck, UserX, Crown, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FiltroClientesProps {
  onBuscar: (termo: string) => void;
  onStatusChange: (status: 'todos' | 'ativos' | 'inativos' | 'premium' | 'verificados') => void;
  statusAtual: 'todos' | 'ativos' | 'inativos' | 'premium' | 'verificados';
  estatisticas: {
    total: number;
    ativos: number;
    inativos: number;
    verificados: number;
    premium: number;
  };
}

export function FiltroClientes({ onBuscar, onStatusChange, statusAtual, estatisticas }: FiltroClientesProps) {
  const [termoBusca, setTermoBusca] = useState('');

  const handleBusca = () => {
    onBuscar(termoBusca);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBusca();
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-teal-500" />
          </div>
          <Input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            className="pl-10 border-teal-200 dark:border-teal-800 focus:border-teal-400 focus:ring-teal-400 rounded-[12px]"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={handleBusca}
                  className="border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-[12px]"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar resultados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={() => {
                    setTermoBusca('');
                    onBuscar('');
                    onStatusChange('todos');
                  }}
                  className="border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-[12px]"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Limpar filtros</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-[12px]"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar clientes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Filtros por status */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange('todos')}
          className={`rounded-full px-4 ${
            statusAtual === 'todos'
              ? 'bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-800/30 dark:text-teal-300'
              : 'text-gray-600 hover:bg-teal-50 dark:text-gray-300 dark:hover:bg-teal-900/20'
          }`}
        >
          <User size={14} className="mr-1" />
          <span>Todos</span>
          <Badge variant="secondary" className="ml-2 bg-teal-200/50 text-teal-800 dark:bg-teal-800/50 dark:text-teal-300">{estatisticas.total}</Badge>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange('ativos')}
          className={`rounded-full px-4 ${
            statusAtual === 'ativos'
              ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/30 dark:text-green-300'
              : 'text-gray-600 hover:bg-green-50 dark:text-gray-300 dark:hover:bg-green-900/20'
          }`}
        >
          <BadgeCheck size={14} className="mr-1" />
          <span>Ativos</span>
          <Badge variant="secondary" className="ml-2 bg-green-200/50 text-green-800 dark:bg-green-800/50 dark:text-green-300">{estatisticas.ativos}</Badge>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange('inativos')}
          className={`rounded-full px-4 ${
            statusAtual === 'inativos'
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
        >
          <UserX size={14} className="mr-1" />
          <span>Inativos</span>
          <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{estatisticas.inativos}</Badge>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange('verificados')}
          className={`rounded-full px-4 ${
            statusAtual === 'verificados'
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-300'
              : 'text-gray-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20'
          }`}
        >
          <BadgeCheck size={14} className="mr-1" />
          <span>Verificados</span>
          <Badge variant="secondary" className="ml-2 bg-blue-200/50 text-blue-800 dark:bg-blue-800/50 dark:text-blue-300">{estatisticas.verificados}</Badge>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange('premium')}
          className={`rounded-full px-4 ${
            statusAtual === 'premium'
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/30 dark:text-amber-300'
              : 'text-gray-600 hover:bg-amber-50 dark:text-gray-300 dark:hover:bg-amber-900/20'
          }`}
        >
          <Crown size={14} className="mr-1" />
          <span>Premium</span>
          <Badge variant="secondary" className="ml-2 bg-amber-200/50 text-amber-800 dark:bg-amber-800/50 dark:text-amber-300">{estatisticas.premium}</Badge>
        </Button>
      </div>
    </div>
  );
}
