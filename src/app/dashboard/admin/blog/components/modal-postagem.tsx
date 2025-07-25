'use client';

import { useEffect, useState } from 'react';
import { X, Upload, FileText, Hash, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostagemDados, CategoriaDados } from '../page';

// Interface para as tags
interface TagProps {
  id: string;
  nome: string;
}

interface ModalPostagemProps {
  isOpen: boolean;
  onClose: () => void;
  postagemParaEditar: PostagemDados | null;
  onSalvar: (postagem: PostagemDados) => void;
  categorias: CategoriaDados[];
}

export function ModalPostagem({ 
  isOpen, 
  onClose, 
  postagemParaEditar, 
  onSalvar, 
  categorias 
}: ModalPostagemProps) {
  // Estado para os campos do formulário
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('');
  const [fotoCapa, setFotoCapa] = useState('');
  const [fotoCapaPreview, setFotoCapaPreview] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [ativo, setAtivo] = useState(false);
  const [palavrasChave, setPalavrasChave] = useState('');
  const [tags, setTags] = useState<TagProps[]>([]);
  const [novaTag, setNovaTag] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('conteudo');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Preencher o formulário quando editar uma postagem existente
  useEffect(() => {
    if (postagemParaEditar) {
      setTitulo(postagemParaEditar.titulo || '');
      setSlug(postagemParaEditar.slug || '');
      setResumo(postagemParaEditar.resumo || '');
      setConteudo(postagemParaEditar.conteudo || '');
      setAutor(postagemParaEditar.autor || '');
      setFotoCapa(postagemParaEditar.fotoCapa || '');
      setFotoCapaPreview(postagemParaEditar.fotoCapa || '');
      setCategoriaId(postagemParaEditar.categoriaId || 'none');
      setAtivo(postagemParaEditar.ativo);
      setPalavrasChave(postagemParaEditar.palavrasChave || '');
      setTags(postagemParaEditar.tags || []);
    } else {
      // Reset para valores padrão quando criar nova postagem
      setTitulo('');
      setSlug('');
      setResumo('');
      setConteudo('<p>Digite o conteúdo da postagem aqui...</p>');
      setAutor('');
      setFotoCapa('');
      setFotoCapaPreview('');
      setCategoriaId('none');
      setAtivo(false);
      setPalavrasChave('');
      setTags([]);
    }
  }, [postagemParaEditar]);

  // Gerar slug automaticamente a partir do título
  const gerarSlug = () => {
    const slugGerado = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    setSlug(slugGerado);
  };

  // Funções para manipulação de tags
  const adicionarTag = () => {
    if (!novaTag.trim()) return;
    
    // Verificar se a tag já existe
    const tagExiste = tags.some(
      tag => tag.nome.toLowerCase() === novaTag.trim().toLowerCase()
    );
    
    if (!tagExiste) {
      const novaTagObj = {
        id: Math.random().toString(36).substr(2, 9),
        nome: novaTag.trim()
      };
      setTags([...tags, novaTagObj]);
    }
    
    setNovaTag('');
  };

  const removerTag = (idTag: string) => {
    setTags(tags.filter(tag => tag.id !== idTag));
  };

  // Upload de imagem para Vercel Blob
  const handleImagemChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // Criar preview local imediatamente
      const tempURL = URL.createObjectURL(file);
      setFotoCapaPreview(tempURL);

      // Fazer upload para Vercel Blob
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;
        
        // Atualizar com URL real
        setFotoCapa(imageUrl);
        setFotoCapaPreview(imageUrl);
      } else {
        console.error('Erro no upload:', response.statusText);
        // Em caso de erro, manter preview local
        setFotoCapa(tempURL);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      // Em caso de erro, usar preview local
      const tempURL = URL.createObjectURL(file);
      setFotoCapa(tempURL);
      setFotoCapaPreview(tempURL);
    } finally {
      setUploadingImage(false);
    }
  };

  // Manipular o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!titulo.trim() || !conteudo.trim()) {
      alert('Por favor, preencha os campos obrigatórios: título e conteúdo.');
      return;
    }
    
    const slugFinal = slug.trim() || 
      titulo.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    
    const postagemAtualizada: PostagemDados = {
      id: postagemParaEditar?.id || '',
      titulo: titulo.trim(),
      slug: slugFinal,
      conteudo: conteudo.trim(),
      resumo: resumo.trim(),
      fotoCapa: fotoCapa,
      categoriaId: categoriaId === 'none' ? undefined : categoriaId,
      categoriaNome: categoriaId !== 'none' ? categorias.find(c => c.id === categoriaId)?.nome : undefined,
      autor: autor.trim(),
      palavrasChave: palavrasChave.trim(),
      pontuacaoSEO: postagemParaEditar?.pontuacaoSEO || Math.floor(Math.random() * 30) + 70,
      tags: tags,
      ativo: ativo,
      visualizacoes: postagemParaEditar?.visualizacoes || 0,
      createdAt: postagemParaEditar?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSalvar(postagemAtualizada);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {postagemParaEditar ? 'Editar Postagem' : 'Nova Postagem'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="grid grid-cols-3 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1">
              <TabsTrigger 
                value="conteudo" 
                className="data-[state=active]:bg-[#27b99a] data-[state=active]:text-white dark:data-[state=active]:bg-[#27b99a] dark:data-[state=active]:text-white rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger 
                value="seo" 
                className="data-[state=active]:bg-[#ff0080] data-[state=active]:text-white dark:data-[state=active]:bg-[#ff0080] dark:data-[state=active]:text-white rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <Hash className="w-4 h-4" />
                SEO
              </TabsTrigger>
              <TabsTrigger 
                value="configuracoes" 
                className="data-[state=active]:bg-[#27b99a] data-[state=active]:text-white dark:data-[state=active]:bg-[#27b99a] dark:data-[state=active]:text-white rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="conteudo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-[#27b99a] dark:text-[#27b99a] font-medium">
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  onBlur={gerarSlug}
                  placeholder="Digite o título da postagem"
                  className="border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] rounded-2xl transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-[#27b99a] dark:text-[#27b99a] font-medium">
                  Slug <span className="text-gray-400 text-sm">(URL)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-da-postagem"
                    className="border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] rounded-2xl transition-all duration-200"
                  />
                  <Button 
                    type="button" 
                    onClick={gerarSlug} 
                    variant="outline"
                    className="border-[#27b99a] hover:bg-[#27b99a] hover:text-white text-[#27b99a] rounded-2xl transition-all duration-200"
                  >
                    Gerar
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resumo" className="text-[#27b99a] dark:text-[#27b99a] font-medium">
                  Resumo
                </Label>
                <Textarea
                  id="resumo"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Digite um breve resumo da postagem"
                  className="border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] min-h-20 rounded-2xl transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conteudo" className="text-[#27b99a] dark:text-[#27b99a] font-medium">
                  Conteúdo <span className="text-red-500">*</span>
                </Label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 min-h-[200px] bg-white dark:bg-gray-800 transition-all duration-200 focus-within:border-[#27b99a]">
                  {/* Aqui você adicionaria um editor de texto rico */}
                  <Textarea
                    id="conteudo"
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    placeholder="Digite o conteúdo da postagem"
                    className="border-0 focus:ring-0 min-h-[180px] resize-none"
                    required
                  />
                </div>
                <p className="text-xs text-[#27b99a]">
                  Dica: Você pode adicionar formatação HTML básica
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#27b99a] dark:text-[#27b99a] font-medium">
                  Imagem de capa
                </Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 border border-dashed border-[#27b99a]/30 dark:border-[#27b99a]/50 rounded-2xl p-6 flex flex-col items-center justify-center bg-[#27b99a]/5 dark:bg-[#27b99a]/10 hover:bg-[#27b99a]/10 dark:hover:bg-[#27b99a]/20 transition-all duration-200">
                    <input 
                      type="file" 
                      id="fotoCapa" 
                      accept="image/*" 
                      onChange={handleImagemChange} 
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <label 
                      htmlFor="fotoCapa" 
                      className={`cursor-pointer flex flex-col items-center justify-center w-full h-full ${
                        uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-12 w-12 text-[#27b99a] mb-3 animate-spin" />
                      ) : (
                        <Upload className="h-12 w-12 text-[#27b99a] mb-3" />
                      )}
                      <span className="text-sm text-[#27b99a] dark:text-[#27b99a] text-center font-medium">
                        {uploadingImage ? 'Fazendo upload...' : 'Clique para fazer upload'} <br/>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                          (PNG, JPG, GIF até 2MB)
                        </span>
                      </span>
                    </label>
                  </div>
                  
                  {fotoCapaPreview && (
                    <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                      <div className="relative h-full w-full min-h-[120px]">
                        <img 
                          src={fotoCapaPreview} 
                          alt="Preview" 
                          className="object-cover h-full w-full"
                        />
                        <Button 
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => {
                            setFotoCapa('');
                            setFotoCapaPreview('');
                          }}
                          className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="palavrasChave" className="text-[#ff0080] dark:text-[#ff0080] font-medium">
                  Palavras-chave
                </Label>
                <Input
                  id="palavrasChave"
                  value={palavrasChave}
                  onChange={(e) => setPalavrasChave(e.target.value)}
                  placeholder="Palavras-chave separadas por vírgula"
                  className="border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080] rounded-2xl transition-all duration-200"
                />
                <p className="text-xs text-[#ff0080]">
                  Dica: Use entre 3 a 5 palavras-chave principais separadas por vírgula
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#ff0080] dark:text-[#ff0080] font-medium">
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={novaTag}
                    onChange={(e) => setNovaTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarTag())}
                    placeholder="Adicionar tag"
                    className="border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080] rounded-2xl transition-all duration-200"
                  />
                  <Button 
                    type="button" 
                    onClick={adicionarTag}
                    variant="outline"
                    className="border-[#ff0080] hover:bg-[#ff0080] hover:text-white text-[#ff0080] rounded-2xl transition-all duration-200"
                  >
                    Adicionar
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map(tag => (
                    <div 
                      key={tag.id}
                      className="bg-[#ff0080]/10 text-[#ff0080] dark:bg-[#ff0080]/20 dark:text-[#ff0080] rounded-full px-3 py-1.5 text-sm flex items-center gap-2 border border-[#ff0080]/20"
                    >
                      <span className="font-medium">{tag.nome}</span>
                      <Button
                        type="button"
                        onClick={() => removerTag(tag.id)}
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 text-[#ff0080] hover:text-white hover:bg-[#ff0080] rounded-full transition-all duration-200"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {tags.length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      Nenhuma tag adicionada
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="configuracoes" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-[#27b99a] dark:text-[#27b99a] font-medium">
                    Categoria
                  </Label>
                  <Select value={categoriaId} onValueChange={setCategoriaId}>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] rounded-2xl transition-all duration-200">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem categoria</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="autor" className="text-[#27b99a] dark:text-[#27b99a] font-medium">
                    Autor
                  </Label>
                  <Input
                    id="autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    placeholder="Nome do autor"
                    className="border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] rounded-2xl transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6 p-4 bg-[#27b99a]/5 dark:bg-[#27b99a]/10 rounded-2xl border border-[#27b99a]/20">
                <Switch 
                  id="ativo" 
                  checked={ativo} 
                  onCheckedChange={setAtivo} 
                  className="data-[state=checked]:bg-[#27b99a]"
                />
                <Label htmlFor="ativo" className="cursor-pointer text-[#27b99a] dark:text-[#27b99a] font-medium">
                  Publicar postagem imediatamente?
                </Label>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium mr-2">Status:</span> 
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                ativo 
                  ? 'bg-[#27b99a]/10 text-[#27b99a] border border-[#27b99a]/20' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
              }`}>
                {ativo ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                onClick={onClose}
                variant="outline"
                className="border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl px-6 transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-2xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {postagemParaEditar ? 'Atualizar Postagem' : 'Criar Postagem'}
              </Button>
            </div>
          </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
