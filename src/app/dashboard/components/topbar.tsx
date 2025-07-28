'use client';

import { useState, useEffect, useRef } from "react";
import { Bell, Monitor, Moon, Sun, UserCircle, Settings, LogOut, ChevronDown, Shield, BarChart3, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { NotificationsDropdown } from './notifications-dropdown';

// Componente para renderizar apenas no lado cliente
function ThemeIcon() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Montagem apenas no lado cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Enquanto não estiver montado, mostra um placeholder
  if (!mounted) {
    return <div className="h-5 w-5" />;
  }
  
  // Renderiza o ícone correto baseado no tema
  if (theme === 'dark') {
    return <Moon className="h-5 w-5" />;
  } else if (theme === 'light') {
    return <Sun className="h-5 w-5" />;
  } else {
    return <Monitor className="h-5 w-5" />;
  }
}

export function Topbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { setTheme } = useTheme();
  const { usuario, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Verificar se é admin
  const isAdmin = usuario?.role === 'ADMIN';
  
  // Menu items para admin
  const adminMenuItems = [
    { 
      icon: <Shield className="w-4 h-4" />, 
      label: 'Dashboard Admin',
      href: '/dashboard/admin',
      highlight: true
    },
    { 
      icon: <BarChart3 className="w-4 h-4" />, 
      label: 'Relatórios',
      href: '/dashboard/admin/relatorios'
    },
    { 
      icon: <Package className="w-4 h-4" />, 
      label: 'Produtos',
      href: '/dashboard/admin/produtos'
    },
    { 
      icon: <Users className="w-4 h-4" />, 
      label: 'Clientes',
      href: '/dashboard/admin/clientes'
    }
  ];

  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 lg:px-8 w-full transition-all duration-300">
      {/* Título da página - Em telas grandes este título pode ser dinâmico */}
      <div>
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">Dashboard</h2>
      </div>
      
      {/* Ações e ícones do usuário */}
      <div className="flex items-center space-x-3">
        {/* Alternador de tema */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ThemeIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="end">
            <div className="grid gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center justify-start px-2 py-1.5 w-full"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                <span>Claro</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center justify-start px-2 py-1.5 w-full"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                <span>Escuro</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center justify-start px-2 py-1.5 w-full"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                <span>Sistema</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Notificações */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="rounded-full relative hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#ff0080] dark:bg-[#27b99a] rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </Button>
          
          <NotificationsDropdown 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>
        
        {/* Perfil do usuário */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "px-3 py-2 flex items-center gap-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/70 rounded-full transition-colors",
              isProfileOpen && "bg-gray-100/80 dark:bg-gray-800/70"
            )}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <Avatar className="h-8 w-8 border-2 border-gray-200 dark:border-gray-700">
              <AvatarFallback className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/80 text-white">
                {usuario?.nome?.substring(0, 2).toUpperCase() || "AD"}
              </AvatarFallback>
            </Avatar>
            
            <span className="text-sm font-medium hidden sm:block">
              <span className="flex flex-col items-start leading-none">
                <span className="text-xs text-gray-500 dark:text-gray-400">Olá,</span>
                <span className="font-medium truncate max-w-[100px]">
                  {usuario?.nome?.split(' ')[0] || 'Admin'}
                </span>
              </span>
            </span>
            
            <ChevronDown className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200",
              isProfileOpen && "rotate-180"
            )} />
          </Button>
          
          {/* Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
              >
                {/* Cabeçalho */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/80 text-white">
                        {usuario?.nome?.substring(0, 2).toUpperCase() || "AD"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {usuario?.nome || 'Administrador'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {usuario?.email || 'admin@exemplo.com'}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="p-1 bg-[#ff0080]/10 dark:bg-[#27b99a]/20 rounded-full">
                          <Shield className="h-3 w-3 text-[#ff0080] dark:text-[#27b99a]" />
                        </div>
                        <span className="text-xs font-medium text-[#ff0080] dark:text-[#27b99a]">
                          Administrador
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Menu de navegação */}
                <div className="py-2">
                  {isAdmin && (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Administração
                        </p>
                      </div>
                      {adminMenuItems.map((item, index) => (
                        <Link 
                          key={index}
                          href={item.href}
                          className={cn(
                            "flex items-center px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors gap-3",
                            item.highlight && "bg-[#ff0080]/5 dark:bg-[#27b99a]/10 border-l-2 border-[#ff0080]/30 dark:border-[#27b99a]/30 ml-2"
                          )}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className={cn(
                            "p-1.5 rounded-full",
                            item.highlight 
                              ? "bg-[#ff0080]/10 dark:bg-[#27b99a]/20 text-[#ff0080] dark:text-[#27b99a]"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          )}>
                            {item.icon}
                          </div>
                          
                          <span className="text-sm font-medium flex-grow">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                      
                      <div className="mx-4 my-2 border-t border-gray-200 dark:border-gray-700"></div>
                    </>
                  )}
                  
                  {/* Configurações */}
                  <Link 
                    href="/dashboard/admin/configuracoes"
                    className="flex items-center px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors gap-3"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium flex-grow">
                      Configurações
                    </span>
                  </Link>
                </div>
                
                {/* Rodapé */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-2">
                  <Button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }} 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> 
                    <span>Sair da conta</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
