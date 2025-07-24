'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

// Componentes da página de pedidos
import { CardsEstatisticas } from './components/cards-estatisticas';
import { FiltrosPedidos } from './components/filtros-pedidos';
import { TabelaPedidos } from './components/tabela-pedidos';

interface FiltrosPedidos {
  status?: string;
  metodoPagamento?: string;
  statusPagamento?: string;
  busca?: string;
  dataInicio?: string;
  dataFim?: string;
  afiliadoId?: string;
}

export default function AdminPedidosPage() {
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltrosPedidos | null>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Função para buscar pedidos
  const buscarPedidos = async (filtros?: FiltrosPedidos | null, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value) {
            params.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`/api/pedidos?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPedidos(data.pedidos);
        setPagination(data.pagination);
      } else {
        setError('Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Carregar pedidos inicialmente
  useEffect(() => {
    buscarPedidos();
  }, []);

  // Função para aplicar os filtros
  const handleAplicarFiltros = (filtros: FiltrosPedidos) => {
    setFiltrosAtivos(filtros);
    buscarPedidos(filtros, 1);
  };

  // Função para limpar os filtros
  const handleLimparFiltros = () => {
    setFiltrosAtivos(null);
    buscarPedidos(null, 1);
  };

  // Função para exportar pedidos
  const handleExportar = async (formato: 'csv' | 'json' = 'csv') => {
    try {
      const params = new URLSearchParams({ formato });
      
      if (filtrosAtivos) {
        Object.entries(filtrosAtivos).forEach(([key, value]) => {
          if (value) {
            params.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`/api/pedidos/exportar?${params}`);
      
      if (formato === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.dados, null, 2)], {
          type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedidos_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao exportar pedidos:', error);
      alert('Erro ao exportar pedidos');
    }
  };

  // Função para atualizar pedido
  const handleAtualizarPedido = async (pedidoId: string, dados: any) => {
    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarregar pedidos
        buscarPedidos(filtrosAtivos, pagination.page);
      } else {
        alert('Erro ao atualizar pedido');
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      alert('Erro ao atualizar pedido');
    }
  };

  // Função para excluir pedido
  const handleExcluirPedido = async (pedidoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarregar pedidos
        buscarPedidos(filtrosAtivos, pagination.page);
      } else {
        alert(data.error || 'Erro ao excluir pedido');
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      alert('Erro ao excluir pedido');
    }
  };

  // Função para mudar página
  const handleMudarPagina = (novaPagina: number) => {
    buscarPedidos(filtrosAtivos, novaPagina);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
          <p className="text-gray-500 dark:text-gray-400">Gerencie todos os pedidos da sua loja.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExportar('csv')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExportar('json')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar JSON</span>
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <CardsEstatisticas />

      {/* Filtros */}
      <FiltrosPedidos 
        onAplicarFiltros={handleAplicarFiltros}
        onLimparFiltros={handleLimparFiltros}
        filtrosAtivos={filtrosAtivos}
      />

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Tabela de pedidos */}
      <TabelaPedidos 
        pedidos={pedidos}
        loading={loading}
        pagination={pagination}
        onAtualizarPedido={handleAtualizarPedido}
        onExcluirPedido={handleExcluirPedido}
        onMudarPagina={handleMudarPagina}
      />
    </div>
  );
}
