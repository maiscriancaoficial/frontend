'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Trash2, MoreHorizontal, User, Mail, Phone, Pencil, Crown, BadgeCheck, BadgeX, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModalCliente } from './components/modal-cliente';
import { FiltroClientes } from './components/filtro-clientes';
import { TabelaClientes } from './components/tabela-clientes';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Interface para dados do cliente
export interface ClienteDados {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpfCnpj?: string;
  fotoPerfil?: string;
  dataCadastro: string;
  ultimaCompra?: string;
  totalGasto?: number;
  totalCompras?: number;
  ativo: boolean;
  verificado: boolean;
  premium?: boolean;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Funções para integração com API
async function buscarClientes(status?: string, busca?: string) {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'todos') params.append('status', status);
    if (busca) params.append('busca', busca);
    
    const response = await fetch(`/api/clientes?${params.toString()}`);
    if (!response.ok) throw new Error('Erro ao buscar clientes');
    
    const data = await response.json();
    return data.clientes || [];
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

async function criarCliente(clienteData: Omit<ClienteDados, 'id' | 'totalGasto' | 'totalCompras' | 'createdAt' | 'updatedAt'>) {
  try {
    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar cliente');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
}

async function atualizarCliente(id: string, clienteData: Partial<ClienteDados>) {
  try {
    const response = await fetch(`/api/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar cliente');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
}

async function excluirCliente(id: string) {
  try {
    const response = await fetch(`/api/clientes/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir cliente');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    throw error;
  }
}

async function uploadFotoCliente(arquivo: File) {
  try {
    const formData = new FormData();
    formData.append('foto', arquivo);
    
    const response = await fetch('/api/clientes/upload-foto', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer upload da foto');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    throw error;
  }
}

export default function AdminClientesPage() {
  // Estados
  const [clientes, setClientes] = useState<ClienteDados[]>([]);
  const [clienteParaEditar, setClienteParaEditar] = useState<ClienteDados | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos' | 'premium' | 'verificados'>('todos');
  const [carregando, setCarregando] = useState(true);
  
  // Carregar clientes ao montar o componente
  useEffect(() => {
    carregarClientes();
  }, []);
  
  // Recarregar quando filtros mudarem
  useEffect(() => {
    carregarClientes();
  }, [filtroStatus, filtroTexto]);
  
  const carregarClientes = async () => {
    setCarregando(true);
    try {
      const clientesData = await buscarClientes(
        filtroStatus === 'todos' ? undefined : filtroStatus,
        filtroTexto || undefined
      );
      setClientes(clientesData);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar clientes');
    } finally {
      setCarregando(false);
    }
  };
  
  // Estatísticas
  const totalClientes = clientes.length;
  const clientesAtivos = clientes.filter(c => c.ativo).length;
  const clientesVerificados = clientes.filter(c => c.verificado).length;
  const clientesPremium = clientes.filter(c => c.premium).length;
  
  // Funções de manipulação
  const handleNovoCliente = () => {
    setClienteParaEditar(null);
    setModalAberto(true);
  };

  const handleEditarCliente = (cliente: ClienteDados) => {
    setClienteParaEditar(cliente);
    setModalAberto(true);
  };

  const handleAlterarStatus = async (id: string) => {
    try {
      const cliente = clientes.find(c => c.id === id);
      if (!cliente) return;
      
      await atualizarCliente(id, { ativo: !cliente.ativo });
      await carregarClientes(); // Recarregar lista
    } catch (error: any) {
      alert(error.message || 'Erro ao alterar status do cliente');
    }
  };

  const handleExcluirCliente = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    try {
      await excluirCliente(id);
      await carregarClientes(); // Recarregar lista
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir cliente');
    }
  };

  const handleSalvarCliente = async (clienteData: ClienteDados) => {
    try {
      if (clienteParaEditar) {
        // Editando cliente existente
        await atualizarCliente(clienteParaEditar.id, clienteData);
      } else {
        // Criando novo cliente
        await criarCliente(clienteData);
      }
      
      setModalAberto(false);
      await carregarClientes(); // Recarregar lista
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar cliente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie os clientes da sua floricultura</p>
        </div>
        
        <Button
          onClick={handleNovoCliente}
          className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <UserPlus size={16} className="mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#27b99a] to-[#239d84] rounded-2xl p-3 shadow-lg">
                <User size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Clientes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalClientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-3 shadow-lg">
                <BadgeCheck size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{clientesAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-3 shadow-lg">
                <BadgeCheck size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verificados</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{clientesVerificados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#ff0080] to-[#e6006e] rounded-2xl p-3 shadow-lg">
                <Crown size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Premium</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{clientesPremium}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Área de filtros e tabela */}
      <div className="space-y-4">
        <FiltroClientes 
          onBuscar={setFiltroTexto} 
          onStatusChange={setFiltroStatus} 
          statusAtual={filtroStatus} 
          estatisticas={{
            total: totalClientes,
            ativos: clientesAtivos,
            inativos: totalClientes - clientesAtivos,
            verificados: clientesVerificados,
            premium: clientesPremium
          }}
          onAdicionarCliente={handleNovoCliente}
        />
        
        {carregando ? (
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27b99a] mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Carregando clientes...</p>
            </CardContent>
          </Card>
        ) : clientes.length === 0 ? (
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gradient-to-r from-[#27b99a] to-[#239d84] p-4 rounded-2xl mb-4 shadow-lg">
                <User size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Nenhum cliente encontrado</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                {filtroTexto || filtroStatus !== 'todos' 
                  ? 'Tente ajustar seus filtros de busca para encontrar clientes' 
                  : 'Comece adicionando o primeiro cliente ao seu sistema'}
              </p>
              <Button 
                onClick={handleNovoCliente} 
                className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <UserPlus size={16} className="mr-2" />
                Adicionar cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TabelaClientes 
            clientes={clientes} 
            onEditar={handleEditarCliente}
            onAlterarStatus={handleAlterarStatus}
            onExcluir={handleExcluirCliente}
          />
        )}
      </div>
      
      {/* Modal de edição/criação */}
      <ModalCliente 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        clienteParaEditar={clienteParaEditar} 
        onSalvar={handleSalvarCliente}
      />
    </div>
  );
}
