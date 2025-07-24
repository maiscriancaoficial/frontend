'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface FiltroAfiliadosProps {
  totalAtivos: number;
  totalInativos: number;
  totalPendentes: number;
  onFiltrar: (filtro: string, valor: string) => void;
  onLimpar: () => void;
  onExportar: () => void;
}

export function FiltroAfiliados({
  totalAtivos,
  totalInativos,
  totalPendentes,
  onFiltrar,
  onLimpar,
  onExportar,
}: FiltroAfiliadosProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4 border-0">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#27b99a] h-4 w-4" />
          <Input 
            placeholder="Buscar por nome, email ou código"
            className="pl-10 border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] rounded-2xl"
            onChange={(e) => onFiltrar('busca', e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onExportar()}
            variant="outline" 
            className="border-[#27b99a] text-[#27b99a] hover:bg-[#27b99a] hover:text-white rounded-2xl transition-all duration-300"
          >
            Exportar
          </Button>
          <Button
            onClick={() => onLimpar()}
            variant="outline" 
            className="border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300"
          >
            Limpar
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => onFiltrar('status', 'todos')}
          variant="ghost"
          className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl transition-all duration-300 hover:shadow-md"
        >
          Todos
          <Badge className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl border-0">
            {totalAtivos + totalInativos + totalPendentes}
          </Badge>
        </Button>
        
        <Button
          onClick={() => onFiltrar('status', 'ativo')}
          variant="ghost"
          className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-400 rounded-2xl transition-all duration-300 hover:shadow-md"
        >
          Ativos
          <Badge className="ml-2 bg-green-200 dark:bg-green-800/50 text-green-700 dark:text-green-400 rounded-xl border-0">
            {totalAtivos}
          </Badge>
        </Button>
        
        <Button
          onClick={() => onFiltrar('status', 'inativo')}
          variant="ghost"
          className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 rounded-2xl transition-all duration-300 hover:shadow-md"
        >
          Inativos
          <Badge className="ml-2 bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-400 rounded-xl border-0">
            {totalInativos}
          </Badge>
        </Button>
        
        <Button
          onClick={() => onFiltrar('status', 'pendente')}
          variant="ghost"
          className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-400 rounded-2xl transition-all duration-300 hover:shadow-md"
        >
          Pendentes
          <Badge className="ml-2 bg-orange-200 dark:bg-orange-800/50 text-orange-700 dark:text-orange-400 rounded-xl border-0">
            {totalPendentes}
          </Badge>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
          <Button
            onClick={() => onFiltrar('comissao', 'alta')}
            variant="outline"
            className="text-[#27b99a] border-[#27b99a] hover:bg-[#27b99a] hover:text-white rounded-2xl transition-all duration-300 hover:shadow-md"
          >
            Maior Comissão
          </Button>
          <Button
            onClick={() => onFiltrar('vendas', 'alta')}
            variant="outline"
            className="text-[#ff0080] border-[#ff0080] hover:bg-[#ff0080] hover:text-white rounded-2xl transition-all duration-300 hover:shadow-md"
          >
            Mais Vendas
          </Button>
          <Button
            onClick={() => onFiltrar('data', 'recente')}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300 hover:shadow-md"
          >
            Mais Recentes
          </Button>
          <Button
            onClick={() => onFiltrar('cliques', 'alta')}
            variant="outline"
            className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white rounded-2xl transition-all duration-300 hover:shadow-md"
          >
            Mais Cliques
          </Button>
        </div>
      </div>
    </div>
  );
}
