'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ImagePlus, 
  Trash2, 
  Image as ImageIcon,
  UploadCloud,
  X,
  MoveLeft,
  MoveRight,
  Star,
  StarOff
} from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";

interface MidiaFormProps {
  formData: any;
  atualizarFormData: (data: any) => void;
}

export function MidiaForm({ formData, atualizarFormData }: MidiaFormProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<{url: string}[]>(
    formData.galeria?.map((url: string) => ({ url })) || []
  );
  
  // Toast já importado do sonner
  
  // Função para adicionar imagens via upload real
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (result.success) {
          return { url: result.url };
        } else {
          throw new Error(result.error || 'Erro no upload');
        }
      });
      
      const novasImagens = await Promise.all(uploadPromises);
      
      // Adicionar às imagens existentes
      const imageList = [...previewImages, ...novasImagens];
      setPreviewImages(imageList);
      
      // Atualizar URLs no formData
      atualizarFormData({
        galeria: imageList.map(img => img.url),
        // Se a imagem principal não estiver definida, use a primeira imagem
        fotoPrincipal: formData.fotoPrincipal || imageList[0]?.url
      });
      
      toast.success(`${novasImagens.length} imagem(ns) enviada(s) com sucesso!`);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagens');
    } finally {
      setIsUploading(false);
    }
    
    // Limpar o input para permitir selecionar os mesmos arquivos novamente
    e.target.value = '';
  };
  
  // Função para remover uma imagem
  const removerImagem = (index: number) => {
    const novaLista = [...previewImages];
    
    // Remover a imagem da lista
    novaLista.splice(index, 1);
    setPreviewImages(novaLista);
    
    // Atualizar o formData
    const novasUrls = novaLista.map(img => img.url);
    
    // Se a imagem removida era a principal, atualizar a imagem principal
    let novaImagemPrincipal = formData.fotoPrincipal;
    if (formData.fotoPrincipal === previewImages[index].url) {
      novaImagemPrincipal = novasUrls[0] || undefined;
    }
    
    atualizarFormData({
      galeria: novasUrls,
      fotoPrincipal: novaImagemPrincipal
    });
    
    toast.success("Imagem removida");
  };
  
  // Função para definir a imagem principal
  const definirImagemPrincipal = (url: string) => {
    atualizarFormData({ fotoPrincipal: url });
    
    toast.success("Imagem principal definida");
  };
  
  // Função para mover a imagem para a esquerda
  const moverParaEsquerda = (index: number) => {
    if (index === 0) return;
    
    const novaLista = [...previewImages];
    const temp = novaLista[index - 1];
    novaLista[index - 1] = novaLista[index];
    novaLista[index] = temp;
    
    setPreviewImages(novaLista);
    atualizarFormData({
      galeria: novaLista.map(img => img.url)
    });
  };
  
  // Função para mover a imagem para a direita
  const moverParaDireita = (index: number) => {
    if (index === previewImages.length - 1) return;
    
    const novaLista = [...previewImages];
    const temp = novaLista[index + 1];
    novaLista[index + 1] = novaLista[index];
    novaLista[index] = temp;
    
    setPreviewImages(novaLista);
    atualizarFormData({
      galeria: novaLista.map(img => img.url)
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Imagens do Produto</h3>
      
      <Card className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6">
          {/* Botão de upload */}
          <div className="mb-6">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG ou WebP (máx. 5MB por imagem)
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          
          {/* Preview das imagens */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Imagens do produto</h4>
            
            {previewImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhuma imagem adicionada
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`
                      relative group rounded-xl overflow-hidden border-2
                      ${formData.fotoPrincipal === image.url
                        ? 'border-amber-500 dark:border-amber-400'
                        : 'border-transparent'
                      }
                      hover:shadow-md transition-all duration-200
                    `}
                  >
                    <div className="aspect-square w-full relative">
                      <Image
                        src={image.url}
                        alt={`Imagem ${index + 1} do produto`}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Badge de imagem principal */}
                      {formData.fotoPrincipal === image.url && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs font-medium">
                          Principal
                        </div>
                      )}
                      
                      {/* Overlay com botões */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removerImagem(index)}
                            className="h-6 w-6 bg-red-500/80 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-center space-x-1">
                          {/* Botão para mover para esquerda */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moverParaEsquerda(index)}
                            disabled={index === 0}
                            className="h-7 w-7 bg-white/80 text-gray-800 rounded-full hover:bg-white"
                          >
                            <MoveLeft className="h-3 w-3" />
                          </Button>
                          
                          {/* Botão para definir como principal */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => definirImagemPrincipal(image.url)}
                            disabled={formData.fotoPrincipal === image.url}
                            className={`
                              h-7 w-7 rounded-full
                              ${formData.fotoPrincipal === image.url
                                ? 'bg-amber-500/90 text-white hover:bg-amber-500'
                                : 'bg-white/80 text-gray-800 hover:bg-white'
                              }
                            `}
                          >
                            {formData.fotoPrincipal === image.url ? (
                              <StarOff className="h-3 w-3" />
                            ) : (
                              <Star className="h-3 w-3" />
                            )}
                          </Button>
                          
                          {/* Botão para mover para direita */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moverParaDireita(index)}
                            disabled={index === previewImages.length - 1}
                            className="h-7 w-7 bg-white/80 text-gray-800 rounded-full hover:bg-white"
                          >
                            <MoveRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {previewImages.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                * Passe o mouse sobre uma imagem para ver as opções
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
