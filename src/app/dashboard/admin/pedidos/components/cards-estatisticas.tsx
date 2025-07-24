'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, PackageCheck, PackageX, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export function CardsEstatisticas() {
  const [estatisticas, setEstatisticas] = useState({
    totalPedidos: 0,
    totalReembolsos: 0,
    valorReembolsado: 0,
    totalVendas: 0,
    crescimentoPedidos: 0,
    crescimentoVendas: 0,
    crescimentoReembolsos: 0
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        const response = await fetch('/api/pedidos/estatisticas?periodo=30');
        const data = await response.json();
        
        if (data.success) {
          setEstatisticas({
            totalPedidos: data.estatisticas.totalPedidos,
            totalReembolsos: data.estatisticas.totalReembolsos,
            valorReembolsado: data.estatisticas.valorReembolsado,
            totalVendas: data.estatisticas.totalVendas,
            crescimentoPedidos: data.estatisticas.crescimentoPedidos,
            crescimentoVendas: data.estatisticas.crescimentoVendas,
            crescimentoReembolsos: data.estatisticas.crescimentoReembolsos
          });
        } else {
          setErro('Erro ao carregar estatísticas');
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setErro('Erro ao carregar estatísticas');
      } finally {
        setCarregando(false);
      }
    };

    carregarEstatisticas();
  }, []);

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Card 1: Total de Pedidos */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
          <ShoppingBag className="h-4 w-4 text-[#ff9898]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {carregando ? 
              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
              estatisticas.totalPedidos
            }
          </div>
          <div className="flex items-center pt-1">
            {estatisticas.crescimentoPedidos > 0 ? (
              <span className="text-xs text-green-500 dark:text-green-400 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +{estatisticas.crescimentoPedidos}%
              </span>
            ) : (
              <span className="text-xs text-red-500 dark:text-red-400 flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" />
                {estatisticas.crescimentoPedidos}%
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              desde o último mês
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Total de Reembolsos */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Reembolsos</CardTitle>
          <PackageX className="h-4 w-4 text-[#ff9898]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {carregando ? 
              <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
              estatisticas.totalReembolsos
            }
          </div>
          <div className="flex items-center pt-1">
            {estatisticas.crescimentoReembolsos < 0 ? (
              <span className="text-xs text-green-500 dark:text-green-400 flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" />
                {Math.abs(estatisticas.crescimentoReembolsos)}%
              </span>
            ) : (
              <span className="text-xs text-red-500 dark:text-red-400 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +{estatisticas.crescimentoReembolsos}%
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              desde o último mês
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Total Reembolsado */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reembolsado</CardTitle>
          <PackageCheck className="h-4 w-4 text-[#ff9898]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {carregando ? 
              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
              formatarMoeda(estatisticas.valorReembolsado)
            }
          </div>
          <div className="flex items-center pt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {estatisticas.totalReembolsos} pedidos estornados
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Total de Vendas */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          <DollarSign className="h-4 w-4 text-[#ff9898]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {carregando ? 
              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div> : 
              formatarMoeda(estatisticas.totalVendas)
            }
          </div>
          <div className="flex items-center pt-1">
            {estatisticas.crescimentoVendas > 0 ? (
              <span className="text-xs text-green-500 dark:text-green-400 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +{estatisticas.crescimentoVendas}%
              </span>
            ) : (
              <span className="text-xs text-red-500 dark:text-red-400 flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" />
                {estatisticas.crescimentoVendas}%
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              desde o último mês
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
