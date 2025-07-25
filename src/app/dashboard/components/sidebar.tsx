'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Truck,
  Ticket,
  Users,
  UsersRound,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  Sparkles,
  BookText,
  Image,
  FileText
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebar-store';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/useAuth';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  admin?: boolean;
  afiliado?: boolean;
  funcionario?: boolean;
};

export function Sidebar({ className, userRole = 'ADMIN' }: { className?: string, userRole?: string }) {
  const { isOpen, isHovered, toggle, setHovered } = useSidebarStore();
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Visão Geral',
      href: '/dashboard/admin',
      icon: <Home className="h-5 w-5" />,
      admin: true,
      funcionario: true,
      afiliado: true,
    },
    {
      label: 'Pedidos',
      href: '/dashboard/admin/pedidos',
      icon: <ShoppingCart className="h-5 w-5" />,
      admin: true,
      funcionario: true,
    },
    {
      label: 'Produtos',
      href: '/dashboard/admin/produtos',
      icon: <Package className="h-5 w-5" />,
      admin: true,
      funcionario: true,
    },
    {
      label: 'Livros',
      href: '/dashboard/admin/livros',
      icon: <BookText className="h-5 w-5" />,
      admin: true,
      funcionario: true,
    },
    {
      label: 'Avatares',
      href: '/dashboard/admin/avatares',
      icon: <Image className="h-5 w-5" />,
      admin: true,
      funcionario: true,
    },
    {
      label: 'Cupons',
      href: '/dashboard/admin/cupons',
      icon: <Ticket className="h-5 w-5" />,
      admin: true,
    },
    {
      label: 'Clientes',
      href: '/dashboard/admin/clientes',
      icon: <Users className="h-5 w-5" />,
      admin: true,
      funcionario: true,
    },
    {
      label: 'Afiliados',
      href: '/dashboard/admin/afiliados',
      icon: <UsersRound className="h-5 w-5" />,
      admin: true,
    },
    {
      label: 'Relatórios',
      href: '/dashboard/admin/relatorios',
      icon: <BarChart3 className="h-5 w-5" />,
      admin: true,
      funcionario: true,
      afiliado: true,
    },
    {
      label: 'Banners',
      href: '/dashboard/admin/banners',
      icon: <Image className="h-5 w-5" />,
      admin: true,
      funcionario: true,
    },
    {
      label: 'Blog',
      href: '/dashboard/admin/blog',
      icon: <FileText className="h-5 w-5" />,
      admin: true,
      funcionario: true,
    },
    {
      label: 'Configurações',
      href: '/dashboard/admin/configuracoes',
      icon: <Settings className="h-5 w-5" />,
      admin: true,
    },
    
   
  ];

  // Filtrar itens baseados na role do usuário
  const filteredNavItems = navItems.filter(item => {
    if (userRole === 'ADMIN') return item.admin;
    if (userRole === 'FUNCIONARIO') return item.funcionario;
    if (userRole === 'AFILIADO') return item.afiliado;
    return false;
  });

  const toggleSidebar = () => {
    toggle();
  };

  return (
    <>
      {/* Botão móvel para abrir a sidebar */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay para fechar a sidebar em dispositivos móveis */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out shadow-2xl shadow-gray-900/5",
          // Mobile - aberto/fechado com botão de toggle
          isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full",
          // Desktop - inicialmente compacto, expande com hover
          "md:translate-x-0", 
          !isHovered ? "md:w-20" : "md:w-72",
          "flex-shrink-0", // Impede que a sidebar encolha quando o conteúdo principal cresce
          className
        )}
        onMouseEnter={() => window.innerWidth >= 768 && setHovered(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setHovered(false)}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Logo */}
          <div className="h-16 flex items-center border-b border-gray-100 dark:border-gray-800 px-3">
            <Link href="/dashboard/admin" className={cn(
              "flex items-center w-full", 
              (!isOpen && !isHovered) && "md:justify-center"
            )}>
              <div className="bg-[#ff0080] h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              {(isOpen || isHovered) && (
                <div className="ml-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Painel Admin</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Dashboard</div>
                </div>
              )}
            </Link>
          </div>
          
          {/* Links de navegação */}
          <div className="flex-1 py-4 px-3 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              const showBadge = item.label === 'Pedidos' || item.label === 'Produtos' || item.label === 'Blog';
              const badgeCount = item.label === 'Pedidos' ? '12' : item.label === 'Produtos' ? '47' : item.label === 'Blog' ? '8' : '';
              
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 rounded-2xl text-gray-600 dark:text-gray-400 transition-all duration-200 ease-in-out relative",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm",
                    isActive && [
                      "bg-[#ff0080]/8 dark:bg-[#ff0080]/15",
                      "text-[#ff0080] dark:text-[#ff0080] font-medium",
                      "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#ff0080] before:rounded-full"
                    ],
                    !isOpen && "md:justify-center lg:justify-start"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <span className="flex-shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
                    {(isOpen || isHovered) && (
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  
                  {/* Badge */}
                  {(isOpen || isHovered) && showBadge && (
                    <span className={cn(
                      "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full transition-all ml-auto",
                      isActive 
                        ? "bg-[#ff0080] text-white" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                    )}>
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Logout */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => logout()}
              className={cn(
                "group flex items-center px-3 py-2.5 rounded-2xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 hover:shadow-sm transition-all duration-200 ease-in-out w-full",
                !isOpen && "md:justify-center lg:justify-start"
              )}
            >
              <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
              {(isOpen || isHovered) && (
                <span className="ml-3 text-sm font-medium">Sair</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
