'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { BotaoSuave } from './botao-suave';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FinalizarBotaoProps {
  dadosClienteCompletos: boolean;
  enderecoCompleto: boolean;
  onFinalizarCompra: () => Promise<void>;
}

export function FinalizarBotao({ 
  dadosClienteCompletos, 
  enderecoCompleto,
  onFinalizarCompra
}: FinalizarBotaoProps) {
  const [carregando, setCarregando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  
  const habilitado = dadosClienteCompletos && enderecoCompleto;
  
  const handleClick = async () => {
    if (!habilitado || carregando) return;
    
    setCarregando(true);
    try {
      await onFinalizarCompra();
      setConcluido(true);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <Card className="shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: !habilitado ? 1 : 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <BotaoSuave
              onClick={handleClick}
              disabled={!habilitado || carregando || concluido}
              size="lg"
              className={`w-full h-16 text-lg font-medium shadow-md hover:shadow-lg rounded-full transition-all duration-300 ${
                concluido
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                  : habilitado
                    ? "bg-gradient-to-r from-[#27b99a] to-[#27b99a]/90 hover:from-[#27b99a] hover:to-[#27b99a]/80 text-white"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              {carregando ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-3"
                  >
                    <Loader2 className="h-6 w-6" />
                  </motion.div>
                  Processando seu pedido...
                </div>
              ) : concluido ? (
                <motion.div 
                  className="flex items-center justify-center"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white/20 p-1 rounded-full mr-3">
                    <Check className="h-6 w-6" />
                  </div>
                  Pedido Realizado com Sucesso!
                </motion.div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="bg-white/20 p-1 rounded-full mr-3">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  Finalizar Compra
                  <ArrowRight className="ml-4 h-6 w-6" />
                </div>
              )}
            </BotaoSuave>
          </motion.div>
          
          {!habilitado && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 bg-gradient-to-r from-[#ff0080]/5 to-[#ff0080]/10 dark:from-[#ff0080]/10 dark:to-[#ff0080]/20 rounded-xl border border-[#ff0080]/20 dark:border-[#ff0080]/30 shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-2 text-[#ff0080] dark:text-[#ff0080]/90">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-sm font-medium">
                        Preencha todos os dados obrigatórios para finalizar
                      </p>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verifique se todos os dados pessoais e endereço estão completos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
