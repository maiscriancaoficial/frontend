'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, Loader2, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

interface ModalLivroExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  livro: any;
}

export function ModalLivroExcluir({
  isOpen,
  onClose,
  livro,
}: ModalLivroExcluirProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!livro) return null;

  const handleExcluir = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/livros/${livro.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Livro excluído com sucesso!');
        onClose();
        // Recarregar a página para atualizar a lista
        window.location.reload();
      } else {
        throw new Error(result.error || 'Erro ao excluir livro');
      }
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      toast.error('Erro ao excluir livro: ' + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangleIcon className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Tem certeza que deseja excluir permanentemente este livro?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Livro:</span> {livro.nome}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">ID:</span> {livro.id}
            </p>
            {livro.personalizacoes?.length > 0 && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                ⚠️ Este livro possui {livro.personalizacoes.length} personalizações associadas que também serão removidas.
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleExcluir}
            disabled={isDeleting}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2Icon className="h-4 w-4" />
                Excluir Permanentemente
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
