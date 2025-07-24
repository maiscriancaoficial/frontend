'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortAsc } from "lucide-react";

export function FiltroFretes() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end justify-between mb-6">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Buscar opções de frete..."
          className="pl-9 rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="R$"
            className="w-20 rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
          />
          <span className="text-sm text-muted-foreground">até</span>
          <Input
            type="number"
            placeholder="R$"
            className="w-20 rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
          />
        </div>
        
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-[10px] border-gray-200 dark:border-gray-700">
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" className="h-10 rounded-[10px] border-gray-200 dark:border-gray-700">
          <SortAsc className="h-4 w-4 mr-2" />
          Tipo
        </Button>
        
        <Button variant="outline" size="sm" className="h-10 rounded-[10px] border-gray-200 dark:border-gray-700">
          Exportar
        </Button>
      </div>
    </div>
  );
}
