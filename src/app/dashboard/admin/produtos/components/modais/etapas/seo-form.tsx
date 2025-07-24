'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Search, 
  Sparkles, 
  BadgePercent,
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { generateProductContentClient } from "@/lib/deepseek-ai";

interface SeoFormProps {
  formData: any;
  atualizarFormData: (data: any) => void;
}

export function SeoForm({ formData, atualizarFormData }: SeoFormProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // Toast já importado do sonner
  
  // Calcular pontuação SEO
  const calcularPontuacaoSEO = () => {
    let pontuacao = 0;
    
    // Título tem tamanho adequado (entre 30 e 70 caracteres)
    if (formData.titulo) {
      if (formData.titulo.length >= 30 && formData.titulo.length <= 70) {
        pontuacao += 20;
      } else if (formData.titulo.length > 0) {
        pontuacao += 10;
      }
    }
    
    // Descrição tem tamanho adequado (pelo menos 100 caracteres)
    if (formData.descricao && formData.descricao.length >= 100) {
      pontuacao += 15;
    } else if (formData.descricao && formData.descricao.length > 0) {
      pontuacao += 8;
    }
    
    // Descrição longa tem conteúdo substancial
    if (formData.descricaoLonga && formData.descricaoLonga.length >= 300) {
      pontuacao += 15;
    } else if (formData.descricaoLonga && formData.descricaoLonga.length > 0) {
      pontuacao += 8;
    }
    
    // Tem pelo menos 5 palavras-chave
    const palavrasChave = formData.palavrasChave?.split(',').filter((p: string) => p.trim()) || [];
    if (palavrasChave.length >= 5) {
      pontuacao += 20;
    } else if (palavrasChave.length > 0) {
      pontuacao += palavrasChave.length * 4;
    }
    
    // Tem foto principal
    if (formData.fotoPrincipal) {
      pontuacao += 10;
    }
    
    // Tem categorias
    if (formData.categorias?.length > 0) {
      pontuacao += 10;
    }
    
    // Tem tags
    if (formData.tags?.length > 0) {
      pontuacao += 10;
    }
    
    return pontuacao;
  };
  
  // Gerar palavras-chave para SEO usando IA
  const gerarPalavrasChaveSEO = async () => {
    if (!formData.titulo) {
      toast.error("Por favor, preencha o título antes de gerar palavras-chave SEO");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const palavrasChave = await generateProductContentClient({
        productName: formData.titulo,
        contentType: 'seo',
        category: formData.categorias?.[0]?.nome,
        keyFeatures: formData.descricao ? [formData.descricao] : undefined
      });
      
      atualizarFormData({ palavrasChave });
      
      // Recalcular a pontuação SEO
      const novaPontuacao = calcularPontuacaoSEO();
      atualizarFormData({ pontuacaoSEO: novaPontuacao });
      
      toast.success("Palavras-chave geradas com sucesso");
    } catch (error: any) {
      toast.error(`Erro ao gerar palavras-chave: ${error.message || "Ocorreu um erro ao gerar as palavras-chave"}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Pontuação SEO atual
  const pontuacaoSEO = formData.pontuacaoSEO || calcularPontuacaoSEO();
  
  // Determinar a cor da barra de progresso
  const getCorPontuacao = () => {
    if (pontuacaoSEO < 40) return "bg-red-500";
    if (pontuacaoSEO < 70) return "bg-amber-500";
    return "bg-green-500";
  };
  
  // Determinar a mensagem da pontuação
  const getMensagemPontuacao = () => {
    if (pontuacaoSEO < 40) return "Ruim";
    if (pontuacaoSEO < 70) return "Regular";
    if (pontuacaoSEO < 90) return "Bom";
    return "Excelente";
  };
  
  // Exibir palavras-chave como badges
  const palavrasChaveArray = formData.palavrasChave
    ? formData.palavrasChave.split(',').map((p: string) => p.trim()).filter((p: string) => p)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Otimização para SEO</h3>
        <div className="flex items-center space-x-2">
          <Badge className={`
            ${pontuacaoSEO < 40 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
            ${pontuacaoSEO >= 40 && pontuacaoSEO < 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
            ${pontuacaoSEO >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
          `}>
            <BadgePercent className="h-3.5 w-3.5 mr-1" />
            Pontuação: {pontuacaoSEO}/100
          </Badge>
        </div>
      </div>
      
      <Card className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6 space-y-5">
          {/* Pontuação SEO */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Pontuação SEO</Label>
              <span className="text-sm font-medium">
                {getMensagemPontuacao()}
              </span>
            </div>
            <Progress
              value={pontuacaoSEO}
              max={100}
              className={`h-2 ${getCorPontuacao()}`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Esta pontuação é baseada nas informações do produto e ajuda a melhorar o posicionamento nos buscadores.
            </p>
          </div>
          
          {/* Palavras-chave */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="palavrasChave">Palavras-chave para SEO</Label>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700"
                onClick={gerarPalavrasChaveSEO}
                disabled={isGenerating}
              >
                {isGenerating ? (
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
            </div>
            <Textarea
              id="palavrasChave"
              placeholder="Palavras-chave separadas por vírgula (Ex: buquê, flores, rosas, presente)"
              value={formData.palavrasChave || ''}
              onChange={(e) => {
                atualizarFormData({ palavrasChave: e.target.value });
                // Recalcular pontuação ao editar palavras-chave
                const novaPontuacao = calcularPontuacaoSEO();
                atualizarFormData({ pontuacaoSEO: novaPontuacao });
              }}
              className="resize-none h-16 rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
            />
          </div>
          
          {/* Visualização das palavras-chave */}
          {palavrasChaveArray.length > 0 && (
            <div className="space-y-2">
              <Label>Visualização das palavras-chave</Label>
              <div className="flex flex-wrap gap-2">
                {palavrasChaveArray.map((palavra: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <Search className="h-3 w-3 mr-1 text-slate-400" />
                    {palavra}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Meta título */}
          <div className="space-y-2">
            <Label htmlFor="metaTitulo">Meta título (para SEO)</Label>
            <Input
              id="metaTitulo"
              placeholder="Título para SEO (geralmente igual ao título do produto)"
              value={formData.metaTitulo || formData.titulo || ''}
              onChange={(e) => atualizarFormData({ metaTitulo: e.target.value })}
              className="rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
              maxLength={70}
            />
            <div className="flex justify-end">
              <span className={`text-xs ${
                formData.metaTitulo?.length > 60 ? 'text-amber-500' : 'text-gray-500'
              }`}>
                {formData.metaTitulo?.length || 0}/70 caracteres
              </span>
            </div>
          </div>
          
          {/* Meta descrição */}
          <div className="space-y-2">
            <Label htmlFor="metaDescricao">Meta descrição (para SEO)</Label>
            <Textarea
              id="metaDescricao"
              placeholder="Breve descrição para SEO (geralmente similar à descrição curta do produto)"
              value={formData.metaDescricao || formData.descricao || ''}
              onChange={(e) => atualizarFormData({ metaDescricao: e.target.value })}
              className="resize-none h-20 rounded-2xl focus:border-[#27b99a] focus:ring-[#27b99a]/20"
              maxLength={160}
            />
            <div className="flex justify-end">
              <span className={`text-xs ${
                formData.metaDescricao?.length > 150 ? 'text-amber-500' : 'text-gray-500'
              }`}>
                {formData.metaDescricao?.length || 0}/160 caracteres
              </span>
            </div>
          </div>
          
          {/* Dicas para melhorar SEO */}
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-900">
            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
              Dicas para melhorar sua pontuação SEO:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 pl-4 list-disc">
              <li>Use pelo menos 5-10 palavras-chave relevantes e específicas</li>
              <li>Certifique-se de que o título tem entre 30-70 caracteres</li>
              <li>Crie uma descrição curta com 100-160 caracteres</li>
              <li>Adicione uma descrição longa detalhada (300+ caracteres)</li>
              <li>Inclua pelo menos uma categoria e algumas tags relevantes</li>
              <li>Adicione pelo menos uma imagem de alta qualidade</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
