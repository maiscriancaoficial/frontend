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
  UserCircle,
  PaintBucket
} from 'lucide-react';

interface TabelaAvataresProps {
  onAcao: (acao: string, avatar: any) => void;
  filtros: any;
}

export function TabelaAvatares({ onAcao, filtros }: TabelaAvataresProps) {
  const [avatares, setAvatares] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const avataresPorPagina = 10;

  useEffect(() => {
    buscarAvatares();
  }, [filtros, paginaAtual]);

  const buscarAvatares = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: avataresPorPagina.toString(),
        ...(filtros.busca && { busca: filtros.busca }),
        ...(filtros.tipo && { tipo: filtros.tipo }),
        ...(filtros.status !== undefined && { ativo: filtros.status.toString() })
      });

      const response = await fetch(`/api/avatares?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setAvatares(data.avatares);
        setTotal(data.total);
      } else {
        console.error('Erro ao buscar avatares:', data.error);
        setAvatares([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Erro ao buscar avatares:', error);
      setAvatares([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Cálculo das páginas
  const totalPaginas = Math.ceil(total / avataresPorPagina);

  const formatarData = (dataIso: string) => {
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR').format(data);
  };

  const contarElementos = (avatar: any) => {
    return avatar.elementos?.length || 0;
  };

  const contarVariacoesCores = (avatar: any) => {
    const elementosComCor = avatar.elementos?.filter((el: any) => el.cor) || [];
    return elementosComCor.length;
  };

  const renderTipoBadge = (tipo: string) => {
    const tipoConfig = {
      'MASCULINO': { label: 'Masculino', cor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      'FEMININO': { label: 'Feminino', cor: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
      'UNISSEX': { label: 'Unissex', cor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    };
    
    const config = tipoConfig[tipo as keyof typeof tipoConfig] || {
      label: tipo,
      cor: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    
    return (
      <Badge className={`${config.cor} rounded-full text-xs font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const toggleStatus = (avatarId: string, novoStatus: boolean) => {
    setAvatares(avatares.map(avatar => 
      avatar.id === avatarId ? {...avatar, ativo: novoStatus} : avatar
    ));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Avatar</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Elementos</TableHead>
                <TableHead>Cores</TableHead>
                <TableHead>Personalizações</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Linhas de esqueleto para carregamento
                Array(5).fill(null).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {Array(8).fill(null).map((_, cellIndex) => (
                      <TableCell key={`cell-${cellIndex}`}>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !isLoading && avatares.length > 0 ? (
                avatares.map((avatar: any) => (
                  <TableRow key={avatar.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                          {avatar.fotoPrincipal ? (
                            <img
                              src={avatar.fotoPrincipal}
                              alt={`Avatar ${avatar.nome}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // Se a imagem falhar ao carregar, mostrar o ícone padrão
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const icon = parent.querySelector('.fallback-icon');
                                  if (icon) {
                                    (icon as HTMLElement).style.display = 'block';
                                  }
                                }
                              }}
                            />
                          ) : null}
                          <UserCircle 
                            className={`absolute inset-0 m-auto text-gray-400 fallback-icon ${
                              avatar.fotoPrincipal ? 'hidden' : 'block'
                            }`} 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{avatar.nome}</span>
                          <span className="text-xs text-gray-500">ID: {avatar.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderTipoBadge(avatar.tipo)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-0">
                        {contarElementos(avatar)} elementos
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <PaintBucket className="h-4 w-4 text-gray-400" />
                        <span>{contarVariacoesCores(avatar)} cores</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{avatar.livrosPersonalizados?.length || 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{formatarData(avatar.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={avatar.ativo}
                        onCheckedChange={(checked) => toggleStatus(avatar.id, checked)}
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
                          <DropdownMenuItem onClick={() => onAcao('visualizar', avatar)} className="cursor-pointer">
                            <EyeIcon className="mr-2 h-4 w-4" />
                            <span>Visualizar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAcao('editar', avatar)} className="cursor-pointer">
                            <PencilIcon className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAcao('excluir', avatar)} className="cursor-pointer text-red-600 dark:text-red-400">
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
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhum avatar encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Exibindo {((paginaAtual - 1) * avataresPorPagina) + 1} a {Math.min(paginaAtual * avataresPorPagina, avatares.length)} de {avatares.length} avatares
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <Button
                  key={pagina}
                  variant={pagina === paginaAtual ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaginaAtual(pagina)}
                  className={pagina === paginaAtual ? "bg-[#27b99a] hover:bg-[#239d84]" : ""}
                >
                  {pagina}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
