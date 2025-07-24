'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  createdAt: Date;
}

interface Tag {
  id: string;
  nome: string;
  slug: string;
  cor?: string;
  createdAt: Date;
}

interface ModalCategoriasTagsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalCategoriasTags({ isOpen, onClose }: ModalCategoriasTagsProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para adicionar nova categoria
  const [novaCategoria, setNovaCategoria] = useState({
    nome: '',
    descricao: ''
  });
  
  // Estados para adicionar nova tag
  const [novaTag, setNovaTag] = useState({
    nome: '',
    cor: '#27b99a'
  });
  
  // Estados para edição
  const [editandoCategoria, setEditandoCategoria] = useState<string | null>(null);
  const [editandoTag, setEditandoTag] = useState<string | null>(null);

  // Carregar categorias e tags
  useEffect(() => {
    if (isOpen) {
      carregarDados();
    }
  }, [isOpen]);

  const carregarDados = async () => {
    try {
      setIsLoading(true);
      
      const [categoriasRes, tagsRes] = await Promise.all([
        fetch('/api/categorias'),
        fetch('/api/tags')
      ]);
      
      if (categoriasRes.ok) {
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData.categorias || []);
      }
      
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        setTags(tagsData.tags || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar categorias e tags');
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarCategoria = async () => {
    if (!novaCategoria.nome.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCategoria)
      });

      if (response.ok) {
        const data = await response.json();
        setCategorias([...categorias, data.categoria]);
        setNovaCategoria({ nome: '', descricao: '' });
        toast.success('Categoria adicionada com sucesso!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao adicionar categoria');
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const adicionarTag = async () => {
    if (!novaTag.nome.trim()) {
      toast.error('Nome da tag é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTag)
      });

      if (response.ok) {
        const data = await response.json();
        setTags([...tags, data.tag]);
        setNovaTag({ nome: '', cor: '#27b99a' });
        toast.success('Tag adicionada com sucesso!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao adicionar tag');
      }
    } catch (error) {
      console.error('Erro ao adicionar tag:', error);
      toast.error('Erro ao adicionar tag');
    }
  };

  const excluirCategoria = async (id: string) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCategorias(categorias.filter(cat => cat.id !== id));
        toast.success('Categoria excluída com sucesso!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao excluir categoria');
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
    }
  };

  const excluirTag = async (id: string) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTags(tags.filter(tag => tag.id !== id));
        toast.success('Tag excluída com sucesso!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao excluir tag');
      }
    } catch (error) {
      console.error('Erro ao excluir tag:', error);
      toast.error('Erro ao excluir tag');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciar Categorias e Tags
          </DialogTitle>
          <DialogDescription>
            Adicione, edite ou remova categorias e tags para organizar seus produtos.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="categorias" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl">
            <TabsTrigger value="categorias" className="rounded-2xl">Categorias</TabsTrigger>
            <TabsTrigger value="tags" className="rounded-2xl">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="categorias" className="space-y-6">
            {/* Adicionar nova categoria */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Adicionar Nova Categoria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria-nome">Nome da Categoria</Label>
                  <Input
                    id="categoria-nome"
                    placeholder="Ex: Livros Infantis"
                    value={novaCategoria.nome}
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria-descricao">Descrição (Opcional)</Label>
                  <Input
                    id="categoria-descricao"
                    placeholder="Descrição da categoria"
                    value={novaCategoria.descricao}
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })}
                    className="rounded-2xl"
                  />
                </div>
              </div>
              <Button 
                onClick={adicionarCategoria}
                className="mt-4 rounded-2xl bg-[#27b99a] hover:bg-[#22a085] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Categoria
              </Button>
            </div>

            {/* Lista de categorias */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Categorias Existentes</h3>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27b99a] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Carregando categorias...</p>
                </div>
              ) : categorias.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma categoria encontrada
                </div>
              ) : (
                <div className="grid gap-3">
                  {categorias.map((categoria) => (
                    <div key={categoria.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border">
                      <div className="flex-1">
                        <h4 className="font-medium">{categoria.nome}</h4>
                        {categoria.descricao && (
                          <p className="text-sm text-gray-500 mt-1">{categoria.descricao}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Slug: {categoria.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditandoCategoria(categoria.id)}
                          className="rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => excluirCategoria(categoria.id)}
                          className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            {/* Adicionar nova tag */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Adicionar Nova Tag</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tag-nome">Nome da Tag</Label>
                  <Input
                    id="tag-nome"
                    placeholder="Ex: Personalizado"
                    value={novaTag.nome}
                    onChange={(e) => setNovaTag({ ...novaTag, nome: e.target.value })}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="tag-cor">Cor da Tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tag-cor"
                      type="color"
                      value={novaTag.cor}
                      onChange={(e) => setNovaTag({ ...novaTag, cor: e.target.value })}
                      className="w-16 h-10 rounded-2xl p-1"
                    />
                    <Input
                      placeholder="#27b99a"
                      value={novaTag.cor}
                      onChange={(e) => setNovaTag({ ...novaTag, cor: e.target.value })}
                      className="flex-1 rounded-2xl"
                    />
                  </div>
                </div>
              </div>
              <Button 
                onClick={adicionarTag}
                className="mt-4 rounded-2xl bg-[#ff0080] hover:bg-[#e6006b] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Tag
              </Button>
            </div>

            {/* Lista de tags */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Tags Existentes</h3>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0080] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Carregando tags...</p>
                </div>
              ) : tags.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma tag encontrada
                </div>
              ) : (
                <div className="grid gap-3">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge 
                          className="rounded-full" 
                          style={{ backgroundColor: tag.cor, color: '#fff' }}
                        >
                          {tag.nome}
                        </Badge>
                        <div>
                          <p className="text-xs text-gray-400">Slug: {tag.slug}</p>
                          <p className="text-xs text-gray-400">Cor: {tag.cor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditandoTag(tag.id)}
                          className="rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => excluirTag(tag.id)}
                          className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onClose}
            variant="outline"
            className="rounded-2xl"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
