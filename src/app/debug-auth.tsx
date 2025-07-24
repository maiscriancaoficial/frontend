'use client';

import { useAuth } from "@/lib/auth/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DebugAuth() {
  const { autenticado, usuario, verificarAutenticacao, carregando } = useAuth();
  const [mensagem, setMensagem] = useState<string>('Carregando...');
  const router = useRouter();

  useEffect(() => {
    const verificarStatus = async () => {
      await verificarAutenticacao();
      
      if (carregando) {
        setMensagem('Verificando autenticação...');
      } else if (autenticado && usuario) {
        setMensagem(`Autenticado como: ${usuario.nome} (${usuario.role}). Redirecionando para o dashboard...`);
        console.log("Dados do usuário:", usuario);
        
        // Espera 3 segundos e depois redireciona
        setTimeout(() => {
          const destino = getRedirecionamentoPorRole(usuario.role);
          console.log("Redirecionando para:", destino);
          router.push(destino);
        }, 3000);
      } else {
        setMensagem('Não autenticado');
      }
    };

    verificarStatus();
  }, [autenticado, usuario, verificarAutenticacao, carregando, router]);

  // Função para determinar redirecionamento com base no role
  const getRedirecionamentoPorRole = (role: string) => {
    const redirecionamentos: Record<string, string> = {
      'ADMIN': '/dashboard/admin',
      'FUNCIONARIO': '/dashboard/funcionario',
      'CLIENTE': '/minha-conta',
      'ASSINANTE': '/minha-conta',
      'AFILIADO': '/dashboard/afiliado',
    };
    return redirecionamentos[role] || '/';
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Depuração de Autenticação</h1>
        <div className="py-4 border-t border-b border-gray-200">
          <p className="font-semibold">Status:</p>
          <p>{mensagem}</p>
        </div>
        {usuario && (
          <div className="space-y-2 bg-gray-50 p-4 rounded">
            <h2 className="font-semibold">Dados do usuário:</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li>ID: {usuario.id}</li>
              <li>Nome: {usuario.nome}</li>
              <li>Email: {usuario.email}</li>
              <li>Role: {usuario.role}</li>
            </ul>
          </div>
        )}
        <p className="text-sm text-gray-500">
          Esta página é usada para depurar o processo de autenticação e redirecionamento.
        </p>
      </div>
    </div>
  );
}
