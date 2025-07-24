'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { CheckoutTitulo } from './components/checkout-titulo';
import { DadosClienteForm } from './components/dados-cliente-form';
import { EnderecoEntregaForm } from './components/endereco-entrega-form';
import { MetodoPagamento } from './components/metodo-pagamento';
import { ResumoPedido } from './components/resumo-pedido';
import { FinalizarBotao } from './components/finalizar-botao';
import { useCarrinhoStore } from '@/services/carrinho-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const [dadosClienteCompletos, setDadosClienteCompletos] = useState(false);
  const [enderecoCompleto, setEnderecoCompleto] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO'>('PIX');
  const router = useRouter();
  
  // Valor do frete (poderia vir de um cálculo real baseado no CEP)
  const frete = 15.90;
  
  const { limparCarrinho, calcularSubtotal } = useCarrinhoStore();
  const subtotal = calcularSubtotal();
  
  // Simulação de finalização de compra
  const finalizarCompra = async () => {
    return new Promise<void>((resolve) => {
      // Simular tempo de processamento
      setTimeout(() => {
        // Limpar o carrinho
        limparCarrinho();
        
        // Exibir toast de sucesso
        toast.success('Pedido realizado com sucesso!', {
          description: 'Você receberá as instruções por email.',
          duration: 5000,
        });
        
        // Redirecionar para uma página de confirmação (poderia ser implementada)
        setTimeout(() => {
          router.push('/');
        }, 2000);
        
        resolve();
      }, 2000);
    });
  };

  return (
    <SiteLayout>
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
        <div className="flex flex-col space-y-8 pb-20">
          {/* Título da página */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CheckoutTitulo />
          </motion.div>
          
          {/* Layout de duas colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da esquerda - Formulários */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                {/* Só mostra um componente por vez baseado no progresso do checkout */}
                {!dadosClienteCompletos ? (
                  <motion.div 
                    key="dados-cliente"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    <DadosClienteForm 
                      onDadosCompletos={setDadosClienteCompletos} 
                    />
                  </motion.div>
                ) : !enderecoCompleto ? (
                  <motion.div 
                    key="endereco-entrega"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    <EnderecoEntregaForm 
                      onEnderecoCompleto={setEnderecoCompleto} 
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="metodo-pagamento"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    <MetodoPagamento 
                      valorTotal={subtotal + frete} 
                      onMetodoSelecionado={setMetodoPagamento} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Coluna da direita - Resumo e finalização */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ResumoPedido frete={frete} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FinalizarBotao 
                  dadosClienteCompletos={dadosClienteCompletos}
                  enderecoCompleto={enderecoCompleto}
                  onFinalizarCompra={finalizarCompra}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}