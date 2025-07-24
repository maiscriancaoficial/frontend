'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  CheckIcon,
  Loader2,
  Plus,
  ImagePlus,
  BookText,
  FileText,
  BookMarked,
  Settings2
} from 'lucide-react';

const livroSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'O slug deve ter pelo menos 3 caracteres'),
  autor: z.string().min(3, 'O nome do autor deve ter pelo menos 3 caracteres'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  faixaEtaria: z.string().min(1, 'Selecione uma faixa etária'),
  descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  resumo: z.string().min(50, 'O resumo deve ter pelo menos 50 caracteres'),
  paginas: z.coerce.number().min(1, 'O livro deve ter pelo menos 1 página'),
  personalizavel: z.boolean().default(false),
  opcoesCapa: z.array(z.string()).optional(),
  precoDigital: z.coerce.number().min(0, 'O preço digital não pode ser negativo'),
  precoFisico: z.coerce.number().min(0, 'O preço físico não pode ser negativo'),
  descontoDigital: z.coerce.number().min(0, 'O desconto não pode ser negativo').max(100, 'O desconto não pode ser maior que 100%'),
  descontoFisico: z.coerce.number().min(0, 'O desconto não pode ser negativo').max(100, 'O desconto não pode ser maior que 100%'),
  ativo: z.boolean().default(true),
});

type LivroFormValues = z.infer<typeof livroSchema>;

interface ModalLivroFormProps {
  isOpen: boolean;
  onClose: () => void;
  livro: any;
  modo: 'criar' | 'editar';
}

export function ModalLivroForm({
  isOpen,
  onClose,
  livro,
  modo,
}: ModalLivroFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [imagemUpload, setImagemUpload] = useState<File | null>(null);
  
  // Configurar o formulário com react-hook-form e zod
  const form = useForm<LivroFormValues>({
    resolver: zodResolver(livroSchema),
    defaultValues: {
      titulo: '',
      slug: '',
      autor: '',
      categoria: '',
      faixaEtaria: '',
      descricao: '',
      resumo: '',
      paginas: 0,
      personalizavel: false,
      opcoesCapa: [],
      precoDigital: 0,
      precoFisico: 0,
      descontoDigital: 0,
      descontoFisico: 0,
      ativo: true
    },
  });
  
  // Carregar dados do livro quando o modo é editar ou quando o livro muda
  useEffect(() => {
    if (modo === 'editar' && livro) {
      form.reset({
        titulo: livro.titulo || '',
        slug: livro.slug || '',
        autor: livro.autor || '',
        categoria: livro.categoria || '',
        faixaEtaria: livro.faixaEtaria || '',
        descricao: livro.descricao || '',
        resumo: livro.resumo || '',
        paginas: livro.paginas || 0,
        personalizavel: livro.personalizavel || false,
        opcoesCapa: livro.opcoesCapa || [],
        precoDigital: livro.precoDigital || 0,
        precoFisico: livro.precoFisico || 0,
        descontoDigital: livro.descontoDigital || 0,
        descontoFisico: livro.descontoFisico || 0,
        ativo: livro.ativo !== undefined ? livro.ativo : true,
      });

      if (livro.capa) {
        setImagemPreview(livro.capa);
      }
    } else if (modo === 'criar') {
      form.reset({
        titulo: '',
        slug: '',
        autor: '',
        categoria: '',
        faixaEtaria: '',
        descricao: '',
        resumo: '',
        paginas: 24, // Valor padrão comum para livros infantis
        personalizavel: false,
        opcoesCapa: [],
        precoDigital: 29.90,
        precoFisico: 59.90,
        descontoDigital: 0,
        descontoFisico: 0,
        ativo: true
      });
      setImagemPreview(null);
      setImagemUpload(null);
    }
  }, [modo, livro, form]);
  
  const onSubmit = async (values: LivroFormValues) => {
    setSubmitting(true);
    try {
      // Simula um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Aqui você enviaria os dados para o servidor em um caso real
      console.log('Dados do livro para salvar:', values);
      
      toast.success(
        modo === 'criar' 
          ? 'Livro criado com sucesso!' 
          : 'Livro atualizado com sucesso!'
      );
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      toast.error('Erro ao salvar livro. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Função para gerar o slug a partir do título
  const gerarSlug = () => {
    const titulo = form.getValues('titulo');
    if (titulo) {
      const slug = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug);
    }
  };
  
  // Função para lidar com o upload de imagem
  const handleImagemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagemPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {modo === 'criar' ? 'Adicionar Novo Livro' : 'Editar Livro'}
          </DialogTitle>
          <DialogDescription>
            {modo === 'criar'
              ? 'Preencha os dados para criar um novo livro no catálogo.'
              : 'Atualize as informações do livro selecionado.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="informacoes" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="informacoes" className="flex items-center gap-2">
                  <BookText className="h-4 w-4" />
                  Informações
                </TabsTrigger>
                <TabsTrigger value="conteudo" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Conteúdo
                </TabsTrigger>
                <TabsTrigger value="precos" className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4" />
                  Preços
                </TabsTrigger>
                <TabsTrigger value="configuracoes" className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Configurações
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="informacoes" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1 - Informações */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="titulo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título do Livro</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite o título do livro" 
                              {...field} 
                              onBlur={() => {
                                field.onBlur();
                                if (modo === 'criar') gerarSlug();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input placeholder="slug-do-livro" {...field} />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={gerarSlug}
                            >
                              Gerar
                            </Button>
                          </div>
                          <FormDescription>
                            Identificador único para URLs (sem espaços ou caracteres especiais)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="autor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autor</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do autor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="categoria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="aventura">Aventura</SelectItem>
                                <SelectItem value="educativo">Educativo</SelectItem>
                                <SelectItem value="fantasia">Fantasia</SelectItem>
                                <SelectItem value="personalizado">Personalizado</SelectItem>
                                <SelectItem value="inclusao">Inclusão</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="faixaEtaria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faixa Etária</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-3">0 a 3 anos</SelectItem>
                                <SelectItem value="3-6">3 a 6 anos</SelectItem>
                                <SelectItem value="6-9">6 a 9 anos</SelectItem>
                                <SelectItem value="9-12">9 a 12 anos</SelectItem>
                                <SelectItem value="12+">12+ anos</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="paginas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Páginas</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Coluna 2 - Upload de imagem */}
                  <div className="space-y-4">
                    <div className="border rounded-xl p-4">
                      <p className="text-sm font-medium mb-2">Capa do Livro</p>
                      
                      <div className="flex items-center justify-center mb-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                        {imagemPreview ? (
                          <div className="relative w-full aspect-[3/4] max-h-[300px] overflow-hidden rounded-md">
                            <img 
                              src={imagemPreview} 
                              alt="Preview da capa" 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 rounded-full h-8 w-8"
                              type="button"
                              onClick={() => {
                                setImagemPreview(null);
                                setImagemUpload(null);
                              }}
                            >
                              &times;
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-64 cursor-pointer">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImagePlus className="w-12 h-12 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG ou WEBP (Max. 2MB)
                              </p>
                            </div>
                            <input 
                              id="capa-upload" 
                              type="file"
                              accept="image/png, image/jpeg, image/webp"
                              className="hidden"
                              onChange={handleImagemUpload}
                            />
                          </label>
                        )}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="personalizavel"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Personalização</FormLabel>
                              <FormDescription>
                                Permite personalização com avatar
                              </FormDescription>
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
                </div>
              </TabsContent>
              
              <TabsContent value="conteudo" className="space-y-4">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Curta</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite uma breve descrição do livro (será exibida em cards e listagens)" 
                          {...field} 
                          className="h-24"
                        />
                      </FormControl>
                      <FormDescription>
                        Máximo de 200 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="resumo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sinopse/Resumo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite a sinopse completa ou resumo do livro" 
                          {...field} 
                          className="h-64"
                        />
                      </FormControl>
                      <FormDescription>
                        Resumo completo do livro, que será exibido na página de detalhes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Seção para upload de páginas exemplo/prévia */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-base mb-2">Páginas de Prévia</h3>
                  <FormDescription className="mb-4">
                    Faça upload de algumas páginas do livro para que os clientes possam visualizar antes de comprar
                  </FormDescription>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((index) => (
                      <div 
                        key={index} 
                        className="border border-dashed rounded-md p-2 aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex flex-col items-center text-gray-400">
                          <Plus className="h-8 w-8 mb-1" />
                          <span className="text-sm">Página {index}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="precos" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preço versão digital */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-base">Versão Digital</h3>
                    
                    <FormField
                      control={form.control}
                      name="precoDigital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder="29.90" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="descontoDigital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desconto (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="0" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium">Preço final:</p>
                      <p className="text-xl font-bold text-[#27b99a]">
                        {(() => {
                          const preco = form.getValues('precoDigital') || 0;
                          const desconto = form.getValues('descontoDigital') || 0;
                          const precoFinal = preco - (preco * desconto / 100);
                          return precoFinal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          });
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Preço versão física */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-base">Versão Física</h3>
                    
                    <FormField
                      control={form.control}
                      name="precoFisico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder="59.90" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="descontoFisico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desconto (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="0" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium">Preço final:</p>
                      <p className="text-xl font-bold text-[#27b99a]">
                        {(() => {
                          const preco = form.getValues('precoFisico') || 0;
                          const desconto = form.getValues('descontoFisico') || 0;
                          const precoFinal = preco - (preco * desconto / 100);
                          return precoFinal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          });
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="configuracoes" className="space-y-6">
                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Status do Livro</FormLabel>
                        <FormDescription>
                          Livros ativos são exibidos na loja e podem ser comprados pelos clientes
                        </FormDescription>
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
                
                <div className="rounded-lg border p-4 space-y-4">
                  <h3 className="font-medium text-base">Metadados SEO</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="meta-title">Meta Título</Label>
                      <Input id="meta-title" placeholder="Título para SEO (deixe em branco para usar o título do livro)" />
                      <p className="text-xs text-gray-500 mt-1">
                        Recomendado: 50-60 caracteres
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="meta-description">Meta Descrição</Label>
                      <Textarea id="meta-description" placeholder="Descrição para SEO (deixe em branco para usar a descrição curta)" />
                      <p className="text-xs text-gray-500 mt-1">
                        Recomendado: 150-160 caracteres
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-[#27b99a] hover:bg-[#239d84] text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    {modo === 'criar' ? 'Criar Livro' : 'Salvar Alterações'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
