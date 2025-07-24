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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';

interface ModalAvatarExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: any;
}

export function ModalAvatarExcluir({
  isOpen,
  onClose,
  avatar,
}: ModalAvatarExcluirProps) {
  const [excluindo, setExcluindo] = useState(false);
  
  if (!avatar) return null;
  
  const handleExcluir = async () => {
    setExcluindo(true);
    
    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Aqui você faria a chamada real para excluir o avatar
      toast.success('Avatar excluído com sucesso!');
      onClose();
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Excluir Avatar
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Tem certeza que deseja excluir o avatar <strong>{avatar.nome}</strong>? 
              Esta ação não poderá ser desfeita.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-amber-800 dark:text-amber-200 text-sm">
              <p className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <strong>ID do avatar:</strong> {avatar.id}
              </p>
              
              {temPersonalizacoes && (
                <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800">
                  <p className="font-medium mb-1">⚠️ Atenção!</p>
                  <p>
                    Este avatar está sendo utilizado em {avatar.livrosPersonalizados.length} {avatar.livrosPersonalizados.length === 1 ? 'livro personalizado' : 'livros personalizados'}.
                  </p>
                  <p className="mt-1">
                    A exclusão deste avatar afetará permanentemente os livros personalizados associados a ele.
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive" 
            disabled={excluindo}
            onClick={handleExcluir}
            className="flex items-center gap-2"
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
    </AlertDialog>
  );
}
