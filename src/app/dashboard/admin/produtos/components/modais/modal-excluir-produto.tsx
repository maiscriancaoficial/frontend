'use client';

import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface ModalExcluirProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produto: {
    id: string;
    titulo: string;
    fotoPrincipal?: string;
    sku?: string;
  };
  onConfirm: () => void;
}

export function ModalExcluirProduto({ isOpen, onClose, produto, onConfirm }: ModalExcluirProdutoProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  // Toast já importado do sonner
  
  // Função para lidar com a confirmação de exclusão
  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      
      // Aqui você faria a chamada para a API para excluir o produto
      // Por exemplo:
      // await fetch(`/api/produtos/${produto.id}`, {
      //   method: 'DELETE',
      // });
      
      // Simulando a chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success(`O produto "${produto.titulo}" foi excluído permanentemente.`);
      
      // Chama a função de callback do componente pai
      onConfirm();
      onClose();
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      toast.error("Não foi possível excluir o produto. Tente novamente mais tarde.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-white dark:bg-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Excluir Produto
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Você tem certeza que deseja excluir o produto <strong>"{produto.titulo}"</strong>?
            </p>
            
            {produto.sku && (
              <p className="text-sm font-medium">
                SKU: {produto.sku}
              </p>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 mt-2">
              <p className="text-sm text-red-600 dark:text-red-400">
                <strong>Atenção:</strong> Esta ação não pode ser desfeita. Ao confirmar, o produto será permanentemente excluído do sistema, incluindo todas as suas imagens, características e relações.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Permanentemente
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
