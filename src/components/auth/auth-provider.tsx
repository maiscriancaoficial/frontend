'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { verificarAutenticacao } = useAuth();

  useEffect(() => {
    // Verificar autenticação quando o componente monta
    verificarAutenticacao();
  }, [verificarAutenticacao]);

  return <>{children}</>;
}
