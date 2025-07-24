'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Download, X, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CategoriaDados } from '../page';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Label } from '@/components/ui/label';

interface FiltroBlogProps {
  onBuscar: (termo: string) => void;
  onCategoriaChange: (categoriaId: string) => void;
  categorias: CategoriaDados[];
  categoriaAtual: string;
}

export function FiltroBlog({ onBuscar, onCategoriaChange, categorias, categoriaAtual }: FiltroBlogProps) {
  const [termoBusca, setTermoBusca] = useState('');
  const [status, setStatus] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const handleBusca = () => {
    onBuscar(termoBusca);
  };

  const limparFiltros = () => {
    setTermoBusca('');
    onCategoriaChange('todas');
    setStatus('');
    setDataInicio(undefined);
    setDataFim(undefined);
    onBuscar('');
  };

  // Formatação de data
  const formatarData = (date?: Date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4 mb-6">
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca por termo */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="pl-9 rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                placeholder="Buscar por título, conteúdo ou autor..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
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

            {/* Seletor de categoria */}
            <div className="w-full md:w-64 xl:w-72">
              <Select value={categoriaAtual} onValueChange={onCategoriaChange}>
                <SelectTrigger 
                  className="rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botões de filtro e exportação */}
            <div className="flex items-center space-x-2">
              {/* Botão de filtro avançado */}
              <Popover open={filtrosAbertos} onOpenChange={setFiltrosAbertos}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Filtros avançados</h4>
                    
                    {/* Status da postagem */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status da postagem</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="w-full rounded-lg">
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="rascunho">Rascunho</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Data de publicação */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium">Data de publicação</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Data inicial</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                size="sm"
                                className={cn(
                                  "w-full justify-start text-left text-xs font-normal rounded-lg",
                                  !dataInicio && "text-gray-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {dataInicio ? formatarData(dataInicio) : "Selecionar data"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={dataInicio}
                                onSelect={setDataInicio}
                                initialFocus
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Data final</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                size="sm"
                                className={cn(
                                  "w-full justify-start text-left text-xs font-normal rounded-lg",
                                  !dataFim && "text-gray-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {dataFim ? formatarData(dataFim) : "Selecionar data"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <Calendar
                                mode="single"
                                selected={dataFim}
                                onSelect={setDataFim}
                                initialFocus
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4 space-x-2">
                      <Button variant="outline" size="sm" onClick={limparFiltros} className="rounded-full">
                        Limpar Filtros
                      </Button>
                      <Button size="sm" onClick={handleBusca} className="rounded-full bg-[#27b99a] hover:bg-[#239d84] text-white">
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Botão de exportar */}
              <Button 
                variant="outline"
                size="sm"
                className="rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              
              {/* Botão de busca - visível apenas em telas menores */}
              <Button 
                className="md:hidden rounded-full bg-[#27b99a] hover:bg-[#239d84] text-white"
                onClick={handleBusca}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
