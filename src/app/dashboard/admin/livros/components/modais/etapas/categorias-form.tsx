'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  X,
  Hash,
  Tag
} from 'lucide-react';

interface CategoriasFormProps {
  form: UseFormReturn<any>;
  categorias: any[];
  tags: any[];
  novaTag: string;
  setNovaTag: (value: string) => void;
  criarTag: () => void;
}

export function CategoriasForm({
  form,
  categorias,
  tags,
  novaTag,
  setNovaTag,
  criarTag
}: CategoriasFormProps) {
  const adicionarCategoria = (categoriaId: string) => {
    const categoriasAtuais = form.getValues('categorias') || [];
    if (!categoriasAtuais.includes(categoriaId)) {
      form.setValue('categorias', [...categoriasAtuais, categoriaId]);
    }
  };

  const removerCategoria = (categoriaId: string) => {
    const categoriasAtuais = form.getValues('categorias') || [];
    form.setValue('categorias', categoriasAtuais.filter((id: string) => id !== categoriaId));
  };

  const adicionarTag = (tagId: string) => {
    const tagsAtuais = form.getValues('tags') || [];
    if (!tagsAtuais.includes(tagId)) {
      form.setValue('tags', [...tagsAtuais, tagId]);
    }
  };

  const removerTag = (tagId: string) => {
    const tagsAtuais = form.getValues('tags') || [];
    form.setValue('tags', tagsAtuais.filter((id: string) => id !== tagId));
  };

  const categoriasForm = form.watch('categorias') || [];
  const tagsForm = form.watch('tags') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Hash className="h-6 w-6 text-[#ff0080]" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Categorias e Tags
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Organize seu livro com categorias e tags
        </p>
      </div>

      {/* Categorias */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-5 w-5 text-[#27b99a]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Categorias *
          </h3>
        </div>

        {/* Categorias Selecionadas */}
        {categoriasForm.length > 0 && (
          <div className="mb-6">
            <Label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
              Categorias Selecionadas:
            </Label>
            <div className="flex flex-wrap gap-2">
              {categoriasForm.map((categoriaId: string) => {
                const categoria = categorias.find((c: any) => c.id === categoriaId);
                return categoria ? (
                  <Badge
                    key={categoriaId}
                    className="bg-[#27b99a]/10 text-[#27b99a] border-[#27b99a]/30 hover:bg-[#27b99a]/20 rounded-full px-4 py-2 flex items-center gap-2 text-sm"
                  >
                    {categoria.nome}
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => removerCategoria(categoriaId)}
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Lista de Categorias Disponíveis */}
        <div>
          <Label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
            Categorias Disponíveis:
          </Label>
          {categorias.filter(categoria => !categoriasForm.includes(categoria.id)).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categorias
                .filter(categoria => !categoriasForm.includes(categoria.id))
                .map((categoria) => (
                  <Button
                    key={categoria.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adicionarCategoria(categoria.id)}
                    className="rounded-2xl border-gray-200 dark:border-gray-700 hover:border-[#27b99a] hover:text-[#27b99a] hover:bg-[#27b99a]/5 justify-start h-auto py-3 px-4 text-left"
                  >
                    <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{categoria.nome}</span>
                  </Button>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {categoriasForm.length === categorias.length 
                ? "Todas as categorias foram selecionadas" 
                : "Nenhuma categoria disponível"}
            </div>
          )}
        </div>

        {/* Aviso sobre categorias obrigatórias */}
        {categoriasForm.length === 0 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ Selecione pelo menos uma categoria para o livro
            </p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-[#ff0080]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Tags
          </h3>
        </div>

        {/* Criar Nova Tag */}
        <div className="mb-6">
          <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            Criar Nova Tag:
          </Label>
          <div className="flex gap-2">
            <Input
              value={novaTag}
              onChange={(e) => setNovaTag(e.target.value)}
              placeholder="Nome da nova tag"
              className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080]"
              onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
              onKeyDown={(e) => e.key === 'Enter' && criarTag()}
            />
            <Button
              type="button"
              onClick={criarTag}
              disabled={!novaTag.trim()}
              className="bg-[#ff0080] hover:bg-[#e6006b] text-white rounded-2xl px-6 flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar
            </Button>
          </div>
        </div>

        {/* Tags Selecionadas */}
        {tagsForm.length > 0 && (
          <div className="mb-6">
            <Label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
              Tags Selecionadas:
            </Label>
            <div className="flex flex-wrap gap-2">
              {tagsForm.map((tagId: string) => {
                const tag = tags.find((t: any) => t.id === tagId);
                return tag ? (
                  <Badge
                    key={tagId}
                    className="bg-[#ff0080]/10 text-[#ff0080] border-[#ff0080]/30 hover:bg-[#ff0080]/20 rounded-full px-4 py-2 flex items-center gap-2 text-sm"
                  >
                    {tag.nome}
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => removerTag(tagId)}
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Lista de Tags Disponíveis */}
        <div>
          <Label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
            Tags Disponíveis:
          </Label>
          {tags.filter(tag => !tagsForm.includes(tag.id)).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {tags
                .filter(tag => !tagsForm.includes(tag.id))
                .map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adicionarTag(tag.id)}
                    className="rounded-full border-gray-200 dark:border-gray-700 hover:border-[#ff0080] hover:text-[#ff0080] hover:bg-[#ff0080]/5 justify-start text-xs h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <span className="truncate">{tag.nome}</span>
                  </Button>
                ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              {tagsForm.length === tags.length 
                ? "Todas as tags foram selecionadas" 
                : "Nenhuma tag disponível"}
            </div>
          )}
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Hash className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Resumo da Categorização:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Categorias: 
                </span>
                <span className="text-blue-700 dark:text-blue-300 ml-1">
                  {categoriasForm.length} selecionada{categoriasForm.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Tags: 
                </span>
                <span className="text-blue-700 dark:text-blue-300 ml-1">
                  {tagsForm.length} selecionada{tagsForm.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
