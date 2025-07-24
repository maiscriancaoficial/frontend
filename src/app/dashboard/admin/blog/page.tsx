'use client';

import { useState, useEffect } from 'react';
import { Pencil, Plus, Hash, FileText, Eye, Users, TrendingUp, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ListaPostagens } from './components/lista-postagens';
import { FiltroBlog } from './components/filtro-blog';
import { ModalPostagem } from './components/modal-postagem';
import { ModalCategoria } from './components/modal-categoria';

// Interface para dados da postagem
export interface PostagemDados {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string;
  resumo?: string;
  fotoCapa?: string;
  categoriaId?: string;
  categoriaNome?: string;
  autor?: string;
  palavrasChave?: string;
  pontuacaoSEO?: number;
  tags: Array<{id: string, nome: string}>;
  ativo: boolean;
  visualizacoes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para categoria
export interface CategoriaDados {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  quantidadePostagens: number;
}

// Funções para interagir com as APIs
async function buscarPostagens() {
  try {
    const response = await fetch('/api/postagens');
    if (!response.ok) throw new Error('Erro ao buscar postagens');
    const data = await response.json();
    return data.postagens || [];
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
    return [];
  }
}

async function buscarCategorias() {
  try {
    const response = await fetch('/api/categorias-blog');
    if (!response.ok) throw new Error('Erro ao buscar categorias');
    const data = await response.json();
    return data.map((cat: any) => ({
      id: cat.id,
      nome: cat.nome,
      slug: cat.slug,
      descricao: cat.descricao,
      quantidadePostagens: cat._count?.postagens || 0
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

async function salvarPostagem(postagem: Partial<PostagemDados>) {
  try {
    const url = postagem.id ? `/api/postagens/${postagem.id}` : '/api/postagens';
    const method = postagem.id ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: postagem.titulo,
        conteudo: postagem.conteudo,
        resumo: postagem.resumo,
        fotoCapa: postagem.fotoCapa,
        categoriaBlogId: postagem.categoriaId,
        autor: postagem.autor,
        palavrasChave: postagem.palavrasChave,
        pontuacaoSEO: postagem.pontuacaoSEO,
        ativo: postagem.ativo,
        tags: postagem.tags?.map(tag => typeof tag === 'string' ? tag : tag.nome) || []
      })
    });
    
    if (!response.ok) throw new Error('Erro ao salvar postagem');
    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar postagem:', error);
    throw error;
  }
}

async function excluirPostagem(id: string) {
  try {
    const response = await fetch(`/api/postagens/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erro ao excluir postagem');
    return true;
  } catch (error) {
    console.error('Erro ao excluir postagem:', error);
    throw error;
  }
}

async function alterarStatusPostagem(id: string, novoStatus: boolean) {
  try {
    const response = await fetch(`/api/postagens/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ativo: novoStatus })
    });
    
    if (!response.ok) throw new Error('Erro ao alterar status');
    return await response.json();
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    throw error;
  }
}

async function salvarCategoria(categoria: Partial<CategoriaDados>) {
  try {
    const url = categoria.id ? `/api/categorias-blog/${categoria.id}` : '/api/categorias-blog';
    const method = categoria.id ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: categoria.nome,
        descricao: categoria.descricao,
        ativo: true
      })
    });
    
    if (!response.ok) throw new Error('Erro ao salvar categoria');
    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar categoria:', error);
    throw error;
  }
}

async function excluirCategoria(id: string) {
  try {
    const response = await fetch(`/api/categorias-blog/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erro ao excluir categoria');
    return true;
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    throw error;
  }
}

export default function AdminBlogPage() {
  const [postagens, setPostagens] = useState<PostagemDados[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDados[]>([]);
  const [postagemParaEditar, setPostagemParaEditar] = useState<PostagemDados | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<CategoriaDados | null>(null);
  const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState('postagens');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [carregando, setCarregando] = useState(true);
  const [estatisticas, setEstatisticas] = useState({
    totalPostagens: 0,
    postagensAtivas: 0,
    totalVisualizacoes: 0,
    postagensRecentes: 0
  });

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [postagensData, categoriasData] = await Promise.all([
        buscarPostagens(),
        buscarCategorias()
      ]);
      
      setPostagens(postagensData);
      setCategorias(categoriasData);
      
      // Calcular estatísticas
      const totalPostagens = postagensData.length;
      const postagensAtivas = postagensData.filter((p: PostagemDados) => p.ativo).length;
      const totalVisualizacoes = postagensData.reduce((acc: number, p: PostagemDados) => acc + (p.visualizacoes || 0), 0);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 30);
      const postagensRecentes = postagensData.filter((p: PostagemDados) => new Date(p.createdAt) > dataLimite).length;
      
      setEstatisticas({
        totalPostagens,
        postagensAtivas,
        totalVisualizacoes,
        postagensRecentes
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Postagens filtradas com base nos critérios
  const postagensFiltradas = postagens.filter(postagem => {
    // Filtro de texto
    const textoMatch = 
      postagem.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (postagem.resumo && postagem.resumo.toLowerCase().includes(filtroTexto.toLowerCase())) ||
      (postagem.autor && postagem.autor.toLowerCase().includes(filtroTexto.toLowerCase()));
    
    // Filtro de categoria
    const categoriaMatch = filtroCategoria === 'todas' || postagem.categoriaId === filtroCategoria;
    
    return textoMatch && categoriaMatch;
  });

  // Funções para manipulação de postagens
  const handleNovaPostagem = () => {
    setPostagemParaEditar(null);
    setModalAberto(true);
  };

  const handleEditarPostagem = (postagem: PostagemDados) => {
    setPostagemParaEditar(postagem);
    setModalAberto(true);
  };

  const handleAlterarStatus = async (id: string) => {
    try {
      const postagem = postagens.find(p => p.id === id);
      if (!postagem) return;
      
      await alterarStatusPostagem(id, !postagem.ativo);
      await carregarDados(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status da postagem');
    }
  };

  const handleExcluirPostagem = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta postagem?')) return;
    
    try {
      await excluirPostagem(id);
      await carregarDados(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao excluir postagem:', error);
      alert('Erro ao excluir postagem');
    }
  };

  const handleSalvarPostagem = async (postagem: PostagemDados) => {
    try {
      await salvarPostagem(postagem);
      await carregarDados(); // Recarregar dados
      setModalAberto(false);
    } catch (error) {
      console.error('Erro ao salvar postagem:', error);
      alert('Erro ao salvar postagem');
    }
  };

  // Funções para categorias
  const handleNovaCategoria = () => {
    setCategoriaParaEditar(null);
    setModalCategoriaAberto(true);
  };

  const handleEditarCategoria = (categoria: CategoriaDados) => {
    setCategoriaParaEditar(categoria);
    setModalCategoriaAberto(true);
  };

  const handleExcluirCategoria = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    
    try {
      await excluirCategoria(id);
      await carregarDados();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria. Verifique se não há postagens vinculadas.');
    }
  };

  const handleSalvarCategoria = async (categoria: CategoriaDados) => {
    try {
      await salvarCategoria(categoria);
      await carregarDados();
      setModalCategoriaAberto(false);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Blog</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie o conteúdo do blog do sistema, publique novos artigos e organize as categorias.
        </p>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Artigos</CardTitle>
            <FileText className="h-4 w-4 text-[#27b99a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postagens.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[#27b99a] font-medium">+5%</span> no último mês
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artigos Publicados</CardTitle>
            <Eye className="h-4 w-4 text-[#ff0080]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postagens.filter(p => p.ativo).length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[#ff0080] font-medium">{Math.round(postagens.filter(p => p.ativo).length / postagens.length * 100)}%</span> do total
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Hash className="h-4 w-4 text-[#27b99a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length}</div>
            <p className="text-xs text-muted-foreground">
              Organizadas e ativas
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#ff0080]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postagens.reduce((acc, p) => acc + p.visualizacoes, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[#27b99a] font-medium">+12%</span> este mês
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Botões de ação */}
      <div className="flex justify-end gap-2">
        {abaSelecionada === 'postagens' && (
          <Button
            onClick={handleNovaPostagem}
            className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full flex items-center gap-1"
            size="sm"
          >
            <Plus size={16} />
            <span>Nova Postagem</span>
          </Button>
        )}
        
        {abaSelecionada === 'categorias' && (
          <Button
            onClick={handleNovaCategoria}
            variant="outline"
            className="border-gray-200 rounded-full flex items-center gap-1"
            size="sm"
          >
            <Hash size={16} />
            <span>Nova Categoria</span>
          </Button>
        )}
      </div>
      
      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="w-full">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <TabsList className="bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger 
              value="postagens" 
              className="data-[state=active]:bg-[#27b99a]/10 data-[state=active]:text-[#27b99a] dark:data-[state=active]:bg-[#27b99a]/20 dark:data-[state=active]:text-[#27b99a] rounded-t-2xl border-b-2 border-transparent data-[state=active]:border-[#27b99a] px-6 py-3 font-medium transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Postagens
            </TabsTrigger>
            <TabsTrigger 
              value="categorias" 
              className="data-[state=active]:bg-[#ff0080]/10 data-[state=active]:text-[#ff0080] dark:data-[state=active]:bg-[#ff0080]/20 dark:data-[state=active]:text-[#ff0080] rounded-t-2xl border-b-2 border-transparent data-[state=active]:border-[#ff0080] px-6 py-3 font-medium transition-all duration-200"
            >
              <Hash className="w-4 h-4 mr-2" />
              Categorias
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="postagens" className="mt-4">
          {/* Filtro de busca e categorias */}
          <FiltroBlog 
            onBuscar={setFiltroTexto} 
            onCategoriaChange={setFiltroCategoria} 
            categorias={categorias}
            categoriaAtual={filtroCategoria}
          />
          
          {/* Lista de postagens */}
          <div className="mt-6">
            {postagensFiltradas.length === 0 ? (
              <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-[#27b99a]/10 dark:bg-[#27b99a]/20 p-6 rounded-full mb-6">
                  <FileText size={48} className="text-[#27b99a]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma postagem encontrada</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  {filtroTexto || filtroCategoria !== 'todas' 
                    ? 'Tente ajustar seus filtros de busca para encontrar o que procura' 
                    : 'Comece criando sua primeira postagem para o blog e compartilhe conhecimento com seus leitores'}
                </p>
                <Button 
                  onClick={handleNovaPostagem} 
                  className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full px-6 py-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar nova postagem
                </Button>
              </Card>
            ) : (
              <ListaPostagens 
                postagens={postagensFiltradas} 
                categorias={categorias}
                onEditar={handleEditarPostagem}
                onAlterarStatus={handleAlterarStatus}
                onExcluir={handleExcluirPostagem}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="categorias" className="mt-4">
          <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800">
            <CardHeader className="bg-gradient-to-r from-[#ff0080]/5 to-transparent dark:from-[#ff0080]/10 dark:to-transparent">
              <CardTitle className="text-xl font-semibold text-[#ff0080] dark:text-[#ff0080] flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Gerenciamento de Categorias
              </CardTitle>
              <CardDescription>
                Organize e gerencie as categorias do seu blog para melhor classificação do conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorias.map((categoria) => (
                  <Card key={categoria.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{categoria.nome}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{categoria.descricao}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2 bg-[#ff0080]/10 text-[#ff0080] border-[#ff0080]/20">
                          {categoria.quantidadePostagens}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-400 font-mono">/{categoria.slug}</span>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-[#ff0080]/10"
                            onClick={() => handleEditarCategoria(categoria)}
                          >
                            <Pencil className="w-3 h-3 text-[#ff0080]" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleExcluirCategoria(categoria.id)}
                          >
                            <Hash className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
      
      {/* Modal de criação/edição de postagem */}
      <ModalPostagem 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        postagemParaEditar={postagemParaEditar} 
        onSalvar={handleSalvarPostagem}
        categorias={categorias}
      />
      
      {/* Modal de criação/edição de categoria */}
      <ModalCategoria 
        isOpen={modalCategoriaAberto} 
        onClose={() => setModalCategoriaAberto(false)} 
        categoriaParaEditar={categoriaParaEditar} 
        onSalvar={handleSalvarCategoria}
      />
    </div>
  );
}
