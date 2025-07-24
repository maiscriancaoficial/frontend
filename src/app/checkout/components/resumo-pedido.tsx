'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Shield, Check, ShoppingBasket, Truck, Receipt, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCarrinhoStore } from '@/services/carrinho-service';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ResumoPedidoProps {
  frete: number;
}

export function ResumoPedido({ frete }: ResumoPedidoProps) {
  const { itens, calcularSubtotal, calcularDesconto } = useCarrinhoStore();
  
  const subtotal = calcularSubtotal();
  const desconto = calcularDesconto();
  const total = subtotal + frete - desconto;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
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
                <ShoppingBasket className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">Resumo do Pedido</h3>
              <p className="text-sm text-white/80">Confira seus itens e valores</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-inner py-1.5 px-3">
            {itens.length} {itens.length === 1 ? 'item' : 'itens'}
          </Badge>
        </motion.div>
      </div>
      
      <CardContent className="p-6">
        <ScrollArea className="h-[200px] rounded-md pr-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {itens.map((item) => (
              <motion.div 
                key={item.produto.id}
                variants={itemVariants}
                className="flex items-center space-x-4 bg-white p-3 rounded-2xl border border-[#27b99a]/20 shadow-sm"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#27b99a]/30 flex-shrink-0 bg-[#27b99a]/5 shadow-inner">
                  {item.produto.fotoPrincipal && (
                    <Image
                      src={item.produto.fotoPrincipal}
                      alt={item.produto.titulo}
                      fill
                      className="object-cover"
                    />
                  )}
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="absolute -top-2 -right-2 bg-[#ff0080] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                  >
                    {item.quantidade}
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.produto.titulo}</h4>
                  <div className="flex justify-between items-center mt-1.5">
                    <p className="text-gray-500 text-xs dark:text-gray-400 flex items-center gap-1">
                      <span className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 p-0.5 px-1.5 rounded-full">{item.quantidade} x</span> R$ {item.produto.preco.toFixed(2)}
                    </p>
                    <p className="font-medium text-sm bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      R$ {(item.quantidade * item.produto.preco).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
        
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-950 border border-gray-100 dark:border-gray-800/50 shadow-inner space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#27b99a]" />
                Subtotal
              </span>
              <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#27b99a]" />
                Frete
              </span>
              <span className={`font-medium ${frete === 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                {frete > 0 ? `R$ ${frete.toFixed(2)}` : 'Grátis'}
              </span>
            </div>
            
            {desconto > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Desconto
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">- R$ {desconto.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#ff0080]/10 to-[#ff0080]/5 border border-[#ff0080]/20 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-[#ff0080]/20 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-[#ff0080]" />
                </span>
                Total
              </span>
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="font-bold text-xl text-[#ff0080]"
              >
                R$ {total.toFixed(2)}
              </motion.span>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center justify-center mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {itens.length > 0 ? (
              <div className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">Pagamento seguro e criptografado</span>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-100 dark:border-amber-900/20 shadow-sm text-center">
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Seu carrinho está vazio
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
