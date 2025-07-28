'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, ToggleLeft, ToggleRight, MapPin, Mail, Phone, Crown, BadgeCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent
} from '@/components/ui/card';
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
  const formatarData = (data?: Date | string) => {
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
    <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <TableRow className="border-b border-gray-100 dark:border-gray-800">
                <TableHead className="w-[250px] font-semibold text-gray-900 dark:text-gray-100">Cliente</TableHead>
                <TableHead className="w-[180px] font-semibold text-gray-900 dark:text-gray-100">Contato</TableHead>
                <TableHead className="w-[120px] font-semibold text-gray-900 dark:text-gray-100">Status</TableHead>
                <TableHead className="w-[120px] font-semibold text-gray-900 dark:text-gray-100">Cadastro</TableHead>
                <TableHead className="w-[120px] font-semibold text-gray-900 dark:text-gray-100">Última Compra</TableHead>
                <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100">Compras</TableHead>
                <TableHead className="text-right w-[80px] font-semibold text-gray-900 dark:text-gray-100">Ações</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {clientes.map(cliente => (
              <>
                <TableRow 
                  key={cliente.id} 
                  className={`
                    border-b border-gray-100 dark:border-gray-800 group transition-all duration-200
                    ${expandidos[cliente.id] ? 'bg-gray-50/70 dark:bg-gray-900/50' : ''}
                    hover:bg-gray-50 dark:hover:bg-gray-900/30
                  `}
                >
                  {/* Cliente Nome */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm
                        ${cliente.ativo 
                          ? 'bg-gradient-to-br from-[#27b99a] to-[#22a085]' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'}
                      `}>
                        {cliente.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium flex items-center">
                          {cliente.nome}
                          {cliente.premium && (
                            <Crown className="ml-1 w-3 h-3 text-amber-500" />
                          )}
                          {cliente.verificado && (
                            <BadgeCheck className="ml-1 w-3 h-3 text-blue-500" />
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
                    <Badge variant="outline" className={`rounded-full ${
                      cliente.ativo 
                        ? "bg-gradient-to-r from-[#27b99a]/10 to-[#ff0080]/10 text-[#27b99a] border-[#27b99a]/20" 
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                    }`}>
                      {cliente.ativo ? "Ativo" : "Inativo"}
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
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
                          <DropdownMenuItem onClick={() => toggleExpandido(cliente.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {expandidos[cliente.id] ? 'Ocultar detalhes' : 'Ver detalhes'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditar(cliente)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAlterarStatus(cliente.id)}>
                            {cliente.ativo ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onExcluir(cliente.id)} 
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Linha expandida com detalhes */}
                {expandidos[cliente.id] && (
                  <TableRow className="bg-gray-50/30 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800">
                    <TableCell colSpan={7} className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações de contato */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-[#27b99a] dark:text-[#27b99a] mb-2">Informações de Contato</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500 dark:text-gray-400">Email: </span> {cliente.email}</p>
                            {cliente.telefone && (
                              <p><span className="text-gray-500 dark:text-gray-400">Telefone: </span> {cliente.telefone}</p>
                            )}
                            {cliente.cpfCnpj && (
                              <p><span className="text-gray-500 dark:text-gray-400">CPF/CNPJ: </span> {cliente.cpfCnpj}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Endereço */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-[#27b99a] dark:text-[#27b99a] mb-2">Endereço</h4>
                          {cliente.endereco ? (
                            <div className="space-y-1 text-sm">
                              {cliente.endereco.rua && (
                                <p>
                                  {cliente.endereco.rua}
                                  {cliente.endereco.numero && `, ${cliente.endereco.numero}`}
                                </p>
                              )}
                              {cliente.endereco.complemento && (
                                <p>{cliente.endereco.complemento}</p>
                              )}
                              {cliente.endereco.bairro && (
                                <p>{cliente.endereco.bairro}</p>
                              )}
                              {cliente.endereco.cidade && (
                                <p>
                                  {cliente.endereco.cidade}, {cliente.endereco.estado}
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
                          <h4 className="text-sm font-medium text-[#27b99a] dark:text-[#27b99a] mb-2">Histórico</h4>
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
                          className="rounded-2xl border-[#27b99a] text-[#27b99a] hover:bg-[#27b99a] hover:text-white transition-all duration-300"
                        >
                          <Edit size={14} className="mr-1" /> Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onAlterarStatus(cliente.id)}
                          className={`rounded-2xl transition-all duration-300 ${
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
      </CardContent>
    </Card>
  );
}
