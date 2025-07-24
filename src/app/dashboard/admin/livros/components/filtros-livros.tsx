'use client';

import { useState } from 'react';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Button
} from '@/components/ui/button';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  FilterX,
  BookPlus
} from 'lucide-react';

interface FiltrosLivrosProps {
  filtros: {
    busca: string;
    categoria: string;
    status?: boolean;
    faixaEtaria?: string;
    dataPublicacao?: string;
  };
  onAtualizarFiltros: (filtros: any) => void;
  onAdicionarLivro: () => void;
}

export function FiltrosLivros({ filtros, onAtualizarFiltros, onAdicionarLivro }: FiltrosLivrosProps) {
  const [camposBusca, setCamposBusca] = useState(filtros);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAtualizarFiltros(camposBusca);
  };

  const handleReset = () => {
    const filtrosVazios = {
      busca: '',
      categoria: 'all',
      status: undefined,
      faixaEtaria: undefined,
      dataPublicacao: undefined
    };
    setCamposBusca(filtrosVazios);
    onAtualizarFiltros(filtrosVazios);
  };

  const handleInputChange = (campo: string, valor: any) => {
    setCamposBusca({ ...camposBusca, [campo]: valor });
  };

  return (
    <Card className="rounded-3xl border border-gray-100 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2 rounded-full border-gray-200"
              >
                <FilterX className="h-4 w-4" />
                Limpar
              </Button>
              <Button
                onClick={onAdicionarLivro}
                className="bg-[#27b99a] hover:bg-[#239d84] text-white flex items-center gap-2 rounded-full"
                size="sm"
              >
                <BookPlus className="h-4 w-4" />
                Novo Livro
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-center gap-3">
              {/* Campo de busca */}
              <div className="relative w-[280px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, autor ou ISBN..."
                  className="pl-9 rounded-full border-gray-200"
                  value={camposBusca.busca}
                  onChange={(e) => handleInputChange('busca', e.target.value)}
                />
              </div>

              {/* Categoria */}
              <div className="w-[200px]">
                <Select
                  value={camposBusca.categoria || 'all'}
                  onValueChange={(value) => handleInputChange('categoria', value)}
                >
                  <SelectTrigger className="rounded-full border-gray-200">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="aventura">Aventura</SelectItem>
                    <SelectItem value="educativo">Educativo</SelectItem>
                    <SelectItem value="fantasia">Fantasia</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                    <SelectItem value="inclusao">Inclusão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="w-[200px]">
                <Select
                  value={camposBusca.status?.toString() || 'all'}
                  onValueChange={(value) => 
                    handleInputChange('status', 
                      value === 'all' ? undefined : value === 'true'
                    )
                  }
                >
                  <SelectTrigger className="rounded-full border-gray-200">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botão de busca */}
              <Button 
                type="submit"
                className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full"
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
