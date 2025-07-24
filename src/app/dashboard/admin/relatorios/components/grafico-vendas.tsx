'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from 'react';

type DataPoint = {
  date: string;
  value: number;
};

// Mock data
const weeklyData: DataPoint[] = [
  { date: "Seg", value: 1420 },
  { date: "Ter", value: 2350 },
  { date: "Qua", value: 1850 },
  { date: "Qui", value: 3100 },
  { date: "Sex", value: 2790 },
  { date: "Sáb", value: 3600 },
  { date: "Dom", value: 2100 },
];

const monthlyData: DataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const value = Math.floor(Math.random() * 5000) + 1000;
  return { date: `${day}`, value };
});

const yearlyData: DataPoint[] = [
  { date: "Jan", value: 42500 },
  { date: "Fev", value: 38700 },
  { date: "Mar", value: 45200 },
  { date: "Abr", value: 50300 },
  { date: "Mai", value: 55100 },
  { date: "Jun", value: 49800 },
  { date: "Jul", value: 52400 },
  { date: "Ago", value: 57300 },
  { date: "Set", value: 53600 },
  { date: "Out", value: 59200 },
  { date: "Nov", value: 63500 },
  { date: "Dez", value: 72100 },
];

export function GraficoVendas() {
  const [activeTab, setActiveTab] = useState("semanal");
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(300);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('vendas-chart-container');
      if (container) {
        setChartWidth(container.clientWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate chart data based on active tab
  const getChartData = () => {
    switch (activeTab) {
      case "semanal": return weeklyData;
      case "mensal": return monthlyData;
      case "anual": return yearlyData;
      default: return weeklyData;
    }
  };
  
  const chartData = getChartData();
  
  // Get max value for scaling
  const maxValue = Math.max(...chartData.map(d => d.value));
  
  // Calculate period comparison
  const currentTotal = chartData.reduce((sum, item) => sum + item.value, 0);
  const previousTotal = currentTotal * 0.85; // Mock data: assume 15% growth
  const growthPercentage = ((currentTotal - previousTotal) / previousTotal) * 100;
  const isPositiveGrowth = growthPercentage >= 0;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };
  
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
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Vendas</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(currentTotal)}
            </h3>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Comparado com período anterior
            </p>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-bold ${isPositiveGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
              </h3>
              {isPositiveGrowth ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>
        
        <div className="relative" id="vendas-chart-container" style={{ height: `${chartHeight}px` }}>
          <div className="flex h-full items-end gap-2 relative">
            {chartData.map((item, index) => {
              const barHeight = (item.value / maxValue) * chartHeight * 0.8;
              
              return (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <div 
                    className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 rounded-t-sm transition-all cursor-pointer group relative"
                    style={{ height: `${barHeight}px` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.date}</span>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels - simplified */}
          <div className="absolute left-0 top-0 h-full w-12 hidden md:flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatCurrency(maxValue)}</span>
            <span>{formatCurrency(maxValue * 0.5)}</span>
            <span>{formatCurrency(0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
