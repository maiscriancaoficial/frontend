'use client';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clock } from "lucide-react";
// Enum de TipoFrete para usar na interface
type TipoFrete = 'POR_CEP' | 'POR_CIDADE' | 'POR_ESTADO' | 'POR_REGIAO' | 'POR_KM' | 'POR_PRODUTO';
// Função formatadora de moeda
function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

// Tipo para o frete com as informações necessárias para a tabela
export interface FreteTabela {
  id: string;
  titulo: string;
  tipoFrete: TipoFrete;
  configEspecifica: string; // Ex: "CEP: 30000000 a 39999999"
  valor: number;
  prazo: number; // em dias
  ativo: boolean;
}

interface TabelaFretesProps {
  fretes: FreteTabela[];
  onEditar?: (freteId: string) => void;
  onExcluir?: (freteId: string) => void;
  onAlternarStatus?: (freteId: string) => void;
}

export function TabelaFretes({ fretes, onEditar, onExcluir, onAlternarStatus }: TabelaFretesProps) {
  const traduzirTipoFrete = (tipo: TipoFrete) => {
    const traducoes = {
      POR_CEP: 'Faixa de CEP',
      POR_CIDADE: 'Por Cidade',
      POR_ESTADO: 'Por Estado',
      POR_REGIAO: 'Por Região',
      POR_KM: 'Por Distância (KM)',
      POR_PRODUTO: 'Específico por Produto'
    };
    
    return traducoes[tipo] || tipo;
  };
  
  return (
    <div className="border rounded-[10px] overflow-hidden shadow-sm border-gray-100 dark:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="w-[250px]">NOME</TableHead>
            <TableHead className="w-[120px]">TIPO</TableHead>
            <TableHead>CONFIGURAÇÃO</TableHead>
            <TableHead className="w-[100px]">VALOR</TableHead>
            <TableHead className="w-[100px]">PRAZO</TableHead>
            <TableHead className="w-[100px]">STATUS</TableHead>
            <TableHead className="w-[50px]">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fretes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhuma opção de frete encontrada.
              </TableCell>
            </TableRow>
          ) : (
            fretes.map((frete) => (
              <TableRow key={frete.id}>
                <TableCell className="font-medium">{frete.titulo}</TableCell>
                <TableCell>{traduzirTipoFrete(frete.tipoFrete)}</TableCell>
                <TableCell>{frete.configEspecifica}</TableCell>
                <TableCell>{formatarMoeda(frete.valor)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{frete.prazo} dias</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={frete.ativo ? "success" : "secondary"}
                    className={`${frete.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {frete.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditar?.(frete.id)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAlternarStatus?.(frete.id)}>
                        {frete.ativo ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onExcluir?.(frete.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
