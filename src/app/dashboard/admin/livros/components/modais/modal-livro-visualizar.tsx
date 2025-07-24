'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookIcon, 
  Calendar, 
  PencilIcon,
  BookOpenIcon,
  DollarSign,
  Tag,
  Clock 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModalLivroVisualizarProps {
  isOpen: boolean;
  onClose: () => void;
  livro: any;
  onEdit: () => void;
  onPreview: () => void;
}

export function ModalLivroVisualizar({
  isOpen,
  onClose,
  livro,
  onEdit,
  onPreview,
}: ModalLivroVisualizarProps) {
  if (!livro) return null;

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarData = (dataIso: string) => {
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderFaixaEtaria = (faixa: string) => {
    const labels: Record<string, string> = {
      '0-3': '0 a 3 anos',
      '3-6': '3 a 6 anos',
      '6-9': '6 a 9 anos',
      '9-12': '9 a 12 anos',
      '12+': '12+ anos',
    };

    return labels[faixa] || faixa;
  };

  const renderCategoriaBadge = (categoria: string) => {
    const cores: Record<string, string> = {
      'aventura': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'educativo': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'fantasia': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'personalizado': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
      'inclusao': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
    };

    const labels: Record<string, string> = {
      'aventura': 'Aventura',
      'educativo': 'Educativo',
      'fantasia': 'Fantasia',
      'personalizado': 'Personalizado',
      'inclusao': 'Inclusão'
    };

    return (
      <Badge variant="outline" className={`${cores[categoria] || 'bg-gray-100 text-gray-800'} border-0`}>
        {labels[categoria] || categoria}
      </Badge>
    );
  };

  const calcularPrecoFinal = (preco: number, desconto: number) => {
    return preco - (preco * desconto / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">{livro.titulo}</DialogTitle>
          <DialogDescription>
            Detalhes completos do livro
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna 1 - Imagem e informações básicas */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full max-h-[350px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                  {livro.capa ? (
                    <img 
                      src={livro.capa} 
                      alt={livro.titulo} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookIcon className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <Badge 
                      className={
                        livro.ativo 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0" 
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0"
                      }
                    >
                      {livro.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Publicado em: {formatarData(livro.dataPublicacao)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>ID: {livro.id}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Última atualização: {formatarData(livro.dataPublicacao)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={onPreview}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    Abrir Prévia
                  </Button>
                  
                  <Button 
                    onClick={onEdit} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Editar Livro
                  </Button>
                </div>
              </div>
              
              {/* Coluna 2 - Detalhes do livro */}
              <div className="col-span-2 space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Informações Gerais</h3>
                  <Separator className="mb-3" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Autor</p>
                      <p className="font-medium">{livro.autor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Categoria</p>
                      <div className="mt-1">{renderCategoriaBadge(livro.categoria)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Faixa Etária</p>
                      <p className="font-medium">{renderFaixaEtaria(livro.faixaEtaria)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Páginas</p>
                      <p className="font-medium">{livro.paginas} páginas</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Personalizável</p>
                      <Badge 
                        variant="outline" 
                        className={
                          livro.personalizavel 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-0"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-0"
                        }
                      >
                        {livro.personalizavel ? "Sim" : "Não"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Slug</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{livro.slug || "-"}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-1">Preços</h3>
                  <Separator className="mb-3" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Versão Digital</span>
                        {livro.descontoDigital > 0 && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-0">
                            {livro.descontoDigital}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-end gap-2">
                        {livro.descontoDigital > 0 && (
                          <span className="text-gray-500 line-through text-sm">
                            {formatarPreco(livro.precoDigital)}
                          </span>
                        )}
                        <span className="text-xl font-bold text-[#27b99a]">
                          {formatarPreco(calcularPrecoFinal(livro.precoDigital, livro.descontoDigital))}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Versão Física</span>
                        {livro.descontoFisico > 0 && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-0">
                            {livro.descontoFisico}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-end gap-2">
                        {livro.descontoFisico > 0 && (
                          <span className="text-gray-500 line-through text-sm">
                            {formatarPreco(livro.precoFisico)}
                          </span>
                        )}
                        <span className="text-xl font-bold text-[#27b99a]">
                          {formatarPreco(calcularPrecoFinal(livro.precoFisico, livro.descontoFisico))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-1">Descrição</h3>
                  <Separator className="mb-3" />
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {livro.descricao || "Nenhuma descrição disponível."}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-1">Resumo/Sinopse</h3>
                  <Separator className="mb-3" />
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {livro.resumo || "Nenhum resumo disponível."}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-1">Estatísticas</h3>
                  <Separator className="mb-3" />
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Visualizações</p>
                      <p className="text-xl font-bold">{(livro.visualizacoes || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Personalizações</p>
                      <p className="text-xl font-bold">{(livro.qtdPersonalizacoes || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Vendas</p>
                      <p className="text-xl font-bold">{(livro.vendas || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
