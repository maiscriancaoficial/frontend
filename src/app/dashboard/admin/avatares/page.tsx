'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CardsEstatisticas } from './components/cards-estatisticas';
import { FiltrosAvatares } from './components/filtros-avatares';
import { TabelaAvatares } from './components/tabela-avatares';
import { ModalAvatarNovo } from './components/modais/modal-avatar-novo';
import { ModalAvatarVisualizar } from './components/modais/modal-avatar-visualizar';
import { ModalAvatarExcluir } from './components/modais/modal-avatar-excluir';

export default function AdminAvataresPage() {
  // Estados para controlar os filtros
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: '',
    status: undefined,
  });

  // Estados para controlar modais
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [avatarSelecionado, setAvatarSelecionado] = useState<any | null>(null);

  // Funções para controle dos filtros
  const handleAtualizarFiltros = (novosFiltros: any) => {
    setFiltros(novosFiltros);
  };

  // Funções de CRUD
  const handleCriarAvatar = async (dados: any) => {
    try {
      console.log('Dados enviados para API:', dados);
      
      const response = await fetch('/api/avatares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      const result = await response.json();
      console.log('Resposta da API:', result);

      if (!response.ok) {
        const errorMessage = result.error || 'Erro ao criar avatar';
        throw new Error(errorMessage);
      }

      toast.success('Avatar criado com sucesso!');
      // Recarregar dados se necessário
      return result.avatar;
    } catch (error) {
      console.error('Erro ao criar avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar avatar';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditarAvatar = async (dados: any) => {
    try {
      const response = await fetch(`/api/avatares/${avatarSelecionado?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao editar avatar');
      }

      toast.success('Avatar atualizado com sucesso!');
      // Recarregar dados se necessário
    } catch (error) {
      console.error('Erro ao editar avatar:', error);
      toast.error('Erro ao editar avatar');
      throw error;
    }
  };

  // Função para lidar com ações na tabela
  const handleAcaoTabela = (acao: string, avatar: any) => {
    setAvatarSelecionado(avatar);

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
      default:
        console.log(`Ação não reconhecida: ${acao}`);
    }
  };

  // Função para abrir modal de criação
  const handleAdicionarAvatar = () => {
    setAvatarSelecionado(null); // Limpa qualquer seleção anterior
    setModalCriarAberto(true);
  };

  // Função para ir da visualização para edição
  const handleVisualizarParaEditar = () => {
    setModalVisualizarAberto(false);
    setModalEditarAberto(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Avatares</h1>
      </div>

      {/* Cards de estatísticas */}
      <CardsEstatisticas />

      {/* Filtros e botão para adicionar */}
      <FiltrosAvatares 
        filtros={filtros} 
        onAtualizarFiltros={handleAtualizarFiltros}
        onAdicionarAvatar={handleAdicionarAvatar}
      />

      {/* Tabela de avatares */}
      <TabelaAvatares 
        filtros={filtros}
        onAcao={handleAcaoTabela}
      />

      {/* Modal de Criar/Editar Avatar */}
      <ModalAvatarNovo
        aberto={modalCriarAberto || modalEditarAberto}
        onFechar={() => {
          setModalCriarAberto(false);
          setModalEditarAberto(false);
          setAvatarSelecionado(null);
        }}
        avatar={avatarSelecionado}
        onSalvar={async (dados) => {
          try {
            if (modalEditarAberto && avatarSelecionado) {
              await handleEditarAvatar(dados);
            } else {
              await handleCriarAvatar(dados);
            }
            setModalCriarAberto(false);
            setModalEditarAberto(false);
            setAvatarSelecionado(null);
          } catch (error) {
            // Erro já tratado nas funções
          }
        }}
      />

      <ModalAvatarVisualizar
        isOpen={modalVisualizarAberto}
        onClose={() => setModalVisualizarAberto(false)}
        avatar={avatarSelecionado}
        onEdit={handleVisualizarParaEditar}
      />

      <ModalAvatarExcluir
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        avatar={avatarSelecionado}
      />
    </div>
  );
}
