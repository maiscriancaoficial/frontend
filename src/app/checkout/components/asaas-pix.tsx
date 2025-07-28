'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  Copy, 
  CheckCircle, 
  Clock, 
  Loader2,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface AsaasPIXProps {
  valor: number;
  dadosCliente: {
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
  };
  onPagamentoConfirmado: () => void;
  onPagamentoError?: (error: string) => void;
}

interface PagamentoPIXResponse {
  success: boolean;
  data?: {
    id: string;
    status: string;
    pixQrCode?: string;
    pixCopyAndPaste?: string;
    expiresAt: string;
    value: number;
  };
  error?: string;
}

export function AsaasPIX({ valor, dadosCliente, onPagamentoConfirmado, onPagamentoError }: AsaasPIXProps) {
  const [carregando, setCarregando] = useState(false);
  const [pagamento, setPagamento] = useState<PagamentoPIXResponse['data'] | null>(null);
  const [tempoRestante, setTempoRestante] = useState<number>(0);
  const [verificandoStatus, setVerificandoStatus] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Timer para expiração do PIX
  useEffect(() => {
    if (pagamento?.expiresAt && tempoRestante > 0) {
      const timer = setInterval(() => {
        const agora = new Date().getTime();
        const expiracao = new Date(pagamento.expiresAt).getTime();
        const diferenca = Math.max(0, expiracao - agora);
        
        setTempoRestante(Math.floor(diferenca / 1000));
        
        if (diferenca <= 0) {
          clearInterval(timer);
          toast.error('PIX expirado. Gere um novo código.');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [pagamento?.expiresAt, tempoRestante]);

  // Verificação automática do status do pagamento
  useEffect(() => {
    if (pagamento?.id && !verificandoStatus) {
      const verificarStatus = async () => {
        try {
          const response = await fetch(`/api/asaas/pix/${pagamento.id}/status`);
          const data = await response.json();
          
          if (data.success && data.status === 'CONFIRMED') {
            toast.success('Pagamento confirmado!');
            onPagamentoConfirmado();
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      };

      const interval = setInterval(verificarStatus, 3000); // Verifica a cada 3 segundos
      
      return () => clearInterval(interval);
    }
  }, [pagamento?.id, verificandoStatus, onPagamentoConfirmado]);

  const gerarPIX = async () => {
    setCarregando(true);
    
    try {
      // Buscar itens do carrinho
      const itensCarrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
      
      const response = await fetch('/api/asaas/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor,
          dadosCliente,
          itens: itensCarrinho
        }),
      });

      const data: PagamentoPIXResponse = await response.json();

      if (data.success && data.data) {
        setPagamento(data.data);
        
        // Calcular tempo de expiração (15 minutos)
        const expiracao = new Date(data.data.expiresAt).getTime();
        const agora = new Date().getTime();
        setTempoRestante(Math.floor((expiracao - agora) / 1000));
        
        toast.success('PIX gerado com sucesso!');
      } else {
        throw new Error(data.error || 'Erro ao gerar PIX');
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PIX';
      toast.error(errorMessage);
      onPagamentoError?.(errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  const copiarCodigo = async () => {
    if (pagamento?.pixCopyAndPaste) {
      try {
        await navigator.clipboard.writeText(pagamento.pixCopyAndPaste);
        setCopiado(true);
        toast.success('Código PIX copiado!');
        
        setTimeout(() => setCopiado(false), 3000);
      } catch (error) {
        toast.error('Erro ao copiar código');
      }
    }
  };

  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Smartphone className="h-5 w-5 text-[#27b99a]" />
          Pagamento PIX
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!pagamento ? (
          // Estado inicial - Gerar PIX
          <div className="text-center space-y-4">
            <div className="bg-[#27b99a]/5 border border-[#27b99a]/20 rounded-2xl p-6">
              <QrCode className="h-12 w-12 text-[#27b99a] mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Pagamento via PIX
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Gere o código PIX para pagar instantaneamente
              </p>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-2xl font-bold text-gray-900">
                  R$ {valor.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-500">Valor total</p>
              </div>
            </div>
            
            <Button
              onClick={gerarPIX}
              disabled={carregando}
              className="w-full h-12 bg-[#27b99a] hover:bg-[#27b99a]/90 text-white font-medium rounded-2xl"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Gerar PIX
                </>
              )}
            </Button>
          </div>
        ) : (
          // Estado com PIX gerado
          <div className="space-y-6">
            {/* Timer de expiração */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">
                    PIX expira em: {formatarTempo(tempoRestante)}
                  </p>
                  <p className="text-sm text-amber-600">
                    Após este tempo, será necessário gerar um novo código
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 inline-block">
                {pagamento.pixQrCode ? (
                  <Image
                    src={`data:image/png;base64,${pagamento.pixQrCode}`}
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-100 rounded-xl flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  Escaneie o QR Code
                </h3>
                <p className="text-sm text-gray-600">
                  Abra o app do seu banco e escaneie o código acima
                </p>
              </div>
            </div>

            {/* Código para copiar */}
            {pagamento.pixCopyAndPaste && (
              <div className="space-y-3">
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Ou copie o código PIX
                  </h4>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <p className="text-xs font-mono text-gray-700 break-all mb-3">
                      {pagamento.pixCopyAndPaste}
                    </p>
                    
                    <Button
                      onClick={copiarCodigo}
                      variant="outline"
                      className="w-full h-10 rounded-xl"
                    >
                      {copiado ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar código PIX
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Status do pagamento */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium text-blue-800">
                    Aguardando pagamento...
                  </p>
                  <p className="text-sm text-blue-600">
                    Você será notificado assim que o pagamento for confirmado
                  </p>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <h4 className="font-medium text-gray-900 mb-3">Como pagar:</h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-[#27b99a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium mt-0.5">1</span>
                  Abra o app do seu banco ou carteira digital
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#27b99a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium mt-0.5">2</span>
                  Escaneie o QR Code ou cole o código PIX
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#27b99a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium mt-0.5">3</span>
                  Confirme o pagamento de R$ {valor.toFixed(2).replace('.', ',')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#27b99a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium mt-0.5">4</span>
                  Aguarde a confirmação automática
                </li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
