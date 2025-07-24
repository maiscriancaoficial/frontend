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
  UserCircle,
  Settings2,
  Paintbrush,
  Plus,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Validação de acordo com o modelo Prisma para Avatar
const avatarSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  tipo: z.enum(['MASCULINO', 'FEMININO', 'UNISSEX'], {
    errorMap: () => ({ message: 'Selecione um tipo válido' })
  }),
  descricao: z.string().optional(),
  fotoPrincipal: z.string().optional(),
  ativo: z.boolean().default(true),
});

type AvatarFormValues = z.infer<typeof avatarSchema>;

interface ModalAvatarFormProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: any;
  modo: 'criar' | 'editar';
}

export function ModalAvatarForm({
  isOpen,
  onClose,
  avatar,
  modo,
}: ModalAvatarFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  
  // Configurar o formulário com react-hook-form e zod
  const form = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      nome: '',
      tipo: '',
      cabelo: [],
      oculos: [],
      roupa: [],
      shorts: [],
      bone: [],
      chapeu: [],
      corRoupa: [],
      corAvatar: [],
      corCabelo: [],
      olhos: [],
      aderecos: [],
      ativo: true
    },
  });
  
  // Carregar dados do avatar quando o modo é editar ou quando o avatar muda
  useEffect(() => {
    if (modo === 'editar' && avatar) {
      form.reset({
        nome: avatar.nome || '',
        tipo: avatar.tipo || '',
        cabelo: avatar.cabelo || [],
        oculos: avatar.oculos || [],
        roupa: avatar.roupa || [],
        shorts: avatar.shorts || [],
        bone: avatar.bone || [],
        chapeu: avatar.chapeu || [],
        corRoupa: avatar.corRoupa || [],
        corAvatar: avatar.corAvatar || [],
        corCabelo: avatar.corCabelo || [],
        olhos: avatar.olhos || [],
        aderecos: avatar.aderecos || [],
        ativo: avatar.ativo !== undefined ? avatar.ativo : true,
      });
    } else if (modo === 'criar') {
      form.reset({
        nome: '',
        tipo: 'menino',
        cabelo: [],
        oculos: [],
        roupa: [],
        shorts: [],
        bone: [],
        chapeu: [],
        corRoupa: [],
        corAvatar: [],
        corCabelo: [],
        olhos: [],
        aderecos: [],
        ativo: true
      });
    }
  }, [modo, avatar, form]);
  
  const onSubmit = async (values: AvatarFormValues) => {
    setSubmitting(true);
    try {
      // Simula um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Aqui você enviaria os dados para o servidor em um caso real
      console.log('Dados do avatar para salvar:', values);
      
      toast.success(
        modo === 'criar' 
          ? 'Avatar criado com sucesso!' 
          : 'Avatar atualizado com sucesso!'
      );
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
      toast.error('Erro ao salvar avatar. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Função para adicionar item a um array
  const adicionarItem = (campo: keyof AvatarFormValues, valor: string) => {
    const valoresAtuais = form.getValues(campo) as string[] || [];
    if (!valoresAtuais.includes(valor) && valor.trim() !== '') {
      form.setValue(campo, [...valoresAtuais, valor] as any);
    }
  };
  
  // Função para remover item de um array
  const removerItem = (campo: keyof AvatarFormValues, valor: string) => {
    const valoresAtuais = form.getValues(campo) as string[] || [];
    form.setValue(campo, valoresAtuais.filter(item => item !== valor) as any);
  };
  
  // Componente para renderizar uma lista de elementos
  const ElementosList = ({ campo, label }: { campo: keyof AvatarFormValues, label: string }) => {
    const [novoItem, setNovoItem] = useState('');
    const valores = form.watch(campo) as string[] || [];
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>{label}</FormLabel>
          <span className="text-xs text-gray-500">{valores.length} item(s)</span>
        </div>
        
        <div className="flex gap-2">
          <Input 
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            placeholder={`Adicionar ${label.toLowerCase()}...`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              adicionarItem(campo, novoItem);
              setNovoItem('');
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {valores.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removerItem(campo, item)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {valores.length === 0 && (
            <span className="text-sm text-gray-500">Nenhum item adicionado</span>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {modo === 'criar' ? 'Adicionar Novo Avatar' : 'Editar Avatar'}
          </DialogTitle>
          <DialogDescription>
            {modo === 'criar'
              ? 'Configure os elementos disponíveis para este avatar.'
              : 'Atualize as configurações deste avatar.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="informacoes" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="informacoes" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  Informações
                </TabsTrigger>
                <TabsTrigger value="elementos" className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Elementos
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
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Avatar</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite o nome do avatar" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo do Avatar</FormLabel>
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
                              <SelectItem value="menino">Menino</SelectItem>
                              <SelectItem value="menina">Menina</SelectItem>
                              <SelectItem value="adulto">Adulto</SelectItem>
                              <SelectItem value="animal">Animal</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Coluna 2 - Imagem de preview */}
                  <div className="border rounded-xl p-4">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                      <UserCircle className="w-32 h-32 text-gray-400" />
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">
                      Prévia indisponível no momento
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="elementos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Elementos de aparência */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Aparência</h3>
                    
                    <ElementosList campo="cabelo" label="Cabelos" />
                    <ElementosList campo="olhos" label="Olhos" />
                    <ElementosList campo="oculos" label="Óculos" />
                  </div>
                  
                  {/* Elementos de vestuário */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Vestuário</h3>
                    
                    <ElementosList campo="roupa" label="Roupas" />
                    <ElementosList campo="shorts" label="Shorts/Calças" />
                    <ElementosList campo="bone" label="Bonés" />
                    <ElementosList campo="chapeu" label="Chapéus" />
                    <ElementosList campo="aderecos" label="Adereços" />
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-medium mb-4">Cores Disponíveis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ElementosList campo="corAvatar" label="Cores de Pele" />
                    <ElementosList campo="corCabelo" label="Cores de Cabelo" />
                    <ElementosList campo="corRoupa" label="Cores de Roupa" />
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
                        <FormLabel className="text-base">Status do Avatar</FormLabel>
                        <FormDescription>
                          Avatares ativos podem ser utilizados pelos usuários na personalização de livros
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
                
                {modo === 'editar' && avatar?.livrosPersonalizados?.length > 0 && (
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium text-base mb-2">Personalizações</h3>
                    <p className="text-sm text-amber-600 dark:text-amber-500 mb-4">
                      ⚠️ Este avatar está sendo utilizado em {avatar.livrosPersonalizados.length} livros personalizados.
                      Alterações podem afetar esses livros.
                    </p>
                    
                    <div className="max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded p-2">
                      <ul className="text-sm">
                        {avatar.livrosPersonalizados.map((livro: any, index: number) => (
                          <li key={index} className="py-1 border-b border-gray-200 dark:border-gray-800 last:border-0">
                            Livro: {livro.id} • Personagem: {livro.nomePersonagem || 'Sem nome'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
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
                    {modo === 'criar' ? 'Criar Avatar' : 'Salvar Alterações'}
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
