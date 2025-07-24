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
          "fixed top-0 left-0 z-40 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 shadow-xl",
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
          <div className="h-20 flex items-center border-b border-gray-200 dark:border-gray-800 px-4">
            <Link href="/dashboard/admin" className={cn(
              "flex items-center", 
              (!isOpen || !isHovered) && "md:justify-center"
            )}>
              <div className="bg-[#ff0080] dark:bg-[#27b99a] text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-xl">M</div>
              {(isOpen || isHovered) && (
                <span className="ml-3 text-xl font-bold">Mais criança</span>
              )}
            </Link>
          </div>
          
          {/* Links de navegação */}
          <div className="flex-1 py-6 px-4 space-y-3">  {/* Aumento do espaçamento vertical entre itens */}
            {filteredNavItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10 hover:text-[#ff0080] dark:hover:text-[#27b99a] transition-colors",
                  pathname === item.href && "bg-[#ff0080]/10 dark:bg-[#27b99a]/10 text-[#ff0080] dark:text-[#27b99a] font-medium border-l-4 border-[#ff0080] dark:border-[#27b99a]",
                  !isOpen && "md:justify-center lg:justify-start"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(isOpen || isHovered) && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
          
          {/* Logout */}
          <div className="p-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => logout()}
              className={cn(
                "flex items-center px-3 py-3 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors w-full font-medium",
                !isOpen && "md:justify-center lg:justify-start"
              )}
            >
              <LogOut className="h-5 w-5" />
              {(isOpen || isHovered) && (
                <span className="ml-3">Sair</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
