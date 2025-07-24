'use client';

import { motion } from 'framer-motion';
import { CheckSquare, ShieldCheck } from 'lucide-react';

export function CheckoutTitulo() {
  return (
    <div className="flex items-center space-x-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] flex items-center justify-center text-white shadow-lg shadow-[#27b99a]/25 border border-white/10"
      >
        <div className="bg-white/20 p-2 rounded-xl shadow-inner">
          <CheckSquare size={28} />
        </div>
      </motion.div>
      <div>
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold tracking-tight pt-3 md:pt-0 flex items-center gap-2">
          Finalizar Compra
          <ShieldCheck size={20} className="text-[#ff0080]" />
        </motion.h1>
        <motion.p 
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
          Complete seu pedido com segurança e tranquilidade
        </motion.p>
      </div>
    </div>
  );
}
