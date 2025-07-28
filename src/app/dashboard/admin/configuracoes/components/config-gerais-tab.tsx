'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Globe, Save, Store, ShieldAlert } from 'lucide-react';

export function ConfigGeraisTab() {
  // Estado para configurações gerais
  const [titulo, setTitulo] = useState('Mais criança');
  const [descricao, setDescricao] = useState('Encontre o livro perfeito para sua criança');
  const [telefone, setTelefone] = useState('(11) 99999-9999');
  const [email, setEmail] = useState('contato@maiscrianca.com');
  const [endereco, setEndereco] = useState('Av. das Flores, 123 - São Paulo, SP');
  
  // Estado para configurações avançadas
  const [manutencao, setManutencao] = useState(false);
  const [lojaAtiva, setLojaAtiva] = useState(true);
  const [permitirRegistros, setPermitirRegistros] = useState(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configurações salvas');
    // Aqui implementaria a lógica para salvar no banco
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-[#27b99a]" />
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100 font-semibold">Informações do Site</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure as informações básicas exibidas para seus visitantes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-title" className="text-gray-700 dark:text-gray-300">
                Nome do Site <span className="text-pink-500">*</span>
              </Label>
              <Input
                id="site-title"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]/20 rounded-2xl"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-description" className="text-gray-700 dark:text-gray-300">
                Descrição do Site
              </Label>
              <Input
                id="site-description"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]/20 rounded-2xl"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Breve descrição que aparecerá nos motores de busca e meta tags
              </p>
            </div>
          </div>
          
          <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-phone" className="text-gray-700 dark:text-gray-300">
                Telefone de Contato
              </Label>
              <Input
                id="site-phone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]/20 rounded-2xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-email" className="text-gray-700 dark:text-gray-300">
                Email de Contato <span className="text-pink-500">*</span>
              </Label>
              <Input
                id="site-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]/20 rounded-2xl"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-address" className="text-gray-700 dark:text-gray-300">
              Endereço Físico
            </Label>
            <Input
              id="site-address"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="border-gray-300 dark:border-gray-700 focus:border-[#27b99a] focus:ring-[#27b99a]/20 rounded-2xl"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <Store className="mr-2 h-5 w-5 text-[#27b99a]" />
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100 font-semibold">Status do Sistema</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure o estado de funcionamento da sua loja online
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div>
              <Label htmlFor="loja-ativa" className="font-medium text-gray-700 dark:text-gray-300">
                Loja Ativa
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quando desativada, a loja fica inacessível para novos clientes
              </p>
            </div>
            <Switch 
              id="loja-ativa" 
              checked={lojaAtiva} 
              onCheckedChange={setLojaAtiva}
              className="data-[state=checked]:bg-[#27b99a]"
            />
          </div>
          
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div>
              <Label htmlFor="modo-manutencao" className="font-medium text-gray-700 dark:text-gray-300">
                Modo Manutenção
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exibe uma página de manutenção para todos os visitantes
              </p>
            </div>
            <Switch 
              id="modo-manutencao" 
              checked={manutencao} 
              onCheckedChange={setManutencao}
              className="data-[state=checked]:bg-[#27b99a]"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5 text-[#27b99a]" />
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100 font-semibold">Configurações Avançadas</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configurações avançadas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div>
              <Label htmlFor="permitir-registros" className="font-medium text-gray-700 dark:text-gray-300">
                Permitir Novos Registros
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Habilita o registro de novos usuários no sistema
              </p>
            </div>
            <Switch 
              id="permitir-registros" 
              checked={permitirRegistros} 
              onCheckedChange={setPermitirRegistros}
              className="data-[state=checked]:bg-[#27b99a]"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-gradient-to-r from-[#27b99a] to-[#22a085] hover:from-[#22a085] hover:to-[#1e8a73] text-white rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </form>
  );
}
