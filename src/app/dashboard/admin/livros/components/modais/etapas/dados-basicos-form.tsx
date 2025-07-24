'use client';

import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Upload,
  X,
  Plus,
  Hash,
  FileText,
  User,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Download,
  Search,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface DadosBasicosFormProps {
  form: UseFormReturn<any>;
  categorias: any[];
  tags: any[];
  novaTag: string;
  setNovaTag: (value: string) => void;
  criarTag: () => void;
}

export function DadosBasicosForm({
  form,
  categorias,
  tags,
  novaTag,
  setNovaTag,
  criarTag
}: DadosBasicosFormProps) {
  const [previewCapa, setPreviewCapa] = useState<string>('');

  const faixasEtarias = [
    { value: '0-3', label: '0-3 anos' },
    { value: '3-6', label: '3-6 anos' },
    { value: '6-9', label: '6-9 anos' },
    { value: '9-12', label: '9-12 anos' },
    { value: '12+', label: '12+ anos' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        field.onChange(result);
        if (field.name === 'capa') {
          setPreviewCapa(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="space-y-8">
      {/* Informações Básicas */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[#27b99a]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Informações Básicas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Título *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Digite o título do livro"
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  SKU
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Será gerado automaticamente se vazio"
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Autor *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nome do autor"
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="faixaEtaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Faixa Etária *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]">
                      <SelectValue placeholder="Selecione a faixa etária" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {faixasEtarias.map((faixa) => (
                      <SelectItem key={faixa.value} value={faixa.value}>
                        {faixa.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6">
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Descrição Curta *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descrição resumida do livro"
                    rows={3}
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6">
          <FormField
            control={form.control}
            name="descricaoLonga"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Descrição Longa</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descrição detalhada do livro"
                    rows={5}
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Detalhes do Livro */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-[#ff0080]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Detalhes e Preços
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="numeroPaginas"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Número de Páginas *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="Ex: 24"
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precoDigital"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Preço Digital (R$) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 19.90"
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precoFisico"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Preço Físico (R$) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 39.90"
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          <div className="mb-4">
            <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
              Categorias Selecionadas:
            </Label>
            <div className="flex flex-wrap gap-2">
              {categoriasForm.map((categoriaId: string) => {
                const categoria = categorias.find((c: any) => c.id === categoriaId);
                return categoria ? (
                  <Badge
                    key={categoriaId}
                    className="bg-[#27b99a]/10 text-[#27b99a] border-[#27b99a]/30 hover:bg-[#27b99a]/20 rounded-full px-3 py-1 flex items-center gap-2"
                  >
                    {categoria.nome}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removerCategoria(categoriaId)}
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Lista de Categorias Disponíveis */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categorias
            .filter(categoria => !categoriasForm.includes(categoria.id))
            .map((categoria) => (
              <Button
                key={categoria.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adicionarCategoria(categoria.id)}
                className="rounded-full border-gray-200 dark:border-gray-700 hover:border-[#27b99a] hover:text-[#27b99a] justify-start"
              >
                <Plus className="h-3 w-3 mr-2" />
                {categoria.nome}
              </Button>
            ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-5 w-5 text-[#ff0080]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Tags
          </h3>
        </div>

        {/* Criar Nova Tag */}
        <div className="flex gap-2 mb-4">
          <Input
            value={novaTag}
            onChange={(e) => setNovaTag(e.target.value)}
            placeholder="Nome da nova tag"
            className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080]"
            onKeyPress={(e) => e.key === 'Enter' && criarTag()}
          />
          <Button
            type="button"
            onClick={criarTag}
            disabled={!novaTag.trim()}
            className="bg-[#ff0080] hover:bg-[#e6006b] text-white rounded-2xl px-4"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tags Selecionadas */}
        {tagsForm.length > 0 && (
          <div className="mb-4">
            <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
              Tags Selecionadas:
            </Label>
            <div className="flex flex-wrap gap-2">
              {tagsForm.map((tagId: string) => {
                const tag = tags.find((t: any) => t.id === tagId);
                return tag ? (
                  <Badge
                    key={tagId}
                    className="bg-[#ff0080]/10 text-[#ff0080] border-[#ff0080]/30 hover:bg-[#ff0080]/20 rounded-full px-3 py-1 flex items-center gap-2"
                  >
                    {tag.nome}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removerTag(tagId)}
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Lista de Tags Disponíveis */}
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
                className="rounded-full border-gray-200 dark:border-gray-700 hover:border-[#ff0080] hover:text-[#ff0080] justify-start"
              >
                <Plus className="h-3 w-3 mr-2" />
                {tag.nome}
              </Button>
            ))}
        </div>
      </div>

      {/* Arquivos */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-[#27b99a]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Arquivos
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capa do Livro */}
          <FormField
            control={form.control}
            name="capa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Capa do Livro
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, field)}
                      className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                    />
                    {(field.value || previewCapa) && (
                      <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={field.value || previewCapa}
                          alt="Preview da capa do livro"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            field.onChange('');
                            setPreviewCapa('');
                          }}
                          className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Arquivo para Download */}
          <FormField
            control={form.control}
            name="arquivoDownload"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Arquivo para Download
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.zip,.rar"
                    onChange={(e) => handleImageUpload(e, field)}
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-[#ff0080]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            SEO
          </h3>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="metaTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Meta Título</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Título para SEO (se vazio, usará o título do livro)"
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Meta Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descrição para SEO (se vazia, usará a descrição curta)"
                    rows={3}
                    className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-[#27b99a]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Configurações
          </h3>
        </div>

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-gray-900 dark:text-gray-100">
                  Livro Ativo
                </FormLabel>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  O livro estará visível e disponível para compra
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#27b99a]"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
