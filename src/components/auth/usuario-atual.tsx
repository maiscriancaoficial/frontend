'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';

export default function UsuarioAtual({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { verificarAutenticacao, carregando } = useAuth();
  
  useEffect(() => {
    verificarAutenticacao();
  }, [verificarAutenticacao]);
  
  return <>{children}</>;
}
