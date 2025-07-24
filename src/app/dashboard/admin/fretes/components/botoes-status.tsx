'use client';

import { Button } from "@/components/ui/button";

interface BotoesStatusProps {
  statusAtivo: 'todos' | 'ativos' | 'inativos';
  onStatusChange: (status: 'todos' | 'ativos' | 'inativos') => void;
  contadores: {
    todos: number;
    ativos: number;
    inativos: number;
  };
}

export function BotoesStatus({ statusAtivo, onStatusChange, contadores }: BotoesStatusProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={statusAtivo === 'todos' ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange('todos')}
        className={`px-4 py-2 text-sm ${statusAtivo === 'todos' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'} hover:bg-gray-100 transition-colors rounded-l-[10px]`}
      >
        Todos
      </Button>
      
      <Button
        variant={statusAtivo === 'ativos' ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange('ativos')}
        className={`px-4 py-2 text-sm ${statusAtivo === 'ativos' ? 'bg-primary text-white' : 'bg-white text-gray-600 border-y border-r border-gray-200'} hover:bg-gray-100 transition-colors`}
      >
        Ativos
      </Button>
      
      <Button
        variant={statusAtivo === 'inativos' ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange('inativos')}
        className={`px-4 py-2 text-sm ${statusAtivo === 'inativos' ? 'bg-primary text-white' : 'bg-white text-gray-600 border-y border-r border-gray-200'} hover:bg-gray-100 transition-colors rounded-r-[10px]`}
      >
        Inativos
      </Button>
    </div>
  );
}
