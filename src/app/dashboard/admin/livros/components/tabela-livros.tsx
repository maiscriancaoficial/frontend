'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MoreHorizontal, 
  PencilIcon, 
  Trash2Icon, 
  EyeIcon, 
  BookOpenIcon,
  BookIcon
} from 'lucide-react';
import Image from 'next/image';

interface TabelaLivrosProps {
  onAcao: (acao: string, livro: any) => void;
  filtros: any;
}

export function TabelaLivros({ onAcao, filtros }: TabelaLivrosProps) {
  const [livros, setLivros] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const livrosPorPagina = 10;

  useEffect(() => {
    buscarLivros();
  }, [filtros, paginaAtual]);

  const buscarLivros = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: livrosPorPagina.toString(),
        ...(filtros.busca && { busca: filtros.busca }),
        ...(filtros.categoria && { categoria: filtros.categoria }),
        ...(filtros.status !== undefined && { ativo: filtros.status.toString() })
      });

      const response = await fetch(`/api/livros?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLivros(data.livros);
        setTotal(data.total);
      } else {
        console.error('Erro ao buscar livros:', data.error);
        setLivros([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setLivros([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (dataIso: string) => {
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR').format(data);
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const renderFaixaEtaria = (faixa: string) => {
    const faixas: Record<string, { label: string; color: string }> = {
      '0-3': { label: '0-3 anos', color: 'bg-pink-100 text-pink-800 border-pink-200' },
      '3-6': { label: '3-6 anos', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      '6-9': { label: '6-9 anos', color: 'bg-green-100 text-green-800 border-green-200' },
      '9-12': { label: '9-12 anos', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      '12+': { label: '12+ anos', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    };
    
    const config = faixas[faixa] || { label: faixa, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    
    return (
      <Badge className={`${config.color} rounded-full text-xs font-medium border`}>
        {config.label}
      </Badge>
    );
  };

  const renderCategoriaBadge = (categorias: any[]) => {
    if (!categorias || categorias.length === 0) {
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
          Sem categoria
        </Badge>
      );
    }
    
    const categoria = categorias[0]?.categoria;
    return (
      <Badge className="bg-[#27b99a]/10 text-[#27b99a] border-[#27b99a]/30 hover:bg-[#27b99a]/20 rounded-full text-xs font-medium border">
        {categoria?.nome || 'Categoria'}
      </Badge>
    );
  };

  const toggleStatus = async (livroId: string, novoStatus: boolean) => {
    try {
      const response = await fetch(`/api/livros/${livroId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: novoStatus }),
      });

      if (response.ok) {
        setLivros(livros.map(livro => 
          livro.id === livroId ? {...livro, ativo: novoStatus} : livro
        ));
      } else {
        console.error('Erro ao atualizar status do livro');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Cálculo das páginas
  const totalPaginas = Math.ceil(total / livrosPorPagina);
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#27b99a]/5 to-[#ff0080]/5 hover:from-[#27b99a]/10 hover:to-[#ff0080]/10">
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Livro</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Categoria</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Faixa Etária</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Páginas</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Preço</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Publicação</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livros.length > 0 ? (
                livros.map((livro) => (
                  <TableRow key={livro.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {(livro.imagemCapa || livro.capa) ? (
                            <Image
                              src={livro.imagemCapa || livro.capa}
                              alt={livro.nome || livro.titulo || 'Capa do livro'}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <BookIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {livro.nome || livro.titulo}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {livro.sku}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderCategoriaBadge(livro.categoriasLink || [])}
                    </TableCell>
                    <TableCell>
                      {renderFaixaEtaria(livro.faixaEtaria || '')}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {livro.numeroPaginas || 0} páginas
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {formatarPreco(livro.precoDigital || 0)}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {livro.dataPublicacao ? formatarData(livro.dataPublicacao) : '-'}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={livro.ativo}
                        onCheckedChange={(checked) => toggleStatus(livro.id, checked)}
                        className="data-[state=checked]:bg-[#27b99a]"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onAcao('visualizar', livro)} className="cursor-pointer">
                            <EyeIcon className="mr-2 h-4 w-4" />
                            <span>Visualizar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAcao('editar', livro)} className="cursor-pointer">
                            <PencilIcon className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAcao('previa', livro)} className="cursor-pointer">
                            <BookOpenIcon className="mr-2 h-4 w-4" />
                            <span>Ver Prévia</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAcao('excluir', livro)} className="cursor-pointer text-red-600 dark:text-red-400">
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Nenhum livro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Exibindo {((paginaAtual - 1) * livrosPorPagina) + 1} a {Math.min(paginaAtual * livrosPorPagina, total)} de {total} livros
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
              disabled={paginaAtual === 1}
              className="rounded-2xl"
            >
              Anterior
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => {
                let pagina;
                if (totalPaginas <= 5) {
                  pagina = i + 1;
                } else if (paginaAtual <= 3) {
                  pagina = i + 1;
                } else if (paginaAtual >= totalPaginas - 2) {
                  pagina = totalPaginas - 4 + i;
                } else {
                  pagina = paginaAtual - 2 + i;
                }
                
                return (
                  <Button
                    key={pagina}
                    variant={pagina === paginaAtual ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaginaAtual(pagina)}
                    className={`rounded-2xl ${
                      pagina === paginaAtual 
                        ? "bg-[#27b99a] hover:bg-[#239d84] text-white" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {pagina}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
              disabled={paginaAtual === totalPaginas}
              className="rounded-2xl"
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
