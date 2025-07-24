'use client';

import { useState, useEffect } from 'react';
import { X, Settings, DollarSign, Calendar, Percent, CreditCard, Banknote, Smartphone, Building, Users, Target, MousePointer, ShoppingCart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AfiliadoDados } from './tabela-afiliados';

interface ModalConfiguracoes {
  isOpen: boolean;
  onClose: () => void;
  afiliado: AfiliadoDados | null;
  onSalvar: (configuracoes: ConfiguracoesAfiliado) => void;
}

interface ConfiguracoesAfiliado {
  // Configurações de Comissão
  tipoEventoComissao: 'acesso' | 'clique' | 'checkout' | 'cupom';
  tipoComissao: 'porcentagem' | 'fixo';
  valorComissao: number;
  
  // Configurações de Saque
  valorMinimoSaque: number;
  diasCarencia: number;
  metodoPagamentoPreferido: 'pix' | 'transferencia' | 'conta_digital';
  pixChave?: string;
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
  
  // Configurações Avançadas
  linkPersonalizado?: string;
  grupoAfiliado?: string;
  limiteMensalSaque?: number;
  ativo: boolean;
  observacoes?: string;
}

export function ModalConfiguracoes({ isOpen, onClose, afiliado, onSalvar }: ModalConfiguracoes) {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesAfiliado>({
    tipoEventoComissao: 'checkout',
    tipoComissao: 'porcentagem',
    valorComissao: 10,
    valorMinimoSaque: 50,
    diasCarencia: 7,
    metodoPagamentoPreferido: 'pix',
    ativo: true
  });

  const [activeTab, setActiveTab] = useState('comissao');

  useEffect(() => {
    if (afiliado) {
      setConfiguracoes({
        tipoEventoComissao: 'checkout',
        tipoComissao: afiliado.tipoComissao as 'porcentagem' | 'fixo',
        valorComissao: afiliado.valorComissao,
        valorMinimoSaque: 50,
        diasCarencia: 7,
        metodoPagamentoPreferido: 'pix',
        ativo: afiliado.ativo,
        observacoes: afiliado.observacoes || ''
      });
    }
  }, [afiliado]);

  const handleSalvar = () => {
    onSalvar(configuracoes);
    onClose();
  };

  if (!isOpen || !afiliado) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-[#27b99a] to-[#239d84] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Settings size={24} />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Configurações do Afiliado</CardTitle>
                <p className="text-white/80 text-sm">{afiliado.nome} - {afiliado.codigoAfiliado}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl h-8 w-8 p-0"
            >
              <X size={18} />
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
                <TabsTrigger 
                  value="comissao" 
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#27b99a] font-medium"
                >
                  <DollarSign size={16} className="mr-2" />
                  Comissão
                </TabsTrigger>
                <TabsTrigger 
                  value="saque" 
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#27b99a] font-medium"
                >
                  <CreditCard size={16} className="mr-2" />
                  Saque
                </TabsTrigger>
                <TabsTrigger 
                  value="grupos" 
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#27b99a] font-medium"
                >
                  <Users size={16} className="mr-2" />
                  Grupos
                </TabsTrigger>
                <TabsTrigger 
                  value="avancado" 
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#27b99a] font-medium"
                >
                  <Settings size={16} className="mr-2" />
                  Avançado
                </TabsTrigger>
              </TabsList>

              {/* Tab Comissão */}
              <TabsContent value="comissao" className="space-y-6 mt-6">
                <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target size={20} className="text-[#27b99a]" />
                      Configurações de Comissão
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Evento para Comissão</Label>
                        <Select 
                          value={configuracoes.tipoEventoComissao} 
                          onValueChange={(value: any) => setConfiguracoes({...configuracoes, tipoEventoComissao: value})}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="acesso" className="rounded-lg">
                              <div className="flex items-center gap-2">
                                <MousePointer size={16} />
                                Por Acesso
                              </div>
                            </SelectItem>
                            <SelectItem value="clique" className="rounded-lg">
                              <div className="flex items-center gap-2">
                                <MousePointer size={16} />
                                Por Clique
                              </div>
                            </SelectItem>
                            <SelectItem value="checkout" className="rounded-lg">
                              <div className="flex items-center gap-2">
                                <ShoppingCart size={16} />
                                Por Checkout (Padrão)
                              </div>
                            </SelectItem>
                            <SelectItem value="cupom" className="rounded-lg">
                              <div className="flex items-center gap-2">
                                <Gift size={16} />
                                Por Cupom
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo de Comissão</Label>
                        <Select 
                          value={configuracoes.tipoComissao} 
                          onValueChange={(value: any) => setConfiguracoes({...configuracoes, tipoComissao: value})}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="porcentagem" className="rounded-lg">
                              <div className="flex items-center gap-2">
                                <Percent size={16} />
                                Porcentagem
                              </div>
                            </SelectItem>
                            <SelectItem value="fixo" className="rounded-lg">
                              <div className="flex items-center gap-2">
                                <Banknote size={16} />
                                Valor Fixo
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Valor da Comissão 
                        {configuracoes.tipoComissao === 'porcentagem' ? '(%)' : '(R$)'}
                      </Label>
                      <Input
                        type="number"
                        step={configuracoes.tipoComissao === 'porcentagem' ? '0.1' : '0.01'}
                        value={configuracoes.valorComissao}
                        onChange={(e) => setConfiguracoes({...configuracoes, valorComissao: parseFloat(e.target.value) || 0})}
                        className="rounded-xl"
                        placeholder={configuracoes.tipoComissao === 'porcentagem' ? '10' : '50.00'}
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Simulação de Comissão</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Para uma venda de R$ 100,00, o afiliado receberá:{' '}
                        <span className="font-semibold">
                          {configuracoes.tipoComissao === 'porcentagem' 
                            ? `R$ ${(100 * configuracoes.valorComissao / 100).toFixed(2)}`
                            : `R$ ${configuracoes.valorComissao.toFixed(2)}`
                          }
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Saque */}
              <TabsContent value="saque" className="space-y-6 mt-6">
                <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard size={20} className="text-[#27b99a]" />
                      Configurações de Saque
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valor Mínimo para Saque (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={configuracoes.valorMinimoSaque}
                          onChange={(e) => setConfiguracoes({...configuracoes, valorMinimoSaque: parseFloat(e.target.value) || 0})}
                          className="rounded-xl"
                          placeholder="50.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Dias de Carência</Label>
                        <Input
                          type="number"
                          value={configuracoes.diasCarencia}
                          onChange={(e) => setConfiguracoes({...configuracoes, diasCarencia: parseInt(e.target.value) || 0})}
                          className="rounded-xl"
                          placeholder="7"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Método de Pagamento Preferido</Label>
                      <Select 
                        value={configuracoes.metodoPagamentoPreferido} 
                        onValueChange={(value: any) => setConfiguracoes({...configuracoes, metodoPagamentoPreferido: value})}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="pix" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <Smartphone size={16} />
                              PIX
                            </div>
                          </SelectItem>
                          <SelectItem value="transferencia" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <Building size={16} />
                              Transferência Bancária
                            </div>
                          </SelectItem>
                          <SelectItem value="conta_digital" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <CreditCard size={16} />
                              Conta Digital
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {configuracoes.metodoPagamentoPreferido === 'pix' && (
                      <div className="space-y-2">
                        <Label>Chave PIX</Label>
                        <Input
                          value={configuracoes.pixChave || ''}
                          onChange={(e) => setConfiguracoes({...configuracoes, pixChave: e.target.value})}
                          className="rounded-xl"
                          placeholder="email@exemplo.com ou CPF ou telefone"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Grupos */}
              <TabsContent value="grupos" className="space-y-6 mt-6">
                <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users size={20} className="text-[#27b99a]" />
                      Grupos de Afiliados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Grupo do Afiliado</Label>
                      <Select 
                        value={configuracoes.grupoAfiliado || ''} 
                        onValueChange={(value) => setConfiguracoes({...configuracoes, grupoAfiliado: value})}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecione um grupo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="" className="rounded-lg">Nenhum grupo</SelectItem>
                          <SelectItem value="premium" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-800 border-0">Premium</Badge>
                              Afiliados Premium
                            </div>
                          </SelectItem>
                          <SelectItem value="iniciante" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 border-0">Iniciante</Badge>
                              Afiliados Iniciantes
                            </div>
                          </SelectItem>
                          <SelectItem value="vip" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-purple-100 text-purple-800 border-0">VIP</Badge>
                              Afiliados VIP
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-medium mb-2">Configurações do Grupo</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        As configurações individuais sobrescrevem as configurações do grupo.
                        Configurações globais são aplicadas quando não há configuração específica.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Avançado */}
              <TabsContent value="avancado" className="space-y-6 mt-6">
                <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings size={20} className="text-[#27b99a]" />
                      Configurações Avançadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <Label className="text-base">Status do Afiliado</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Afiliado pode gerar comissões quando ativo
                        </p>
                      </div>
                      <Switch
                        checked={configuracoes.ativo}
                        onCheckedChange={(checked) => setConfiguracoes({...configuracoes, ativo: checked})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Link Personalizado (Opcional)</Label>
                      <Input
                        value={configuracoes.linkPersonalizado || ''}
                        onChange={(e) => setConfiguracoes({...configuracoes, linkPersonalizado: e.target.value})}
                        className="rounded-xl"
                        placeholder="https://meusite.com/ref/codigo-personalizado"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Limite Mensal de Saque (R$) - Opcional</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={configuracoes.limiteMensalSaque || ''}
                        onChange={(e) => setConfiguracoes({...configuracoes, limiteMensalSaque: parseFloat(e.target.value) || undefined})}
                        className="rounded-xl"
                        placeholder="1000.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={configuracoes.observacoes || ''}
                        onChange={(e) => setConfiguracoes({...configuracoes, observacoes: e.target.value})}
                        className="rounded-xl resize-none"
                        rows={4}
                        placeholder="Observações internas sobre o afiliado..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl border-gray-300 dark:border-gray-600"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSalvar}
              className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Salvar Configurações
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
