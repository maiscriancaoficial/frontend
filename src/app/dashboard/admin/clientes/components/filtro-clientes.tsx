'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal, Plus, UserPlus, BadgeCheck, UserX, Crown, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  onAdicionarCliente?: () => void;
}

export function FiltroClientes({ onBuscar, onStatusChange, statusAtual, estatisticas, onAdicionarCliente }: FiltroClientesProps) {
  const [termoBusca, setTermoBusca] = useState('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const aplicarFiltros = () => {
    onBuscar(termoBusca);
    setFiltrosAbertos(false);
  };

  const limparFiltros = () => {
    setTermoBusca('');
    setFiltroStatus('todos');
    onBuscar('');
    onStatusChange('todos');
  };

  return (
    <div className="space-y-4 mb-6">
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Busca por termo */}
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="pl-9 rounded-2xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 w-full focus:border-[#27b99a] focus:ring-[#27b99a]/20"
                placeholder="Buscar por nome, email ou telefone..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
              />
              {termoBusca && (
                <button
                  onClick={() => setTermoBusca('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Botão de filtros avançados */}
            <Popover open={filtrosAbertos} onOpenChange={setFiltrosAbertos}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-2xl border-gray-300 hover:border-[#27b99a] hover:text-[#27b99a] gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros Avançados</span>
                  <span className="inline sm:hidden">Filtros</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Filtros Avançados</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Status do Cliente</label>
                      <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                        <SelectTrigger className="h-8 text-sm rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="todos">Todos os clientes</SelectItem>
                          <SelectItem value="ativos">Ativos</SelectItem>
                          <SelectItem value="inativos">Inativos</SelectItem>
                          <SelectItem value="verificados">Verificados</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 space-x-2">
                    <Button variant="outline" size="sm" onClick={limparFiltros} className="rounded-2xl border-gray-300 hover:border-[#ff0080] hover:text-[#ff0080] transition-all duration-300">
                      Limpar Filtros
                    </Button>
                    <Button size="sm" onClick={aplicarFiltros} className="rounded-2xl bg-[#27b99a] hover:bg-[#22a085] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Botão de busca - visível apenas em telas menores */}
            <Button className="md:hidden rounded-full" onClick={aplicarFiltros}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            
            {/* Botão de adicionar cliente */}
            {onAdicionarCliente && (
              <Button 
                className="rounded-2xl bg-[#ff0080] hover:bg-[#e6006b] text-white gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={onAdicionarCliente}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Cliente</span>
                <span className="inline sm:hidden">Adicionar</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Filtros por status - badges */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange('todos')}
          className={`rounded-full px-4 ${
            statusAtual === 'todos'
              ? 'bg-[#27b99a]/10 text-[#27b99a] border-[#27b99a]/20'
              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900/20'
          }`}
        >
          <User size={14} className="mr-1" />
          <span>Todos</span>
          <Badge variant="secondary" className="ml-2 bg-[#27b99a]/20 text-[#27b99a]">{estatisticas.total}</Badge>
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
