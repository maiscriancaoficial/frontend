'use client';

import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";
import { useAuth } from "@/lib/auth/useAuth";
import { useSidebarStore } from "@/store/sidebar-store";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { autenticado, carregando, usuario, verificarAutenticacao } = useAuth();
  const { isHovered, isOpen } = useSidebarStore();
  const pathname = usePathname();

  useEffect(() => {
    console.log('Verificando autenticação no dashboard layout...');
    verificarAutenticacao();
  }, [verificarAutenticacao]);
  
  // Log para debug do estado da autenticação
  useEffect(() => {
    console.log('Estado da autenticação:', {
      autenticado,
      carregando,
      usuario
    });
  }, [autenticado, carregando, usuario]);

  // Verificar se está na rota correta para o role do usuário
  const isRightRole = () => {
    if (!usuario) return false;
    
    if (usuario.role === 'ADMIN' && pathname.includes('/dashboard/admin')) {
      return true;
    }
    
    if (usuario.role === 'FUNCIONARIO' && pathname.includes('/dashboard/funcionario')) {
      return true;
    }
    
    if (usuario.role === 'AFILIADO' && pathname.includes('/dashboard/afiliado')) {
      return true;
    }
    
    return false;
  };

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#ff9898]" />
      </div>
    );
  }

  // Verificação de autenticação
  if (!autenticado) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-2">
        <p className="text-xl">Você precisa estar autenticado para acessar esta página</p>
        <p className="text-gray-500">Redirecionando...</p>
        <Loader2 className="h-6 w-6 animate-spin text-[#ff9898] mt-2" />
      </div>
    );
  }

  // Verificação de permissão de role
  if (!isRightRole()) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-2">
        <p className="text-xl">Você não tem permissão para acessar esta página</p>
        <p className="text-gray-500">Redirecionando...</p>
        <Loader2 className="h-6 w-6 animate-spin text-[#ff9898] mt-2" />
      </div>
    );
  }

  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar */}
        <Sidebar userRole={usuario?.role} />
        
        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col transition-all duration-300"
             style={{ 
               marginLeft: (isHovered || isOpen) ? "18rem" : "5rem", /* 18rem quando expandida, 5rem quando recolhida */
             }}
        >
          {/* Topbar */}
          <Topbar />
          
          {/* Conteúdo principal */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}