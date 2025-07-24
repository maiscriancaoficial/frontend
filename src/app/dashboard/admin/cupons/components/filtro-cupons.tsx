'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, SortAsc } from "lucide-react";

interface FiltroCuponsProps {
  onBuscar: (termo: string) => void;
}

export function FiltroCupons({ onBuscar }: FiltroCuponsProps) {
  const [termoBusca, setTermoBusca] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(termoBusca);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <form onSubmit={handleSubmit}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar cupons..."
            className="pl-9 rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </form>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-[10px] border-gray-200 dark:border-gray-700">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" className="h-10 rounded-[10px] border-gray-200 dark:border-gray-700">
            <SortAsc className="h-4 w-4 mr-2" />
            Expiração
          </Button>
          
          <Button variant="outline" size="sm" className="h-10 rounded-[10px] border-gray-200 dark:border-gray-700">
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
