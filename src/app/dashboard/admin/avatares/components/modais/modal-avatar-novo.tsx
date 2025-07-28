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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  CheckIcon,
  Loader2,
  UserCircle,
  Upload,
  Shirt,
  Glasses,
  Crown,
  Gem,
  Palette,
  Eye,
  ShirtIcon,
  Footprints
} from 'lucide-react';
import { GerenciadorElementos } from './gerenciador-elementos';

// Validação de acordo com o novo modelo Prisma para Avatar
const avatarSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.enum(['MASCULINO', 'FEMININO', 'UNISSEX']),
  descricao: z.string().optional(),
  fotoPrincipal: z.string().optional(),
  ativo: z.boolean(),
});

type AvatarFormValues = z.infer<typeof avatarSchema>;

// Tipos para elementos do avatar
type TipoElemento = 'CABELO' | 'OCULOS' | 'ROUPA' | 'SHORTS' | 'BONE' | 'CHAPEU' | 'COR_ROUPA' | 'COR_AVATAR' | 'COR_CABELO' | 'OLHOS' | 'ADERECOS' | 'SAPATOS' | 'MEIAS' | 'LUVAS' | 'BRINCOS' | 'COLAR' | 'PULSEIRA' | 'RELOGIO' | 'MOCHILA' | 'OUTROS';

interface AvatarElemento {
  id?: string;
  nome: string;
  tipo: TipoElemento;
  cor?: string;
  imagens: string[];
  ativo: boolean;
}

interface TabElementos {
  tipo: TipoElemento;
  elementos: AvatarElemento[];
}

interface ElementoTab {
  tipo: TipoElemento;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ModalAvatarNovoProps {
  aberto: boolean;
  onFechar: () => void;
  avatar?: any;
  onSalvar: (dados: any) => Promise<void>;
}

export function ModalAvatarNovo({
  aberto,
  onFechar,
  avatar,
  onSalvar
}: ModalAvatarNovoProps) {
  const [submitting, setSubmitting] = useState(false);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const [elementos, setElementos] = useState<TabElementos[]>([
    { tipo: 'CABELO', elementos: [] },
    { tipo: 'OCULOS', elementos: [] },
    { tipo: 'ROUPA', elementos: [] },
    { tipo: 'SHORTS', elementos: [] },
    { tipo: 'BONE', elementos: [] },
    { tipo: 'CHAPEU', elementos: [] },
    { tipo: 'COR_ROUPA', elementos: [] },
    { tipo: 'COR_AVATAR', elementos: [] },
    { tipo: 'COR_CABELO', elementos: [] },
    { tipo: 'OLHOS', elementos: [] },
    { tipo: 'ADERECOS', elementos: [] },
    { tipo: 'SAPATOS', elementos: [] },
    { tipo: 'MEIAS', elementos: [] },
    { tipo: 'LUVAS', elementos: [] },
    { tipo: 'BRINCOS', elementos: [] },
    { tipo: 'COLAR', elementos: [] },
    { tipo: 'PULSEIRA', elementos: [] },
    { tipo: 'RELOGIO', elementos: [] },
    { tipo: 'MOCHILA', elementos: [] },
    { tipo: 'OUTROS', elementos: [] }
  ]);

  // Configuração das abas de elementos
  const tiposElementos: ElementoTab[] = [
    { tipo: 'CABELO', label: 'Cabelo', icon: UserCircle },
    { tipo: 'OCULOS', label: 'Óculos', icon: Glasses },
    { tipo: 'ROUPA', label: 'Roupas', icon: Shirt },
    { tipo: 'SHORTS', label: 'Shorts', icon: ShirtIcon },
    { tipo: 'BONE', label: 'Boné', icon: Crown },
    { tipo: 'CHAPEU', label: 'Chapéu', icon: Crown },
    { tipo: 'COR_ROUPA', label: 'Cor Roupa', icon: Palette },
    { tipo: 'COR_AVATAR', label: 'Cor Avatar', icon: Palette },
    { tipo: 'COR_CABELO', label: 'Cor Cabelo', icon: Palette },
    { tipo: 'OLHOS', label: 'Olhos', icon: Eye },
    { tipo: 'ADERECOS', label: 'Acessórios', icon: Gem },
    { tipo: 'SAPATOS', label: 'Sapatos', icon: Footprints },
    { tipo: 'MEIAS', label: 'Meias', icon: Footprints },
    { tipo: 'LUVAS', label: 'Luvas', icon: Gem },
    { tipo: 'BRINCOS', label: 'Brincos', icon: Gem },
    { tipo: 'COLAR', label: 'Colar', icon: Gem },
    { tipo: 'PULSEIRA', label: 'Pulseira', icon: Gem },
    { tipo: 'RELOGIO', label: 'Relógio', icon: Gem },
    { tipo: 'MOCHILA', label: 'Mochila', icon: Gem },
    { tipo: 'OUTROS', label: 'Outros', icon: Gem }
  ];

  // Funções para gerenciar elementos
  const adicionarElemento = (tipoElemento: TipoElemento, elemento: Omit<AvatarElemento, 'id'>) => {
    const novoElemento = {
      ...elemento,
      id: Date.now().toString() // ID temporário
    };
    
    setElementos(prev => 
      prev.map(tab => 
        tab.tipo === tipoElemento 
          ? { ...tab, elementos: [...tab.elementos, novoElemento] }
          : tab
      )
    );
  };
  
  const editarElemento = (tipoElemento: TipoElemento, id: string, dadosAtualizados: Partial<AvatarElemento>) => {
    setElementos(prev => 
      prev.map(tab => 
        tab.tipo === tipoElemento 
          ? {
              ...tab, 
              elementos: tab.elementos.map(el => 
                el.id === id ? { ...el, ...dadosAtualizados } : el
              )
            }
          : tab
      )
    );
  };
  
  const removerElemento = (tipoElemento: TipoElemento, id: string) => {
    setElementos(prev => 
      prev.map(tab => 
        tab.tipo === tipoElemento 
          ? { ...tab, elementos: tab.elementos.filter(el => el.id !== id) }
          : tab
      )
    );
  };
  

  
  // Configurar o formulário com react-hook-form e zod
  const form = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      nome: '',
      tipo: 'MASCULINO',
      descricao: '',
      fotoPrincipal: '',
      ativo: true
    },
  });
  
  // Configuração inicial baseada no avatar
  useEffect(() => {
    console.log('🔄 useEffect executado - avatar:', avatar);
    console.log('🔄 useEffect executado - aberto:', aberto);
    
    if (avatar && aberto) {
      console.log('✅ Carregando dados do avatar para edição:', avatar);
      
      // Verificar se a foto principal é base64 (não usar)
      const isBase64 = avatar.fotoPrincipal?.startsWith('data:');
      const fotoParaUsar = isBase64 ? '' : (avatar.fotoPrincipal || '');
      
      form.reset({
        nome: avatar.nome || '',
        tipo: avatar.tipo || '',
        descricao: avatar.descricao || '',
        fotoPrincipal: fotoParaUsar,
        ativo: avatar.ativo ?? true,
      });
      
      // Só definir preview se não for base64
      setImagemPreview(isBase64 ? null : (avatar.fotoPrincipal || null));
      
      if (isBase64) {
        console.log('⚠️ Foto principal em base64 detectada, removendo para forçar novo upload');
      }
      
      // Carregar elementos existentes do avatar
      if (avatar.elementos && avatar.elementos.length > 0) {
        console.log('📦 Elementos encontrados no avatar:', avatar.elementos);
        
        // Resetar elementos
        const elementosCarregados = elementos.map(tab => ({ ...tab, elementos: [] }));
        
        // Agrupar elementos por tipo
        avatar.elementos.forEach((elemento: any) => {
          const tabIndex = elementosCarregados.findIndex(tab => tab.tipo === elemento.tipo);
          if (tabIndex !== -1) {
            const elementoFormatado: AvatarElemento = {
              id: elemento.id,
              nome: elemento.nome,
              tipo: elemento.tipo as TipoElemento,
              cor: elemento.cor || '',
              imagens: elemento.arquivo ? [elemento.arquivo] : [],
              ativo: elemento.ativo ?? true
            };
            (elementosCarregados[tabIndex].elementos as AvatarElemento[]).push(elementoFormatado);
          }
        });
        
        setElementos(elementosCarregados);
      } else {
        console.log('⚠️ Avatar não tem elementos, resetando...');
        // Resetar elementos se não houver
        setElementos(prev => prev.map(tab => ({ ...tab, elementos: [] })));
      }
    } else if (aberto && !avatar) {
      console.log('✨ Criando novo avatar, limpando formulário e elementos...');
      
      form.reset({
        nome: '',
        tipo: 'MASCULINO',
        descricao: '',
        fotoPrincipal: '',
        ativo: true,
      });
      setImagemPreview(null);
      // Resetar elementos para novo avatar
      setElementos(prev => prev.map(tab => ({ ...tab, elementos: [] })));
    }
  }, [avatar, aberto, form]);
  
  const onSubmit = async (values: AvatarFormValues) => {
    setSubmitting(true);
    try {
      // Validar se a foto principal não é base64
      if (values.fotoPrincipal && values.fotoPrincipal.startsWith('data:')) {
        toast.error('Erro: Foto principal em formato inválido. Faça upload novamente.');
        console.error('❌ Tentativa de enviar foto principal em base64:', values.fotoPrincipal.substring(0, 50) + '...');
        return;
      }
      
      // Preparar dados do avatar com elementos
      const todosElementos = elementos.flatMap(tab => 
        tab.elementos.map(elemento => ({
          tipo: elemento.tipo,
          nome: elemento.nome,
          cor: elemento.cor,
          imagens: elemento.imagens,
          ativo: elemento.ativo
        }))
      );
      
      const dadosCompletos = {
        ...values,
        elementos: todosElementos
      };
      
      console.log('Dados completos enviados:', dadosCompletos);
      
      await onSalvar(dadosCompletos);
      
      toast.success(
        avatar 
          ? 'Avatar atualizado com sucesso!' 
          : 'Avatar criado com sucesso!'
      );
      
      onFechar();
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
      toast.error('Erro ao salvar avatar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    
    try {
      // Upload real da imagem
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.url) {
        throw new Error('Resposta inválida do servidor');
      }
      
      console.log('✅ Upload da foto principal realizado:', data.url);
      
      // Definir preview e valor do formulário com a URL
      setImagemPreview(data.url);
      form.setValue('fotoPrincipal', data.url);
      
      toast.success('Foto carregada com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro no upload da foto:', error);
      toast.error(`Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setUploadingPhoto(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {avatar ? 'Editar Avatar' : 'Criar Novo Avatar'}
          </DialogTitle>
          <DialogDescription>
            {avatar 
              ? 'Edite as informações e elementos do avatar selecionado.'
              : 'Preencha as informações e configure os elementos do novo avatar.'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-6 h-auto">
            <TabsTrigger value="dados" className="text-xs p-2">Dados</TabsTrigger>
            {tiposElementos.map((tipo) => {
              const Icon = tipo.icon;
              return (
                <TabsTrigger key={tipo.tipo} value={tipo.tipo} className="text-xs flex flex-col items-center gap-1 p-2">
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{tipo.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
              
              {/* Aba de Dados Básicos */}
              <TabsContent value="dados" className="space-y-6">
            
            {/* Upload de Imagem */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {imagemPreview ? (
                  <img
                    src={imagemPreview}
                    alt="Preview do avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                    <UserCircle className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                  id="avatar-image"
                />
                <label
                  htmlFor="avatar-image"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    uploadingPhoto 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                  }`}
                >
                  {uploadingPhoto ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      Fazendo Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Escolher Foto
                    </>
                  )}
                </label>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  📷 Foto principal do avatar
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <FormField
                control={form.control as any}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Avatar</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: João Menino" 
                        className="rounded-2xl"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo */}
              <FormField
                control={form.control as any}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo do Avatar</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MASCULINO">Masculino</SelectItem>
                        <SelectItem value="FEMININO">Feminino</SelectItem>
                        <SelectItem value="UNISSEX">Unissex</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição */}
            <FormField
              control={form.control as any}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva as características do avatar..."
                      className="rounded-2xl resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Uma breve descrição sobre o avatar e suas características.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Ativo */}
            <FormField
              control={form.control as any}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-2xl border p-4">
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
            
            </TabsContent>
              
              {/* Abas para Elementos do Avatar */}
              {elementos.map((elementoTab) => {
                const configAba = tiposElementos.find(config => config.tipo === elementoTab.tipo);
                if (!configAba) return null;
                
                return (
                  <TabsContent key={elementoTab.tipo} value={elementoTab.tipo} className="space-y-4">
                    <GerenciadorElementos
                      tipo={elementoTab.tipo}
                      label={configAba.label}
                      icon={configAba.icon}
                      elementos={elementoTab.elementos}
                      onAdicionarElemento={(elemento) => adicionarElemento(elementoTab.tipo, elemento)}
                      onEditarElemento={(id, dados) => editarElemento(elementoTab.tipo, id, dados)}
                      onRemoverElemento={(id) => removerElemento(elementoTab.tipo, id)}
                    />
                  </TabsContent>
                );
              })}
            
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={onFechar} className="rounded-full">
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-[#27b99a] hover:bg-[#239d84] text-white rounded-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      {avatar ? 'Salvar Alterações' : 'Criar Avatar'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
