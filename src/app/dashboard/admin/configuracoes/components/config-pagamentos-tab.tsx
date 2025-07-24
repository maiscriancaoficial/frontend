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
  Wallet,
  CreditCard,
  QrCode,
  Save,
  Lock,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ConfigPagamentosTab() {
  // Estado para PIX
  const [pixAtivo, setPixAtivo] = useState(true);
  const [pixChave, setPixChave] = useState('');
  const [pixNome, setPixNome] = useState('');
  const [pixBanco, setPixBanco] = useState('');
  
  // Estado para Cartão de Crédito
  const [creditoAtivo, setCreditoAtivo] = useState(true);
  const [creditoStripeKey, setCreditoStripeKey] = useState('');
  const [creditoInstallments, setCreditoInstallments] = useState(true);
  const [creditoMaxInstallments, setCreditoMaxInstallments] = useState(12);
  
  // Estado para Cartão de Débito
  const [debitoAtivo, setDebitoAtivo] = useState(false);
  
  // Estado para configurações gerais de pagamento
  const [testMode, setTestMode] = useState(true);
  const [taxasEmbutidas, setTaxasEmbutidas] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configurações de pagamento salvas');
    // Aqui implementaria a lógica para salvar no banco
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="metodos" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="metodos" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <CreditCard className="h-4 w-4 mr-2" />
            Métodos de Pagamento
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Wallet className="h-4 w-4 mr-2" />
            Configurações Gerais
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metodos">
          {/* Configuração de PIX */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <QrCode className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">PIX</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure pagamentos via PIX
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="pix-ativo" className="font-medium text-gray-700 dark:text-gray-300">
                    Ativar PIX
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permitir que clientes paguem via PIX
                  </p>
                </div>
                <Switch 
                  id="pix-ativo" 
                  checked={pixAtivo} 
                  onCheckedChange={setPixAtivo}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              {pixAtivo && (
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="pix-chave" className="text-gray-700 dark:text-gray-300">
                      Chave PIX
                    </Label>
                    <Input
                      id="pix-chave"
                      value={pixChave}
                      onChange={(e) => setPixChave(e.target.value)}
                      className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                      placeholder="CPF, CNPJ, email ou chave aleatória"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pix-nome" className="text-gray-700 dark:text-gray-300">
                      Nome do Beneficiário
                    </Label>
                    <Input
                      id="pix-nome"
                      value={pixNome}
                      onChange={(e) => setPixNome(e.target.value)}
                      className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                      placeholder="Nome completo ou razão social"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pix-banco" className="text-gray-700 dark:text-gray-300">
                      Banco
                    </Label>
                    <Input
                      id="pix-banco"
                      value={pixBanco}
                      onChange={(e) => setPixBanco(e.target.value)}
                      className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                      placeholder="Nome do banco"
                    />
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[10px] p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Importante</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Verifique se a chave PIX está correta. Pagamentos enviados para a chave errada não podem ser recuperados automaticamente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Configuração de Cartão de Crédito */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm mt-6">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Cartão de Crédito</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure pagamentos com cartão de crédito via Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="credito-ativo" className="font-medium text-gray-700 dark:text-gray-300">
                    Ativar Cartão de Crédito
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permitir que clientes paguem com cartão de crédito
                  </p>
                </div>
                <Switch 
                  id="credito-ativo" 
                  checked={creditoAtivo} 
                  onCheckedChange={setCreditoAtivo}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              {creditoAtivo && (
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="credito-stripe-key" className="text-gray-700 dark:text-gray-300">
                      Chave Secreta Stripe
                    </Label>
                    <Input
                      id="credito-stripe-key"
                      type="password"
                      value={creditoStripeKey}
                      onChange={(e) => setCreditoStripeKey(e.target.value)}
                      className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                      placeholder="sk_live_..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                    <div>
                      <Label htmlFor="credito-installments" className="font-medium text-gray-700 dark:text-gray-300">
                        Parcelamento
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Permitir que clientes parcelem suas compras
                      </p>
                    </div>
                    <Switch 
                      id="credito-installments" 
                      checked={creditoInstallments} 
                      onCheckedChange={setCreditoInstallments}
                      className="data-[state=checked]:bg-pink-500"
                    />
                  </div>
                  
                  {creditoInstallments && (
                    <div className="space-y-2">
                      <Label htmlFor="credito-max-installments" className="text-gray-700 dark:text-gray-300">
                        Número máximo de parcelas
                      </Label>
                      <Input
                        id="credito-max-installments"
                        type="number"
                        min="1"
                        max="24"
                        value={creditoMaxInstallments}
                        onChange={(e) => setCreditoMaxInstallments(Number(e.target.value))}
                        className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px] w-20"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recomendamos limitar a 12 parcelas para evitar taxas altas.
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[10px] p-4">
                    <div className="flex items-start space-x-2">
                      <Lock className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800 dark:text-blue-200">Integração Stripe</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                          Para usar o Stripe, você precisa:
                        </p>
                        <ol className="text-sm text-blue-700 dark:text-blue-300 list-decimal pl-5 space-y-1">
                          <li>Criar uma conta no Stripe</li>
                          <li>Obter sua chave secreta no painel do Stripe</li>
                          <li>Configurar o webhook para receber atualizações de pagamento</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Configuração de Cartão de Débito */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm mt-6">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Cartão de Débito</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure pagamentos com cartão de débito
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="debito-ativo" className="font-medium text-gray-700 dark:text-gray-300">
                    Ativar Cartão de Débito
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permitir que clientes paguem com cartão de débito
                  </p>
                </div>
                <Switch 
                  id="debito-ativo" 
                  checked={debitoAtivo} 
                  onCheckedChange={setDebitoAtivo}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              {debitoAtivo && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[10px] p-4 mt-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-200">Informação</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        O pagamento com cartão de débito é processado através da mesma integração do Stripe configurada para cartão de crédito.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Segurança de Pagamentos</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure os parâmetros de segurança para transações
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Certificações de Segurança</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <Shield className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm ml-2 text-gray-700 dark:text-gray-300">PCI DSS</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <Lock className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm ml-2 text-gray-700 dark:text-gray-300">SSL</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <Shield className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm ml-2 text-gray-700 dark:text-gray-300">3D Secure</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Todas as transações com cartão são processadas através do Stripe, que é certificado PCI DSS nível 1 
                  (o nível mais alto de certificação de segurança na indústria de pagamentos).
                </p>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nenhuma informação de cartão de crédito é armazenada nos nossos servidores. 
                  Todo o processamento é feito diretamente pelo provedor de pagamento.
                </p>
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="test-mode" className="font-medium text-gray-700 dark:text-gray-300">
                    Modo de Teste
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Usar ambiente de teste (sandbox) para transações
                  </p>
                </div>
                <Switch 
                  id="test-mode" 
                  checked={testMode} 
                  onCheckedChange={setTestMode}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              {testMode && (
                <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription className="text-sm">
                    O modo de teste está ativado. As transações não serão reais e não haverá movimentação de dinheiro.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[10px] p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-200">Dica de Segurança</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Faça sempre testes de pagamento antes de ativar o modo de produção. Use cartões de teste fornecidos 
                      pelo Stripe para simular diversos cenários de pagamento.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuracoes">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Configurações Gerais</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configurações adicionais para o sistema de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="taxas-embutidas" className="font-medium text-gray-700 dark:text-gray-300">
                    Taxas Embutidas
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Incluir taxas de processamento no preço final do produto
                  </p>
                </div>
                <Switch 
                  id="taxas-embutidas" 
                  checked={taxasEmbutidas} 
                  onCheckedChange={setTaxasEmbutidas}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-confirmacao" className="text-gray-700 dark:text-gray-300">
                  Mensagem de Confirmação de Pagamento
                </Label>
                <Textarea
                  id="email-confirmacao"
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  rows={3}
                  placeholder="Mensagem personalizada que será exibida após a confirmação do pagamento"
                />
                <p className="text-xs text-gray-500">
                  Esta mensagem aparecerá na página de confirmação e no email de confirmação de pagamento.
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[10px] p-4">
                <div className="flex items-start space-x-2">
                  <QrCode className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-200">Sobre QR Codes PIX</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      O sistema gera automaticamente QR Codes PIX para cada transação. O cliente pode escanear o 
                      código com seu aplicativo bancário para realizar o pagamento facilmente.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[10px] p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Taxas de processamento aproximadas:
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• PIX: Gratuito ou taxa mínima (dependendo do banco)</li>
                  <li>• Cartão de Crédito: 2.39% + R$0,39 por transação</li>
                  <li>• Cartão de Débito: 1.99% + R$0,39 por transação</li>
                  <li>• Parcelamento: Acréscimo de 0.15% a 0.30% por parcela</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
