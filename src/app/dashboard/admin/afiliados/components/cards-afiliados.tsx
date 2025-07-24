'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Settings, TrendingUp, MousePointer, ShoppingCart, DollarSign, Calendar, Mail, Phone, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AfiliadoDados } from './tabela-afiliados';

interface CardsAfiliadosProps {
  afiliados: AfiliadoDados[];
  onEditar: (afiliado: AfiliadoDados) => void;
  onAlterarStatus: (id: string, novoStatus: boolean) => void;
  onExcluir: (id: string) => void;
  onConfigurar?: (afiliado: AfiliadoDados) => void;
  mostrarMetricasAvancadas: boolean;
}

export function CardsAfiliados({ 
  afiliados, 
  onEditar, 
  onAlterarStatus, 
  onExcluir, 
  onConfigurar,
  mostrarMetricasAvancadas 
}: CardsAfiliadosProps) {
  const formatarData = (data: Date | string) => {
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dataObj);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusBadge = (afiliado: AfiliadoDados) => {
    if (afiliado.pendente) {
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-0">
          Pendente
        </Badge>
      );
    }
    
    if (afiliado.ativo) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
          Ativo
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-0">
        Inativo
      </Badge>
    );
  };

  const getComissaoBadge = (afiliado: AfiliadoDados) => {
    const cor = afiliado.tipoComissao === 'porcentagem' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    const valor = afiliado.tipoComissao === 'porcentagem' ? `${afiliado.valorComissao}%` : formatarMoeda(afiliado.valorComissao);
    
    return (
      <Badge className={`${cor} border-0`}>
        {valor}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {afiliados.map((afiliado) => (
        <Card key={afiliado.id} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            {/* Header do Card */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-700">
                  <AvatarImage src={afiliado.fotoPerfil} alt={afiliado.nome} />
                  <AvatarFallback className="bg-gradient-to-r from-[#27b99a] to-[#239d84] text-white font-semibold">
                    {afiliado.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {afiliado.nome}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {afiliado.email}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-0 shadow-xl">
                  <DropdownMenuItem onClick={() => onEditar(afiliado)} className="rounded-xl">
                    <Edit size={16} className="mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {onConfigurar && (
                    <DropdownMenuItem onClick={() => onConfigurar(afiliado)} className="rounded-xl">
                      <Settings size={16} className="mr-2" />
                      Configurações
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onAlterarStatus(afiliado.id, !afiliado.ativo)}
                    className="rounded-xl"
                  >
                    {afiliado.ativo ? (
                      <>
                        <EyeOff size={16} className="mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye size={16} className="mr-2" />
                        Ativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onExcluir(afiliado.id)}
                    className="text-red-600 dark:text-red-400 rounded-xl"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status e Código */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusBadge(afiliado)}
                {getComissaoBadge(afiliado)}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Código</p>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {afiliado.codigoAfiliado}
                </p>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-2 mb-4">
              {afiliado.telefone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={14} />
                  <span>{afiliado.telefone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={14} />
                <span>Desde {formatarData(afiliado.dataRegistro)}</span>
              </div>
              {afiliado.ultimaVenda && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ShoppingCart size={14} />
                  <span>Última venda: {formatarData(afiliado.ultimaVenda)}</span>
                </div>
              )}
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendas</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {afiliado.totalVendas}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ganhos</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatarMoeda(afiliado.totalGanhos)}
                </p>
              </div>
            </div>

            {/* Métricas Avançadas (Condicionais) */}
            {mostrarMetricasAvancadas && (
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <MousePointer size={14} className="mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                    <p className="font-semibold text-blue-900 dark:text-blue-300">{afiliado.cliques}</p>
                    <p className="text-blue-600 dark:text-blue-400">Cliques</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <TrendingUp size={14} className="mx-auto mb-1 text-green-600 dark:text-green-400" />
                    <p className="font-semibold text-green-900 dark:text-green-300">{afiliado.conversoes}</p>
                    <p className="text-green-600 dark:text-green-400">Conversões</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <DollarSign size={14} className="mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                    <p className="font-semibold text-purple-900 dark:text-purple-300">{afiliado.taxaConversao.toFixed(1)}%</p>
                    <p className="text-purple-600 dark:text-purple-400">Taxa</p>
                  </div>
                </div>
                
                {afiliado.linkAfiliado && (
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => window.open(afiliado.linkAfiliado, '_blank')}
                    >
                      <ExternalLink size={14} className="mr-2" />
                      Ver Link de Afiliado
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
