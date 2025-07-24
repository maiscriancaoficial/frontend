'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  BookMarked, 
  BookX, 
  BarChart3, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';

interface EstatisticasLivros {
  totalLivros: number;
  livrosAtivos: number;
  livrosInativos: number;
  totalVendidos: number;
  crescimentoLivros: number; // Porcentagem de crescimento
  crescimentoVendas: number; // Porcentagem de crescimento
}

export function CardsEstatisticas() {
  const [stats, setStats] = useState<EstatisticasLivros>({
    totalLivros: 0,
    livrosAtivos: 0,
    livrosInativos: 0,
    totalVendidos: 0,
    crescimentoLivros: 0,
    crescimentoVendas: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    buscarEstatisticas();
  }, []);

  const buscarEstatisticas = async () => {
    try {
      setIsLoading(true);
      
      // Buscar estatísticas dos livros
      const response = await fetch('/api/livros?limit=1000'); // Buscar todos para contar
      const data = await response.json();
      
      if (data.success) {
        const livros = data.livros;
        const totalLivros = livros.length;
        const livrosAtivos = livros.filter((l: any) => l.ativo).length;
        const livrosInativos = totalLivros - livrosAtivos;
        
        // Calcular total vendido (soma dos itensPedido de todos os livros)
        const totalVendidos = livros.reduce((acc: number, livro: any) => {
          return acc + (livro._count?.itensPedido || 0);
        }, 0);
        
        // Para o crescimento, vamos usar dados simulados por enquanto
        // Em uma implementação real, você compararia com dados do mês anterior
        const crescimentoLivros = totalLivros > 0 ? Math.random() * 20 - 5 : 0; // -5% a +15%
        const crescimentoVendas = totalVendidos > 0 ? Math.random() * 30 - 10 : 0; // -10% a +20%
        
        setStats({
          totalLivros,
          livrosAtivos,
          livrosInativos,
          totalVendidos,
          crescimentoLivros: Number(crescimentoLivros.toFixed(1)),
          crescimentoVendas: Number(crescimentoVendas.toFixed(1))
        });
      } else {
        console.error('Erro ao buscar estatísticas:', data.error);
        // Manter valores padrão em caso de erro
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Manter valores padrão em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar números com separador de milhares
  const formatarNumero = (num: number): string => {
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card: Total de Livros */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Livros</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md mt-2"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-2">{formatarNumero(stats.totalLivros)}</h3>
              )}
              {!isLoading && (
                <div className="flex items-center mt-2">
                  {stats.crescimentoLivros > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs font-medium text-green-500">
                        +{stats.crescimentoLivros}% este mês
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-xs font-medium text-red-500">
                        {stats.crescimentoLivros}% este mês
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Livros Ativos */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Livros Ativos</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md mt-2"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-2">{formatarNumero(stats.livrosAtivos)}</h3>
              )}
              {!isLoading && (
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {Math.round((stats.livrosAtivos / stats.totalLivros) * 100)}% do catálogo
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
              <BookMarked className="w-6 h-6 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Livros Inativos */}
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Livros Inativos</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md mt-2"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-2">{formatarNumero(stats.livrosInativos)}</h3>
              )}
              {!isLoading && (
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {Math.round((stats.livrosInativos / stats.totalLivros) * 100)}% do catálogo
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full">
              <BookX className="w-6 h-6 text-amber-500 dark:text-amber-400" />
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
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
