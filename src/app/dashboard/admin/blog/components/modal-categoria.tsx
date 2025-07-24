'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CategoriaDados } from '../page';

interface ModalCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  categoriaParaEditar: CategoriaDados | null;
  onSalvar: (categoria: CategoriaDados) => void;
}

export function ModalCategoria({ 
  isOpen, 
  onClose, 
  categoriaParaEditar, 
  onSalvar 
}: ModalCategoriaProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ativo, setAtivo] = useState(true);

  // Preencher campos quando estiver editando
  useEffect(() => {
    if (categoriaParaEditar) {
      setNome(categoriaParaEditar.nome);
      setDescricao(categoriaParaEditar.descricao || '');
      setAtivo(true); // Assumindo que categorias sempre são ativas por padrão
    } else {
      setNome('');
      setDescricao('');
      setAtivo(true);
    }
  }, [categoriaParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert('Por favor, preencha o nome da categoria.');
      return;
    }
    
    const categoriaAtualizada: CategoriaDados = {
      id: categoriaParaEditar?.id || '',
      nome: nome.trim(),
      slug: categoriaParaEditar?.slug || '',
      descricao: descricao.trim(),
      quantidadePostagens: categoriaParaEditar?.quantidadePostagens || 0
    };
    
    onSalvar(categoriaAtualizada);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90vw] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {categoriaParaEditar ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome da Categoria *
            </Label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome da categoria"
              className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite uma breve descrição da categoria"
              className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] dark:bg-gray-800 dark:text-gray-100 min-h-[80px]"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <div>
              <Label htmlFor="ativo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria Ativa
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Categorias ativas podem ser usadas em postagens
              </p>
            </div>
            <Switch
              id="ativo"
              checked={ativo}
              onCheckedChange={setAtivo}
              className="data-[state=checked]:bg-[#27b99a]"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-end gap-3 w-full">
              <Button 
                type="button" 
                onClick={onClose}
                variant="outline"
                className="border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl px-6 transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-2xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {categoriaParaEditar ? 'Atualizar Categoria' : 'Criar Categoria'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
