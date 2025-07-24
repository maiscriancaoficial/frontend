'use client';

import { useState } from "react";
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Trash2, 
  PencilLine,
  Image as ImageIcon,
  MoveUp,
  MoveDown
} from "lucide-react";
import { BannerDados } from "../page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListaBannersProps {
  banners: BannerDados[];
  onEditar: (banner: BannerDados) => void;
  onAlterarStatus: (id: string) => void;
  onExcluir: (id: string) => void;
}

export function ListaBanners({ banners, onEditar, onAlterarStatus, onExcluir }: ListaBannersProps) {
  const [bannerExpandido, setBannerExpandido] = useState<string | null>(null);

  // Função para formatar data
  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  // Função para expandir/recolher detalhes do banner
  const toggleExpandir = (id: string) => {
    if (bannerExpandido === id) {
      setBannerExpandido(null);
    } else {
      setBannerExpandido(id);
    }
  };

  return (
    <div className="space-y-4">
      {banners.map((banner) => (
        <div 
          key={banner.id}
          className={`
            group bg-white dark:bg-gray-900 rounded-[15px] border border-gray-100 dark:border-gray-800 shadow-sm 
            transition-all duration-200 hover:shadow-md overflow-hidden
            ${bannerExpandido === banner.id ? 'ring-2 ring-emerald-500/30' : ''}
          `}
        >
          {/* Cabeçalho do banner com foto e informações básicas */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 cursor-pointer relative"
            onClick={() => toggleExpandir(banner.id)}
          >
            {/* Preview do banner */}
            <div className="relative h-32 w-full md:w-48 lg:w-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
              {banner.fotoDesktop ? (
                <div className="h-full w-full relative">
                  <img 
                    src={banner.fotoDesktop} 
                    alt={banner.titulo}
                    className="object-cover h-full w-full"
                  />
                  <Badge 
                    variant={banner.ativo ? "success" : "destructive"}
                    className="absolute top-2 left-2"
                  >
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-300" />
                </div>
              )}
            </div>
            
            {/* Informações básicas */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{banner.titulo}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
                    Ordem: {banner.ordem}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEditar(banner);
                      }}>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onAlterarStatus(banner.id);
                      }}>
                        {banner.ativo ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExcluir(banner.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Descrição e datas */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {banner.descricao || "Sem descrição"}
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-1">Criado:</span> 
                  <span>{formatarData(banner.createdAt)}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-1">Atualizado:</span> 
                  <span>{formatarData(banner.updatedAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Ícone indicador de expansão */}
            <div className="absolute right-4 bottom-4 md:relative md:right-0 md:bottom-0">
              <ArrowUpDown className={`h-4 w-4 text-gray-400 transition-transform ${bannerExpandido === banner.id ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {/* Detalhes expandidos */}
          {bannerExpandido === banner.id && (
            <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-800 mt-2 animate-slideDown">
              <div className="flex flex-col md:flex-row gap-4 mt-2">
                {/* Detalhes dos botões */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h4 className="text-sm font-medium">Botões do Banner</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Botão 1 */}
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h5 className="text-xs font-medium mb-2">Botão Principal</h5>
                      {banner.botao1Label ? (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Texto:</span>
                            <span className="text-xs font-medium">{banner.botao1Label}</span>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Link:</span>
                            <span className="text-xs font-mono">{banner.botao1Link || "—"}</span>
                          </div>
                          {banner.botao1Cor && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Cor:</span>
                              <div className="flex items-center">
                                <div 
                                  className="h-4 w-4 rounded-full mr-1" 
                                  style={{ backgroundColor: banner.botao1Cor }}
                                ></div>
                                <span className="text-xs font-mono">{banner.botao1Cor}</span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-500">Nenhum botão principal configurado</p>
                      )}
                    </div>
                    
                    {/* Botão 2 */}
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h5 className="text-xs font-medium mb-2">Botão Secundário</h5>
                      {banner.botao2Label ? (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Texto:</span>
                            <span className="text-xs font-medium">{banner.botao2Label}</span>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Link:</span>
                            <span className="text-xs font-mono">{banner.botao2Link || "—"}</span>
                          </div>
                          {banner.botao2Cor && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Cor:</span>
                              <div className="flex items-center">
                                <div 
                                  className="h-4 w-4 rounded-full mr-1" 
                                  style={{ backgroundColor: banner.botao2Cor }}
                                ></div>
                                <span className="text-xs font-mono">{banner.botao2Cor}</span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-500">Nenhum botão secundário configurado</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Versão mobile e ações rápidas */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Versão Mobile</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 px-2 rounded-lg">
                        <MoveUp className="h-4 w-4 mr-1" />
                        Subir
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 px-2 rounded-lg">
                        <MoveDown className="h-4 w-4 mr-1" />
                        Descer
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview mobile */}
                  <div className="h-28 w-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mx-auto">
                    {banner.fotoMobile ? (
                      <img 
                        src={banner.fotoMobile} 
                        alt={`${banner.titulo} (mobile)`}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  {/* Botões de ação rápida */}
                  <div className="flex justify-center gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditar(banner);
                      }}
                    >
                      <PencilLine className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant={banner.ativo ? "destructive" : "success"} 
                      className="h-8 rounded-lg" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAlterarStatus(banner.id);
                      }}
                    >
                      {banner.ativo ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
