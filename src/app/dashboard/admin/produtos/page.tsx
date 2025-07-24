'use client';

import { useState, useEffect } from 'react';
import { CardsEstatisticas } from './components/cards-estatisticas';
import { FiltrosProdutos } from './components/filtros-produtos';
import { TabelaProdutos } from './components/tabela-produtos';
import { ModalProdutoForm } from './components/modais/modal-produto-form';
import { ModalCategoriasTags } from './components/modais/modal-categorias-tags';
import { ModalVisualizarProduto } from './components/modais/modal-visualizar-produto';
import { ModalExcluirProduto } from './components/modais/modal-excluir-produto';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Produto inicial vazio para o modal de adição
const produtoVazio = {
  titulo: '',
  slug: '',
  preco: 0,
  estoque: 0,
  galeria: [],
  emDestaque: false,
  ativo: true,
  categorias: [],
  tags: []
};

export default function AdminProdutosPage() {
  // Estados para controlar os modais
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [isModalCategoriasTagsOpen, setIsModalCategoriasTagsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'criar' | 'editar'>('criar');
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(produtoVazio);

  
  // Filtros
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    precoMin: undefined,
    precoMax: undefined,
    estoqueMin: undefined,
    estoqueMax: undefined,
    status: undefined,
    emDestaque: undefined
  });

  // Funções para abrir os modais
  const abrirModalAdicionar = () => {
    setProdutoSelecionado(produtoVazio);
    setModalMode('criar');
    setIsModalFormOpen(true);
  };

  const abrirModalEditar = (produto: any) => {
    setProdutoSelecionado(produto);
    setModalMode('editar');
    setIsModalFormOpen(true);
  };

  const abrirModalVisualizar = (produto: any) => {
    setProdutoSelecionado(produto);
    setIsVisualizarModalOpen(true);
  };

  const abrirModalExcluir = (produto: any) => {
    setProdutoSelecionado(produto);
    setIsExcluirModalOpen(true);
  };

  // Função para atualizar os filtros
  const atualizarFiltros = (novosFiltros: any) => {
    setFiltros({ ...filtros, ...novosFiltros });
  };

  // Função para excluir produto
  const handleExcluirProduto = async (produtoId: string) => {
    try {
      const response = await fetch(`/api/produtos/${produtoId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Produto excluído com sucesso!');
        // Recarregar a página para mostrar as alterações
        window.location.reload();
      } else {
        throw new Error(data.error || 'Erro ao excluir produto');
      }
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      toast.error(`Erro ao excluir produto: ${error.message}`);
    }
  };

  // Função para lidar com ações na tabela
  const handleAcaoTabela = (acao: string, produto: any) => {
    switch (acao) {
      case 'visualizar':
        abrirModalVisualizar(produto);
        break;
      case 'editar':
        abrirModalEditar(produto);
        break;
      case 'excluir':
        abrirModalExcluir(produto);
        break;
      default:
        console.error('Ação não reconhecida:', acao);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie todos os produtos da loja, adicione novos ou edite os existentes.
        </p>
      </div>

      {/* Cards estatísticos */}
      <CardsEstatisticas />

      {/* Filtros */}
      <FiltrosProdutos 
        filtros={filtros} 
        onAtualizarFiltros={atualizarFiltros} 
        onAdicionarProduto={abrirModalAdicionar}
        onGerenciarCategoriasTags={() => setIsModalCategoriasTagsOpen(true)}
      />
      
      {/* Tabela de produtos */}
      <TabelaProdutos onAcao={handleAcaoTabela} filtros={filtros} />
      
      {/* Modal de Adicionar/Editar Produto */}
      <ModalProdutoForm 
        isOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        produto={produtoSelecionado}
        modo={modalMode}
      />
      
      {/* Modal de Visualizar Produto */}
      {produtoSelecionado && (
        <ModalVisualizarProduto 
          isOpen={isVisualizarModalOpen}
          onClose={() => setIsVisualizarModalOpen(false)}
          produto={produtoSelecionado}
          onEdit={(produto) => {
            setIsVisualizarModalOpen(false);
            abrirModalEditar(produto);
          }}
        />
      )}
      
      {/* Modal de Excluir Produto */}
      {produtoSelecionado && (
        <ModalExcluirProduto 
          isOpen={isExcluirModalOpen}
          onClose={() => setIsExcluirModalOpen(false)}
          produto={produtoSelecionado}
          onConfirm={() => {
            if (produtoSelecionado?.id) {
              handleExcluirProduto(produtoSelecionado.id);
            }
            setIsExcluirModalOpen(false);
          }}
        />
      )}
      
      {/* Modal de Categorias e Tags */}
      <ModalCategoriasTags 
        isOpen={isModalCategoriasTagsOpen}
        onClose={() => setIsModalCategoriasTagsOpen(false)}
      />
    </div>
  );
}
