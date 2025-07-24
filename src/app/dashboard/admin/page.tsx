'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  UserCheck, 
  TrendingUp, 
  TrendingDown,
  BookOpen,
  Activity,
  Eye,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";

interface MetricasData {
  vendasTotais: { valor: number; crescimento: number };
  livrosVendidos: { valor: number; crescimento: number };
  produtosVendidos: { valor: number; crescimento: number };
  clientes: { total: number; novos: number; crescimento: number };
  afiliados: { total: number; novos: number; crescimento: number };
  pedidosRecentes: Array<{
    id: string;
    cliente: string;
    email: string;
    valor: number;
    status: string;
    data: string;
  }>;
  ticketMedio: number;
  periodo: number;
}

export default function AdminDashboard() {
  const [metricas, setMetricas] = useState<MetricasData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarMetricas = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const response = await fetch('/api/dashboard/metricas?periodo=30');
      const data = await response.json();
      
      if (data.success) {
        setMetricas(data.metricas);
      } else {
        setErro('Erro ao carregar métricas');
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarMetricas();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <p className="text-gray-500 dark:text-gray-400">Bem-vindo ao painel administrativo da Mais criança.</p>
      </div>

      {/* Cartões de estatísticas - 5 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Vendas Totais */}
        <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-[#ff9898]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carregando ? 
                <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
                erro ? '---' :
                `R$ ${metricas?.vendasTotais.valor.toFixed(2).replace('.', ',') || '0,00'}`
              }
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {!carregando && !erro && metricas && (
                <>
                  {metricas.vendasTotais.crescimento >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(metricas.vendasTotais.crescimento).toFixed(1)}% últimos {metricas.periodo} dias
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Livros Vendidos */}
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livros Vendidos</CardTitle>
            <BookOpen className="h-4 w-4 text-[#27b99a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carregando ? 
                <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
                erro ? '---' :
                metricas?.livrosVendidos.valor || 0
              }
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {!carregando && !erro && metricas && (
                <>
                  {metricas.livrosVendidos.crescimento >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(metricas.livrosVendidos.crescimento).toFixed(1)}% últimos {metricas.periodo} dias
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Produtos Vendidos */}
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-[#ff0080]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carregando ? 
                <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
                erro ? '---' :
                metricas?.produtosVendidos.valor || 0
              }
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {!carregando && !erro && metricas && (
                <>
                  {metricas.produtosVendidos.crescimento >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(metricas.produtosVendidos.crescimento).toFixed(1)}% últimos {metricas.periodo} dias
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-[#ff9898]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carregando ? 
                <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
                erro ? '---' :
                metricas?.clientes.total || 0
              }
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {!carregando && !erro && metricas && (
                <>
                  {metricas.clientes.crescimento >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  +{metricas.clientes.novos} novos últimos {metricas.periodo} dias
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Afiliados */}
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afiliados</CardTitle>
            <UserCheck className="h-4 w-4 text-[#27b99a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carregando ? 
                <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
                erro ? '---' :
                metricas?.afiliados.total || 0
              }
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {!carregando && !erro && metricas && (
                <>
                  {metricas.afiliados.crescimento >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  +{metricas.afiliados.novos} novos últimos {metricas.periodo} dias
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Pedidos Recentes */}
        <Card className="col-span-2 rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Os últimos 5 pedidos realizados na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : erro ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Erro ao carregar pedidos recentes</p>
                <button 
                  onClick={buscarMetricas}
                  className="mt-2 text-[#ff9898] hover:underline text-sm"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-4 text-xs text-gray-500 dark:text-gray-400 border-b pb-2">
                  <div>#Pedido</div>
                  <div>Cliente</div>
                  <div>Status</div>
                  <div className="text-right">Total</div>
                </div>
                {metricas?.pedidosRecentes && metricas.pedidosRecentes.length > 0 ? (
                  metricas.pedidosRecentes.map((pedido, i) => {
                    const getStatusStyle = (status: string) => {
                      switch (status) {
                        case 'ENTREGUE':
                          return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
                        case 'ENVIADO':
                          return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
                        case 'AGUARDANDO_PAGAMENTO':
                          return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                        case 'PAGAMENTO_APROVADO':
                        case 'EM_PREPARACAO':
                          return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
                        case 'CANCELADO':
                        case 'ESTORNADO':
                          return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                        default:
                          return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
                      }
                    };

                    const formatStatus = (status: string) => {
                      const statusMap: Record<string, string> = {
                        'AGUARDANDO_PAGAMENTO': 'Aguardando',
                        'PAGAMENTO_APROVADO': 'Aprovado',
                        'EM_PREPARACAO': 'Preparando',
                        'ENVIADO': 'Enviado',
                        'ENTREGUE': 'Entregue',
                        'CANCELADO': 'Cancelado',
                        'ESTORNADO': 'Estornado'
                      };
                      return statusMap[status] || status;
                    };

                    return (
                      <div key={pedido.id} className="grid grid-cols-4 text-sm py-2 border-b border-gray-100 dark:border-gray-800 items-center">
                        <div className="font-medium text-xs">#{pedido.id.slice(-8)}</div>
                        <div className="truncate" title={pedido.cliente}>{pedido.cliente}</div>
                        <div>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${getStatusStyle(pedido.status)}`}>
                            {formatStatus(pedido.status)}
                          </span>
                        </div>
                        <div className="text-right">R$ {pedido.valor.toFixed(2).replace('.', ',')}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Nenhum pedido encontrado</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <a href="/dashboard/admin/pedidos" className="text-sm text-[#ff9898] hover:underline">Ver todos os pedidos →</a>
          </CardFooter>
        </Card>

        {/* Estatísticas */}
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle>Desempenho da Loja</CardTitle>
            <CardDescription>Estatísticas de crescimento e desempenho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Taxa de Conversão</p>
                <p className="text-sm text-green-500 dark:text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  3.2%
                </p>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-2 rounded-full bg-green-500 dark:bg-green-400" style={{ width: '65%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">+1.1% acima da média</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Ticket Médio</p>
                <p className="text-sm font-medium">
                  {carregando ? 
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div> :
                    erro ? '---' :
                    `R$ ${metricas?.ticketMedio.toFixed(2).replace('.', ',') || '0,00'}`
                  }
                </p>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-2 rounded-full bg-[#ff9898]" style={{ width: '78%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">+12% em relação ao mês anterior</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Taxa de Retorno</p>
                <p className="text-sm text-blue-500 dark:text-blue-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  42%
                </p>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-2 rounded-full bg-blue-500 dark:bg-blue-400" style={{ width: '42%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">+5% em relação ao mês anterior</p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <a href="/dashboard/admin/relatorios" className="text-sm text-[#ff9898] hover:underline">Ver relatório completo →</a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}