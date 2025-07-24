'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles, Wand2, PencilLine, KeyRound } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { generateProductContentClient } from "@/lib/deepseek-ai";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import slugify from "slugify";

interface InfoProdutoFormProps {
  formData: any;
  atualizarFormData: (data: any) => void;
}

export function InfoProdutoForm({ formData, atualizarFormData }: InfoProdutoFormProps) {
  const [isGenerating, setIsGenerating] = useState<{
    descricao?: boolean;
    descricaoLonga?: boolean;
    slug?: boolean;
    sku?: boolean;
  }>({});
  const [geracaoAtiva, setGeracaoAtiva] = useState<boolean>(false);
  
  // Toast já importado do sonner
  
  // Função para gerar slug automático com base no título
  const gerarSlug = () => {
    if (!formData.titulo) {
      toast.error("Por favor, preencha o título antes de gerar o slug");
      return;
    }
    
    const novoSlug = slugify(formData.titulo, {
      lower: true,
      strict: true,
      locale: 'pt'
    });
    
    atualizarFormData({ slug: novoSlug });
  };
  
  // Função para gerar descrição curta usando IA
  const gerarDescricao = async () => {
    if (!formData.titulo) {
      toast.error("Por favor, preencha o título antes de gerar a descrição");
      return;
    }
    
    try {
      setIsGenerating(prev => ({ ...prev, descricao: true }));
      
      const descricao = await generateProductContentClient({
        productName: formData.titulo,
        contentType: 'short',
        tone: 'professional',
        category: formData.categorias?.[0]?.nome
      });
      
      atualizarFormData({ descricao });
      toast.success("A descrição curta foi gerada com IA");
    } catch (error: any) {
      toast.error(`Erro ao gerar descrição: ${error.message}`);
    } finally {
      setIsGenerating(prev => ({ ...prev, descricao: false }));
    }
  };
  
  // Função para gerar descrição longa usando IA
  const gerarDescricaoLonga = async () => {
    if (!formData.titulo) {
      toast.error("Por favor, preencha o título antes de gerar a descrição completa");
      return;
    }
    
    try {
      setIsGenerating(prev => ({ ...prev, descricaoLonga: true }));
      
      const descricaoLonga = await generateProductContentClient({
        productName: formData.titulo,
        contentType: 'long',
        tone: 'enthusiastic',
        category: formData.categorias?.[0]?.nome
      });
      
      atualizarFormData({ descricaoLonga });
      toast.success("A descrição completa foi gerada com IA");
    } catch (error: any) {
      toast.error(`Erro ao gerar descrição completa: ${error.message}`);
    } finally {
      setIsGenerating(prev => ({ ...prev, descricaoLonga: false }));
    }
  };
  
  // Função para gerar SKU usando IA
  const gerarSKU = async () => {
    if (!formData.titulo) {
      toast.error("Por favor, preencha o título antes de gerar o SKU");
      return;
    }
    
    try {
      setIsGenerating(prev => ({ ...prev, sku: true }));
      
      const sku = await generateProductContentClient({
        productName: formData.titulo,
        contentType: 'sku',
        category: formData.categorias?.[0]?.nome
      });
      
      atualizarFormData({ sku });
      toast.success("O código SKU foi gerado com IA");
    } catch (error: any) {
      toast.error(`Erro ao gerar SKU: ${error.message}`);
    } finally {
      setIsGenerating(prev => ({ ...prev, sku: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Informações Básicas</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Geração com IA</span>
          <Switch
            checked={geracaoAtiva}
            onCheckedChange={setGeracaoAtiva}
            className={cn(
              geracaoAtiva ? "bg-gradient-to-r from-blue-500 to-violet-500" : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        </div>
      </div>
      
      <Card className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6 space-y-5">
          {/* Título do Produto */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Produto*</Label>
            <Input
              id="titulo"
              placeholder="Ex: Buquê de Rosas Vermelhas"
              value={formData.titulo || ''}
              onChange={(e) => {
                const titulo = e.target.value;
                const slug = slugify(titulo, {
                  lower: true,
                  strict: true,
                  locale: 'pt'
                });
                atualizarFormData({ titulo, slug });
              }}
              className="rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
            />
          </div>

          
          {/* SKU */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="sku">Código SKU</Label>
              {geracaoAtiva && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  onClick={gerarSKU}
                  disabled={isGenerating.sku}
                >
                  {isGenerating.sku ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-3 w-3 mr-1" />
                      Gerar SKU
                    </>
                  )}
                </Button>
              )}
            </div>
            <Input
              id="sku"
              placeholder="Ex: BQT-1001"
              value={formData.sku}
              onChange={(e) => atualizarFormData({ sku: e.target.value })}
              className="rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
            />
          </div>
          
          {/* Descrição Curta */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="descricao">Descrição Curta</Label>
              {geracaoAtiva && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  onClick={gerarDescricao}
                  disabled={isGenerating.descricao}
                >
                  {isGenerating.descricao ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Gerar com IA
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="descricao"
              placeholder="Breve descrição do produto (será exibida em cards e listas)"
              value={formData.descricao || ''}
              onChange={(e) => atualizarFormData({ descricao: e.target.value })}
              className="resize-none h-20 rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
            />
          </div>
          
          {/* Descrição Longa */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="descricaoLonga">Descrição Completa</Label>
              {geracaoAtiva && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  onClick={gerarDescricaoLonga}
                  disabled={isGenerating.descricaoLonga}
                >
                  {isGenerating.descricaoLonga ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3 w-3 mr-1" />
                      Gerar com IA
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="descricaoLonga"
              placeholder="Descrição detalhada do produto (suporta HTML básico)"
              value={formData.descricaoLonga || ''}
              onChange={(e) => atualizarFormData({ descricaoLonga: e.target.value })}
              className="resize-none h-32 rounded-2xl font-mono text-sm focus:border-[#27b99a] focus:ring-[#27b99a]/20"
            />
          </div>
          
          {/* Configurações do Produto */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Configurações</h4>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Produto Ativo */}
              <div className="flex items-center space-x-3">
                <input
                  id="ativo"
                  type="checkbox"
                  checked={formData.ativo || false}
                  onChange={(e) => atualizarFormData({ ativo: e.target.checked })}
                  className="w-4 h-4 text-[#27b99a] bg-gray-100 border-gray-300 rounded focus:ring-[#27b99a] focus:ring-2"
                />
                <Label htmlFor="ativo" className="text-sm font-medium cursor-pointer">
                  Produto Ativo
                </Label>
              </div>
              
              {/* Em Destaque */}
              <div className="flex items-center space-x-3">
                <input
                  id="emDestaque"
                  type="checkbox"
                  checked={formData.emDestaque || false}
                  onChange={(e) => atualizarFormData({ emDestaque: e.target.checked })}
                  className="w-4 h-4 text-[#ff0080] bg-gray-100 border-gray-300 rounded focus:ring-[#ff0080] focus:ring-2"
                />
                <Label htmlFor="emDestaque" className="text-sm font-medium cursor-pointer">
                  Produto em Destaque
                </Label>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
