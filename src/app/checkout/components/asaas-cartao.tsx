'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Lock, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface AsaasCartaoProps {
  valor: number;
  onPagamentoConfirmado: () => void;
  onPagamentoError?: (error: string) => void;
  dadosCliente: {
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
  };
}

interface DadosCartao {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
  parcelas: number;
}

interface PagamentoCartaoResponse {
  success: boolean;
  data?: {
    id: string;
    status: string;
    value: number;
    installmentCount: number;
    installmentValue: number;
  };
  error?: string;
}

export function AsaasCartao({ valor, onPagamentoConfirmado, onPagamentoError, dadosCliente }: AsaasCartaoProps) {
  const [dadosCartao, setDadosCartao] = useState<DadosCartao>({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
    parcelas: 1
  });
  
  const [processando, setProcessando] = useState(false);
  const [erros, setErros] = useState<Partial<DadosCartao>>({});

  // Opções de parcelamento (sem juros até 3x, com juros após)
  const parcelasDisponiveis = [
    { valor: 1, texto: `1x de R$ ${valor.toFixed(2)} (sem juros)`, valorTotal: valor },
    { valor: 2, texto: `2x de R$ ${(valor / 2).toFixed(2)} (sem juros)`, valorTotal: valor },
    { valor: 3, texto: `3x de R$ ${(valor / 3).toFixed(2)} (sem juros)`, valorTotal: valor },
    { valor: 4, texto: `4x de R$ ${(valor * 1.0299 / 4).toFixed(2)} (com juros)`, valorTotal: valor * 1.0299 },
    { valor: 5, texto: `5x de R$ ${(valor * 1.0499 / 5).toFixed(2)} (com juros)`, valorTotal: valor * 1.0499 },
    { valor: 6, texto: `6x de R$ ${(valor * 1.0699 / 6).toFixed(2)} (com juros)`, valorTotal: valor * 1.0699 },
    { valor: 7, texto: `7x de R$ ${(valor * 1.0899 / 7).toFixed(2)} (com juros)`, valorTotal: valor * 1.0899 },
    { valor: 8, texto: `8x de R$ ${(valor * 1.1099 / 8).toFixed(2)} (com juros)`, valorTotal: valor * 1.1099 },
    { valor: 9, texto: `9x de R$ ${(valor * 1.1299 / 9).toFixed(2)} (com juros)`, valorTotal: valor * 1.1299 },
    { valor: 10, texto: `10x de R$ ${(valor * 1.1499 / 10).toFixed(2)} (com juros)`, valorTotal: valor * 1.1499 },
    { valor: 11, texto: `11x de R$ ${(valor * 1.1699 / 11).toFixed(2)} (com juros)`, valorTotal: valor * 1.1699 },
    { valor: 12, texto: `12x de R$ ${(valor * 1.1899 / 12).toFixed(2)} (com juros)`, valorTotal: valor * 1.1899 },
  ];

  const handleInputChange = (field: keyof DadosCartao, value: string | number) => {
    setDadosCartao(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (erros[field]) {
      setErros(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const formatarNumeroCartao = (numero: string) => {
    // Remove tudo que não é número
    const apenasNumeros = numero.replace(/\D/g, '');
    
    // Adiciona espaços a cada 4 dígitos
    const formatado = apenasNumeros.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatado.substring(0, 19); // Máximo 16 dígitos + 3 espaços
  };

  const formatarValidade = (validade: string) => {
    // Remove tudo que não é número
    const apenasNumeros = validade.replace(/\D/g, '');
    
    // Adiciona barra após os 2 primeiros dígitos
    if (apenasNumeros.length >= 2) {
      return apenasNumeros.substring(0, 2) + '/' + apenasNumeros.substring(2, 4);
    }
    
    return apenasNumeros;
  };

  const validarDados = (): boolean => {
    const novosErros: Partial<DadosCartao> = {};
    
    // Validar número do cartão (16 dígitos)
    const numeroLimpo = dadosCartao.numero.replace(/\D/g, '');
    if (!numeroLimpo || numeroLimpo.length !== 16) {
      novosErros.numero = 'Número do cartão deve ter 16 dígitos';
    }
    
    // Validar nome
    if (!dadosCartao.nome.trim()) {
      novosErros.nome = 'Nome do portador é obrigatório';
    }
    
    // Validar validade
    const validadeLimpa = dadosCartao.validade.replace(/\D/g, '');
    if (!validadeLimpa || validadeLimpa.length !== 4) {
      novosErros.validade = 'Validade deve ter formato MM/AA';
    } else {
      const mes = parseInt(validadeLimpa.substring(0, 2));
      const ano = parseInt('20' + validadeLimpa.substring(2, 4));
      const agora = new Date();
      const anoAtual = agora.getFullYear();
      const mesAtual = agora.getMonth() + 1;
      
      if (mes < 1 || mes > 12) {
        novosErros.validade = 'Mês inválido';
      } else if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
        novosErros.validade = 'Cartão expirado';
      }
    }
    
    // Validar CVV
    if (!dadosCartao.cvv || dadosCartao.cvv.length < 3) {
      novosErros.cvv = 'CVV deve ter 3 ou 4 dígitos';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const processarPagamento = async () => {
    if (!validarDados()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setProcessando(true);
    
    try {
      // Buscar itens do carrinho
      const itensCarrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
      
      // Calcular valor total com juros se houver
      const parcelaInfo = parcelasDisponiveis.find(p => p.valor === dadosCartao.parcelas);
      const valorTotal = parcelaInfo?.valorTotal || valor;

      const response = await fetch('/api/asaas/cartao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: valorTotal,
          dadosCliente,
          dadosCartao: {
            ...dadosCartao,
            numero: dadosCartao.numero.replace(/\D/g, ''), // Remove espaços
            validade: dadosCartao.validade.replace(/\D/g, '') // Remove barra
          },
          itens: itensCarrinho
        }),
      });

      const data: PagamentoCartaoResponse = await response.json();

      if (data.success && data.data) {
        toast.success('Pagamento processado com sucesso!');
        onPagamentoConfirmado();
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento';
      toast.error(errorMessage);
      onPagamentoError?.(errorMessage);
    } finally {
      setProcessando(false);
    }
  };

  const detectarBandeira = (numero: string): string => {
    const numeroLimpo = numero.replace(/\D/g, '');
    
    if (numeroLimpo.startsWith('4')) return 'Visa';
    if (numeroLimpo.startsWith('5') || numeroLimpo.startsWith('2')) return 'Mastercard';
    if (numeroLimpo.startsWith('3')) return 'American Express';
    if (numeroLimpo.startsWith('6')) return 'Elo';
    
    return 'Cartão';
  };

  const parcelaAtual = parcelasDisponiveis.find(p => p.valor === dadosCartao.parcelas);

  return (
    <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-[#ff007d]" />
          Pagamento com Cartão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Número do Cartão */}
          <div>
            <Label htmlFor="numero">Número do Cartão</Label>
            <div className="relative">
              <Input
                id="numero"
                value={dadosCartao.numero}
                onChange={(e) => handleInputChange('numero', formatarNumeroCartao(e.target.value))}
                placeholder="0000 0000 0000 0000"
                className={`mt-1 pl-10 ${erros.numero ? 'border-red-300' : ''}`}
                maxLength={19}
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {dadosCartao.numero && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs font-medium text-gray-600">
                    {detectarBandeira(dadosCartao.numero)}
                  </span>
                </div>
              )}
            </div>
            {erros.numero && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {erros.numero}
              </p>
            )}
          </div>

          {/* Nome do Portador */}
          <div>
            <Label htmlFor="nome">Nome do Portador</Label>
            <Input
              id="nome"
              value={dadosCartao.nome}
              onChange={(e) => handleInputChange('nome', e.target.value.toUpperCase())}
              placeholder="NOME COMO ESTÁ NO CARTÃO"
              className={`mt-1 ${erros.nome ? 'border-red-300' : ''}`}
            />
            {erros.nome && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {erros.nome}
              </p>
            )}
          </div>

          {/* Validade e CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="validade">Validade</Label>
              <Input
                id="validade"
                value={dadosCartao.validade}
                onChange={(e) => handleInputChange('validade', formatarValidade(e.target.value))}
                placeholder="MM/AA"
                className={`mt-1 ${erros.validade ? 'border-red-300' : ''}`}
                maxLength={5}
              />
              {erros.validade && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {erros.validade}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={dadosCartao.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                className={`mt-1 ${erros.cvv ? 'border-red-300' : ''}`}
                maxLength={4}
                type="password"
              />
              {erros.cvv && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {erros.cvv}
                </p>
              )}
            </div>
          </div>

          {/* Parcelas */}
          <div>
            <Label htmlFor="parcelas">Parcelamento</Label>
            <Select 
              value={dadosCartao.parcelas.toString()} 
              onValueChange={(value) => handleInputChange('parcelas', parseInt(value))}
            >
              <SelectTrigger className="mt-1 rounded-xl">
                <SelectValue placeholder="Selecione as parcelas" />
              </SelectTrigger>
              <SelectContent>
                {parcelasDisponiveis.map((parcela) => (
                  <SelectItem key={parcela.valor} value={parcela.valor.toString()}>
                    {parcela.texto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resumo do pagamento */}
        {parcelaAtual && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <h4 className="font-medium text-gray-900 mb-2">Resumo do pagamento</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">R$ {valor.toFixed(2)}</span>
              </div>
              {parcelaAtual.valorTotal > valor && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Juros ({dadosCartao.parcelas}x):</span>
                  <span className="text-gray-900">R$ {(parcelaAtual.valorTotal - valor).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-1 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">R$ {parcelaAtual.valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botão de Pagamento */}
        <Button
          onClick={processarPagamento}
          disabled={processando}
          className="w-full h-12 bg-[#ff007d] hover:bg-[#ff007d]/90 text-white font-medium rounded-2xl"
        >
          {processando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pagar R$ {parcelaAtual?.valorTotal.toFixed(2) || valor.toFixed(2)}
            </>
          )}
        </Button>

        {/* Segurança */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Pagamento 100% seguro</p>
              <p className="text-xs text-gray-600">
                Seus dados são protegidos com criptografia SSL de 256 bits
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
