'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Ticket, CheckCircle, XCircle } from 'lucide-react';

import { ResumoCartao } from './components/resumo-cartao';
import { FiltroCupons } from './components/filtro-cupons';
import { TabelaCupons } from './components/tabela-cupons';
import { ModalCupom } from './components/modal-cupom';
import { BotoesStatus } from './components/botoes-status';

// Enum de TipoDesconto para usar na interface
type TipoDesconto = 'PORCENTAGEM' | 'FIXO' | 'SEQUENCIAL_POR_UNIDADE';

// Tipo para o cupom
export interface CupomDados {
  id: string;
  titulo: string;
  codigo: string;
  descricao?: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: number;
  dataExpiracao?: string;
  qtdMaxPorUsuario?: number;
  ativo: boolean;
  utilizados: number;
  createdAt: string;
  updatedAt: string;
}

// Funções para integração com API
async function buscarCupons(status?: string, busca?: string) {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'todos') params.append('status', status);
    if (busca) params.append('busca', busca);
    
    const response = await fetch(`/api/cupons?${params.toString()}`);
    if (!response.ok) throw new Error('Erro ao buscar cupons');
    
    const data = await response.json();
    return data.cupons || [];
  } catch (error) {
    console.error('Erro ao buscar cupons:', error);
    return [];
  }
}

async function criarCupom(cupomData: Omit<CupomDados, 'id' | 'utilizados' | 'createdAt' | 'updatedAt'>) {
  try {
    const response = await fetch('/api/cupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cupomData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar cupom');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    throw error;
  }
}

async function atualizarCupom(id: string, cupomData: Partial<CupomDados>) {
  try {
    const response = await fetch(`/api/cupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cupomData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar cupom');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    throw error;
  }
}

async function excluirCupom(id: string) {
  try {
    const response = await fetch(`/api/cupons/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir cupom');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir cupom:', error);
    throw error;
  }
}

export default function AdminCuponsPage() {
  // Estado para controle dos cupons
  const [cupons, setCupons] = useState<CupomDados[]>([]);
  const [statusAtivo, setStatusAtivo] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [carregando, setCarregando] = useState(true);
  
  // Estado para controle do modal
  const [modalAberto, setModalAberto] = useState(false);
  const [cupomParaEditar, setCupomParaEditar] = useState<CupomDados | null>(null);
  
  // Carregar cupons ao montar o componente
  useEffect(() => {
    carregarCupons();
  }, []);
  
  // Recarregar quando filtros mudarem
  useEffect(() => {
    carregarCupons();
  }, [statusAtivo, termoBusca]);
  
  const carregarCupons = async () => {
    setCarregando(true);
    try {
      const cuponsData = await buscarCupons(
        statusAtivo === 'todos' ? undefined : statusAtivo,
        termoBusca || undefined
      );
      setCupons(cuponsData);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
      alert('Erro ao carregar cupons');
    } finally {
      setCarregando(false);
    }
  };
  
  // Contadores para os cards de resumo
  const totalCupons = cupons.length;
  const cuponsAtivos = cupons.filter(cupom => cupom.ativo).length;
  const cuponsInativos = totalCupons - cuponsAtivos;
  
  // Filtragem de cupons por status e termo de busca
  const cuponsFiltrados = cupons
    .filter(cupom => {
      if (statusAtivo === 'ativos') return cupom.ativo;
      if (statusAtivo === 'inativos') return !cupom.ativo;
      return true; // 'todos'
    })
    .filter(cupom => {
      if (!termoBusca.trim()) return true;
      
      const termo = termoBusca.toLowerCase();
      return (
        cupom.titulo.toLowerCase().includes(termo) ||
        cupom.codigo.toLowerCase().includes(termo) ||
        (cupom.descricao?.toLowerCase().includes(termo))
      );
    });
  
  // Funções para manipulação dos cupons
  const handleAbrirModal = () => {
    setCupomParaEditar(null);
    setModalAberto(true);
  };
  
  const handleEditarCupom = (cupom: CupomDados) => {
    setCupomParaEditar(cupom);
    setModalAberto(true);
  };
  
  const handleStatusChange = (status: 'todos' | 'ativos' | 'inativos') => {
    setStatusAtivo(status);
  };
  
  const handleAlterarStatus = async (id: string) => {
    try {
      const cupom = cupons.find(c => c.id === id);
      if (!cupom) return;
      
      await atualizarCupom(id, { ativo: !cupom.ativo });
      await carregarCupons(); // Recarregar lista
    } catch (error: any) {
      alert(error.message || 'Erro ao alterar status do cupom');
    }
  };
  
  const handleExcluirCupom = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;
    
    try {
      await excluirCupom(id);
      await carregarCupons(); // Recarregar lista
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir cupom');
    }
  };
  
  const handleBuscar = (termo: string) => {
    setTermoBusca(termo);
  };
  
  const handleSalvarCupom = async (cupomData: CupomDados) => {
    try {
      if (cupomParaEditar) {
        // Editando cupom existente
        await atualizarCupom(cupomParaEditar.id, cupomData);
      } else {
        // Criando novo cupom
        await criarCupom(cupomData);
      }
      
      setModalAberto(false);
      await carregarCupons(); // Recarregar lista
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar cupom');
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Cupons</h2>
          <p className="text-gray-600 mt-2">Gerencie os cupons promocionais da loja.</p>
        </div>
        
        <Button 
          onClick={handleAbrirModal} 
          className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Novo Cupom
        </Button>
      </div>
      
      {/* Cards de resumo modernos */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Cupons</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCupons}</p>
                <p className="text-sm text-gray-500 mt-1">Todos os cupons cadastrados</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-[#27b99a]/20 to-[#239d84]/20 rounded-2xl">
                <Ticket className="h-8 w-8 text-[#27b99a]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cupons Ativos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{cuponsAtivos}</p>
                <p className="text-sm text-gray-500 mt-1">Disponíveis para uso</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cupons Inativos</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{cuponsInativos}</p>
                <p className="text-sm text-gray-500 mt-1">Cupons desativados</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtros e Botões */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <FiltroCupons onBuscar={handleBuscar} />
        <BotoesStatus 
          statusAtivo={statusAtivo} 
          onStatusChange={handleStatusChange} 
          contadores={{ todos: totalCupons, ativos: cuponsAtivos, inativos: cuponsInativos }} 
        />
      </div>
      
      {/* Tabela de cupons */}
      {carregando ? (
        <Card className="rounded-3xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#27b99a]"></div>
              <span className="text-gray-600">Carregando cupons...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TabelaCupons 
          cupons={cupons} 
          onEditar={handleEditarCupom} 
          onExcluir={handleExcluirCupom} 
          onAlterarStatus={handleAlterarStatus}
        />
      )}
      
      {/* Modal para criar/editar cupom */}
      <ModalCupom 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        cupomParaEditar={cupomParaEditar} 
        onSalvar={handleSalvarCupom}
      />
    </div>
  );
}
