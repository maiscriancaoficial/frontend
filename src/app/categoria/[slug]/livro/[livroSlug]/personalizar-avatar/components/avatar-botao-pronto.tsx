'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AvatarBotaoProntoProps {
  livroSlug: string;
  categoriaSlug: string;
  isValid: boolean;
  onSalvar: () => Promise<boolean>;
  loading?: boolean;
}

export function AvatarBotaoPronto({ 
  livroSlug, 
  categoriaSlug, 
  isValid,
  onSalvar,
  loading = false
}: AvatarBotaoProntoProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    if (!isValid) return;
    
    // Antes de navegar, salvamos as configurações do avatar no localStorage
    // usando a função de salvar do componente pai
    onSalvar();
    
    // Navegamos para a página de prévia
    router.push(`/categoria/${categoriaSlug}/livro/${livroSlug}/previa-livro`);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Button
        onClick={handleClick}
        disabled={!isValid || isLoading || loading}
        className={cn(
          "w-full py-6 rounded-full text-white font-medium text-lg",
          isValid ? "bg-[#27b99a] hover:bg-[#27b99a]/90" : "bg-gray-300"
        )}
      >
        {(isLoading || loading) ? (
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Salvando...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>PRONTINHO? SIGA PARA O LIVRO</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        )}
      </Button>
    </motion.div>
  );
}
