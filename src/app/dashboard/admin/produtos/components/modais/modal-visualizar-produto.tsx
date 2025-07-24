'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Star, 
  CircleDollarSign, 
  Package, 
  BadgeCheck, 
  BadgeX, 
  Hash,
  Tag,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface Produto {
  id?: string;
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
  tamanho?: string;
  palavrasChave?: string;
  pontuacaoSEO?: number;
  emDestaque: boolean;
  ativo: boolean;
  categorias: { id: string, nome: string }[];
  tags: { id: string, nome: string }[];
}

interface ModalVisualizarProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto;
  onEdit: (produto: Produto) => void;
}

export function ModalVisualizarProduto({ isOpen, onClose, produto, onEdit }: ModalVisualizarProdutoProps) {
  // Formatar valor monetário
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  // Calcular desconto
  const calcularDesconto = () => {
    if (!produto.precoPromocional || !produto.preco) return 0;
    return Math.round(100 - (produto.precoPromocional * 100 / produto.preco));
  };
  
  // Formatação HTML para exibição segura
  const renderizarHTML = (html?: string) => {
    if (!html) return null;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Detalhes do Produto</span>
            <Button 
              variant="outline"
              onClick={() => onEdit(produto)}
              className="text-xs h-8"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Editar
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Imagem principal */}
          <div className="w-full md:w-1/3">
            <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              {produto.fotoPrincipal ? (
                <Image 
                  src={produto.fotoPrincipal}
                  alt={produto.titulo}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Miniaturas */}
            {produto.galeria && produto.galeria.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {produto.galeria.slice(0, 4).map((imagem, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800"
                  >
                    <Image 
                      src={imagem}
                      alt={`${produto.titulo} - imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Status */}
            <div className="mt-3 flex flex-wrap gap-2">
              {produto.ativo ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200">
                  <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                  Ativo
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200">
                  <BadgeX className="h-3.5 w-3.5 mr-1" />
                  Inativo
                </Badge>
              )}
              
              {produto.emDestaque && (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200">
                  <Star className="h-3.5 w-3.5 mr-1" />
                  Destaque
                </Badge>
              )}
            </div>
          </div>
          
          {/* Informações principais */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-bold">{produto.titulo}</h2>
            
            {produto.descricao && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {produto.descricao}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3">
              {produto.categorias?.map((categoria, idx) => (
                <Badge 
                  key={categoria.id || `categoria-${idx}`} 
                  variant="outline"
                  className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {categoria.nome}
                </Badge>
              ))}
            </div>
            
            <div className="mt-5 space-y-2">
              {produto.sku && (
                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">SKU: {produto.sku}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">Preço: {formatarMoeda(produto.preco)}</span>
                
                {produto.precoPromocional && (
                  <>
                    <span className="mx-2 text-gray-400">&bull;</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-500">
                      Promoção: {formatarMoeda(produto.precoPromocional)}
                      <Badge className="ml-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        -{calcularDesconto()}%
                      </Badge>
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">
                  Estoque: 
                  <span className={produto.estoque > 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
                    {' '}{produto.estoque} unidade{produto.estoque !== 1 ? 's' : ''}
                  </span>
                </span>
              </div>
              
              {(produto.tamanho || produto.peso) && (
                <div className="flex items-center">
                  <Layers className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">
                    {produto.tamanho && `Tamanho: ${produto.tamanho}`}
                    {produto.tamanho && produto.peso && <span className="mx-2 text-gray-400">&bull;</span>}
                    {produto.peso && `Peso: ${produto.peso} kg`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Abas com informações detalhadas */}
        <Tabs defaultValue="descricao">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="descricao">Descrição</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          {/* Descrição Completa */}
          <TabsContent value="descricao" className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
            {produto.descricaoLonga ? (
              <div className="prose dark:prose-invert max-w-none">
                {renderizarHTML(produto.descricaoLonga)}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Este produto não possui descrição detalhada.
              </p>
            )}
          </TabsContent>
          
          {/* Dimensões e Detalhes */}
          <TabsContent value="detalhes">
            <Card className="border-0 shadow-none">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  {produto.tags && produto.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {produto.tags.map((tag, idx) => (
                        <Badge 
                          key={tag.id || `tag-${idx}`} 
                          variant="outline"
                          className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.nome}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma tag adicionada.
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Dimensões</h3>
                  {produto.altura || produto.largura || produto.comprimento ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Altura</span>
                        <p className="font-medium">{produto.altura ? `${produto.altura} cm` : '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Largura</span>
                        <p className="font-medium">{produto.largura ? `${produto.largura} cm` : '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Comprimento</span>
                        <p className="font-medium">{produto.comprimento ? `${produto.comprimento} cm` : '-'}</p>
                      </div>
                      
                      {produto.altura && produto.largura && produto.comprimento && (
                        <div className="col-span-3 mt-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Volume</span>
                          <p className="font-medium">
                            {(produto.altura * produto.largura * produto.comprimento / 1000).toFixed(2)} litros
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({(produto.altura * produto.largura * produto.comprimento / 1000000).toFixed(6)} m³)
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Dimensões não especificadas.
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Link do Produto</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md font-mono text-xs break-all">
                    {`https://floriculturanaweb.com/produto/${produto.slug}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Informações SEO */}
          <TabsContent value="seo">
            <Card className="border-0 shadow-none">
              <CardContent className="p-4 space-y-4">
                {/* Pontuação SEO */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Pontuação SEO</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (produto.pontuacaoSEO || 0) < 40 
                            ? 'bg-red-500' 
                            : (produto.pontuacaoSEO || 0) < 70 
                              ? 'bg-amber-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${produto.pontuacaoSEO || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {produto.pontuacaoSEO || 0}/100
                    </span>
                  </div>
                </div>
                
                {/* Meta título */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Meta Título</h3>
                  <p className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                    {produto.metaTitulo || produto.titulo || '-'}
                  </p>
                </div>
                
                {/* Meta descrição */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Meta Descrição</h3>
                  <p className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                    {produto.metaDescricao || produto.descricao || '-'}
                  </p>
                </div>
                
                {/* Palavras-chave */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Palavras-chave</h3>
                  {produto.palavrasChave ? (
                    <div className="flex flex-wrap gap-1">
                      {produto.palavrasChave.split(',').map((palavra, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300"
                        >
                          {palavra.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma palavra-chave definida.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
