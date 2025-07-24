'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Plus,
  Trash2,
  Gift,
  Star,
  Heart,
  Zap,
  Shield,
  Trophy,
  Target,
  Lightbulb,
  Sparkles,
  Award,
  CheckCircle,
  Smile,
  Book,
  Palette,
  Music,
  Camera,
  Gamepad2,
  Puzzle,
  Rocket
} from 'lucide-react';

interface BeneficiosFormProps {
  form: UseFormReturn<any>;
  adicionarBeneficio: () => void;
  removerBeneficio: (index: number) => void;
}

const iconesDisponiveis = [
  { value: 'star', label: 'Estrela', icon: Star },
  { value: 'heart', label: 'Coração', icon: Heart },
  { value: 'zap', label: 'Raio', icon: Zap },
  { value: 'shield', label: 'Escudo', icon: Shield },
  { value: 'trophy', label: 'Troféu', icon: Trophy },
  { value: 'target', label: 'Alvo', icon: Target },
  { value: 'lightbulb', label: 'Lâmpada', icon: Lightbulb },
  { value: 'sparkles', label: 'Brilhos', icon: Sparkles },
  { value: 'award', label: 'Prêmio', icon: Award },
  { value: 'check-circle', label: 'Check', icon: CheckCircle },
  { value: 'smile', label: 'Sorriso', icon: Smile },
  { value: 'book', label: 'Livro', icon: Book },
  { value: 'palette', label: 'Paleta', icon: Palette },
  { value: 'music', label: 'Música', icon: Music },
  { value: 'camera', label: 'Câmera', icon: Camera },
  { value: 'gamepad2', label: 'Jogo', icon: Gamepad2 },
  { value: 'puzzle', label: 'Quebra-cabeça', icon: Puzzle },
  { value: 'rocket', label: 'Foguete', icon: Rocket },
];

export function BeneficiosForm({
  form,
  adicionarBeneficio,
  removerBeneficio
}: BeneficiosFormProps) {
  const beneficios = form.watch('beneficios') || [];

  const getIconComponent = (iconValue: string) => {
    const icone = iconesDisponiveis.find(i => i.value === iconValue);
    return icone ? icone.icon : Gift;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="h-6 w-6 text-[#ff0080]" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Benefícios do Livro
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Adicione os principais benefícios e diferenciais que este livro oferece
        </p>
      </div>

      {/* Botão Adicionar Benefício */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={adicionarBeneficio}
          className="bg-[#ff0080] hover:bg-[#e6006b] text-white rounded-2xl px-6 py-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Benefício
        </Button>
      </div>

      {/* Lista de Benefícios */}
      {beneficios.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            Nenhum benefício adicionado
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Clique em "Adicionar Benefício" para começar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beneficios.map((beneficio: any, index: number) => {
            const IconComponent = getIconComponent(beneficio.icone);
            
            return (
              <Card key={index} className="rounded-3xl border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-[#ff0080]" />
                      Benefício {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerBeneficio(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Título do Benefício */}
                  <FormField
                    control={form.control}
                    name={`beneficios.${index}.titulo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Título *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Desenvolve a criatividade"
                            className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Seleção de Ícone */}
                  <FormField
                    control={form.control}
                    name={`beneficios.${index}.icone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Ícone *
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-6 gap-2">
                            {iconesDisponiveis.map((icone) => {
                              const IconComponent = icone.icon;
                              const isSelected = field.value === icone.value;
                              
                              return (
                                <Button
                                  key={icone.value}
                                  type="button"
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => field.onChange(icone.value)}
                                  className={`rounded-xl p-2 h-10 w-10 ${
                                    isSelected 
                                      ? "bg-[#ff0080] hover:bg-[#e6006b] text-white" 
                                      : "hover:border-[#ff0080] hover:text-[#ff0080]"
                                  }`}
                                  title={icone.label}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </Button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Descrição do Benefício */}
                  <FormField
                    control={form.control}
                    name={`beneficios.${index}.descricao`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Descrição *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Descreva como este livro oferece este benefício..."
                            rows={3}
                            className="rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#ff0080] focus:ring-[#ff0080] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview dos Benefícios */}
      {beneficios.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#27b99a]" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Preview dos Benefícios
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beneficios
              .filter((b: any) => b.titulo && b.icone && b.descricao)
              .map((beneficio: any, index: number) => {
                const IconComponent = getIconComponent(beneficio.icone);
                
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#ff0080]/10 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-[#ff0080]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {beneficio.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {beneficio.descricao}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Dicas */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Dicas para benefícios eficazes:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Seja específico sobre como o livro ajuda a criança</li>
              <li>• Use linguagem que ressoe com os pais</li>
              <li>• Foque nos resultados e aprendizados</li>
              <li>• Mantenha as descrições claras e concisas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
