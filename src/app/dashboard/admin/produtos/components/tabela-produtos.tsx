'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Archive,
  Tag,
  CircleAlert,
  Box
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";

// Define o tipo de um produto
interface Produto {
  id: string;
  titulo: string;
  descricao?: string;
  descricaoLonga?: string;
  slug: string;
  preco: number;
  precoPromocional?: number;
  sku?: string;
  estoque: number;
  fotoPrincipal?: string;
  galeria: string[];
  peso?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  palavrasChave?: string;
  pontuacaoSEO?: number;
  emDestaque: boolean;
  ativo: boolean;
  categoriasLink?: {
    categoria: {
      id: string;
      titulo: string;
    };
  }[];
  tagsLink?: {
    tag: {
      id: string;
      nome: string;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface TabelaProdutosProps {
  filtros?: any;
  onAcao: (acao: string, produto: Produto) => void;
}

export function TabelaProdutos({ filtros, onAcao }: TabelaProdutosProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Toast já importado do sonner

  // Carregamento de dados reais da API
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setIsLoading(true);
        
        // Construir query string com filtros
        const params = new URLSearchParams();
        params.append('page', paginaAtual.toString());
        params.append('limit', '15');
        
        if (filtros?.busca) params.append('busca', filtros.busca);
        if (filtros?.categoria) params.append('categoria', filtros.categoria);
        if (filtros?.precoMin) params.append('precoMin', filtros.precoMin.toString());
        if (filtros?.precoMax) params.append('precoMax', filtros.precoMax.toString());
        if (filtros?.status !== undefined) params.append('ativo', filtros.status.toString());
        if (filtros?.emDestaque !== undefined) params.append('emDestaque', filtros.emDestaque.toString());
        
        const response = await fetch(`/api/produtos?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setProdutos(data.produtos);
          setTotalPaginas(Math.ceil(data.total / 15));
        } else {
          console.error('Erro ao carregar produtos:', data.error);
          toast.error('Não foi possível carregar a lista de produtos.');
          setProdutos([]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast.error('Não foi possível carregar a lista de produtos. Tente novamente mais tarde.');
        setProdutos([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarProdutos();
  }, [paginaAtual, filtros]);

  // Funções para abrir modais
  const abrirModalVisualizar = (produto: Produto) => {
    onAcao('visualizar', produto);
  };

  const abrirModalEditar = (produto: Produto) => {
    onAcao('editar', produto);
  };

  const abrirModalExcluir = (produto: Produto) => {
    onAcao('excluir', produto);
  };

  // Função para formatar preço
  const formatarPreco = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Função para formatar data
  const formatarData = (data: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(data));
  };

  return (
    <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Foto</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-40" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-16" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-16 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-8 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      {produto.fotoPrincipal && !produto.fotoPrincipal.includes('unsplash') ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          <Image 
                            src={produto.fotoPrincipal} 
                            alt={produto.titulo}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Se a imagem falhar, esconder e mostrar placeholder
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      <div className="flex flex-col">
                        <span className="truncate">{produto.titulo}</span>
                        {produto.emDestaque && (
                          <Badge variant="outline" className="text-xs w-fit mt-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800 rounded-full">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{produto.sku || "-"}</TableCell>
                    <TableCell>
                      {produto.categoriasLink && produto.categoriasLink.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {produto.categoriasLink.map((catLink, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs rounded-full bg-[#27b99a]/10 text-[#27b99a] border-[#27b99a]/30 hover:bg-[#27b99a]/20">
                              {catLink.categoria.titulo}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div>
                        {produto.precoPromocional ? (
                          <div className="flex flex-col items-end">
                            <span className="text-green-600 dark:text-green-500 font-semibold">
                              {formatarPreco(produto.precoPromocional)}
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                              {formatarPreco(produto.preco)}
                            </span>
                          </div>
                        ) : (
                          formatarPreco(produto.preco)
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className={`rounded-full ${
                        produto.ativo 
                          ? "bg-gradient-to-r from-[#27b99a]/10 to-[#ff0080]/10 text-[#27b99a] border-[#27b99a]/20"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                      }`}>
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => abrirModalVisualizar(produto)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => abrirModalEditar(produto)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => abrirModalExcluir(produto)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
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
        
        {/* Paginação */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Exibindo <span className="font-medium">{produtos.length}</span> de{" "}
            <span className="font-medium">15</span> produtos
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={paginaAtual === 1}
              onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {paginaAtual} de {totalPaginas}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
