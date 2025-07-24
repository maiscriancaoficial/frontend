'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Save, Percent, DollarSign, CreditCard, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface ConfiguracaoGlobal {
  id: string;
  // Configurações de Comissão
  tipoComissaoPadrao: 'porcentagem' | 'fixo';
  valorComissaoPadrao: number;
  tipoEventoComissaoPadrao: 'acesso' | 'clique' | 'checkout' | 'cupom';
  
  // Configurações de Saque
  metodoSaquePadrao: 'pix' | 'ted' | 'boleto';
  valorMinimoSaquePadrao: number;
  diasProcessamentoSaque: number;
  
  // Configurações de Asaas
  asaasApiKey: string;
  asaasEnvironment: 'sandbox' | 'production';
  asaasWebhookUrl: string;
  
  // Configurações de Link
  dominioAfiliado: string;
  prefixoLink: string;
  
  // Configurações de Aprovação
  aprovacaoAutomatica: boolean;
  limiteVendasAprovacao: number;
  
  // Outras configurações
  cookieExpiracao: number; // em dias
  ativo: boolean;
}

interface ModalConfigGlobalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalConfigGlobal({ isOpen, onClose }: ModalConfigGlobalProps) {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoGlobal | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Estados do formulário
  const [tipoComissaoPadrao, setTipoComissaoPadrao] = useState<'porcentagem' | 'fixo'>('porcentagem');
  const [valorComissaoPadrao, setValorComissaoPadrao] = useState(10);
  const [tipoEventoComissaoPadrao, setTipoEventoComissaoPadrao] = useState<'acesso' | 'clique' | 'checkout' | 'cupom'>('checkout');
  const [metodoSaquePadrao, setMetodoSaquePadrao] = useState<'pix' | 'ted' | 'boleto'>('pix');
  const [valorMinimoSaquePadrao, setValorMinimoSaquePadrao] = useState(50);
  const [diasProcessamentoSaque, setDiasProcessamentoSaque] = useState(7);
  const [asaasApiKey, setAsaasApiKey] = useState('');
  const [asaasEnvironment, setAsaasEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [asaasWebhookUrl, setAsaasWebhookUrl] = useState('');
  const [dominioAfiliado, setDominioAfiliado] = useState('maiscrianca.com');
  const [prefixoLink, setPrefixoLink] = useState('ref');
  const [aprovacaoAutomatica, setAprovacaoAutomatica] = useState(false);
  const [limiteVendasAprovacao, setLimiteVendasAprovacao] = useState(5);
  const [cookieExpiracao, setCookieExpiracao] = useState(30);
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (isOpen) {
      carregarConfiguracoes();
    }
  }, [isOpen]);

  const carregarConfiguracoes = async () => {
    setCarregando(true);
    try {
      const response = await fetch('/api/configuracoes-afiliados');
      if (response.ok) {
        const data = await response.json();
        const config = data.configuracao;
        
        if (config) {
          setConfiguracao(config);
          setTipoComissaoPadrao(config.tipoComissaoPadrao);
          setValorComissaoPadrao(config.valorComissaoPadrao);
          setTipoEventoComissaoPadrao(config.tipoEventoComissaoPadrao);
          setMetodoSaquePadrao(config.metodoSaquePadrao);
          setValorMinimoSaquePadrao(config.valorMinimoSaquePadrao);
          setDiasProcessamentoSaque(config.diasProcessamentoSaque);
          setAsaasApiKey(config.asaasApiKey);
          setAsaasEnvironment(config.asaasEnvironment);
          setAsaasWebhookUrl(config.asaasWebhookUrl);
          setDominioAfiliado(config.dominioAfiliado);
          setPrefixoLink(config.prefixoLink);
          setAprovacaoAutomatica(config.aprovacaoAutomatica);
          setLimiteVendasAprovacao(config.limiteVendasAprovacao);
          setCookieExpiracao(config.cookieExpiracao);
          setAtivo(config.ativo);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const dadosConfiguracao = {
        tipoComissaoPadrao,
        valorComissaoPadrao,
        tipoEventoComissaoPadrao,
        metodoSaquePadrao,
        valorMinimoSaquePadrao,
        diasProcessamentoSaque,
        asaasApiKey,
        asaasEnvironment,
        asaasWebhookUrl,
        dominioAfiliado,
        prefixoLink,
        aprovacaoAutomatica,
        limiteVendasAprovacao,
        cookieExpiracao,
        ativo,
      };

      let response;
      if (configuracao) {
        response = await fetch(`/api/configuracoes-afiliados/${configuracao.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosConfiguracao),
        });
      } else {
        response = await fetch('/api/configuracoes-afiliados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosConfiguracao),
        });
      }

      if (response.ok) {
        alert('Configurações salvas com sucesso!');
        await carregarConfiguracoes();
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-2">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Configurações Globais
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure as regras padrão do sistema de afiliados
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {carregando ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <Tabs defaultValue="comissoes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="comissoes" className="rounded-2xl">
                  <Percent size={16} className="mr-2" />
                  Comissões
                </TabsTrigger>
                <TabsTrigger value="saques" className="rounded-2xl">
                  <CreditCard size={16} className="mr-2" />
                  Saques
                </TabsTrigger>
                <TabsTrigger value="asaas" className="rounded-2xl">
                  <Zap size={16} className="mr-2" />
                  Asaas
                </TabsTrigger>
                <TabsTrigger value="geral" className="rounded-2xl">
                  <Settings size={16} className="mr-2" />
                  Geral
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comissoes">
                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Configurações de Comissão Padrão</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Tipo de Comissão Padrão</Label>
                        <Select value={tipoComissaoPadrao} onValueChange={(value: 'porcentagem' | 'fixo') => setTipoComissaoPadrao(value)}>
                          <SelectTrigger className="rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="porcentagem">Porcentagem</SelectItem>
                            <SelectItem value="fixo">Valor Fixo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Valor da Comissão Padrão</Label>
                        <Input
                          type="number"
                          value={valorComissaoPadrao}
                          onChange={(e) => setValorComissaoPadrao(Number(e.target.value))}
                          className="rounded-2xl"
                        />
                      </div>
                      <div>
                        <Label>Evento de Comissão Padrão</Label>
                        <Select value={tipoEventoComissaoPadrao} onValueChange={(value: 'acesso' | 'clique' | 'checkout' | 'cupom') => setTipoEventoComissaoPadrao(value)}>
                          <SelectTrigger className="rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acesso">Por Acesso</SelectItem>
                            <SelectItem value="clique">Por Clique</SelectItem>
                            <SelectItem value="checkout">Por Checkout (Recomendado)</SelectItem>
                            <SelectItem value="cupom">Por Cupom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saques">
                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Configurações de Saque Padrão</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Método de Saque Padrão</Label>
                        <Select value={metodoSaquePadrao} onValueChange={(value: 'pix' | 'ted' | 'boleto') => setMetodoSaquePadrao(value)}>
                          <SelectTrigger className="rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pix">PIX (Recomendado)</SelectItem>
                            <SelectItem value="ted">TED</SelectItem>
                            <SelectItem value="boleto">Boleto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Valor Mínimo para Saque (R$)</Label>
                        <Input
                          type="number"
                          value={valorMinimoSaquePadrao}
                          onChange={(e) => setValorMinimoSaquePadrao(Number(e.target.value))}
                          className="rounded-2xl"
                        />
                      </div>
                      <div>
                        <Label>Dias para Processamento</Label>
                        <Input
                          type="number"
                          value={diasProcessamentoSaque}
                          onChange={(e) => setDiasProcessamentoSaque(Number(e.target.value))}
                          className="rounded-2xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="asaas">
                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Integração com Asaas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>API Key do Asaas</Label>
                        <Input
                          type="password"
                          value={asaasApiKey}
                          onChange={(e) => setAsaasApiKey(e.target.value)}
                          placeholder="$aact_..."
                          className="rounded-2xl"
                        />
                      </div>
                      <div>
                        <Label>Ambiente</Label>
                        <Select value={asaasEnvironment} onValueChange={(value: 'sandbox' | 'production') => setAsaasEnvironment(value)}>
                          <SelectTrigger className="rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sandbox">Sandbox (Teste)</SelectItem>
                            <SelectItem value="production">Produção</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>URL do Webhook</Label>
                      <Input
                        value={asaasWebhookUrl}
                        onChange={(e) => setAsaasWebhookUrl(e.target.value)}
                        placeholder="https://seudominio.com/api/webhooks/asaas"
                        className="rounded-2xl"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="geral">
                <div className="space-y-6">
                  <Card className="rounded-3xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Configurações de Link de Afiliado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Domínio do Afiliado</Label>
                          <Input
                            value={dominioAfiliado}
                            onChange={(e) => setDominioAfiliado(e.target.value)}
                            className="rounded-2xl"
                          />
                        </div>
                        <div>
                          <Label>Prefixo do Link</Label>
                          <Input
                            value={prefixoLink}
                            onChange={(e) => setPrefixoLink(e.target.value)}
                            className="rounded-2xl"
                          />
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Exemplo de link:</strong> https://{dominioAfiliado}/{prefixoLink}/CODIGO_AFILIADO
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Configurações de Aprovação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aprovacao-automatica"
                          checked={aprovacaoAutomatica}
                          onCheckedChange={setAprovacaoAutomatica}
                        />
                        <Label htmlFor="aprovacao-automatica">Aprovação Automática de Afiliados</Label>
                      </div>
                      {!aprovacaoAutomatica && (
                        <div>
                          <Label>Limite de Vendas para Aprovação Automática</Label>
                          <Input
                            type="number"
                            value={limiteVendasAprovacao}
                            onChange={(e) => setLimiteVendasAprovacao(Number(e.target.value))}
                            className="rounded-2xl"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Outras Configurações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Expiração do Cookie (dias)</Label>
                        <Input
                          type="number"
                          value={cookieExpiracao}
                          onChange={(e) => setCookieExpiracao(Number(e.target.value))}
                          className="rounded-2xl"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sistema-ativo"
                          checked={ativo}
                          onCheckedChange={setAtivo}
                        />
                        <Label htmlFor="sistema-ativo">Sistema de Afiliados Ativo</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvar}
              disabled={salvando}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl"
            >
              <Save size={16} className="mr-2" />
              {salvando ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
