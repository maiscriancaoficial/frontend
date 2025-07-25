'use client';

import { useState } from 'react';
import { CardsEstatisticas } from './components/cards-estatisticas';
import { FiltrosLivros } from './components/filtros-livros';
import { TabelaLivros } from './components/tabela-livros';
import { ModalLivroNovo } from './components/modais/modal-livro-novo';
import { ModalLivroForm } from './components/modais/modal-livro-form';
import { ModalLivroVisualizar } from './components/modais/modal-livro-visualizar';
import { ModalLivroExcluir } from './components/modais/modal-livro-excluir';
import { useRouter } from 'next/navigation';

export default function AdminLivrosPage() {
  const router = useRouter();

  // Estados para controlar os filtros
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    status: undefined,
    faixaEtaria: undefined,
    dataPublicacao: undefined,
  });

  // Estados para controlar modais
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState<any | null>(null);

  // Funções para controle dos filtros
  const handleAtualizarFiltros = (novosFiltros: any) => {
    setFiltros(novosFiltros);
  };

  // Função para lidar com ações na tabela
  const handleAcaoTabela = (acao: string, livro: any) => {
    setLivroSelecionado(livro);

    switch (acao) {
      case 'visualizar':
        setModalVisualizarAberto(true);
        break;
      case 'editar':
        setModalEditarAberto(true);
        break;
      case 'excluir':
        setModalExcluirAberto(true);
        break;
      case 'previa':
        // Aqui vamos redirecionar para a página de prévia do livro
        const categoriaSlug = livro.categoriasLink?.[0]?.categoria?.slug || 'personalizado';
        router.push(`/categoria-livro/${categoriaSlug}/livro/${livro.id}/previa-livro`);
        break;
      default:
        console.log(`Ação não reconhecida: ${acao}`);
    }
  };

  // Funções para salvar livros
  const handleCriarLivro = async (dados: any) => {
    try {
      const response = await fetch('/api/livros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      const result = await response.json();
      if (result.success) {
        // Recarregar dados
        window.location.reload();
      } else {
        throw new Error(result.error || 'Erro ao criar livro');
      }
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      throw error;
    }
  };

  const handleEditarLivro = async (dados: any) => {
    if (!livroSelecionado) return;

    try {
      const response = await fetch(`/api/livros/${livroSelecionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      const result = await response.json();
      if (result.success) {
        // Recarregar dados
        window.location.reload();
      } else {
        throw new Error(result.error || 'Erro ao atualizar livro');
      }
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      throw error;
    }
  };

  // Função para abrir modal de criação
  const handleAdicionarLivro = () => {
    setLivroSelecionado(null); // Limpa qualquer seleção anterior
    setModalCriarAberto(true);
  };

  // Função para ir da visualização para edição
  const handleVisualizarParaEditar = () => {
    setModalVisualizarAberto(false);
    setModalEditarAberto(true);
  };

  // Função para ir da visualização para prévia
  const handleVisualizarParaPrevia = () => {
    if (livroSelecionado) {
      const categoriaSlug = livroSelecionado.categoriasLink?.[0]?.categoria?.slug || 'personalizado';
      router.push(`/categoria-livro/${categoriaSlug}/livro/${livroSelecionado.id}/previa-livro`);
    }
  };

  // Mapeando o objeto livro para o formato esperado pelo Prisma
  const mapearLivroParaPrisma = (livro: any) => {
    return {
      id: livro.id,
      nome: livro.titulo, // O Prisma usa "nome" em vez de "titulo"
      descricao: livro.descricao,
      descricaoCompleta: livro.resumo, // O Prisma usa "descricaoCompleta" em vez de "resumo"
      preco: livro.precoFisico,
      precoPromocional: livro.descontoFisico > 0 
        ? livro.precoFisico - (livro.precoFisico * livro.descontoFisico / 100) 
        : null,
      capa: livro.capa || '',
      ativo: livro.ativo,
      emDestaque: false, // Valor padrão
      // Outros campos conforme necessário
      categoriasLink: livro.categoria 
        ? [{ categoriaId: livro.categoria, livroId: livro.id }]
        : [],
      // Campos para relacionamentos que existem no Prisma
      personalizacoes: [],
      paginas: [],
      beneficios: [],
      tagsLink: []
    };
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Livros</h1>
      </div>

      {/* Cards de estatísticas */}
      <CardsEstatisticas />

      {/* Filtros e botão para adicionar */}
      <FiltrosLivros 
        filtros={filtros} 
        onAtualizarFiltros={handleAtualizarFiltros}
        onAdicionarLivro={handleAdicionarLivro}
      />

      {/* Tabela de livros */}
      <TabelaLivros 
        filtros={filtros}
        onAcao={handleAcaoTabela}
      />

      {/* Modais */}
      <ModalLivroNovo
        isOpen={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onSalvar={handleCriarLivro}
        isEditando={false}
      />

      <ModalLivroNovo
        isOpen={modalEditarAberto}
        onClose={() => setModalEditarAberto(false)}
        onSalvar={handleEditarLivro}
        livroParaEdicao={livroSelecionado}
        isEditando={true}
      />

      <ModalLivroVisualizar
        isOpen={modalVisualizarAberto}
        onClose={() => setModalVisualizarAberto(false)}
        livro={livroSelecionado}
        onEdit={handleVisualizarParaEditar}
        onPreview={handleVisualizarParaPrevia}
      />

      <ModalLivroExcluir
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        livro={livroSelecionado}
      />
    </div>
  );
}
