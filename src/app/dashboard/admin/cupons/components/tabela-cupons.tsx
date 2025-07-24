'use client';

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clock } from "lucide-react";
import { CupomDados } from "../page";

interface TabelaCuponsProps {
  cupons: CupomDados[];
  onEditar: (cupom: CupomDados) => void;
  onAlterarStatus: (id: string) => void;
  onExcluir: (id: string) => void;
}

// Função para formatar datas
function formatarData(data: Date | string | undefined): string {
  if (!data) return 'Sem expiração';
  
  // Converte string para Date se necessário
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  // Verifica se a data é válida
  if (isNaN(dataObj.getTime())) {
    return 'Data inválida';
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dataObj);
}

// Função para formatar valor do desconto
function formatarDesconto(valor: number, tipo: string): string {
  if (tipo === 'PORCENTAGEM') {
    return `${valor}%`;
  } else if (tipo === 'FIXO') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  } else if (tipo === 'SEQUENCIAL_POR_UNIDADE') {
    return `${valor}% por unidade`;
  }
  return `${valor}`;
}

// Mapeia os tipos de desconto para descrições amigáveis
const descricaoTipoDesconto = {
  PORCENTAGEM: 'Porcentagem',
  FIXO: 'Valor fixo',
  SEQUENCIAL_POR_UNIDADE: 'Progressivo por unidade',
};

export function TabelaCupons({ cupons, onEditar, onAlterarStatus, onExcluir }: TabelaCuponsProps) {
  return (
    <div className="border rounded-[10px] overflow-hidden shadow-sm border-gray-100 dark:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="font-medium">Título / Código</TableHead>
            <TableHead className="font-medium">Tipo</TableHead>
            <TableHead className="font-medium">Desconto</TableHead>
            <TableHead className="font-medium">Expiração</TableHead>
            <TableHead className="font-medium">Máx. p/ Usuário</TableHead>
            <TableHead className="font-medium">Utilizados</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Nenhum cupom encontrado
              </TableCell>
            </TableRow>
          ) : (
            cupons.map((cupom) => (
              <TableRow key={cupom.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell>
                  <div>
                    <div className="font-medium">{cupom.titulo}</div>
                    <div className="text-sm text-gray-500 font-mono">{cupom.codigo}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {descricaoTipoDesconto[cupom.tipoDesconto] || cupom.tipoDesconto}
                </TableCell>
                <TableCell>
                  {formatarDesconto(cupom.valorDesconto, cupom.tipoDesconto)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {cupom.dataExpiracao && <Clock className="h-3 w-3 text-gray-400" />}
                    <span className={cupom.dataExpiracao ? '' : 'text-gray-500'}>
                      {formatarData(cupom.dataExpiracao)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {cupom.qtdMaxPorUsuario || <span className="text-gray-500">Ilimitado</span>}
                </TableCell>
                <TableCell>
                  {cupom.utilizados}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={cupom.ativo ? "success" : "destructive"} 
                    className={`px-2 py-0 text-xs ${!cupom.ativo && 'opacity-70'}`}
                  >
                    {cupom.ativo ? 'Ativo' : 'Inativo'}
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
                      <DropdownMenuItem onClick={() => onEditar(cupom)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAlterarStatus(cupom.id)}>
                        {cupom.ativo ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onExcluir(cupom.id)}
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
