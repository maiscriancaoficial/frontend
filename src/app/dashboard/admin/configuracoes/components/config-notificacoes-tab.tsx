'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Bell, 
  Mail, 
  MessageSquare,
  Smartphone,
  Save,
  ShoppingCart,
  Users,
  AlertTriangle,
  Settings,
  Package
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ConfigNotificacoesTab() {
  // Estado para notificações por email
  const [emailPedidos, setEmailPedidos] = useState(true);
  const [emailNovoCliente, setEmailNovoCliente] = useState(true);
  const [emailEstoque, setEmailEstoque] = useState(true);
  const [emailReviews, setEmailReviews] = useState(true);
  const [emailContato, setEmailContato] = useState(true);
  
  // Estado para notificações do sistema
  const [notifNovoPedido, setNotifNovoPedido] = useState(true);
  const [notifNovoCliente, setNotifNovoCliente] = useState(true);
  const [notifNovaReview, setNotifNovaReview] = useState(true);
  const [notifEstoque, setNotifEstoque] = useState(true);
  const [notifMensagem, setNotifMensagem] = useState(true);

  // Estado para push notifications
  const [pushAtivo, setPushAtivo] = useState(false);
  const [pushKey, setPushKey] = useState('');
  
  // Estado para templates de email
  const [emailTemplate, setEmailTemplate] = useState('default');
  const [emailRemetente, setEmailRemetente] = useState('contato@maiscrianca.com.br');
  const [emailAssinatura, setEmailAssinatura] = useState('Equipe da Mais criança');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configurações de notificações salvas');
    // Aqui implementaria a lógica para salvar no banco
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="emails" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="emails" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Mail className="h-4 w-4 mr-2" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="sistema" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Bell className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="push" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Smartphone className="h-4 w-4 mr-2" />
            Push
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="emails">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Notificações por Email</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure quais eventos devem enviar emails de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="email-pedidos" className="font-medium text-gray-700 dark:text-gray-300">
                      Novos Pedidos
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba emails quando novos pedidos forem realizados
                    </p>
                  </div>
                </div>
                <Switch 
                  id="email-pedidos" 
                  checked={emailPedidos} 
                  onCheckedChange={setEmailPedidos}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="email-clientes" className="font-medium text-gray-700 dark:text-gray-300">
                      Novos Clientes
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba emails quando novos clientes se registrarem
                    </p>
                  </div>
                </div>
                <Switch 
                  id="email-clientes" 
                  checked={emailNovoCliente} 
                  onCheckedChange={setEmailNovoCliente}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="email-estoque" className="font-medium text-gray-700 dark:text-gray-300">
                      Alertas de Estoque
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba alertas quando produtos estiverem com estoque baixo
                    </p>
                  </div>
                </div>
                <Switch 
                  id="email-estoque" 
                  checked={emailEstoque} 
                  onCheckedChange={setEmailEstoque}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="email-reviews" className="font-medium text-gray-700 dark:text-gray-300">
                      Novas Avaliações
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba emails quando clientes deixarem novas avaliações
                    </p>
                  </div>
                </div>
                <Switch 
                  id="email-reviews" 
                  checked={emailReviews} 
                  onCheckedChange={setEmailReviews}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="email-contato" className="font-medium text-gray-700 dark:text-gray-300">
                      Mensagens do Formulário de Contato
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba emails quando alguém enviar uma mensagem pelo formulário
                    </p>
                  </div>
                </div>
                <Switch 
                  id="email-contato" 
                  checked={emailContato} 
                  onCheckedChange={setEmailContato}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm mt-6">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Configurações de Email</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure detalhes para os emails enviados pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-remetente" className="text-gray-700 dark:text-gray-300">
                  Email do Remetente
                </Label>
                <Input
                  id="email-remetente"
                  type="email"
                  value={emailRemetente}
                  onChange={(e) => setEmailRemetente(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  placeholder="contato@seusite.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-assinatura" className="text-gray-700 dark:text-gray-300">
                  Assinatura de Email
                </Label>
                <Textarea
                  id="email-assinatura"
                  value={emailAssinatura}
                  onChange={(e) => setEmailAssinatura(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-template" className="text-gray-700 dark:text-gray-300">
                  Template de Email
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div
                    className={`border rounded-[10px] p-2 cursor-pointer transition-all ${
                      emailTemplate === 'default'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                    }`}
                    onClick={() => setEmailTemplate('default')}
                  >
                    <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mb-2">
                      <p className="text-xs text-gray-400">Simples</p>
                    </div>
                    <p className="text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                      Padrão
                    </p>
                  </div>
                  
                  <div
                    className={`border rounded-[10px] p-2 cursor-pointer transition-all ${
                      emailTemplate === 'modern'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                    }`}
                    onClick={() => setEmailTemplate('modern')}
                  >
                    <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mb-2">
                      <p className="text-xs text-gray-400">Moderno</p>
                    </div>
                    <p className="text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                      Moderno
                    </p>
                  </div>
                  
                  <div
                    className={`border rounded-[10px] p-2 cursor-pointer transition-all ${
                      emailTemplate === 'MCl'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                    }`}
                    onClick={() => setEmailTemplate('MCl')}
                  >
                    <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mb-2">
                      <p className="text-xs text-gray-400">MCl</p>
                    </div>
                    <p className="text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                      MCl
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selecione um template para todos os emails enviados pelo sistema.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sistema">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Notificações do Sistema</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure quais notificações aparecem no painel administrativo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="notif-pedido" className="font-medium text-gray-700 dark:text-gray-300">
                      Novos Pedidos
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrar notificação quando novos pedidos forem realizados
                    </p>
                  </div>
                </div>
                <Switch 
                  id="notif-pedido" 
                  checked={notifNovoPedido} 
                  onCheckedChange={setNotifNovoPedido}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="notif-cliente" className="font-medium text-gray-700 dark:text-gray-300">
                      Novos Clientes
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrar notificação quando novos clientes se registrarem
                    </p>
                  </div>
                </div>
                <Switch 
                  id="notif-cliente" 
                  checked={notifNovoCliente} 
                  onCheckedChange={setNotifNovoCliente}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="notif-review" className="font-medium text-gray-700 dark:text-gray-300">
                      Novas Avaliações
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrar notificação quando clientes deixarem novas avaliações
                    </p>
                  </div>
                </div>
                <Switch 
                  id="notif-review" 
                  checked={notifNovaReview} 
                  onCheckedChange={setNotifNovaReview}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="notif-estoque" className="font-medium text-gray-700 dark:text-gray-300">
                      Alertas de Estoque
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrar notificação quando produtos estiverem com estoque baixo
                    </p>
                  </div>
                </div>
                <Switch 
                  id="notif-estoque" 
                  checked={notifEstoque} 
                  onCheckedChange={setNotifEstoque}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3" />
                  <div>
                    <Label htmlFor="notif-mensagem" className="font-medium text-gray-700 dark:text-gray-300">
                      Novas Mensagens
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrar notificação quando receber novas mensagens de contato
                    </p>
                  </div>
                </div>
                <Switch 
                  id="notif-mensagem" 
                  checked={notifMensagem} 
                  onCheckedChange={setNotifMensagem}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[10px]">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Sobre notificações do sistema</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  As notificações do sistema aparecem no canto superior direito do painel administrativo.
                  Elas permanecem visíveis até serem descartadas e também são armazenadas na sua central de notificações para referência futura.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="push">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Notificações Push</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure notificações push para dispositivos móveis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="push-ativo" className="font-medium text-gray-700 dark:text-gray-300">
                    Ativar Notificações Push
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Envie notificações push para dispositivos móveis
                  </p>
                </div>
                <Switch 
                  id="push-ativo" 
                  checked={pushAtivo} 
                  onCheckedChange={setPushAtivo}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              {pushAtivo && (
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="push-key" className="text-gray-700 dark:text-gray-300">
                      Chave Firebase Cloud Messaging (FCM)
                    </Label>
                    <Input
                      id="push-key"
                      value={pushKey}
                      onChange={(e) => setPushKey(e.target.value)}
                      className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                      placeholder="AAAA0000000:AAAAAAAAAA-AAAAAAAA_AAAAAAAAAAAA-AAAAAAAAAAAAAA..."
                    />
                    <p className="text-xs text-gray-500">
                      Insira sua chave do Firebase Cloud Messaging para enviar notificações push.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[10px] p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Como configurar notificações push:
                    </h3>
                    <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 pl-5 list-decimal">
                      <li>Crie um projeto no Firebase Console</li>
                      <li>Configure o Firebase Cloud Messaging (FCM)</li>
                      <li>Copie a chave de servidor FCM</li>
                      <li>Cole a chave no campo acima</li>
                      <li>Ative as notificações push</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[10px]">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Dica de uso</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Notificações push são uma ótima maneira de manter seus clientes engajados e informados sobre novidades, promoções e status de pedidos. Recomendamos configurar essa funcionalidade para aumentar as taxas de conversão e retenção de clientes.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-[10px] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </form>
  );
}
