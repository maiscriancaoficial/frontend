'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Trash2,
  Eye,
  Palette,
  Upload,
  X,
  Save
} from 'lucide-react';

// Tipos para elementos do avatar
type TipoElemento = 'CABELO' | 'OCULOS' | 'ROUPA' | 'SHORTS' | 'BONE' | 'CHAPEU' | 'COR_ROUPA' | 'COR_AVATAR' | 'COR_CABELO' | 'OLHOS' | 'ADERECOS' | 'SAPATOS' | 'MEIAS' | 'LUVAS' | 'BRINCOS' | 'COLAR' | 'PULSEIRA' | 'RELOGIO' | 'MOCHILA' | 'OUTROS';

interface AvatarElemento {
  id?: string;
  nome: string;
  tipo: TipoElemento;
  cor?: string;
  imagens: string[]; // Para compatibilidade com o frontend
  arquivo?: string; // Campo do Prisma
  ativo: boolean;
}

interface GerenciadorElementosProps {
  tipo: TipoElemento;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  elementos: AvatarElemento[];
  onAdicionarElemento: (elemento: Omit<AvatarElemento, 'id'>) => void;
  onEditarElemento: (id: string, elemento: Partial<AvatarElemento>) => void;
  onRemoverElemento: (id: string) => void;
}

export function GerenciadorElementos({
  tipo,
  label,
  icon: Icon,
  elementos,
  onAdicionarElemento,
  onEditarElemento,
  onRemoverElemento
}: GerenciadorElementosProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [elementoEditando, setElementoEditando] = useState<AvatarElemento | null>(null);
  const [nomeElemento, setNomeElemento] = useState('');
  const [corElemento, setCorElemento] = useState('');
  const [imagensElemento, setImagensElemento] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  const abrirModalNovo = () => {
    setElementoEditando(null);
    setNomeElemento('');
    setCorElemento('');
    setImagensElemento([]);
    setUrlInput('');
    setModalAberto(true);
  };

  const abrirModalEditar = (elemento: AvatarElemento) => {
    setElementoEditando(elemento);
    setNomeElemento(elemento.nome);
    setCorElemento(elemento.cor || '');
    setImagensElemento(elemento.imagens);
    setUrlInput('');
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setElementoEditando(null);
    setNomeElemento('');
    setCorElemento('');
    setImagensElemento([]);
    setUrlInput('');
    setUploadingImages(false);
  };

  const salvarElemento = () => {
    if (!nomeElemento.trim()) return;

    const dadosElemento = {
      nome: nomeElemento,
      tipo,
      cor: corElemento || undefined,
      imagens: imagensElemento,
      ativo: true
    };

    if (elementoEditando) {
      onEditarElemento(elementoEditando.id!, dadosElemento);
    } else {
      onAdicionarElemento(dadosElemento);
    }

    fecharModal();
  };

  const adicionarImagemPorUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    
    // Validação básica de URL
    try {
      new URL(url);
      setImagensElemento(prev => [...prev, url]);
      setUrlInput('');
    } catch (error) {
      console.error('URL inválida:', error);
      // Aqui você pode adicionar um toast de erro se quiser
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadingImages(true);
    
    try {
      // Processar cada arquivo
      for (const file of Array.from(files)) {
        try {
          console.log('🚀 Iniciando upload de:', file.name);
          const imageUrl = await uploadImageToService(file);
          setImagensElemento(prev => [...prev, imageUrl]);
          console.log('✅ Upload concluído:', file.name);
        } catch (error) {
          console.error('❌ Erro ao fazer upload da imagem:', file.name, error);
          // Aqui você pode adicionar um toast de erro
        }
      }
    } finally {
      setUploadingImages(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  // Função real de upload que salva no blob e retorna URL
  const uploadImageToService = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.url) {
        throw new Error('Resposta inválida do servidor');
      }
      
      console.log('✅ Upload realizado com sucesso:', data.url);
      return data.url;
      
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      throw new Error(`Falha no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };



  const removerImagem = (index: number) => {
    setImagensElemento(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            Gerenciar {label}
          </CardTitle>
          <CardDescription>
            Adicione e configure elementos de {label.toLowerCase()} para este avatar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Botão para adicionar novo elemento */}
            <Button 
              type="button" 
              variant="outline" 
              onClick={abrirModalNovo}
              className="w-full border-dashed border-2 h-20 rounded-2xl hover:bg-gray-50"
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Adicionar {label}
                </span>
              </div>
            </Button>
            
            {/* Lista de elementos existentes */}
            {elementos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elementos.map((elemento) => (
                  <Card key={elemento.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm">{elemento.nome}</h4>
                          {elemento.cor && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              <Palette className="w-3 h-3 mr-1" />
                              {elemento.cor}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => abrirModalEditar(elemento)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => elemento.id && onRemoverElemento(elemento.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Preview das imagens */}
                      {elemento.imagens.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {elemento.imagens.slice(0, 3).map((imagem, index) => (
                            <img
                              key={index}
                              src={imagem}
                              alt={`${elemento.nome} ${index + 1}`}
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                          ))}
                          {elemento.imagens.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border text-xs text-gray-500">
                              +{elemento.imagens.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Palette className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum elemento de {label.toLowerCase()} adicionado ainda.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Clique no botão acima para adicionar o primeiro elemento.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para adicionar/editar elemento */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {elementoEditando ? `Editar ${label}` : `Adicionar ${label}`}
            </DialogTitle>
            <DialogDescription>
              {elementoEditando 
                ? `Edite as informações do elemento de ${label.toLowerCase()}.`
                : `Configure um novo elemento de ${label.toLowerCase()} para o avatar.`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Nome do elemento */}
            <div className="space-y-2">
              <Label htmlFor="nome-elemento">Nome do Elemento</Label>
              <Input
                id="nome-elemento"
                placeholder={`Ex: ${label} Azul`}
                value={nomeElemento}
                onChange={(e) => setNomeElemento(e.target.value)}
                className="rounded-2xl"
              />
            </div>

            {/* Cor do elemento */}
            <div className="space-y-2">
              <Label htmlFor="cor-elemento">Cor (Opcional)</Label>
              <Input
                id="cor-elemento"
                placeholder="Ex: Azul, Vermelho, Verde"
                value={corElemento}
                onChange={(e) => setCorElemento(e.target.value)}
                className="rounded-2xl"
              />
            </div>

            {/* URLs de imagens */}
            <div className="space-y-2">
              <Label>Imagens do Elemento</Label>
              <div className="space-y-4">
                {/* Input para adicionar URL */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Cole a URL da imagem aqui..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="rounded-2xl flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        adicionarImagemPorUrl();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={adicionarImagemPorUrl}
                    disabled={!urlInput.trim()}
                    className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500">
                  💡 Dica: Cole URLs de imagens (ex: https://exemplo.com/imagem.jpg)
                </div>
                
                {/* Ou fazer upload de arquivo */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-400 font-medium">OU</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                    id="elemento-images"
                  />
                  <label
                    htmlFor="elemento-images"
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      uploadingImages 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#27b99a] hover:bg-[#239d84] cursor-pointer'
                    } text-white`}
                  >
                    {uploadingImages ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Fazendo Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Fazer Upload de Imagens
                      </>
                    )}
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    📁 Faça upload e obtenha o link automaticamente
                  </div>
                </div>

                {/* Preview das imagens */}
                {imagensElemento.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {imagensElemento.map((imagem, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imagem}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 rounded-lg object-cover border"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removerImagem(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={fecharModal} className="rounded-full">
              Cancelar
            </Button>
            <Button 
              onClick={salvarElemento}
              disabled={!nomeElemento.trim()}
              className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full"
            >
              <Save className="mr-2 h-4 w-4" />
              {elementoEditando ? 'Salvar Alterações' : 'Adicionar Elemento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GerenciadorElementos;
