'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  XCircle,
  DollarSign,
  Users
} from "lucide-react";

// Interface para os dados de estatísticas
interface EstatisticaPedido {
  titulo: string;
  valor: number;
  comparacao: number;
  icone: React.ReactNode;
  corFundo: string;
  corIcone: string;
}

// Interface para os dados de status
interface StatusPedido {
  titulo: string;
  valor: number;
  percentual: number;
  icone: React.ReactNode;
  corIcone: string;
}

export function EstatisticasPedidos() {
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Carregar métricas da API
  useEffect(() => {
    const carregarMetricas = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/relatorios/metricas?periodo=30');
        const data = await response.json();
        
        if (data.success) {
          setMetricas(data.metricas);
        } else {
          setError('Erro ao carregar métricas');
        }
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
        setError('Erro ao carregar métricas');
      } finally {
        setLoading(false);
      }
    };

    carregarMetricas();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Métricas de Pedidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
              <CardContent className="pt-6 pb-4 px-4">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metricas) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Métricas de Pedidos</h3>
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum pedido ainda</h3>
              <p className="text-gray-500 dark:text-gray-400">Quando você tiver pedidos, as métricas aparecerão aqui.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estatísticas baseadas nos dados reais da API
  const estatisticas: EstatisticaPedido[] = [
    {
      titulo: "Total de Pedidos",
      valor: metricas.pedidos.total,
      comparacao: metricas.pedidos.crescimento,
      icone: <ShoppingBag />,
      corFundo: "bg-pink-100 dark:bg-pink-900/20",
      corIcone: "text-pink-600 dark:text-pink-400"
    },
    {
      titulo: "Receita Total",
      valor: metricas.pedidos.receita.total,
      comparacao: metricas.pedidos.receita.crescimento,
      icone: <DollarSign />,
      corFundo: "bg-green-100 dark:bg-green-900/20",
      corIcone: "text-green-600 dark:text-green-400"
    },
    {
      titulo: "Ticket Médio",
      valor: metricas.pedidos.ticketMedio.valor,
      comparacao: metricas.pedidos.ticketMedio.crescimento,
      icone: <TrendingUp />,
      corFundo: "bg-blue-100 dark:bg-blue-900/20",
      corIcone: "text-blue-600 dark:text-blue-400"
    },
    {
      titulo: "Tempo Médio de Entrega",
      valor: metricas.pedidos.tempoMedioEntrega,
      comparacao: 0, // Não temos comparação para este campo ainda
      icone: <Clock />,
      corFundo: "bg-amber-100 dark:bg-amber-900/20",
      corIcone: "text-amber-600 dark:text-amber-400"
    }
  ];
  
  // Status dos pedidos baseado nos dados reais da API
  const totalPedidos = metricas.pedidos.total;
  const statusPedidos: StatusPedido[] = [
    {
      titulo: "Aguardando Pagamento",
      valor: metricas.pedidos.status.aguardandoPagamento,
      percentual: totalPedidos > 0 ? (metricas.pedidos.status.aguardandoPagamento / totalPedidos) * 100 : 0,
      icone: <Clock />,
      corIcone: "text-amber-500"
    },
    {
      titulo: "Pagamento Aprovado",
      valor: metricas.pedidos.status.pagamentoAprovado,
      percentual: totalPedidos > 0 ? (metricas.pedidos.status.pagamentoAprovado / totalPedidos) * 100 : 0,
      icone: <CheckCircle2 />,
      corIcone: "text-green-500"
    },
    {
      titulo: "Em Preparação",
      valor: metricas.pedidos.status.emPreparacao,
      percentual: totalPedidos > 0 ? (metricas.pedidos.status.emPreparacao / totalPedidos) * 100 : 0,
      icone: <AlertCircle />,
      corIcone: "text-blue-500"
    },
    {
      titulo: "Enviado",
      valor: metricas.pedidos.status.enviado,
      percentual: totalPedidos > 0 ? (metricas.pedidos.status.enviado / totalPedidos) * 100 : 0,
      icone: <Truck />,
      corIcone: "text-purple-500"
    },
    {
      titulo: "Entregue",
      valor: metricas.pedidos.status.entregue,
      percentual: totalPedidos > 0 ? (metricas.pedidos.status.entregue / totalPedidos) * 100 : 0,
      icone: <CheckCircle2 />,
      corIcone: "text-green-600"
    },
    {
      titulo: "Cancelado",
      valor: metricas.pedidos.status.cancelado,
      percentual: totalPedidos > 0 ? (metricas.pedidos.status.cancelado / totalPedidos) * 100 : 0,
      icone: <XCircle />,
      corIcone: "text-red-500"
    }
  ].filter(status => status.valor > 0); // Mostrar apenas status com pedidos

  // Formatação de valores
  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };

  const formatarComparacao = (valor: number): string => {
    return `${valor > 0 ? '+' : ''}${valor}%`;
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Métricas de Pedidos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((item, index) => (
          <Card key={index} className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="pt-6 pb-4 px-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`${item.corFundo} p-2 rounded-full`}>
                  <div className={`${item.corIcone} h-5 w-5`}>{item.icone}</div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.comparacao >= 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {formatarComparacao(item.comparacao)}
                </div>
              </div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.titulo}
              </h4>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {item.titulo.includes("Ticket") || item.titulo.includes("Receita")
                  ? formatarMoeda(item.valor) 
                  : item.titulo.includes("Tempo") 
                    ? `${item.valor} dias`
                    : item.titulo.includes("Taxa") 
                      ? `${item.valor}%` 
                      : item.valor}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm mt-6">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Status dos Pedidos</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {statusPedidos.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`${item.corIcone} h-5 w-5`}>{item.icone}</div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.titulo}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.valor} ({item.percentual}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      item.titulo.includes("Confirmado") ? "bg-green-500" : 
                      item.titulo.includes("Trânsito") ? "bg-blue-500" : 
                      item.titulo.includes("Aguardando") ? "bg-amber-500" : 
                      item.titulo.includes("Cancelados") ? "bg-red-500" : 
                      "bg-orange-500"
                    }`}
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
