'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, ChevronRight, Loader2, Save } from 'lucide-react';
import { InfoProdutoForm } from './etapas/info-produto-form';
import { PrecosEstoqueForm } from './etapas/precos-estoque-form';
import { MidiaForm } from './etapas/midia-form';
import { CategoriasTagsForm } from './etapas/categorias-tags-form';
import { SeoForm } from './etapas/seo-form';

interface Produto {
  id?: string;
  titulo: string;
  descricao?: string;
  descricaoLonga?: string;
  slug: string;
  preco: number;
  precoPromocional?: number;
  sku?: string;
  estoque: number;
  fotoPrincipal?: string;
  galeria: string[];
  peso?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  tamanho?: string;
  palavrasChave?: string;
  pontuacaoSEO?: number;
  emDestaque: boolean;
  ativo: boolean;
  categorias: { id: string, nome: string }[];
  tags: { id: string, nome: string }[];
}

interface ModalProdutoFormProps {
  isOpen: boolean;
  onClose: () => void;
  produto?: Produto;
  modo: 'criar' | 'editar';
}

export function ModalProdutoForm({ isOpen, onClose, produto, modo }: ModalProdutoFormProps) {
  // Estado para controlar a etapa atual do formulário
  const [etapaAtual, setEtapaAtual] = useState(0);
  
  // Estado para controlar se o formulário está sendo salvo
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState<Partial<Produto>>({
    titulo: '',
    descricao: '',
    descricaoLonga: '',
    slug: '',
    preco: 0,
    precoPromocional: undefined,
    sku: '',
    estoque: 0,
    fotoPrincipal: undefined,
    galeria: [],
    peso: undefined,
    altura: undefined,
    largura: undefined,
    comprimento: undefined,
    tamanho: undefined,
    palavrasChave: '',
    pontuacaoSEO: 0,
    emDestaque: false,
    ativo: true,
    categorias: [],
    tags: []
  });
  
  // Definição das etapas do formulário
  const etapas = [
    { titulo: 'Informações Básicas', componente: InfoProdutoForm },
    { titulo: 'Preços', componente: PrecosEstoqueForm },
    { titulo: 'Imagens', componente: MidiaForm },
    { titulo: 'Categorias e Tags', componente: CategoriasTagsForm },
    { titulo: 'SEO', componente: SeoForm }
  ];
  
  // Toast já importado do sonner
  
  // Carrega os dados do produto quando o componente é montado
  useEffect(() => {
    if (produto && modo === 'editar') {
      setFormData({
        ...produto
      });
    }
  }, [produto, modo]);
  
  // Verifica se a etapa atual está completa
  const isEtapaValida = (etapa: number): boolean => {
    switch (etapa) {
      case 0: // Informações Básicas
        return !!formData.titulo && !!formData.slug;
      case 1: // Preços e Estoque
        return formData.preco !== undefined && formData.preco > 0;
      case 2: // Imagens
        return true; // Imagens são opcionais
      case 3: // Categorias e Tags
        return true; // Categorias e tags são opcionais
      case 4: // Dimensões
        return true; // Dimensões são opcionais
      case 5: // SEO
        return true; // SEO é opcional
      default:
        return false;
    }
  };
  
  // Função para avançar para a próxima etapa
  const avancarEtapa = () => {
    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    }
  };
  
  // Função para voltar para a etapa anterior
  const voltarEtapa = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
    }
  };
  
  // Função para ir para uma etapa específica
  const irParaEtapa = (index: number) => {
    if (index >= 0 && index < etapas.length) {
      setEtapaAtual(index);
    }
  };
  
  // Função para atualizar os dados do formulário
  const atualizarFormData = (data: Partial<Produto>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const url = modo === 'criar' ? '/api/produtos' : `/api/produtos/${produto?.id}`;
      const method = modo === 'criar' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`O produto ${formData.titulo} foi ${modo === 'criar' ? 'adicionado' : 'atualizado'} com sucesso.`);
        onClose();
        // Recarregar a página para mostrar as alterações
        window.location.reload();
      } else {
        throw new Error(data.error || 'Erro ao salvar produto');
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      toast.error(`Erro ao salvar produto: ${error.message || 'Ocorreu um erro ao salvar o produto'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderiza o componente da etapa atual
  const EtapaAtualComponente = etapas[etapaAtual].componente;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-900 rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle>{modo === 'criar' ? 'Adicionar Novo Produto' : 'Editar Produto'}</DialogTitle>
        </DialogHeader>
        
        {/* Indicador de Progresso */}
        <div className="flex justify-between items-center mb-6 px-2">
          {etapas.map((etapa, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all shadow-lg hover:shadow-xl
                  ${index < etapaAtual ? 'bg-[#27b99a] text-white' : ''}
                  ${index === etapaAtual ? 'bg-[#ff0080] text-white' : ''}
                  ${index > etapaAtual ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : ''}
                `}
                onClick={() => {
                  // Só permite navegar para etapas anteriores ou a atual
                  if (index <= etapaAtual) {
                    irParaEtapa(index);
                  }
                }}
              >
                {index < etapaAtual ? <Check className="h-4 w-4" /> : index + 1}
              </button>
              <span className="text-xs mt-1 hidden sm:block">{etapa.titulo}</span>
            </div>
          ))}
        </div>
        
        {/* Componente da Etapa Atual */}
        <div className="py-2">
          <EtapaAtualComponente
            formData={formData}
            atualizarFormData={atualizarFormData}
          />
        </div>
        
        {/* Botões de Navegação */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={voltarEtapa}
            disabled={etapaAtual === 0}
            className="rounded-2xl border-gray-300 hover:border-[#27b99a] hover:text-[#27b99a] transition-all duration-300"
          >
            Voltar
          </Button>
          
          <div className="flex space-x-2">
            {etapaAtual === etapas.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isEtapaValida(etapaAtual)}
                className="bg-[#27b99a] hover:bg-[#22a085] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Produto
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={avancarEtapa}
                disabled={!isEtapaValida(etapaAtual)}
                className="bg-[#ff0080] hover:bg-[#e6006b] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Próximo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
