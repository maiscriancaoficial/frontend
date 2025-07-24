'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Search, X, SlidersHorizontal, Plus, Settings } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

interface FiltrosProdutosProps {
  filtros: {
    busca?: string;
    categoria?: string;
    precoMin?: number;
    precoMax?: number;
    estoqueMin?: number;
    estoqueMax?: number;
    status?: boolean;
    emDestaque?: boolean;
  };
  onAtualizarFiltros: (filtros: any) => void;
  onAdicionarProduto: () => void;
  onGerenciarCategoriasTags?: () => void;
}

export function FiltrosProdutos({ filtros, onAtualizarFiltros, onAdicionarProduto, onGerenciarCategoriasTags }: FiltrosProdutosProps) {
  const [termoBusca, setTermoBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [preco, setPreco] = useState<{min: string, max: string}>({ min: "", max: "" });
  const [estoque, setEstoque] = useState<string>("todos");
  const [status, setStatus] = useState<string>("todos");
  const [emDestaque, setEmDestaque] = useState<boolean>(false);
  
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  // Função para aplicar os filtros
  const aplicarFiltros = () => {
    const novosFiltros = {
      busca: termoBusca,
      categoria: categoria || undefined,
      precoMin: preco.min ? parseFloat(preco.min) : undefined,
      precoMax: preco.max ? parseFloat(preco.max) : undefined,
      estoque: estoque !== "todos" ? estoque : undefined,
      status: status !== "todos" ? status === "ativo" : undefined,
      emDestaque
    };
    
    onAtualizarFiltros(novosFiltros);
    setFiltrosAbertos(false);
  };

  // Função para limpar os filtros
  const limparFiltros = () => {
    setTermoBusca("");
    setCategoria("");
    setPreco({ min: "", max: "" });
    setEstoque("todos");
    setStatus("todos");
    setEmDestaque(false);
    
    // Resetar todos os filtros
    onAtualizarFiltros({
      busca: "",
      categoria: undefined,
      precoMin: undefined,
      precoMax: undefined,
      estoque: undefined,
      status: undefined,
      emDestaque: undefined
    });
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
                placeholder="Buscar por título, SKU ou descrição..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
              />
              {termoBusca && (
                <button
                  onClick={() => setTermoBusca("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Botão de filtros avançados */}
            <Popover open={filtrosAbertos} onOpenChange={setFiltrosAbertos}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-2xl gap-2 border-gray-300 hover:border-[#27b99a] hover:text-[#27b99a] transition-all duration-300">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 bg-white dark:bg-gray-900 rounded-xl p-6" align="end">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium mb-4">Filtros Avançados</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger id="categoria" className="rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-white dark:bg-gray-900">
                        <SelectItem value="todas">Todas as categorias</SelectItem>
                        <SelectItem value="1">Buquês</SelectItem>
                        <SelectItem value="2">Arranjos</SelectItem>
                        <SelectItem value="3">Plantas</SelectItem>
                        <SelectItem value="4">Acessórios</SelectItem>
                        <SelectItem value="5">Cestas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Status de Estoque</Label>
                    <Select value={estoque} onValueChange={setEstoque}>
                      <SelectTrigger id="estoque" className="rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20">
                        <SelectValue placeholder="Status de estoque" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-white dark:bg-gray-900">
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="com_estoque">Com estoque</SelectItem>
                        <SelectItem value="sem_estoque">Sem estoque</SelectItem>
                        <SelectItem value="baixo_estoque">Estoque baixo (≤ 10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status do Produto</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status" className="rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20">
                        <SelectValue placeholder="Status do produto" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-white dark:bg-gray-900">
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full border-none">
                    <AccordionItem value="preco" className="border-b-0">
                      <AccordionTrigger className="py-2 text-sm">
                        Filtrar por preço
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="preco-minimo" className="text-xs">Preço Mínimo</Label>
                            <Input
                              id="preco-minimo"
                              type="number"
                              placeholder="R$ 0,00"
                              className="h-8 text-sm rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
                              value={preco.min}
                              onChange={(e) => setPreco({...preco, min: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="preco-maximo" className="text-xs">Preço Máximo</Label>
                            <Input
                              id="preco-maximo"
                              type="number"
                              placeholder="R$ 999,99"
                              className="h-8 text-sm rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
                              value={preco.max}
                              onChange={(e) => setPreco({...preco, max: e.target.value})}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Label htmlFor="em-destaque" className="cursor-pointer">Em destaque</Label>
                    <Switch
                      id="em-destaque"
                      checked={emDestaque}
                      onCheckedChange={setEmDestaque}
                    />
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
            
            {/* Botão de gerenciar categorias e tags */}
            <Button 
              variant="outline"
              className="rounded-2xl border-[#27b99a] text-[#27b99a] hover:bg-[#27b99a] hover:text-white gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={onGerenciarCategoriasTags}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Categorias & Tags</span>
              <span className="inline sm:hidden">Gerenciar</span>
            </Button>
            
            {/* Botão de adicionar produto */}
            <Button 
              className="rounded-2xl bg-[#ff0080] hover:bg-[#e6006b] text-white gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={onAdicionarProduto}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar Produto</span>
              <span className="inline sm:hidden">Adicionar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
