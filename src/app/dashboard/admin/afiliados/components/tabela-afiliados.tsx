'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronUp, 
  CreditCard, 
  Edit, 
  MoreVertical, 
  Trash2, 
  UserCheck, 
  UserX,
  Link,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate, formatCurrency } from '@/lib/utils';

export interface AfiliadoDados {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  fotoPerfil?: string;
  codigoAfiliado: string;
  ativo: boolean;
  pendente: boolean;
  dataRegistro: Date;
  ultimaVenda: Date | null;
  totalVendas: number;
  totalGanhos: number;
  cliques: number;
  conversoes: number;
  taxaConversao: number;
  tipoComissao: 'porcentagem' | 'fixo';
  valorComissao: number;
  linkAfiliado?: string;
  observacoes?: string;
}

interface TabelaAfiliadosProps {
  afiliados: AfiliadoDados[];
  onEditar: (afiliado: AfiliadoDados) => void;
  onAlterarStatus: (id: string, ativo: boolean) => void;
  onExcluir: (id: string) => void;
}

export function TabelaAfiliados({ 
  afiliados, 
  onEditar, 
  onAlterarStatus, 
  onExcluir 
}: TabelaAfiliadosProps) {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [ordenacao, setOrdenacao] = useState<{coluna: string; direcao: 'asc' | 'desc'}>({
    coluna: 'nome', 
    direcao: 'asc'
  });
  
  const alternarExpansao = (id: string) => {
    setExpandidos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const ordenar = (coluna: string) => {
    setOrdenacao(prev => ({
      coluna,
      direcao: prev.coluna === coluna && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const afiliadosOrdenados = [...afiliados].sort((a, b) => {
    const { coluna, direcao } = ordenacao;
    const fator = direcao === 'asc' ? 1 : -1;
    
    switch (coluna) {
      case 'nome':
        return a.nome.localeCompare(b.nome) * fator;
      case 'cliques':
        return (a.cliques - b.cliques) * fator;
      case 'vendas':
        return (a.totalVendas - b.totalVendas) * fator;
      case 'ganhos':
        return (a.totalGanhos - b.totalGanhos) * fator;
      case 'conversao':
        return (a.taxaConversao - b.taxaConversao) * fator;
      case 'dataRegistro':
        return (new Date(a.dataRegistro).getTime() - new Date(b.dataRegistro).getTime()) * fator;
      case 'ultimaVenda':
        if (!a.ultimaVenda) return 1 * fator;
        if (!b.ultimaVenda) return -1 * fator;
        return (new Date(a.ultimaVenda).getTime() - new Date(b.ultimaVenda).getTime()) * fator;
      default:
        return 0;
    }
  });
  
  const renderIconeOrdenacao = (coluna: string) => {
    if (ordenacao.coluna !== coluna) return null;
    
    return ordenacao.direcao === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-10"></th>
              <th 
                onClick={() => ordenar('nome')}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-amber-600 dark:hover:text-amber-200 flex items-center"
              >
                Afiliado {renderIconeOrdenacao('nome')}
              </th>
              <th 
                onClick={() => ordenar('cliques')}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-amber-600 dark:hover:text-amber-200 flex items-center"
              >
                Cliques {renderIconeOrdenacao('cliques')}
              </th>
              <th 
                onClick={() => ordenar('vendas')}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-amber-600 dark:hover:text-amber-200 flex items-center"
              >
                Vendas {renderIconeOrdenacao('vendas')}
              </th>
              <th 
                onClick={() => ordenar('conversao')}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-amber-600 dark:hover:text-amber-200 flex items-center"
              >
                Taxa Conv. {renderIconeOrdenacao('conversao')}
              </th>
              <th 
                onClick={() => ordenar('ganhos')}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-amber-600 dark:hover:text-amber-200 flex items-center"
              >
                Ganhos {renderIconeOrdenacao('ganhos')}
              </th>
              <th 
                onClick={() => ordenar('dataRegistro')}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-amber-600 dark:hover:text-amber-200 flex items-center"
              >
                Registro {renderIconeOrdenacao('dataRegistro')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider w-20">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 dark:divide-amber-900/50">
            {afiliadosOrdenados.map((afiliado) => (
              <tr 
                key={afiliado.id}
                className="hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors group"
              >
                <td className="px-4 py-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => alternarExpansao(afiliado.id)} 
                    className="h-6 w-6 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  >
                    {expandidos[afiliado.id] ? 
                      <ChevronDown className="h-4 w-4 text-amber-600 dark:text-amber-400" /> : 
                      <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    }
                  </Button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium">
                      {afiliado.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-amber-900 dark:text-amber-100">{afiliado.nome}</div>
                      <div className="text-sm text-amber-600 dark:text-amber-400">{afiliado.email}</div>
                      <div className="text-xs mt-1 flex items-center space-x-2">
                        <Link className="h-3 w-3 text-amber-500" />
                        <span className="text-amber-700 dark:text-amber-300">{afiliado.codigoAfiliado}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-amber-800 dark:text-amber-200">
                  {afiliado.cliques.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-amber-800 dark:text-amber-200">
                  {afiliado.totalVendas.toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <Badge variant={afiliado.taxaConversao > 5 ? "success" : "secondary"} className="font-normal">
                    {afiliado.taxaConversao.toFixed(2)}%
                  </Badge>
                </td>
                <td className="px-4 py-4 text-amber-800 dark:text-amber-200">
                  {formatCurrency(afiliado.totalGanhos)}
                </td>
                <td className="px-4 py-4 text-amber-800 dark:text-amber-200">
                  {formatDate(afiliado.dataRegistro)}
                </td>
                <td className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      >
                        <MoreVertical className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-amber-200 dark:border-amber-800">
                      <DropdownMenuItem 
                        onClick={() => onEditar(afiliado)}
                        className="text-amber-700 dark:text-amber-300 focus:bg-amber-50 dark:focus:bg-amber-900/30"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => onAlterarStatus(afiliado.id, !afiliado.ativo)}
                        className="text-amber-700 dark:text-amber-300 focus:bg-amber-50 dark:focus:bg-amber-900/30"
                      >
                        {afiliado.ativo ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" /> Desativar
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" /> Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => onExcluir(afiliado.id)}
                        className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {afiliadosOrdenados.map(afiliado => (
              expandidos[afiliado.id] && (
                <tr key={`${afiliado.id}-details`} className="bg-amber-50/50 dark:bg-amber-900/5">
                  <td colSpan={8} className="px-4 py-4">
                    <div className="pl-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-amber-500" />
                          Detalhes de Comissão
                        </h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-[10px] shadow-sm space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                            <Badge variant="outline" className="text-amber-600 border-amber-300 dark:border-amber-700">
                              {afiliado.tipoComissao === 'porcentagem' ? (
                                <div className="flex items-center">
                                  <Percent className="h-3 w-3 mr-1" /> Porcentagem
                                </div>
                              ) : 'Valor Fixo'}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                            <span className="font-medium text-amber-700 dark:text-amber-300">
                              {afiliado.tipoComissao === 'porcentagem' 
                                ? `${afiliado.valorComissao}%` 
                                : formatCurrency(afiliado.valorComissao)
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            {afiliado.pendente ? (
                              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                                Pendente
                              </Badge>
                            ) : afiliado.ativo ? (
                              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
                                Inativo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          Métricas de Desempenho
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-[10px] shadow-sm">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Total de Cliques</div>
                            <div className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                              {afiliado.cliques.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-[10px] shadow-sm">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Conversões</div>
                            <div className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                              {afiliado.conversoes.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-[10px] shadow-sm">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Taxa de Conversão</div>
                            <div className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                              {afiliado.taxaConversao.toFixed(2)}%
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-[10px] shadow-sm">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Última Venda</div>
                            <div className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                              {afiliado.ultimaVenda ? formatDate(afiliado.ultimaVenda) : 'Nenhuma'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          Link de Afiliado
                        </h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-[10px] shadow-sm space-y-4">
                          <div className="flex items-center space-x-2">
                            <Link className="h-4 w-4 text-amber-600" />
                            <input 
                              readOnly
                              className="flex-1 text-xs p-2 border border-amber-200 dark:border-amber-800 rounded-md bg-amber-50/50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-200"
                              value={`https://floriculturanaweb.com/ref/${afiliado.codigoAfiliado}`}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="border border-amber-200 hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `https://floriculturanaweb.com/ref/${afiliado.codigoAfiliado}`
                                );
                              }}
                            >
                              Copiar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            ))}
            {afiliadosOrdenados.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  Nenhum afiliado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
