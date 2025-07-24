'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, ArrowRight, CheckCircle2, Copy, RefreshCcw, CreditCard as CardIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputSuave } from "./input-suave";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetodoPagamentoProps {
  valorTotal: number;
  onMetodoSelecionado: (metodo: 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO') => void;
}

export function MetodoPagamento({ valorTotal, onMetodoSelecionado }: MetodoPagamentoProps) {
  const [metodoAtual, setMetodoAtual] = useState<'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO'>('PIX');
  const [copiouPix, setCopiouPix] = useState(false);
  const [carregandoPix, setCarregandoPix] = useState(false);
  const [pixGerado, setPixGerado] = useState(false);
  
  // Parcelas para cartão de crédito
  const [parcela, setParcela] = useState(1);
  const parcelasDisponiveis = [
    { valor: 1, texto: '1x de R$ ' + valorTotal.toFixed(2) + ' (sem juros)' },
    { valor: 2, texto: '2x de R$ ' + (valorTotal / 2).toFixed(2) + ' (sem juros)' },
    { valor: 3, texto: '3x de R$ ' + (valorTotal / 3).toFixed(2) + ' (sem juros)' },
    { valor: 4, texto: '4x de R$ ' + (valorTotal / 4).toFixed(2) + ' (sem juros)' },
    { valor: 5, texto: '5x de R$ ' + (valorTotal / 5).toFixed(2) + ' (sem juros)' },
    { valor: 6, texto: '6x de R$ ' + (valorTotal / 6).toFixed(2) + ' (sem juros)' },
    { valor: 7, texto: '7x de R$ ' + (valorTotal / 7).toFixed(2) + ' (sem juros)' },
    { valor: 8, texto: '8x de R$ ' + (valorTotal / 8).toFixed(2) + ' (sem juros)' },
    { valor: 9, texto: '9x de R$ ' + (valorTotal / 9).toFixed(2) + ' (sem juros)' },
    { valor: 10, texto: '10x de R$ ' + (valorTotal / 10).toFixed(2) + ' (sem juros)' },
    { valor: 11, texto: '11x de R$ ' + (valorTotal / 11).toFixed(2) + ' (sem juros)' },
    { valor: 12, texto: '12x de R$ ' + (valorTotal / 12).toFixed(2) + ' (sem juros)' },
  ];
  
  // Dados do cartão
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Formatar número do cartão
  const formatarNumeroCartao = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digitsOnly.length; i += 4) {
      groups.push(digitsOnly.substr(i, 4));
    }
    
    return groups.join(' ').substr(0, 19);
  };
  
  // Formatar data de validade
  const formatarDataValidade = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length <= 2) {
      return digitsOnly;
    }
    
    const month = digitsOnly.substr(0, 2);
    const year = digitsOnly.substr(2, 2);
    return `${month}/${year}`;
  };

  // Gerar código PIX (simulado)
  const gerarCodigoPix = () => {
    setCarregandoPix(true);
    setTimeout(() => {
      setCarregandoPix(false);
      setPixGerado(true);
    }, 2000);
  };

  // Copiar código PIX
  const copiarCodigoPix = () => {
    navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX0136b76d3abc-fake-pix-code-123456789012345678901234');
    setCopiouPix(true);
    setTimeout(() => setCopiouPix(false), 3000);
  };

  // Lidar com mudança de método
  const handleMetodoChange = (value: string) => {
    const metodo = value as 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';
    setMetodoAtual(metodo);
    onMetodoSelecionado(metodo);
  };

  return (
    <Card className="shadow-lg border-0 rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] p-6 text-white shadow-sm rounded-t-3xl">
        <motion.div 
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-white/20 shadow-inner border border-white/30">
              <AvatarFallback className="text-white">
                <CreditCard className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-lg">Método de Pagamento</h3>
              <p className="text-sm text-white/80">Escolha como deseja pagar seu pedido</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <CardContent className="p-6 pt-8">
        <Tabs defaultValue="PIX" onValueChange={handleMetodoChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 shadow-sm rounded-full bg-gray-50 dark:bg-gray-900/40 p-1 border border-[#27b99a]/20 dark:border-[#27b99a]/30">
            <TabsTrigger value="PIX" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff0080] data-[state=active]:to-[#ff0080]/90 data-[state=active]:text-white rounded-full">
              <div className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />
                <span>PIX</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="CARTAO_CREDITO" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff0080] data-[state=active]:to-[#ff0080]/90 data-[state=active]:text-white rounded-full">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span>Cartão de Crédito</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="CARTAO_DEBITO" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff0080] data-[state=active]:to-[#ff0080]/90 data-[state=active]:text-white rounded-full">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span>Cartão de Débito</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="PIX" className="mt-0">
            <div className="border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 bg-gradient-to-b from-white to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/10 flex flex-col items-center shadow-sm">
              {!pixGerado ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center text-center space-y-4 w-full"
                >
                  <div className="h-20 w-20 rounded-full bg-[#ff0080]/10 dark:bg-[#ff0080]/20 flex items-center justify-center mb-2">
                    <Wallet className="h-10 w-10 text-[#ff0080]" />
                  </div>
                  <h3 className="text-xl font-medium">Pagamento Instantâneo</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Pague instantaneamente utilizando o PIX. 
                    Gere um código QR e escaneie com seu aplicativo bancário.
                  </p>
                  <div className="text-2xl font-bold text-[#ff0080] mt-2">
                    R$ {valorTotal.toFixed(2)}
                  </div>
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-[#ff0080] to-[#ff0080]/90 hover:from-[#ff0080] hover:to-[#ff0080]/80 text-white rounded-full h-14 font-medium shadow-md hover:shadow-lg transition-all" 
                    onClick={gerarCodigoPix}
                    disabled={carregandoPix}
                  >
                    {carregandoPix ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Gerando PIX...
                      </div>
                    ) : (
                      <>
                        Gerar código PIX
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full space-y-6"
                >
                  <div className="flex items-center justify-center bg-[#ff0080]/10 dark:bg-[#ff0080]/20 rounded-full p-2">
                    <CheckCircle2 className="h-8 w-8 text-[#ff0080]" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-medium">Código PIX gerado</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Copie o código abaixo ou escaneie o QR code
                    </p>
                  </div>
                  
                  {/* QR Code (imagem simulada) */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="h-48 w-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded flex items-center justify-center">
                      <div className="text-sm text-gray-400">QR Code simulado</div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="relative">
                      <InputSuave
                        value="00020126580014BR.GOV.BCB.PIX0136b76d3abc-fake-pix-code-1234"
                        readOnly
                        className="pr-16 font-mono text-sm text-center py-5"
                      />
                      <Button
                        onClick={copiarCodigoPix}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-[#ff0080] text-white hover:bg-[#ff0080]/90"
                        size="sm"
                      >
                        {copiouPix ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" /> Copiar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Valor a pagar:
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      R$ {valorTotal.toFixed(2)}
                    </div>
                  </div>

                  <Button
                    onClick={() => setPixGerado(false)}
                    variant="outline"
                    className="flex items-center"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Gerar novo código
                  </Button>
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="CARTAO_CREDITO" className="mt-0">
            <div className="border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 bg-gradient-to-b from-white to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/10 shadow-sm">
              <div className="space-y-6">
                {/* Número do cartão */}
                <div className="space-y-2">
                  <Label htmlFor="numeroCartao" className="text-sm font-medium flex items-center gap-1.5">
                    <CardIcon className="h-4 w-4 text-[#27b99a]" />
                    Número do cartão
                  </Label>
                  <InputSuave
                    id="numeroCartao"
                    value={numeroCartao}
                    onChange={(e) => setNumeroCartao(formatarNumeroCartao(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="font-mono rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                  />
                </div>
                
                {/* Nome do titular */}
                <div className="space-y-2">
                  <Label htmlFor="nomeTitular" className="text-sm font-medium flex items-center gap-1.5">
                    <CardIcon className="h-4 w-4 text-[#27b99a]" />
                    Nome do titular (como está no cartão)
                  </Label>
                  <InputSuave
                    id="nomeTitular"
                    value={nomeTitular}
                    onChange={(e) => setNomeTitular(e.target.value.toUpperCase())}
                    placeholder="NOME COMPLETO"
                    className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Data de validade */}
                  <div className="space-y-2">
                    <Label htmlFor="dataValidade" className="text-sm font-medium flex items-center gap-1.5">
                      <CardIcon className="h-4 w-4 text-[#27b99a]" />
                      Data de validade
                    </Label>
                    <InputSuave
                      id="dataValidade"
                      value={dataValidade}
                      onChange={(e) => setDataValidade(formatarDataValidade(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="font-mono rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                    />
                  </div>
                  
                  {/* CVV */}
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-sm font-medium flex items-center gap-1.5">
                      <CardIcon className="h-4 w-4 text-[#27b99a]" />
                      CVV
                    </Label>
                    <InputSuave
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="000"
                      maxLength={4}
                      className="font-mono rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                    />
                  </div>
                </div>
                
                {/* Parcelas */}
                <div className="space-y-2">
                  <Label htmlFor="parcelas" className="text-sm font-medium flex items-center gap-1.5">
                    <CardIcon className="h-4 w-4 text-[#27b99a]" />
                    Parcelas
                  </Label>
                  <select
                    id="parcelas"
                    value={parcela}
                    onChange={(e) => setParcela(parseInt(e.target.value))}
                    className="flex h-14 w-full rounded-full border border-gray-200 dark:border-gray-700 bg-background px-5 py-2 text-sm appearance-none shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f29798] focus-visible:ring-offset-1"
                  >
                    {parcelasDisponiveis.map((p) => (
                      <option key={p.valor} value={p.valor}>
                        {p.texto}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="CARTAO_DEBITO" className="mt-0">
            <div className="border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 bg-gradient-to-b from-white to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/10 shadow-sm">
              <div className="space-y-6">
                {/* Número do cartão */}
                <div className="space-y-2">
                  <Label htmlFor="numeroCartaoDebito" className="text-sm font-medium flex items-center gap-1.5">
                    <CardIcon className="h-4 w-4 text-[#27b99a]" />
                    Número do cartão
                  </Label>
                  <InputSuave
                    id="numeroCartaoDebito"
                    value={numeroCartao}
                    onChange={(e) => setNumeroCartao(formatarNumeroCartao(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="font-mono rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                  />
                </div>
                
                {/* Nome do titular */}
                <div className="space-y-2">
                  <Label htmlFor="nomeTitularDebito" className="text-sm font-medium flex items-center gap-1.5">
                    <CardIcon className="h-4 w-4 text-[#27b99a]" />
                    Nome do titular (como está no cartão)
                  </Label>
                  <InputSuave
                    id="nomeTitularDebito"
                    value={nomeTitular}
                    onChange={(e) => setNomeTitular(e.target.value.toUpperCase())}
                    placeholder="NOME COMPLETO"
                    className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Data de validade */}
                  <div className="space-y-2">
                    <Label htmlFor="dataValidadeDebito" className="text-sm font-medium flex items-center gap-1.5">
                      <CardIcon className="h-4 w-4 text-[#27b99a]" />
                      Data de validade
                    </Label>
                    <InputSuave
                      id="dataValidadeDebito"
                      value={dataValidade}
                      onChange={(e) => setDataValidade(formatarDataValidade(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="font-mono rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                    />
                  </div>
                  
                  {/* CVV */}
                  <div className="space-y-2">
                    <Label htmlFor="cvvDebito" className="text-sm font-medium flex items-center gap-1.5">
                      <CardIcon className="h-4 w-4 text-[#27b99a]" />
                      CVV
                    </Label>
                    <InputSuave
                      id="cvvDebito"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="000"
                      maxLength={4}
                      className="font-mono rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                    />
                  </div>
                </div>
                
                {/* Valor à vista */}
                <div className="mt-6 text-center p-6 bg-gradient-to-r from-[#ff0080]/10 to-[#ff0080]/5 rounded-2xl border border-[#ff0080]/20 shadow-inner">
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Valor à vista</div>
                  <div className="text-2xl font-bold text-[#ff0080]">
                    R$ {valorTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
