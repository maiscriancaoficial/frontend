'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageOpen, ShoppingCart, User, Heart, LogOut, Settings, CreditCard } from 'lucide-react';

export default function MinhaContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, carregando, autenticado, logout } = useAuth();
  const router = useRouter();

  // Redireciona usuários não autenticados para o login
  useEffect(() => {
    if (!carregando && !autenticado) {
      router.push('/login?redirecionarPara=/minha-conta');
    }
  }, [autenticado, carregando, router]);

  // Redireciona para a página correta se o usuário não for cliente ou assinante
  useEffect(() => {
    if (autenticado && usuario && usuario.role !== 'CLIENTE' && usuario.role !== 'ASSINANTE') {
      const redirecionamentos: Record<string, string> = {
        'ADMIN': '/admin',
        'FUNCIONARIO': '/funcionario',
        'AFILIADO': '/afiliado',
      };
      
      router.push(redirecionamentos[usuario.role] || '/');
    }
  }, [autenticado, usuario, router]);

  // Exibe carregando enquanto verifica autenticação
  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Menu Lateral */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6">
          <div className="text-lg font-medium">Olá, {usuario?.nome?.split(' ')[0]}</div>
          <div className="text-sm text-muted-foreground">{usuario?.email}</div>
        </div>
        <nav className="space-y-1 px-3 pb-6">
          <MenuItem href="/minha-conta" icon={<User className="mr-3 h-5 w-5" />}>
            Meus Dados
          </MenuItem>
          <MenuItem href="/minha-conta/pedidos" icon={<ShoppingCart className="mr-3 h-5 w-5" />}>
            Meus Pedidos
          </MenuItem>
          <MenuItem href="/minha-conta/favoritos" icon={<Heart className="mr-3 h-5 w-5" />}>
            Favoritos
          </MenuItem>
          <MenuItem href="/minha-conta/assinatura" icon={<PackageOpen className="mr-3 h-5 w-5" />}>
            Minha Assinatura
          </MenuItem>
          <MenuItem href="/minha-conta/pagamentos" icon={<CreditCard className="mr-3 h-5 w-5" />}>
            Métodos de Pagamento
          </MenuItem>
          <MenuItem href="/minha-conta/configuracoes" icon={<Settings className="mr-3 h-5 w-5" />}>
            Configurações
          </MenuItem>
          <div className="pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => logout()}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </Button>
          </div>
        </nav>
      </div>

      {/* Conteúdo */}
      <div className="flex-grow p-6">
        {children}
      </div>
    </div>
  );
}

// Componente auxiliar para itens do menu
function MenuItem({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) {
  const isActive = typeof window !== 'undefined' && window.location.pathname === href;
  
  return (
    <Link
      href={href}
      className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors ${isActive
        ? 'bg-primary text-primary-foreground font-medium'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}