'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, X, Tags, Tag, FolderTree } from "lucide-react";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Interfaces
interface Categoria {
  id: string;
  titulo: string;
  slug: string;
}

interface Tag {
  id: string;
  nome: string;
  slug: string;
}

interface CategoriasTagsFormProps {
  formData: any;
  atualizarFormData: (data: any) => void;
}

export function CategoriasTagsForm({ formData, atualizarFormData }: CategoriasTagsFormProps) {
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [categoriaBusca, setCategoriaBusca] = useState('');
  const [novaTag, setNovaTag] = useState("");
  const [isCarregando, setIsCarregando] = useState(false);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  
  // Carregar categorias da API
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const response = await fetch('/api/categorias');
        const data = await response.json();
        if (data.success) {
          setCategoriasDisponiveis(data.categorias);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    
    carregarCategorias();
  }, []);
  
  // Carregar tags da API
  useEffect(() => {
    const carregarTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        if (data.success) {
          setTagsDisponiveis(data.tags);
        }
      } catch (error) {
        console.error('Erro ao carregar tags:', error);
      }
    };
    
    carregarTags();
  }, []);
  
  // Filtrar as categorias com base na busca
  const categoriasFiltradas = categoriaBusca
    ? categoriasDisponiveis.filter(cat => 
        cat.titulo.toLowerCase().includes(categoriaBusca.toLowerCase())
      )
    : categoriasDisponiveis;
  
  // Função para adicionar categoria
  const adicionarCategoria = (categoria: Categoria) => {
    // Verificar se a categoria já está adicionada
    if (!formData.categorias?.some((cat: any) => cat.id === categoria.id)) {
      atualizarFormData({
        categorias: [...(formData.categorias || []), { id: categoria.id, nome: categoria.titulo }]
      });
    }
    
    setCategoriaOpen(false);
  };
  
  // Função para remover categoria
  const removerCategoria = (id: string) => {
    atualizarFormData({
      categorias: formData.categorias?.filter((cat: any) => cat.id !== id) || []
    });
  };
  
  // Função para adicionar tag
  const adicionarTag = (tag: Tag | { id: string, nome: string }) => {
    // Verificar se a tag já está adicionada
    if (!formData.tags?.some((t: any) => t.id === tag.id)) {
      atualizarFormData({
        tags: [...(formData.tags || []), { id: tag.id, nome: tag.nome }]
      });
    }
  };
  
  // Função para criar e adicionar uma nova tag
  const criarNovaTag = async () => {
    if (!novaTag.trim()) return;
    
    setIsCarregando(true);
    
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: novaTag.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Adicionar a nova tag criada
        adicionarTag(data.tag);
        
        // Atualizar a lista de tags disponíveis
        setTagsDisponiveis(prev => [...prev, data.tag]);
        
        // Limpar o input
        setNovaTag('');
      } else {
        console.error('Erro ao criar tag:', data.error);
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    } finally {
      setIsCarregando(false);
    }
  };
  
  // Função para remover tag
  const removerTag = (id: string) => {
    atualizarFormData({
      tags: formData.tags?.filter((tag: any) => tag.id !== id) || []
    });
  };
  
  // Manipular entrada de tag pelo teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      criarNovaTag();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Categorias e Tags</h3>
      
      <Card className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6 space-y-6">
          {/* Categorias */}
          <div className="space-y-3">
            <div className="flex items-center">
              <FolderTree className="h-4 w-4 mr-2 text-gray-500" />
              <Label htmlFor="categorias" className="text-base">Categorias</Label>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.categorias?.map((categoria: any) => (
                <Badge 
                  key={categoria.id} 
                  variant="outline"
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800 pl-3"
                >
                  {categoria.nome}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-5 w-5 p-0 ml-1 hover:bg-blue-200/50 dark:hover:bg-blue-800/50 rounded-full"
                    onClick={() => removerCategoria(categoria.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              
              {(!formData.categorias || formData.categorias.length === 0) && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhuma categoria selecionada
                </div>
              )}
            </div>
            
            <Popover open={categoriaOpen} onOpenChange={setCategoriaOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left bg-white dark:bg-gray-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Categoria
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full" align="start">
                <Command>
                  <CommandInput
                    placeholder="Buscar categoria..."
                    value={categoriaBusca}
                    onValueChange={setCategoriaBusca}
                    className="border-none focus:ring-0"
                  />
                  <CommandList>
                    <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-60">
                        {categoriasFiltradas.map((categoria) => (
                          <CommandItem
                            key={categoria.id}
                            onSelect={() => adicionarCategoria(categoria)}
                            className="cursor-pointer"
                          >
                            {categoria.titulo}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-800 my-4"></div>
          
          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center">
              <Tags className="h-4 w-4 mr-2 text-gray-500" />
              <Label htmlFor="tags" className="text-base">Tags</Label>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map((tag: any) => (
                <Badge 
                  key={tag.id} 
                  variant="outline"
                  className="flex items-center gap-1 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400 dark:hover:bg-violet-900/50 border-violet-200 dark:border-violet-800 pl-3"
                >
                  {tag.nome}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-5 w-5 p-0 ml-1 hover:bg-violet-200/50 dark:hover:bg-violet-800/50 rounded-full"
                    onClick={() => removerTag(tag.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              
              {(!formData.tags || formData.tags.length === 0) && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhuma tag adicionada
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Digite uma tag e pressione Enter"
                  value={novaTag}
                  onChange={(e) => setNovaTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9 pr-20"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-xs"
                  onClick={criarNovaTag}
                  disabled={!novaTag.trim() || isCarregando}
                >
                  {isCarregando ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Tags disponíveis */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Tags disponíveis:</h4>
              <div className="flex flex-wrap gap-1">
                {tagsDisponiveis.slice(0, 10).map((tag: Tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="outline"
                    className={cn(
                      "cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700",
                      formData.tags?.some((t: any) => t.id === tag.id) && "opacity-40 pointer-events-none"
                    )}
                    onClick={() => adicionarTag(tag)}
                  >
                    {tag.nome}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
