'use client';

import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Plus,
  Trash2,
  FileText,
  Image as ImageIcon,
  Upload,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface PaginasFormProps {
  form: UseFormReturn<any>;
  adicionarPagina: () => void;
  removerPagina: (index: number) => void;
}

// Tipos de arquivo aceitos (removido seletor manual)
const tiposArquivoAceitos = 'image/*,application/pdf';

// Função para detectar tipo de arquivo
const detectarTipoArquivo = (arquivo: string): 'IMAGE' | 'PDF' => {
  if (arquivo.includes('.pdf') || arquivo.startsWith('data:application/pdf')) {
    return 'PDF';
  }
  return 'IMAGE';
};
const getFileType = (file: File) => {
  if (file.type.startsWith('image/')) return 'IMAGE';
  if (file.type === 'application/pdf') return 'PDF';
  return 'IMAGE'; // Default para imagem
};

export function PaginasForm({
  form,
  adicionarPagina,
  removerPagina
}: PaginasFormProps) {
  const [previewImages, setPreviewImages] = useState<Record<number, string>>({});
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({ 
    isOpen: false, 
    imageUrl: '', 
    title: '' 
  });
  const paginas = form.watch('paginas') || [];

  // Sincronizar previewImages com os dados do formulário
  useEffect(() => {
    const newPreviewImages: Record<number, string> = {};
    paginas.forEach((pagina: any, index: number) => {
      if (pagina.arquivo) {
        // Detectar tipo se não estiver definido
        const tipo = pagina.tipo || detectarTipoArquivo(pagina.arquivo);
        if (tipo === 'IMAGE') {
          newPreviewImages[index] = pagina.arquivo;
        }
      }
    });
    setPreviewImages(newPreviewImages);
  }, [paginas]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number, field: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Detectar tipo automaticamente
      const tipoDetectado = getFileType(file);
      
      // Criar FormData para upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Fazer upload para API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Atualizar formulário com URL da imagem
        const paginasAtuais = form.getValues('paginas') || [];
        paginasAtuais[index] = {
          ...paginasAtuais[index],
          tipo: tipoDetectado,
          arquivo: result.url // URL em vez de base64
        };
        form.setValue('paginas', paginasAtuais);
        field.onChange(result.url);
        
        // Criar preview para imagens
        if (file.type.startsWith('image/')) {
          setPreviewImages(prev => ({
            ...prev,
            [index]: result.url
          }));
        } else {
          // Se não for imagem, remover preview se existir
          setPreviewImages(prev => {
            const newPrev = { ...prev };
            delete newPrev[index];
            return newPrev;
          });
        }
      } else {
        console.error('Erro no upload:', result.error);
        // Aqui você pode adicionar um toast de erro
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      // Aqui você pode adicionar um toast de erro
    }
  };

  const moverPagina = (index: number, direcao: 'up' | 'down') => {
    const paginasAtuais = [...paginas];
    const novaPosicao = direcao === 'up' ? index - 1 : index + 1;
    
    if (novaPosicao >= 0 && novaPosicao < paginasAtuais.length) {
      // Trocar posições
      [paginasAtuais[index], paginasAtuais[novaPosicao]] = [paginasAtuais[novaPosicao], paginasAtuais[index]];
      
      // Renumerar páginas
      const paginasRenumeradas = paginasAtuais.map((pagina, i) => ({
        ...pagina,
        numero: i + 1
      }));
      
      form.setValue('paginas', paginasRenumeradas);
    }
  };

  // Função removida - não precisamos mais de seletor de tipo

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ImageIcon className="h-6 w-6 text-[#27b99a]" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Páginas do Livro
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Faça upload das páginas do livro em ordem sequencial
        </p>
      </div>

      {/* Botão Adicionar Página */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={adicionarPagina}
          className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-2xl px-6 py-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Página
        </Button>
      </div>

      {/* Lista de Páginas */}
      {paginas.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            Nenhuma página adicionada
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Clique em "Adicionar Página" para começar
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginas.map((pagina: any, index: number) => {
            // Determinar tipo e ícone baseado no arquivo
            const tipo = pagina.tipo || (pagina.arquivo ? detectarTipoArquivo(pagina.arquivo) : 'IMAGE');
            const IconComponent = tipo === 'PDF' ? FileText : ImageIcon;
            
            return (
              <Card key={index} className="rounded-3xl border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-[#27b99a]" />
                      Página {pagina.numero}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      {/* Botões de Ordenação */}
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moverPagina(index, 'up')}
                          disabled={index === 0}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moverPagina(index, 'down')}
                          disabled={index === paginas.length - 1}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Badge do Tipo - Simplificado */}
                      <Badge className="bg-[#27b99a] text-white rounded-full text-xs font-medium border-0">
                        {tipo === 'PDF' ? 'PDF' : 'Imagem'}
                      </Badge>
                      
                      {/* Botão Remover */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerPagina(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {/* Upload de Arquivo */}
                    <FormField
                      control={form.control}
                      name={`paginas.${index}.arquivo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">
                            Arquivo *
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept={tiposArquivoAceitos}
                                onChange={(e) => handleFileUpload(e, index, field)}
                                className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                              />
                              {field.value && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-4 w-4" />
                                  Arquivo carregado
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Preview da Imagem ou Ícone de Visualização */}
                  {pagina.arquivo && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-gray-700 dark:text-gray-300">
                          {tipo === 'IMAGE' ? 'Preview:' : 'Arquivo:'}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => {
                            if (tipo === 'IMAGE') {
                              setPreviewModal({
                                isOpen: true,
                                imageUrl: previewImages[index] || pagina.arquivo,
                                title: `Página ${pagina.numero || index + 1}`
                              });
                            } else {
                              window.open(pagina.arquivo, '_blank');
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {tipo === 'IMAGE' ? (
                        <div className="relative inline-block">
                          <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <img
                              src={previewImages[index] || pagina.arquivo}
                              alt={`Página ${pagina.numero || index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                            <FileText className="h-5 w-5" />
                            <span className="text-sm font-medium">Arquivo PDF carregado</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Resumo das Páginas */}
      {paginas.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-[#27b99a]" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Resumo das Páginas
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#27b99a]">
                {paginas.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total de Páginas
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {paginas.filter((p: any) => p.arquivo).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Com Arquivo
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {paginas.filter((p: any) => {
                  const tipo = p.tipo || (p.arquivo ? detectarTipoArquivo(p.arquivo) : 'IMAGE');
                  return tipo === 'IMAGE';
                }).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Imagens
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {paginas.filter((p: any) => {
                  const tipo = p.tipo || (p.arquivo ? detectarTipoArquivo(p.arquivo) : 'IMAGE');
                  return tipo === 'PDF';
                }).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                PDFs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dicas */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Dicas para upload de páginas:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use imagens em alta resolução (PNG ou JPG)</li>
              <li>• Para múltiplas páginas, prefira um único PDF</li>
              <li>• Mantenha a ordem sequencial das páginas</li>
              <li>• Arquivos muito grandes podem demorar para carregar</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Modal de Preview */}
      <Dialog open={previewModal.isOpen} onOpenChange={(open) => setPreviewModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewModal.title}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={previewModal.imageUrl}
              alt={previewModal.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
