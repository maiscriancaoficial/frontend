'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, 
  ShoppingBag, 
  PackageOpen, 
  BarChart3, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';

interface EstatisticasProdutos {
  totalProdutos: number;
  produtosEmEstoque: number;
  produtosForaEstoque: number;
  totalVendidos: number;
  crescimentoProdutos: number; // Porcentagem de crescimento
  crescimentoVendas: number;   // Porcentagem de crescimento
}

export function CardsEstatisticas() {
  const [stats, setStats] = useState<EstatisticasProdutos>({
    totalProdutos: 0,
    produtosEmEstoque: 0,
    produtosForaEstoque: 0,
    totalVendidos: 0,
    crescimentoProdutos: 0,
    crescimentoVendas: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buscarEstatisticas = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/produtos/estatisticas');
        const data = await response.json();
        
        if (data.success && data.estatisticas) {
          // Garantir que todos os campos numéricos existam
          setStats({
            totalProdutos: data.estatisticas.totalProdutos || 0,
            produtosEmEstoque: data.estatisticas.produtosEmEstoque || 0,
            produtosForaEstoque: data.estatisticas.produtosForaEstoque || 0,
            totalVendidos: data.estatisticas.totalVendidos || 0,
            crescimentoProdutos: data.estatisticas.crescimentoProdutos || 0,
            crescimentoVendas: data.estatisticas.crescimentoVendas || 0
          });
        } else {
          console.error('Erro ao carregar estatísticas:', data.error);
          // Fallback para dados de exemplo em caso de erro
          setStats({
            totalProdutos: 0,
            produtosEmEstoque: 0,
            produtosForaEstoque: 0,
            totalVendidos: 0,
            crescimentoProdutos: 0,
            crescimentoVendas: 0
          });
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Fallback para dados de exemplo em caso de erro
        setStats({
          totalProdutos: 0,
          produtosEmEstoque: 0,
          produtosForaEstoque: 0,
          totalVendidos: 0,
          crescimentoProdutos: 0,
          crescimentoVendas: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    buscarEstatisticas();
  }, []);

  // Função para formatar números com separador de milhares
  const formatarNumero = (num: number | undefined): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card: Total de Produtos */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Produtos</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md mt-2"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-2">{formatarNumero(stats.totalProdutos)}</h3>
              )}
              {!isLoading && (
                <div className="flex items-center mt-2">
                  {stats.crescimentoProdutos > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs font-medium text-green-500">
                        +{stats.crescimentoProdutos}% este mês
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-xs font-medium text-red-500">
                        {stats.crescimentoProdutos}% este mês
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="p-3 bg-gradient-to-br from-[#27b99a]/10 to-[#ff0080]/10 rounded-full">
              <Package className="w-6 h-6 text-[#27b99a]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Produtos em Estoque */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Em Estoque</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md mt-2"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-2">{formatarNumero(stats.produtosEmEstoque)}</h3>
              )}
              {!isLoading && (
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {Math.round((stats.produtosEmEstoque / stats.totalProdutos) * 100)}% do catálogo
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-gradient-to-br from-[#27b99a]/10 to-[#ff0080]/10 rounded-full">
              <ShoppingBag className="w-6 h-6 text-[#27b99a]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Produtos Fora de Estoque */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fora de Estoque</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md mt-2"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-2">{formatarNumero(stats.produtosForaEstoque)}</h3>
              )}
              {!isLoading && (
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {Math.round((stats.produtosForaEstoque / stats.totalProdutos) * 100)}% do catálogo
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-gradient-to-br from-[#ff0080]/10 to-[#27b99a]/10 rounded-full">
              <PackageOpen className="w-6 h-6 text-[#ff0080]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Total Vendidos */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vendidos</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md mt-2"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-2">{formatarNumero(stats.totalVendidos)}</h3>
              )}
              {!isLoading && (
                <div className="flex items-center mt-2">
                  {stats.crescimentoVendas > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs font-medium text-green-500">
                        +{stats.crescimentoVendas}% este mês
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-xs font-medium text-red-500">
                        {stats.crescimentoVendas}% este mês
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="p-3 bg-gradient-to-br from-[#ff0080]/10 to-[#27b99a]/10 rounded-full">
              <BarChart3 className="w-6 h-6 text-[#ff0080]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
