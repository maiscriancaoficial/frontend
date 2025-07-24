'use client';

import { GraficoVendas } from './components/grafico-vendas';
import { EstatisticasPedidos } from './components/estatisticas-pedidos';
import { FiltrosRelatorio } from './components/filtros-relatorio';
import { ProdutosMaisVendidos } from './components/produtos-mais-vendidos';

export default function AdminRelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-gray-500 dark:text-gray-400">Análise de vendas e métricas do seu negócio.</p>
      </div>
      
      {/* Filtros */}
      <FiltrosRelatorio />
      
      {/* Gráfico de vendas */}
      <div className="mt-6">
        <GraficoVendas />
      </div>
      
      {/* Estatísticas de pedidos */}
      <div className="mt-6">
        <EstatisticasPedidos />
      </div>
      
      {/* Produtos mais vendidos */}
      <div className="mt-6">
        <ProdutosMaisVendidos />
      </div>
    </div>
  );
}
