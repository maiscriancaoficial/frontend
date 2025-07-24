'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, ToggleLeft, ToggleRight, MapPin, Mail, Phone, Crown, BadgeCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ClienteDados } from '../page';

interface TabelaClientesProps {
  clientes: ClienteDados[];
  onEditar: (cliente: ClienteDados) => void;
  onAlterarStatus: (id: string) => void;
  onExcluir: (id: string) => void;
}

export function TabelaClientes({ clientes, onEditar, onAlterarStatus, onExcluir }: TabelaClientesProps) {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const toggleExpandido = (id: string) => {
    setExpandidos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Formatar data em pt-BR
  const formatarData = (data?: Date) => {
    if (!data) return '—';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(data));
  };

  // Formatar valor monetário em R$
  const formatarMoeda = (valor?: number) => {
    if (valor === undefined) return '—';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-teal-100 dark:border-teal-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-teal-50/70 dark:bg-teal-950/20">
            <TableRow className="hover:bg-teal-50 dark:hover:bg-teal-950/30">
              <TableHead className="w-[250px]">Cliente</TableHead>
              <TableHead className="w-[180px]">Contato</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Cadastro</TableHead>
              <TableHead className="w-[120px]">Última Compra</TableHead>
              <TableHead className="text-right">Compras</TableHead>
              <TableHead className="text-right w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map(cliente => (
              <>
                <TableRow 
                  key={cliente.id} 
                  className={`
                    border-b border-teal-100 dark:border-teal-900/30 group
                    ${expandidos[cliente.id] ? 'bg-teal-50/70 dark:bg-teal-950/20' : ''}
                    hover:bg-teal-50 dark:hover:bg-teal-950/20
                  `}
                >
                  {/* Cliente Nome */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm
                        ${cliente.ativo 
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'}
                      `}>
                        {cliente.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium flex items-center">
                          {cliente.nome}
                          {cliente.premium && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Crown size={14} className="ml-1 text-amber-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cliente Premium</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {cliente.verificado && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <BadgeCheck size={14} className="ml-1 text-blue-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Email Verificado</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        {cliente.endereco?.cidade && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                            <MapPin size={10} className="mr-1" />
                            {cliente.endereco.cidade}, {cliente.endereco.estado}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Contato */}
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-sm">
                      <div className="flex items-center">
                        <Mail size={12} className="mr-1 text-teal-500" />
                        <span className="truncate max-w-[140px]">{cliente.email}</span>
                      </div>
                      {cliente.telefone && (
                        <div className="flex items-center">
                          <Phone size={12} className="mr-1 text-teal-500" />
                          <span>{cliente.telefone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell>
                    <Badge 
                      className={`${
                        cliente.ativo
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      } px-3 py-1 rounded-full text-xs`}
                    >
                      {cliente.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  
                  {/* Data de Cadastro */}
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar size={12} className="mr-1 text-gray-400" />
                      {formatarData(cliente.dataCadastro)}
                    </div>
                  </TableCell>
                  
                  {/* Última Compra */}
                  <TableCell>
                    {cliente.ultimaCompra ? (
                      <span className="text-sm">{formatarData(cliente.ultimaCompra)}</span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">Sem compras</span>
                    )}
                  </TableCell>
                  
                  {/* Compras */}
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      {cliente.totalCompras ? (
                        <>
                          <div className="text-sm font-medium">
                            {cliente.totalCompras} {cliente.totalCompras === 1 ? 'compra' : 'compras'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatarMoeda(cliente.totalGasto)}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Ações */}
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleExpandido(cliente.id)}
                        className="h-8 w-8 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye size={16} />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950/50 rounded-full"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-teal-100 dark:border-teal-900">
                          <DropdownMenuItem 
                            onClick={() => onEditar(cliente)}
                            className="cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-950/30 text-teal-700 dark:text-teal-300"
                          >
                            <Edit size={16} className="mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onAlterarStatus(cliente.id)}
                            className="cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-950/30 text-teal-700 dark:text-teal-300"
                          >
                            {cliente.ativo ? (
                              <>
                                <ToggleLeft size={16} className="mr-2" /> Desativar
                              </>
                            ) : (
                              <>
                                <ToggleRight size={16} className="mr-2" /> Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onExcluir(cliente.id)}
                            className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                          >
                            <Trash2 size={16} className="mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Linha expandida com detalhes */}
                {expandidos[cliente.id] && (
                  <TableRow className="bg-teal-50/30 dark:bg-teal-950/10">
                    <TableCell colSpan={7} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Dados pessoais */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-teal-700 dark:text-teal-400 mb-2">Dados do Cliente</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500 dark:text-gray-400">Nome: </span> {cliente.nome}</p>
                            <p><span className="text-gray-500 dark:text-gray-400">Email: </span> {cliente.email}</p>
                            {cliente.telefone && (
                              <p><span className="text-gray-500 dark:text-gray-400">Telefone: </span> {cliente.telefone}</p>
                            )}
                            <p><span className="text-gray-500 dark:text-gray-400">Cadastro: </span> {formatarData(cliente.dataCadastro)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${cliente.ativo 
                                    ? 'border-green-300 text-green-700 dark:border-green-800 dark:text-green-400'
                                    : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-400'
                                  }
                                `}
                              >
                                {cliente.ativo ? 'Ativo' : 'Inativo'}
                              </Badge>
                              
                              {cliente.verificado && (
                                <Badge 
                                  variant="outline" 
                                  className="border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                                >
                                  Verificado
                                </Badge>
                              )}
                              
                              {cliente.premium && (
                                <Badge 
                                  variant="outline" 
                                  className="border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                                >
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Endereço */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-teal-700 dark:text-teal-400 mb-2">Endereço</h4>
                          {cliente.endereco && (cliente.endereco.rua || cliente.endereco.cidade) ? (
                            <div className="space-y-1 text-sm">
                              {cliente.endereco.rua && (
                                <p>
                                  {cliente.endereco.rua}, {cliente.endereco.numero || 'S/N'}
                                  {cliente.endereco.complemento && ` - ${cliente.endereco.complemento}`}
                                </p>
                              )}
                              {cliente.endereco.bairro && (
                                <p>{cliente.endereco.bairro}</p>
                              )}
                              {cliente.endereco.cidade && (
                                <p>
                                  {cliente.endereco.cidade} - {cliente.endereco.estado}
                                </p>
                              )}
                              {cliente.endereco.cep && (
                                <p><span className="text-gray-500 dark:text-gray-400">CEP: </span> {cliente.endereco.cep}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum endereço cadastrado</p>
                          )}
                        </div>
                        
                        {/* Histórico de compras */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-teal-700 dark:text-teal-400 mb-2">Histórico</h4>
                          {cliente.totalCompras ? (
                            <div className="space-y-2 text-sm">
                              <p><span className="text-gray-500 dark:text-gray-400">Total de compras: </span> {cliente.totalCompras}</p>
                              <p><span className="text-gray-500 dark:text-gray-400">Valor total gasto: </span> {formatarMoeda(cliente.totalGasto)}</p>
                              <p><span className="text-gray-500 dark:text-gray-400">Última compra: </span> {formatarData(cliente.ultimaCompra)}</p>
                              <p><span className="text-gray-500 dark:text-gray-400">Ticket médio: </span> {formatarMoeda(cliente.totalGasto ? cliente.totalGasto / cliente.totalCompras : 0)}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma compra realizada</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditar(cliente)}
                          className="rounded-full border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-900/30"
                        >
                          <Edit size={14} className="mr-1" /> Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onAlterarStatus(cliente.id)}
                          className={`rounded-full ${
                            cliente.ativo
                              ? 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400'
                              : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400'
                          }`}
                        >
                          {cliente.ativo ? (
                            <>
                              <ToggleLeft size={14} className="mr-1" /> Desativar
                            </>
                          ) : (
                            <>
                              <ToggleRight size={14} className="mr-1" /> Ativar
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
