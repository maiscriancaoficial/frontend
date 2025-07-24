'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BannerDados } from "../page";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ModalBannerProps {
  isOpen: boolean;
  onClose: () => void;
  bannerParaEditar: BannerDados | null;
  onSalvar: (bannerData: Omit<BannerDados, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  salvando?: boolean;
}

export function ModalBanner({ isOpen, onClose, bannerParaEditar, onSalvar, salvando = false }: ModalBannerProps) {
  // Estado inicial do formulário
  const bannerVazio = {
    id: '',
    titulo: '',
    descricao: '',
    fotoDesktop: '',
    fotoMobile: '',
    ordem: 1,
    ativo: true,
    botao1Label: '',
    botao1Link: '',
    botao1Cor: '#4CAF50',
    botao2Label: '',
    botao2Link: '',
    botao2Cor: '#9E9E9E',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Estado do formulário
  const [formulario, setFormulario] = useState<BannerDados>(bannerVazio);
  
  // Preview de imagens
  const [previewDesktop, setPreviewDesktop] = useState<string>('');
  const [previewMobile, setPreviewMobile] = useState<string>('');
  
  // Quando o modal abrir com um banner para editar
  useEffect(() => {
    if (bannerParaEditar) {
      setFormulario(bannerParaEditar);
      setPreviewDesktop(bannerParaEditar.fotoDesktop);
      setPreviewMobile(bannerParaEditar.fotoMobile || '');
    } else {
      setFormulario(bannerVazio);
      setPreviewDesktop('');
      setPreviewMobile('');
    }
  }, [bannerParaEditar, isOpen]);

  // Manipuladores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convertendo valores numéricos
    if (type === 'number') {
      setFormulario(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormulario(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormulario(prev => ({ ...prev, ativo: checked }));
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      // Em produção, aqui faria o upload para um serviço de armazenamento
      // Para fins de demonstração, vamos apenas simular com URL.createObjectURL
      const preview = URL.createObjectURL(file);
      
      if (tipo === 'desktop') {
        setPreviewDesktop(preview);
        setFormulario(prev => ({ ...prev, fotoDesktop: preview }));
      } else {
        setPreviewMobile(preview);
        setFormulario(prev => ({ ...prev, fotoMobile: preview }));
      }
    }
  };

  const handleSalvar = () => {
    // Preparar dados para envio (excluindo campos que não devem ser enviados)
    const dadosParaEnvio = {
      titulo: formulario.titulo,
      descricao: formulario.descricao || undefined,
      fotoDesktop: formulario.fotoDesktop,
      fotoMobile: formulario.fotoMobile || undefined,
      ordem: formulario.ordem,
      ativo: formulario.ativo,
      botao1Label: formulario.botao1Label || undefined,
      botao1Link: formulario.botao1Link || undefined,
      botao1Cor: formulario.botao1Cor || undefined,
      botao1CorFonte: formulario.botao1CorFonte || undefined,
      botao1Tamanho: formulario.botao1Tamanho || undefined,
      botao2Label: formulario.botao2Label || undefined,
      botao2Link: formulario.botao2Link || undefined,
      botao2Cor: formulario.botao2Cor || undefined,
      botao2CorFonte: formulario.botao2CorFonte || undefined,
      botao2Tamanho: formulario.botao2Tamanho || undefined,
    };
    
    console.log('[MODAL BANNER] Dados a serem enviados:', dadosParaEnvio);
    onSalvar(dadosParaEnvio);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white dark:bg-gray-900 border shadow-lg rounded-[20px]">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/20 dark:to-transparent">
          <DialogTitle className="text-xl font-semibold text-emerald-800 dark:text-emerald-300">
            {bannerParaEditar ? "Editar banner" : "Novo banner"}
          </DialogTitle>
          <DialogDescription className="text-emerald-700/70 dark:text-emerald-400/70">
            {bannerParaEditar 
              ? "Altere os detalhes do banner existente" 
              : "Configure todos os detalhes para criar um novo banner"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Título e Status */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="titulo">Título do Banner</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formulario.titulo}
                onChange={handleInputChange}
                placeholder="Ex: Promoção de Verão"
                className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem</Label>
              <Input
                id="ordem"
                name="ordem"
                type="number"
                value={formulario.ordem}
                onChange={handleInputChange}
                min={1}
                className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700 w-24"
              />
            </div>
            
            <div className="space-y-2 flex items-center">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="ativo" className="pr-2">
                  Banner ativo
                </Label>
                <Switch
                  id="ativo"
                  checked={formulario.ativo}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formulario.descricao || ''}
              onChange={handleInputChange}
              placeholder="Descreva o conteúdo deste banner"
              className="min-h-[80px] rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
            />
          </div>
          
          {/* Upload de imagens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagem Desktop */}
            <div className="space-y-2">
              <Label htmlFor="fotoDesktop">Banner Desktop</Label>
              <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-[10px] p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                {previewDesktop ? (
                  <div className="relative w-full">
                    <img 
                      src={previewDesktop} 
                      alt="Preview Desktop" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg"
                      onClick={() => {
                        setPreviewDesktop('');
                        setFormulario(prev => ({ ...prev, fotoDesktop: '' }));
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="upload-desktop" className="cursor-pointer w-full h-40 flex flex-col items-center justify-center">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-full mb-2">
                      <ImageIcon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium">Clique para fazer upload</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recomendado: 1920x600px</span>
                    <input
                      type="file"
                      id="upload-desktop"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handleImagemChange(e, 'desktop')}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {/* Imagem Mobile */}
            <div className="space-y-2">
              <Label htmlFor="fotoMobile">Banner Mobile (opcional)</Label>
              <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-[10px] p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                {previewMobile ? (
                  <div className="relative w-full">
                    <img 
                      src={previewMobile} 
                      alt="Preview Mobile" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg"
                      onClick={() => {
                        setPreviewMobile('');
                        setFormulario(prev => ({ ...prev, fotoMobile: '' }));
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="upload-mobile" className="cursor-pointer w-full h-40 flex flex-col items-center justify-center">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-full mb-2">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium">Clique para fazer upload</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recomendado: 768x500px</span>
                    <input
                      type="file"
                      id="upload-mobile"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handleImagemChange(e, 'mobile')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          {/* Configuração de botões */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-medium mb-4">Configuração de Botões</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Botão 1 */}
              <div className="space-y-4 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-medium">Botão Principal</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="botao1Label">Texto</Label>
                  <Input
                    id="botao1Label"
                    name="botao1Label"
                    value={formulario.botao1Label || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: Ver ofertas"
                    className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="botao1Link">Link</Label>
                  <Input
                    id="botao1Link"
                    name="botao1Link"
                    value={formulario.botao1Link || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: /promocoes"
                    className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="botao1Cor">Cor</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="botao1Cor"
                      name="botao1Cor"
                      value={formulario.botao1Cor || '#4CAF50'}
                      onChange={handleInputChange}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formulario.botao1Cor || ''}
                      onChange={handleInputChange}
                      name="botao1Cor"
                      className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
              
              {/* Botão 2 */}
              <div className="space-y-4 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-medium">Botão Secundário (opcional)</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="botao2Label">Texto</Label>
                  <Input
                    id="botao2Label"
                    name="botao2Label"
                    value={formulario.botao2Label || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: Saiba mais"
                    className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="botao2Link">Link</Label>
                  <Input
                    id="botao2Link"
                    name="botao2Link"
                    value={formulario.botao2Link || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: /sobre"
                    className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="botao2Cor">Cor</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="botao2Cor"
                      name="botao2Cor"
                      value={formulario.botao2Cor || '#9E9E9E'}
                      onChange={handleInputChange}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formulario.botao2Cor || ''}
                      onChange={handleInputChange}
                      name="botao2Cor"
                      className="rounded-[10px] focus-visible:ring-emerald-500/20 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-100 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} className="rounded-[15px]">
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar} 
            className="rounded-[15px] bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          >
            {bannerParaEditar ? "Salvar alterações" : "Criar banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
