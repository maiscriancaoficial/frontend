'use client';

import { useState, useEffect } from "react";
import { Bell, Monitor, Moon, Sun, UserCircle, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth/useAuth';
import Link from 'next/link';

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
  
  // Mock de notificações
  const notifications = [
    { id: 1, message: 'Novo pedido recebido', time: 'Agora mesmo', unread: true },
    { id: 2, message: 'Estoque baixo para Rosas Vermelhas', time: 'Há 1 hora', unread: true },
    { id: 3, message: 'Pedido #1234 entregue', time: 'Há 3 horas', unread: false },
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
        <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-[#ff0080]/10">
              <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#ff0080] rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700" align="end">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#ff0080] dark:text-[#27b99a]" />
                Notificações
              </h3>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-[#ff0080] dark:text-[#27b99a] hover:text-[#ff0080]/80 dark:hover:text-[#27b99a]/80 hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10">
                Marcar todas como lidas
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-2 w-2 mt-2 rounded-full ${notification.unread ? 'bg-[#ff0080] dark:bg-[#27b99a]' : 'bg-transparent'}`} />
                        <div className="ml-2 flex-1">
                          <p className={`text-sm ${notification.unread ? 'font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center">
              <Button variant="ghost" size="sm" className="text-xs w-full text-[#ff0080] dark:text-[#27b99a] hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10 font-medium">
                Ver todas as notificações
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Perfil do usuário */}
        <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#ff0080]/10">
              <Avatar className="h-8 w-8 border-2 border-[#ff0080] dark:border-[#27b99a]">
                <AvatarFallback className="bg-[#ff0080] dark:bg-[#27b99a] text-white font-medium">
                  {usuario?.nome?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg" align="end">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-12 w-12 border-2 border-[#ff0080] dark:border-[#27b99a]">
                <AvatarFallback className="bg-[#ff0080] dark:bg-[#27b99a] text-white font-medium">
                  {usuario?.nome?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{usuario?.nome || "Usuário"}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {usuario?.email || "usuario@exemplo.com"}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
              <Button asChild variant="ghost" size="sm" className="justify-start w-full hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10 hover:text-[#ff0080] dark:hover:text-[#27b99a]">
                <Link href="/minha-conta" className="flex items-center">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="justify-start w-full hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10 hover:text-[#ff0080] dark:hover:text-[#27b99a]">
                <Link href="/dashboard/admin/configuracoes" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </Button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()} 
                className="justify-start w-full text-red-500 hover:text-white hover:bg-red-500 transition-colors flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da conta
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
