'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { AsaasPIX } from './components/asaas-pix';
import { AsaasCartao } from './components/asaas-cartao';
import { DetalhesPersonalizacao } from './components/detalhes-personalizacao';


interface DadosCliente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

// Funções auxiliares para trabalhar com diferentes tipos de itens
function getTitulo(item: any): string {
  return item.titulo || item.livroNome || item.produto?.titulo || 'Item sem título';
}

function getPreco(item: any): number {
  return item.preco || item.livroPreco || item.produto?.preco || 0;
}

function getPrecoPromocional(item: any): number | null {
  return item.precoPromocional || item.livroPrecoPromocional || item.produto?.precoPromocional || null;
}

function getImagem(item: any): string {
  return item.fotoPrincipal || item.livroCapa || item.produto?.fotoPrincipal || '/images/placeholder.jpg';
}

function getId(item: any): string {
  return item.id || item.produto?.id?.toString() || '';
}

function getPrecoTotal(item: any): number {
  if (item.precoTotal) return item.precoTotal;
  const preco = getPrecoPromocional(item) || getPreco(item);
  const quantidade = item.quantidade || 1;
  return preco * quantidade;
}

export default function CheckoutPage() {
  const [itens, setItens] = useState<any[]>([]);
  const [dadosCliente, setDadosCliente] = useState<DadosCliente>({
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  });
  const [metodoPagamento, setMetodoPagamento] = useState<'PIX' | 'CARTAO'>('PIX');
  const [processando, setProcessando] = useState(false);
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [desconto, setDesconto] = useState(0);
  const router = useRouter();

  // Estados para controlar o fluxo progressivo
  const [dadosCompletos, setDadosCompletos] = useState(false);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);

  useEffect(() => {
    // Carregar dados do localStorage como a página do carrinho
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho) {
      const itensCarrinho = JSON.parse(carrinho);
      setItens(itensCarrinho);
      
      // Se carrinho vazio, redirecionar
      if (itensCarrinho.length === 0) {
        toast.error('Seu carrinho está vazio!');
        router.push('/carrinho');
      }
    } else {
      // Se não há carrinho, redirecionar
      toast.error('Seu carrinho está vazio!');
      router.push('/carrinho');
    }
  }, [router]);

  // Funções de cálculo locais
  const calcularSubtotal = () => {
    return itens.reduce((total, item) => {
      const preco = getPrecoPromocional(item) || getPreco(item);
      const quantidade = item.quantidade || 1;
      return total + (preco * quantidade);
    }, 0);
  };

  const calcularDesconto = () => {
    return desconto;
  };

  // Calcular valores
  const subtotal = calcularSubtotal();
  const valorDesconto = calcularDesconto();
  const total = subtotal - valorDesconto;

  const handleDadosChange = (field: keyof DadosCliente, value: string) => {
    const novosDados = {
      ...dadosCliente,
      [field]: value
    };
    setDadosCliente(novosDados);
    
    // Verificar se dados obrigatórios estão preenchidos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dadosObrigatoriosPreenchidos = 
      novosDados.nome.trim() !== '' && 
      novosDados.email.trim() !== '' && 
      emailRegex.test(novosDados.email) &&
      novosDados.telefone.trim() !== '';
    
    setDadosCompletos(dadosObrigatoriosPreenchidos);
    
    // Se dados completos, mostrar método de pagamento após um delay
    if (dadosObrigatoriosPreenchidos && !mostrarPagamento) {
      setTimeout(() => {
        setMostrarPagamento(true);
      }, 500);
    } else if (!dadosObrigatoriosPreenchidos) {
      setMostrarPagamento(false);
    }
  };

  const aplicarCupom = () => {
    // Simulação de cupons válidos
    const cuponsValidos = [
      { codigo: "FLORES10", desconto: 0.1 },
      { codigo: "BEMVINDO20", desconto: 0.2 },
      { codigo: "FRETE", desconto: 0.05 },
    ];
    
    const cupomValido = cuponsValidos.find(c => c.codigo === cupom.toUpperCase());
    
    if (cupomValido) {
      const valorDesconto = subtotal * cupomValido.desconto;
      setDesconto(valorDesconto);
      setCupomAplicado(true);
      toast.success(`Cupom ${cupom.toUpperCase()} aplicado com sucesso!`);
    } else {
      toast.error('Cupom inválido ou expirado');
    }
  };

  const validarDados = () => {
    if (!dadosCliente.nome || !dadosCliente.email || !dadosCliente.telefone) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dadosCliente.email)) {
      toast.error('Email inválido');
      return false;
    }
    
    return true;
  };

  const finalizarCompra = async () => {
    if (!validarDados()) return;
    
    setProcessando(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpar carrinho
      localStorage.removeItem('carrinho');
      
      toast.success('Pedido realizado com sucesso!', {
        description: 'Você receberá as instruções por email.',
        duration: 5000,
      });
      
      // Redirecionar após sucesso
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  if (itens.length === 0) {
    return (
      <SiteLayout>
        <div className="container mx-auto py-16 px-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Carrinho Vazio</h1>
          <p className="text-gray-500 mb-6">Adicione alguns livros ao seu carrinho para continuar.</p>
          <Button onClick={() => router.push('/')} className="bg-[#ff007d] hover:bg-[#ff007d]/90">
            Explorar Livros
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/carrinho')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Carrinho
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <h1 className="text-2xl font-semibold text-gray-900">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário - 2 colunas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Cliente */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  Dados do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={dadosCliente.nome}
                      onChange={(e) => handleDadosChange('nome', e.target.value)}
                      placeholder="Seu nome completo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={dadosCliente.email}
                      onChange={(e) => handleDadosChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={dadosCliente.telefone}
                      onChange={(e) => handleDadosChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF (opcional)</Label>
                    <Input
                      id="cpf"
                      value={dadosCliente.cpf}
                      onChange={(e) => handleDadosChange('cpf', e.target.value)}
                      placeholder="000.000.000-00"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicador de Progresso */}
            {dadosCompletos && !mostrarPagamento && (
              <Card className="border border-green-200 bg-green-50 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Dados validados com sucesso!</p>
                      <p className="text-sm text-green-600">Carregando opções de pagamento...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seleção de Método - Só aparece quando dados estão completos */}
            {mostrarPagamento && (
              <Card className="border border-gray-200 shadow-sm animate-in slide-in-from-top-4 duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={metodoPagamento}
                    onValueChange={(value) => setMetodoPagamento(value as 'PIX' | 'CARTAO')}
                    className="space-y-3"
                  >
                    <div 
                      className={`flex items-center space-x-3 p-4 border rounded-2xl transition-all cursor-pointer ${
                        metodoPagamento === 'PIX' 
                          ? 'border-[#27b99a] bg-[#27b99a]/5 ring-2 ring-[#27b99a]/20' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setMetodoPagamento('PIX')}
                    >
                      <RadioGroupItem value="PIX" id="pix" className="text-[#27b99a]" />
                      <Smartphone className="h-5 w-5 text-[#27b99a]" />
                      <div className="flex-1">
                        <Label htmlFor="pix" className="font-medium cursor-pointer">PIX</Label>
                        <p className="text-sm text-gray-500">Pagamento instantâneo</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Recomendado
                      </Badge>
                    </div>
                    
                    <div 
                      className={`flex items-center space-x-3 p-4 border rounded-2xl transition-all cursor-pointer ${
                        metodoPagamento === 'CARTAO' 
                          ? 'border-[#ff007d] bg-[#ff007d]/5 ring-2 ring-[#ff007d]/20' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setMetodoPagamento('CARTAO')}
                    >
                      <RadioGroupItem value="CARTAO" id="cartao" className="text-[#ff007d]" />
                      <CreditCard className="h-5 w-5 text-[#ff007d]" />
                      <div className="flex-1">
                        <Label htmlFor="cartao" className="font-medium cursor-pointer">Cartão de Crédito</Label>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Elo</p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Formulário de Pagamento - Expande quando método selecionado */}
            {mostrarPagamento && metodoPagamento === 'PIX' && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <AsaasPIX
                  valor={total}
                  dadosCliente={dadosCliente}
                  onPagamentoConfirmado={finalizarCompra}
                  onPagamentoError={(error) => {
                    console.error('Erro no pagamento PIX:', error);
                    toast.error(error);
                  }}
                />
              </div>
            )}

            {mostrarPagamento && metodoPagamento === 'CARTAO' && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <AsaasCartao
                  valor={total}
                  dadosCliente={dadosCliente}
                  onPagamentoConfirmado={finalizarCompra}
                  onPagamentoError={(error) => {
                    console.error('Erro no pagamento Cartão:', error);
                    toast.error(error);
                  }}
                />
              </div>
            )}
          </div>

          {/* Resumo - 1 coluna */}
          <div className="space-y-6">
            {/* Itens do Pedido */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  Seus Livros ({itens.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {itens.map((item, index) => (
                  <div key={`${getId(item)}-${index}`} className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={getImagem(item)}
                          alt={getTitulo(item)}
                          width={64}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                          {getTitulo(item)}
                        </h4>
                        {(item.personalizacao || item.nomePersonagem) && (
                          <p className="text-xs text-gray-500 mt-1">
                            Personagem: {item.personalizacao?.nomePersonagem || item.nomePersonagem} ({item.personalizacao?.genero || item.tipo})
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            Qtd: {item.quantidade || 1}
                          </span>
                          <span className="font-medium text-sm">
                            R$ {getPrecoTotal(item).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Detalhes da personalização */}
                    {item.personalizacao && (
                      <DetalhesPersonalizacao item={item} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cupom */}
            {!cupomAplicado && (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                  <Label className="text-sm font-medium">Cupom de Desconto</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={cupom}
                      onChange={(e) => setCupom(e.target.value)}
                      placeholder="Digite seu cupom"
                      className="flex-1"
                    />
                    <Button
                      onClick={aplicarCupom}
                      variant="outline"
                      size="sm"
                      disabled={!cupom}
                    >
                      Aplicar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo de Valores */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {cupomAplicado && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Desconto (10%)</span>
                    <span className="text-green-600 font-medium">-R$ {desconto.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-[#ff007d]">R$ {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Botão Finalizar - Aparece quando método selecionado */}
            {mostrarPagamento && metodoPagamento && (
              <Button
                onClick={finalizarCompra}
                disabled={processando || !dadosCompletos}
                className="w-full h-12 bg-[#ff007d] hover:bg-[#ff007d]/90 text-white font-medium rounded-xl animate-in slide-in-from-bottom-4 duration-500"
              >
                {processando ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Compra - R$ {total.toFixed(2)}
                  </>
                )}
              </Button>
            )}

            {/* Indicador quando dados não estão completos */}
            {!dadosCompletos && (
              <div className="w-full h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                <User className="h-4 w-4 mr-2" />
                Complete os dados para continuar
              </div>
            )}

            {/* Indicador para selecionar método de pagamento */}
            {dadosCompletos && mostrarPagamento && !metodoPagamento && (
              <div className="w-full h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Selecione um método de pagamento
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              Ao finalizar, você concorda com nossos termos de uso
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}