'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  BookOpen, 
  Gift, 
  FileText, 
  Save, 
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Hash
} from 'lucide-react';

// Importar os componentes das abas
import { InformacoesForm } from './etapas/informacoes-form';
import { CategoriasForm } from './etapas/categorias-form';
import { ArquivosForm } from './etapas/arquivos-form';
import { BeneficiosForm } from './etapas/beneficios-form';
import { PaginasForm } from './etapas/paginas-form';

// Schemas de validação
const livroSchema = z.object({
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  descricaoLonga: z.string().optional(),
  sku: z.string().optional(),
  autor: z.string().optional(),
  faixaEtaria: z.string().optional(),
  numeroPaginas: z.number().optional(),
  precoDigital: z.number().optional(),
  precoFisico: z.number().optional(),
  capa: z.string().optional(),
  imagemCapa: z.string().optional(),
  arquivoDownload: z.string().optional(),
  metaTitulo: z.string().optional(),
  metaDescricao: z.string().optional(),
  ativo: z.boolean().optional().default(true),
  categorias: z.array(z.string()).optional(),
  tags: z.array(z.string()).default([]),
  beneficios: z.array(z.object({
    id: z.string().optional(),
    titulo: z.string().min(1, 'Título do benefício é obrigatório'),
    icone: z.string().min(1, 'Ícone é obrigatório'),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
  })).default([]),
  paginas: z.array(z.object({
    id: z.string().optional(),
    numero: z.number().min(1, 'Número da página deve ser maior que 0'),
    arquivo: z.string().min(1, 'Arquivo é obrigatório'),
    tipo: z.enum(['PDF', 'IMAGE']).default('IMAGE'),
  })).default([]),
});

type LivroFormData = z.infer<typeof livroSchema>;

interface ModalLivroNovoProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (dados: any) => void;
  livroParaEdicao?: any;
  isEditando?: boolean;
}

export function ModalLivroNovo({
  isOpen,
  onClose,
  onSalvar,
  livroParaEdicao,
  isEditando = false
}: ModalLivroNovoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('informacoes');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [novaTag, setNovaTag] = useState('');

  const form = useForm<LivroFormData>({
    resolver: zodResolver(livroSchema) as any,
    defaultValues: {
      titulo: '',
      descricao: '',
      descricaoLonga: '',
      sku: '',
      autor: '',
      faixaEtaria: '',
      numeroPaginas: 0,
      precoDigital: 0,
      precoFisico: 0,
      capa: '',
      imagemCapa: '',
      arquivoDownload: '',
      metaTitulo: '',
      metaDescricao: '',
      ativo: true,
      categorias: [],
      tags: [],
      beneficios: [],
      paginas: [],
    }
  });

  // Carregar dados quando modal abrir
  useEffect(() => {
    if (isOpen) {
      carregarCategorias();
      carregarTags();
      
      if (isEditando && livroParaEdicao) {
        preencherFormulario(livroParaEdicao);
      } else {
        form.reset();
      }
    }
  }, [isOpen, isEditando, livroParaEdicao]);

  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      if (data.success) {
        setCategorias(data.categorias);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      if (data.success) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  };

  const preencherFormulario = (livro: any) => {
    // Mapear páginas com tipos corretos
    const paginasMapeadas = (livro.paginas || []).map((pagina: any) => {
      // Detectar tipo baseado no arquivo ou tipo salvo
      let tipo = 'IMAGE'; // Default
      
      if (pagina.tipo) {
        // Se já tem tipo salvo, usar ele
        tipo = pagina.tipo;
      } else if (pagina.arquivo) {
        // Se não tem tipo, detectar pelo arquivo
        if (pagina.arquivo.includes('.pdf') || pagina.arquivo.startsWith('data:application/pdf')) {
          tipo = 'PDF';
        } else {
          tipo = 'IMAGE';
        }
      }
      
      return {
        ...pagina,
        tipo
      };
    });
    
    form.reset({
      titulo: livro.nome || livro.titulo || '',
      descricao: livro.descricao || '',
      descricaoLonga: livro.descricaoCompleta || livro.descricaoLonga || '',
      sku: livro.sku || '',
      autor: livro.autor || '',
      faixaEtaria: livro.faixaEtaria || '',
      numeroPaginas: livro.numeroPaginas || 0,
      precoDigital: livro.precoDigital || 0,
      precoFisico: livro.precoFisico || 0,
      capa: livro.capa || '',
      imagemCapa: livro.imagemCapa || livro.capa || '',
      arquivoDownload: livro.arquivoDownload || '',
      metaTitulo: livro.metaTitulo || '',
      metaDescricao: livro.metaDescricao || '',
      ativo: livro.ativo ?? true,
      categorias: livro.categoriasLink?.map((cl: any) => cl.categoriaId) || [],
      tags: livro.tagsLink?.map((tl: any) => tl.tagId) || [],
      beneficios: livro.beneficios || [],
      paginas: paginasMapeadas,
    });
  };

  const adicionarBeneficio = () => {
    const beneficiosAtuais = form.getValues('beneficios');
    form.setValue('beneficios', [
      ...beneficiosAtuais,
      {
        titulo: '',
        icone: '',
        descricao: '',
      }
    ]);
  };

  const removerBeneficio = (index: number) => {
    const beneficiosAtuais = form.getValues('beneficios');
    form.setValue('beneficios', beneficiosAtuais.filter((_, i) => i !== index));
  };

  const adicionarPagina = () => {
    const paginasAtuais = form.getValues('paginas');
    const proximoNumero = paginasAtuais.length + 1;
    
    form.setValue('paginas', [
      ...paginasAtuais,
      {
        numero: proximoNumero,
        arquivo: '',
        tipo: 'IMAGE' as const,
      }
    ]);
  };

  const removerPagina = (index: number) => {
    const paginasAtuais = form.getValues('paginas');
    const novasPaginas = paginasAtuais.filter((_, i) => i !== index);
    
    // Renumerar páginas
    const paginasRenumeradas = novasPaginas.map((pagina, i) => ({
      ...pagina,
      numero: i + 1
    }));
    
    form.setValue('paginas', paginasRenumeradas);
  };

  const criarTag = async () => {
    if (!novaTag.trim()) return;

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novaTag.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        setTags([...tags, data.tag]);
        setNovaTag('');
        toast.success('Tag criada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
    }
  };

  const onSubmit = async (data: LivroFormData) => {
    try {
      setIsLoading(true);

      const dadosParaEnvio = {
        ...data,
        // Converter arrays de IDs para formato esperado pela API
        categorias: (data.categorias || []).map(id => ({ categoriaId: id })),
        tags: (data.tags || []).map(id => ({ tagId: id })),
      };
      
      await onSalvar(dadosParaEnvio);
      
      toast.success(isEditando ? 'Livro atualizado com sucesso!' : 'Livro criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      toast.error('Erro ao salvar livro: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setAbaAtiva('informacoes');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#27b99a]" />
            {isEditando ? 'Editar Livro' : 'Novo Livro'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="flex flex-col h-full">
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5 bg-gray-50 dark:bg-gray-800 rounded-2xl p-1">
              <TabsTrigger 
                value="informacoes" 
                className="flex items-center gap-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#27b99a] data-[state=active]:shadow-sm text-xs"
              >
                <FileText className="h-3 w-3" />
                Informações
              </TabsTrigger>
              <TabsTrigger 
                value="categorias"
                className="flex items-center gap-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#ff0080] data-[state=active]:shadow-sm text-xs"
              >
                <Hash className="h-3 w-3" />
                Categorias
              </TabsTrigger>
              <TabsTrigger 
                value="arquivos"
                className="flex items-center gap-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#27b99a] data-[state=active]:shadow-sm text-xs"
              >
                <Upload className="h-3 w-3" />
                Arquivos
              </TabsTrigger>
              <TabsTrigger 
                value="beneficios"
                className="flex items-center gap-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#ff0080] data-[state=active]:shadow-sm text-xs"
              >
                <Gift className="h-3 w-3" />
                Benefícios
              </TabsTrigger>
              <TabsTrigger 
                value="paginas"
                className="flex items-center gap-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#27b99a] data-[state=active]:shadow-sm text-xs"
              >
                <ImageIcon className="h-3 w-3" />
                Páginas
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto py-4 max-h-[calc(95vh-200px)]">
              <TabsContent value="informacoes" className="mt-0 space-y-0">
                <div className="pr-2">
                  <InformacoesForm form={form} />
                </div>
              </TabsContent>

              <TabsContent value="categorias" className="space-y-6">
                <CategoriasForm 
                  form={form}
                  categorias={categorias}
                  tags={tags}
                  novaTag={novaTag}
                  setNovaTag={setNovaTag}
                  criarTag={criarTag}
                />
              </TabsContent>

              <TabsContent value="arquivos" className="mt-0 space-y-0">
                <div className="pr-2">
                  <ArquivosForm form={form} />
                </div>
              </TabsContent>

              <TabsContent value="beneficios" className="mt-0 space-y-0">
                <div className="pr-2">
                  <BeneficiosForm
                    form={form}
                    adicionarBeneficio={adicionarBeneficio}
                    removerBeneficio={removerBeneficio}
                  />
                </div>
              </TabsContent>

              <TabsContent value="paginas" className="mt-0 space-y-0">
                <div className="pr-2">
                  <PaginasForm
                    form={form}
                    adicionarPagina={adicionarPagina}
                    removerPagina={removerPagina}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Botões de ação */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-2xl"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            <div className="flex gap-2">
              {abaAtiva !== 'informacoes' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const abas = ['informacoes', 'categorias', 'arquivos', 'beneficios', 'paginas'];
                    const indiceAtual = abas.indexOf(abaAtiva);
                    if (indiceAtual > 0) {
                      setAbaAtiva(abas[indiceAtual - 1]);
                    }
                  }}
                  className="rounded-2xl"
                >
                  Anterior
                </Button>
              )}

              {abaAtiva !== 'paginas' ? (
                <Button
                  type="button"
                  onClick={() => {
                    const abas = ['informacoes', 'categorias', 'arquivos', 'beneficios', 'paginas'];
                    const indiceAtual = abas.indexOf(abaAtiva);
                    if (indiceAtual < abas.length - 1) {
                      setAbaAtiva(abas[indiceAtual + 1]);
                    }
                  }}
                  className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-2xl"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    const data = form.getValues();
                    onSubmit(data);
                  }}
                  disabled={isLoading}
                  className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-2xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : (isEditando ? 'Atualizar' : 'Criar Livro')}
                </Button>
              )}
            </div>
          </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
