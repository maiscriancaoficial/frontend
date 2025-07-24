'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  FileText,
  User,
  Calendar,
  DollarSign,
  Hash,
  Settings,
  Search
} from 'lucide-react';

interface InformacoesFormProps {
  form: UseFormReturn<any>;
}

export function InformacoesForm({ form }: InformacoesFormProps) {
  const faixasEtarias = [
    { value: '0-3', label: '0-3 anos' },
    { value: '3-6', label: '3-6 anos' },
    { value: '6-9', label: '6-9 anos' },
    { value: '9-12', label: '9-12 anos' },
    { value: '12+', label: '12+ anos' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-[#27b99a]" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Informações Básicas
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Dados principais do livro
        </p>
      </div>

      {/* Informações Básicas */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[#27b99a]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dados Principais
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
                    rows={4}
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
