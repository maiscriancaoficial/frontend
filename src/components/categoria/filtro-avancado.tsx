'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Filter, X, Sliders, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FiltroAvancadoProps {
  filtros: {
    termo: string;
    precoMin: number;
    precoMax: number;
    categorias: string[];
    tags: string[];
    cores: string[];
    tamanhos: string[];
  };
  onFiltroChange: (filtro: any) => void;
  isOpen: boolean;
  onToggle: () => void;
  categorias: string[];
  tags: string[];
  cores: string[];
  tamanhos: string[];
}

export function FiltroAvancado({
  filtros,
  onFiltroChange,
  isOpen,
  onToggle,
  categorias,
  tags,
  cores,
  tamanhos,
}: FiltroAvancadoProps) {
  const [localFiltros, setLocalFiltros] = useState(filtros);
  const [precoRange, setPrecoRange] = useState([filtros.precoMin, filtros.precoMax]);

  useEffect(() => {
    setLocalFiltros(filtros);
    setPrecoRange([filtros.precoMin, filtros.precoMax]);
  }, [filtros]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFiltros({ ...localFiltros, [name]: value });
  };

  const handleSliderChange = (value: number[]) => {
    setPrecoRange(value);
    setLocalFiltros({
      ...localFiltros,
      precoMin: value[0],
      precoMax: value[1],
    });
  };

  const toggleItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleCheckboxChange = (category: string, item: string) => {
    const newArray = toggleItem(localFiltros[category as keyof typeof localFiltros] as string[], item);
    setLocalFiltros({
      ...localFiltros,
      [category]: newArray,
    });
  };

  const handleSearch = () => {
    onFiltroChange(localFiltros);
  };

  const limparFiltros = () => {
    const resetFiltros = {
      termo: '',
      precoMin: 0,
      precoMax: 1000,
      categorias: [],
      tags: [],
      cores: [],
      tamanhos: [],
    };
    setLocalFiltros(resetFiltros);
    setPrecoRange([0, 1000]);
    onFiltroChange(resetFiltros);
  };

  const countFiltrosAtivos = () => {
    let count = 0;
    if (localFiltros.termo) count++;
    if (localFiltros.precoMin > 0 || localFiltros.precoMax < 1000) count++;
    count += localFiltros.categorias.length;
    count += localFiltros.tags.length;
    count += localFiltros.cores.length;
    count += localFiltros.tamanhos.length;
    return count;
  };

  return (
    <>
      {/* Barra de busca sempre visível */}
      <div className="w-full sticky top-24 z-20 bg-white dark:bg-gray-900 mb-4 shadow-sm rounded-full overflow-hidden flex items-center border border-gray-200 dark:border-gray-800">
        <Button
          onClick={onToggle}
          variant="ghost"
          className="px-3 h-full rounded-l-full flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Filter className="h-4 w-4 text-[#27b99a]" />
          {countFiltrosAtivos() > 0 && (
            <Badge className="bg-[#ff0080] hover:bg-[#ff0080]/90 text-white">
              {countFiltrosAtivos()}
            </Badge>
          )}
        </Button>
        <div className="flex-1 flex items-center">
          <Search className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            name="termo"
            value={localFiltros.termo}
            onChange={(e) => {
              handleInputChange(e);
              if (!isOpen) onToggle(); // Auto expande o filtro quando digita
            }}
            placeholder="Buscar produtos..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Drawer de filtros - Lateral esquerdo */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80", 
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ transition: "opacity 0.3s ease" }}
        onClick={onToggle}
      />
      
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[85%] max-w-[350px] bg-white dark:bg-gray-900 shadow-xl transform transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Cabeçalho do drawer */}
          <div className="bg-gradient-to-r from-[#27b99a] to-[#27b99a]/90 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrar Produtos
            </h3>
            <Button variant="ghost" size="icon" onClick={onToggle} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Corpo do drawer com scroll */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">

              <Accordion type="multiple" className="w-full">
                {/* Preço */}
                <AccordionItem value="preco">
                  <AccordionTrigger className="text-sm font-medium py-3">
                    Faixa de Preço
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 pb-6">
                      <Slider
                        value={precoRange}
                        min={0}
                        max={1000}
                        step={10}
                        onValueChange={handleSliderChange}
                        className="my-6"
                      />
                      <div className="flex justify-between mt-2">
                        <div className="flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 mr-2 text-sm">
                            R$
                          </span>
                          <Input
                            type="number"
                            className="w-20 h-8"
                            value={precoRange[0]}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 0 && val <= precoRange[1]) {
                                setPrecoRange([val, precoRange[1]]);
                                setLocalFiltros({ ...localFiltros, precoMin: val });
                              }
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 mr-2 text-sm">
                            R$
                          </span>
                          <Input
                            type="number"
                            className="w-20 h-8"
                            value={precoRange[1]}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= precoRange[0] && val <= 1000) {
                                setPrecoRange([precoRange[0], val]);
                                setLocalFiltros({ ...localFiltros, precoMax: val });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Categorias */}
                {categorias.length > 0 && (
                  <AccordionItem value="categorias">
                    <AccordionTrigger className="text-sm font-medium py-3">
                      Categorias
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2 pt-2 pb-4">
                        {categorias.map((categoria) => (
                          <div key={categoria} className="flex items-center space-x-2">
                            <Checkbox
                              id={`categoria-${categoria}`}
                              checked={localFiltros.categorias.includes(categoria)}
                              onCheckedChange={() => handleCheckboxChange('categorias', categoria)}
                            />
                            <Label
                              htmlFor={`categoria-${categoria}`}
                              className="text-sm cursor-pointer"
                            >
                              {categoria}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <AccordionItem value="tags">
                    <AccordionTrigger className="text-sm font-medium py-3">
                      Ocasiões e Estilos
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pt-2 pb-4">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={localFiltros.tags.includes(tag) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              localFiltros.tags.includes(tag)
                                ? "bg-pink-500 hover:bg-pink-600"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => handleCheckboxChange('tags', tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Cores */}
                {cores.length > 0 && (
                  <AccordionItem value="cores" className="border-b border-gray-100 dark:border-gray-800">
                    <AccordionTrigger className="text-sm font-medium py-3 hover:text-[#27b99a] hover:no-underline">
                      Cores
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-3 pt-2 pb-4">
                        {cores.map((cor) => {
                          // Mapear nomes de cores para classes CSS
                          const corClass = {
                            Vermelho: 'bg-red-500',
                            Rosa: 'bg-pink-400',
                            Branco: 'bg-white border-2',
                            Azul: 'bg-blue-500',
                            Amarelo: 'bg-yellow-400',
                            Laranja: 'bg-orange-500',
                            Roxo: 'bg-purple-500',
                          }[cor] || 'bg-gray-300';

                          return (
                            <div
                              key={cor}
                              className="flex flex-col items-center gap-1 cursor-pointer"
                              onClick={() => handleCheckboxChange('cores', cor)}
                            >
                              <div
                                className={`w-8 h-8 rounded-full ${corClass} ${
                                  localFiltros.cores.includes(cor)
                                    ? 'ring-2 ring-[#27b99a] ring-offset-2'
                                    : ''
                                }`}
                              />
                              <span className="text-xs">{cor}</span>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Tamanhos */}
                {tamanhos.length > 0 && (
                  <AccordionItem value="tamanhos" className="border-b border-gray-100 dark:border-gray-800">
                    <AccordionTrigger className="text-sm font-medium py-3 hover:text-[#27b99a] hover:no-underline">
                      Tamanhos
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pt-2 pb-4">
                        {tamanhos.map((tamanho) => (
                          <Button
                            key={tamanho}
                            variant={localFiltros.tamanhos.includes(tamanho) ? "default" : "outline"}
                            size="sm"
                            className={`min-w-[70px] rounded-full ${
                              localFiltros.tamanhos.includes(tamanho)
                                ? "bg-[#ff0080] hover:bg-[#ff0080]/90 border-0"
                                : "border border-gray-200 hover:border-[#27b99a] dark:border-gray-700"
                            }`}
                            onClick={() => handleCheckboxChange('tamanhos', tamanho)}
                          >
                            {tamanho}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
          
          {/* Rodapé com ações */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-3">
            {countFiltrosAtivos() > 0 && (
              <Button
                onClick={limparFiltros}
                variant="outline"
                className="w-full border-[#27b99a] text-[#27b99a] hover:bg-[#27b99a]/10 rounded-full"
              >
                <X className="mr-2 h-4 w-4" />
                Limpar {countFiltrosAtivos()} filtros
              </Button>
            )}
            <Button
              onClick={handleSearch}
              className="w-full bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full"
            >
              <Search className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
