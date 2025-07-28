'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';

interface ModalAvatarExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: any;
  onSuccess?: () => void;
}

export function ModalAvatarExcluir({
  isOpen,
  onClose,
  avatar,
  onSuccess,
}: ModalAvatarExcluirProps) {
  const [excluindo, setExcluindo] = useState(false);
  
  if (!avatar) return null;
  
  const handleExcluir = async () => {
    setExcluindo(true);
    
    try {
      // Chamada real para a API de exclusão
      const response = await fetch(`/api/avatares/${avatar.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir avatar');
      }
      
      toast.success('Avatar excluído com sucesso!');
      onClose();
      
      // Chamar callback de sucesso se fornecido, senão recarregar
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao excluir avatar:', error);
      toast.error('Erro ao excluir avatar. Por favor, tente novamente.');
    } finally {
      setExcluindo(false);
    }
  };
  
  const temPersonalizacoes = avatar.livrosPersonalizados?.length > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="bg-black/30 backdrop-blur-sm" />
        <AlertDialogContent className="max-w-md rounded-3xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Excluir Avatar
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="text-gray-700">
                Tem certeza que deseja excluir o avatar <strong>{avatar.nome}</strong>? 
                Esta ação não poderá ser desfeita.
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-amber-800 dark:text-amber-200 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <strong>ID do avatar:</strong> {avatar.id}
                </div>
                
                {temPersonalizacoes && (
                  <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                    <div className="font-medium mb-2">⚠️ Atenção!</div>
                    <div className="mb-2">
                      Este avatar está sendo utilizado em {avatar.livrosPersonalizados.length} {avatar.livrosPersonalizados.length === 1 ? 'livro personalizado' : 'livros personalizados'}.
                    </div>
                    <div>
                      A exclusão deste avatar afetará permanentemente os livros personalizados associados a ele.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel 
            disabled={excluindo}
            className="rounded-full px-6 py-2 border-gray-200 hover:bg-gray-50"
          >
            Cancelar
          </AlertDialogCancel>
          <Button 
            variant="destructive" 
            disabled={excluindo}
            onClick={handleExcluir}
            className="flex items-center gap-2 rounded-full px-6 py-2 bg-red-500 hover:bg-red-600 text-white"
          >
            {excluindo ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Excluir Avatar
              </>
            )}
          </Button>
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
