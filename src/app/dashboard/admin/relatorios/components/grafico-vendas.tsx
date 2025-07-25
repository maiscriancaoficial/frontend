'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, TrendingUp, TrendingDown, ShoppingBag } from "lucide-react";
import { useEffect, useState } from 'react';

type DataPoint = {
  date: string;
  value: number;
};

type VendasData = {
  pedidos: {
    total: number;
    receita: {
      total: number;
      crescimento: number;
    };
  };
};

export function GraficoVendas() {
  const [activeTab, setActiveTab] = useState("semanal");
  const [loading, setLoading] = useState(true);
  const [vendasData, setVendasData] = useState<VendasData | null>(null);
  
  // Carregar dados reais da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/relatorios/metricas?periodo=30');
        const data = await response.json();
        
        if (data.success) {
          setVendasData(data.metricas);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };
  
  if (loading) {
    return (
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Relatório de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!vendasData) {
    return (
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Relatório de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma venda ainda</h3>
            <p className="text-gray-500 dark:text-gray-400">Quando você tiver vendas, elas aparecerão aqui.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { pedidos } = vendasData;
  const isPositiveGrowth = pedidos.receita.crescimento >= 0;
  
  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Relatório de Vendas</CardTitle>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Exportar 
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <Tabs
          defaultValue="semanal"
          className="mt-2"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 max-w-[400px]">
            <TabsTrigger value="semanal" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
              Semanal
            </TabsTrigger>
            <TabsTrigger value="mensal" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
              Mensal
            </TabsTrigger>
            <TabsTrigger value="anual" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
              Anual
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-pink-500 p-2 rounded-full">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              {pedidos.receita.crescimento !== 0 && (
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isPositiveGrowth 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {isPositiveGrowth ? '+' : ''}{pedidos.receita.crescimento.toFixed(1)}%
                </div>
              )}
            </div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Receita Total
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(pedidos.receita.total)}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-500 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total de Pedidos
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pedidos.total}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-500 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Ticket Médio
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pedidos.total > 0 ? formatCurrency(pedidos.receita.total / pedidos.total) : formatCurrency(0)}
            </p>
          </div>
        </div>
        
        {pedidos.total === 0 && (
          <div className="text-center py-8 mt-6">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">Nenhuma venda registrada</h3>
            <p className="text-gray-400">Suas vendas aparecerão aqui quando você começar a vender.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
