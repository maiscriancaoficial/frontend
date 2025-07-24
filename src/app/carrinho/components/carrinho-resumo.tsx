'use client';

import { useState } from 'react';
import { useCarrinhoStore } from '@/services/carrinho-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Gift, X, ChevronRight, Receipt, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function CarrinhoResumo() {
  const { itens, total, aplicarCupom } = useCarrinhoStore();
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  
  const handleAplicarCupom = () => {
    if (!cupom) return;
    
    setCarregando(true);
    // Simulando um delay de rede
    setTimeout(() => {
      const resultado = aplicarCupom(cupom);
      if (resultado) {
        setCupomAplicado(true);
        toast.success(`Cupom ${cupom.toUpperCase()} aplicado com sucesso!`);
      } else {
        toast.error(`Cupom ${cupom.toUpperCase()} inválido ou expirado.`);
      }
      setCarregando(false);
    }, 800);
  };
  
  // Calcular frete (simulação)
  const valorFrete = total > 200 ? 0 : 29.90;
  const totalComFrete = total + valorFrete;

  // Se não houver itens, não mostra o resumo
  if (itens.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-3xl sticky top-4">
      <div className="bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] p-6 border-b border-white/20 text-white shadow-sm rounded-t-3xl">
        <motion.div 
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-white/20 shadow-inner border border-white/30">
              <AvatarImage src="" />
              <AvatarFallback className="text-white">
                <Receipt className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-lg">Resumo da Compra</h3>
              <p className="text-sm text-white/80">Detalhes do seu pedido</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Valores */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Frete</span>
            {valorFrete === 0 ? (
              <span className="text-green-500 font-medium">Grátis</span>
            ) : (
              <span>R$ {valorFrete.toFixed(2)}</span>
            )}
          </div>
          
          {valorFrete > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl p-3 text-xs flex items-start">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Compras acima de R$ 200,00 têm frete grátis. Adicione mais R$ {(200 - total).toFixed(2)} para ganhar frete grátis.</span>
            </div>
          )}
          
          {/* Cupom */}
          {!cupomAplicado ? (
            <div className="pt-2">
              <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
                Cupom de desconto
              </label>
              <div className="flex gap-2">
                <Input 
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  placeholder="FLORES10"
                  className="rounded-full border-gray-200 dark:border-gray-700"
                />
                <Button
                  onClick={handleAplicarCupom}
                  disabled={!cupom || carregando}
                  className="rounded-full bg-black hover:bg-gray-800 text-white dark:bg-black dark:text-white dark:hover:bg-gray-800"
                >
                  {carregando ? "Aplicando..." : "Aplicar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl p-3">
              <div className="flex items-center">
                <Gift className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">{cupom.toUpperCase()}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50"
                onClick={() => setCupomAplicado(false)}
              >
                <X size={14} />
              </Button>
            </div>
          )}
          
          <div className="border-t border-gray-100 dark:border-gray-800 my-3 pt-3"></div>
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-lg">R$ {totalComFrete.toFixed(2)}</span>
          </div>
        </div>
        
        <Button
          asChild
          className="w-full h-14 bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full shadow-lg shadow-[#ff0080]/20"
        >
          <Link href="/checkout">
            Finalizar Compra
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-gray-400">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pagamento seguro
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-gray-400">
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
            Garantia de qualidade
          </div>
        </div>
      </div>
    </Card>
  );
}
