'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UserCircle,
  PencilIcon,
  Calendar,
  CheckCircle,
  XCircle,
  Paintbrush,
  BookOpen
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModalAvatarVisualizarProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: any;
  onEdit: () => void;
}

export function ModalAvatarVisualizar({
  isOpen,
  onClose,
  avatar,
  onEdit,
}: ModalAvatarVisualizarProps) {
  if (!avatar) return null;
  
  const formatarData = (dataIso: string) => {
    if (!dataIso) return 'Não disponível';
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data);
  };
  
  const renderTipoBadge = (tipo: string) => {
    const cores: Record<string, string> = {
      'menino': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'menina': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'adulto': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'animal': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'outro': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
    };

    const labels: Record<string, string> = {
      'menino': 'Menino',
      'menina': 'Menina',
      'adulto': 'Adulto',
      'animal': 'Animal',
      'outro': 'Outro'
    };

    return (
      <Badge variant="outline" className={`${cores[tipo] || 'bg-gray-100 text-gray-800'} border-0`}>
        {labels[tipo] || tipo}
      </Badge>
    );
  };
  
  const renderElementosLista = (elementos: string[] | undefined, titulo: string) => {
    if (!elementos || elementos.length === 0) return null;
    
    return (
      <div>
        <h4 className="text-sm font-medium mb-2">{titulo}</h4>
        <div className="flex flex-wrap gap-2">
          {elementos.map((elemento, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
              {elemento}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalhes do Avatar</DialogTitle>
          <DialogDescription>
            Informações completas sobre o avatar selecionado.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coluna da esquerda - Prévia e informações básicas */}
            <div className="md:col-span-1 space-y-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                <UserCircle className="h-32 w-32 text-gray-400" />
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <h3 className="font-bold text-lg">{avatar.nome}</h3>
                <p className="text-sm text-gray-500 mb-2">ID: {avatar.id}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Tipo:</span>
                    {renderTipoBadge(avatar.tipo)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Criado em: {formatarData(avatar.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Status:</span>
                    {avatar.ativo ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Utilizado em {avatar.livrosPersonalizados?.length || 0} livros
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coluna da direita - Elementos e cores */}
            <div className="md:col-span-2 space-y-6">
              {/* Seção de aparência */}
              <div className="border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Paintbrush className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium">Elementos disponíveis</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-600">Aparência</h4>
                    {renderElementosLista(avatar.cabelo, "Cabelos")}
                    {renderElementosLista(avatar.olhos, "Olhos")}
                    {renderElementosLista(avatar.oculos, "Óculos")}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-600">Vestuário</h4>
                    {renderElementosLista(avatar.roupa, "Roupas")}
                    {renderElementosLista(avatar.shorts, "Shorts/Calças")}
                    {renderElementosLista(avatar.bone, "Bonés")}
                    {renderElementosLista(avatar.chapeu, "Chapéus")}
                    {renderElementosLista(avatar.aderecos, "Adereços")}
                  </div>
                </div>
              </div>
              
              {/* Seção de cores */}
              <div className="border rounded-xl p-4">
                <h3 className="text-lg font-medium mb-4">Cores disponíveis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {renderElementosLista(avatar.corAvatar, "Cores de Pele")}
                  {renderElementosLista(avatar.corCabelo, "Cores de Cabelo")}
                  {renderElementosLista(avatar.corRoupa, "Cores de Roupa")}
                </div>
              </div>
              
              {/* Livros personalizados */}
              {avatar.livrosPersonalizados && avatar.livrosPersonalizados.length > 0 && (
                <div className="border rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-2">Livros personalizados</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Este avatar está sendo utilizado nos seguintes livros:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 max-h-32 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs font-medium text-gray-500">
                        <tr>
                          <th className="text-left py-1 px-2">ID do Livro</th>
                          <th className="text-left py-1 px-2">Nome do Personagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {avatar.livrosPersonalizados.map((livro: any, index: number) => (
                          <tr key={index} className="border-t border-gray-200 dark:border-gray-800">
                            <td className="py-1 px-2">{livro.id}</td>
                            <td className="py-1 px-2">{livro.nomePersonagem || 'Não definido'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button 
            type="button" 
            className="bg-[#27b99a] hover:bg-[#239d84] text-white"
            onClick={onEdit}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Editar Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
