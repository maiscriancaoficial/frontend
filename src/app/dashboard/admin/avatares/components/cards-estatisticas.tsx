'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserX, Palette, Shirt, Eye, Layers } from 'lucide-react';

interface Estatisticas {
  total: number;
  ativos: number;
  inativos: number;
  porTipo: {
    masculino: number;
    feminino: number;
    unissex: number;
  };
  elementos: {
    total: number;
    ativos: number;
    inativos: number;
    porTipo: Array<{
      tipo: string;
      quantidade: number;
    }>;
  };
  avataresMaisCompletos: Array<{
    id: string;
    nome: string;
    tipo: string;
    totalElementos: number;
  }>;
}

export function CardsEstatisticas() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    buscarEstatisticas();
  }, []);

  const buscarEstatisticas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/avatares/estatisticas');
      const data = await response.json();
      
      if (data.success) {
        setEstatisticas(data.estatisticas);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-3xl animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!estatisticas) {
    return null;
  }

  const cards = [
    {
      titulo: 'Total de Avatares',
      valor: estatisticas.total,
      descricao: `${estatisticas.ativos} ativos, ${estatisticas.inativos} inativos`,
      icon: Users,
      cor: 'text-[#27b99a]'
    },
    {
      titulo: 'Avatares Ativos',
      valor: estatisticas.ativos,
      descricao: `${estatisticas.total > 0 ? ((estatisticas.ativos / estatisticas.total) * 100).toFixed(1) : 0}% do total`,
      icon: UserCheck,
      cor: 'text-[#27b99a]'
    },
    {
      titulo: 'Total de Elementos',
      valor: estatisticas.elementos?.total || 0,
      descricao: `${estatisticas.elementos?.ativos || 0} elementos ativos`,
      icon: Palette,
      cor: 'text-[#ff0080]'
    },
    {
      titulo: 'Tipos Disponíveis',
      valor: estatisticas.elementos?.porTipo?.length || 0,
      descricao: 'Tipos de elementos diferentes',
      icon: Layers,
      cor: 'text-[#ff0080]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.valor}</p>
                  <p className="text-xs text-gray-500">{card.descricao}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50`}>
                  <IconComponent className={`h-6 w-6 ${card.cor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
