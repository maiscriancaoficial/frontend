'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ArrowUpDown, Download } from "lucide-react";

interface FiltroBannersProps {
  onBuscar: (termo: string) => void;
}

export function FiltroBanners({ onBuscar }: FiltroBannersProps) {
  const [termoBusca, setTermoBusca] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(termoBusca);
  };
  
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 rounded-[15px] shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <Input 
              placeholder="Buscar banners..."
              className="pl-10 rounded-[15px] bg-white dark:bg-gray-950 focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700 shadow-sm"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-[15px] border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="h-10 rounded-[15px] border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Ordenar
          </Button>
          
          <Button 
            variant="outline" 
            className="h-10 rounded-[15px] border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
