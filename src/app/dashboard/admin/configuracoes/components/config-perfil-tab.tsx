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
import { 
  User, 
  Lock, 
  Shield, 
  Save,
  Upload,
  Mail,
  Key
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ConfigPerfilTab() {
  // Estado para informações de perfil
  const [nome, setNome] = useState('Administrador');
  const [email, setEmail] = useState('admin@maiscrianca.com.br');
  const [avatar, setAvatar] = useState('/placeholder-avatar.png');

  // Estado para segurança
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [autenticacaoDoisFatores, setAutenticacaoDoisFatores] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configurações de perfil salvas');
    // Aqui implementaria a lógica para salvar no banco
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Perfil Administrador</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure suas informações pessoais de administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-pink-200 dark:border-pink-900">
                  {/* Placeholder para avatar */}
                  <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 p-0 bg-pink-600 hover:bg-pink-700"
                >
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Enviar foto</span>
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Imagem JPG, PNG. Max 1MB
              </p>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-nome" className="text-gray-700 dark:text-gray-300">
                    Nome <span className="text-pink-500">*</span>
                  </Label>
                  <Input
                    id="admin-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-gray-700 dark:text-gray-300">
                    Email <span className="text-pink-500">*</span>
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Segurança</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure as opções de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 flex items-center">
              <Lock className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-400" />
              Alterar Senha
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="admin-senha" className="text-gray-700 dark:text-gray-300">
                  Nova Senha
                </Label>
                <Input
                  id="admin-senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-confirmar-senha" className="text-gray-700 dark:text-gray-300">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="admin-confirmar-senha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
          
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
            <div>
              <Label htmlFor="auth-2fa" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Key className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-400" />
                Autenticação de Dois Fatores
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                Adiciona uma camada extra de segurança à sua conta
              </p>
            </div>
            <Switch 
              id="auth-2fa" 
              checked={autenticacaoDoisFatores} 
              onCheckedChange={setAutenticacaoDoisFatores}
              className="data-[state=checked]:bg-pink-500"
            />
          </div>
          
          {autenticacaoDoisFatores && (
            <div className="ml-6 mt-2 p-3 rounded-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2">
                Configurar 2FA
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escaneie o QR code com o seu app de autenticação (Google Authenticator, Authy, etc) ou insira o código manualmente.
              </p>
              <div className="flex justify-center my-4">
                {/* Placeholder para QR code */}
                <div className="h-32 w-32 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-xs text-gray-400">QR Code</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="2fa-code" className="text-sm text-gray-700 dark:text-gray-300">
                  Código do aplicativo
                </Label>
                <Input
                  id="2fa-code"
                  placeholder="Digite o código de 6 dígitos"
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  className="mt-2 border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950 rounded-[10px]"
                >
                  Verificar e Ativar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-[10px] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Perfil
        </Button>
      </div>
    </form>
  );
}
