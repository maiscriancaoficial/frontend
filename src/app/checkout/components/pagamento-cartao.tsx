'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Lock, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface PagamentoCartaoProps {
  valor: number;
  onPagamentoConfirmado: () => void;
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

export function PagamentoCartao({ valor, onPagamentoConfirmado, dadosCliente }: PagamentoCartaoProps) {
  const [dadosCartao, setDadosCartao] = useState<DadosCartao>({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
    parcelas: 1
  });
  
  const [processando, setProcessando] = useState(false);
  const [erros, setErros] = useState<Partial<DadosCartao>>({});

  // Opções de parcelamento (sem juros até 3x)
  const parcelasDisponiveis = [
    { valor: 1, texto: `1x de R$ ${valor.toFixed(2)} (sem juros)` },
    { valor: 2, texto: `2x de R$ ${(valor / 2).toFixed(2)} (sem juros)` },
    { valor: 3, texto: `3x de R$ ${(valor / 3).toFixed(2)} (sem juros)` },
    { valor: 4, texto: `4x de R$ ${(valor * 1.05 / 4).toFixed(2)} (com juros)` },
    { valor: 5, texto: `5x de R$ ${(valor * 1.08 / 5).toFixed(2)} (com juros)` },
    { valor: 6, texto: `6x de R$ ${(valor * 1.12 / 6).toFixed(2)} (com juros)` },
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
      toast.error('Verifique os dados do cartão');
      return;
    }

    setProcessando(true);
    
    try {
      const valorFinal = dadosCartao.parcelas > 3 ? 
        valor * (1 + (dadosCartao.parcelas - 3) * 0.03) : // 3% de juros por parcela acima de 3
        valor;

      const response = await fetch('/api/pagamentos/cartao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(valorFinal * 100), // Pagar.me usa centavos
          card: {
            number: dadosCartao.numero.replace(/\D/g, ''),
            holder_name: dadosCartao.nome,
            exp_month: dadosCartao.validade.substring(0, 2),
            exp_year: '20' + dadosCartao.validade.substring(3, 5),
            cvv: dadosCartao.cvv
          },
          customer: {
            name: dadosCliente.nome,
            email: dadosCliente.email,
            phone: dadosCliente.telefone.replace(/\D/g, ''),
            document: dadosCliente.cpf?.replace(/\D/g, '') || '',
            type: 'individual'
          },
          installments: dadosCartao.parcelas,
          metadata: {
            produto: 'Livro Personalizado',
            valor_original: valor,
            parcelas: dadosCartao.parcelas
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar pagamento');
      }

      const data = await response.json();
      
      if (data.status === 'paid') {
        toast.success('Pagamento aprovado!', {
          description: 'Seu pedido foi processado com sucesso.',
        });
        onPagamentoConfirmado();
      } else if (data.status === 'refused') {
        toast.error('Pagamento recusado', {
          description: 'Verifique os dados do cartão ou tente outro cartão.',
        });
      } else {
        toast.error('Erro no pagamento', {
          description: 'Tente novamente ou use outro método.',
        });
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento', {
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
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
    
    return '';
  };

  return (
    <Card className="border border-[#ff007d] bg-white shadow-sm rounded-2xl">
      <CardContent className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-[#ff007d]" />
          <div>
            <h3 className="font-semibold text-gray-900">Cartão de Crédito</h3>
            <p className="text-sm text-gray-600">Valor: R$ {valor.toFixed(2)}</p>
          </div>
        </div>

        {/* Formulário */}
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
                className={`mt-1 pr-20 ${erros.numero ? 'border-red-300' : ''}`}
                maxLength={19}
              />
              {detectarBandeira(dadosCartao.numero) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
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
              <SelectTrigger className="mt-1">
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

        {/* Botão de Pagamento */}
        <Button
          onClick={processarPagamento}
          disabled={processando}
          className="w-full h-12 bg-[#ff007d] hover:bg-[#ff007d]/90 text-white font-medium"
        >
          {processando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pagar R$ {(dadosCartao.parcelas > 3 ? valor * (1 + (dadosCartao.parcelas - 3) * 0.03) : valor).toFixed(2)}
            </>
          )}
        </Button>

        {/* Segurança */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-600" />
            <p className="text-xs text-gray-600">
              Seus dados estão protegidos com criptografia SSL
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
