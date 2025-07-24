"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { SessaoUsuario } from '@/lib/auth/types';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ChevronDown, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  Settings,
  Calendar,
  Mail,
  Gift,
  ArrowUpRight,
  CircleDollarSign,
  Shield,
  BarChart3,
  Users,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Interface para o perfil do usuário
interface PerfilInfo {
  id?: string;
  nome: string;
  email: string;
  role?: string;
  fotoPerfil?: string;
  totalGasto?: number;
  cashbackDisponivel?: number;
}

// Interface para itens do menu
interface MenuItem {
  icon: React.ReactElement;
  label: string;
  href: string;
  badge?: string;
  highlight?: boolean;
  admin?: boolean;
}

interface PerfilDropdownProps {
  usuario?: PerfilInfo;
  logado?: boolean;
  onLogout?: () => void;
}

export function PerfilDropdown({
  usuario: usuarioProps,
  logado: logadoProps = false,
  onLogout
}: PerfilDropdownProps) {
  // Usar dados do hook useAuth, com fallback para props
  const { usuario: usuarioAuth, autenticado, logout } = useAuth();
  
  // Usar dados da autenticação, com fallback para props
  const usuario = usuarioAuth || usuarioProps;
  const logado = autenticado || logadoProps;
  
  // Debug logs
  console.log('[PERFIL DROPDOWN] Usuario auth:', usuarioAuth);
  console.log('[PERFIL DROPDOWN] Autenticado:', autenticado);
  console.log('[PERFIL DROPDOWN] Usuario final:', usuario);
  console.log('[PERFIL DROPDOWN] Role do usuario:', usuario?.role);
  
  // Função para verificar se o usuário tem um campo específico
  const temCampo = <T extends object, K extends string>(obj: T | undefined, campo: K): boolean => {
    return !!obj && campo in obj;
  };
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Fechar o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Verificar se o usuário é admin
  const isAdmin = usuario?.role === 'admin' || usuario?.role === 'ADMIN';

  // Itens do menu para usuários comuns
  const menuItemsComuns: MenuItem[] = [
    { 
      icon: <ShoppingBag className="w-4 h-4" />, 
      label: 'Meus Pedidos',
      href: '/conta/pedidos'
    },
    { 
      icon: <Heart className="w-4 h-4" />, 
      label: 'Meus Favoritos',
      href: '/conta/favoritos',
      badge: '4'
    },
    { 
      icon: <CircleDollarSign className="w-4 h-4" />, 
      label: 'Meu Cashback',
      href: '/conta/cashback',
      highlight: true
    },
    { 
      icon: <Settings className="w-4 h-4" />, 
      label: 'Meus Dados',
      href: '/conta/dados'
    }
  ];

  // Itens do menu específicos para admin
  const menuItemsAdmin: MenuItem[] = [
    { 
      icon: <Shield className="w-4 h-4" />, 
      label: 'Painel Admin',
      href: '/dashboard/admin',
      highlight: true,
      admin: true
    },
    { 
      icon: <BarChart3 className="w-4 h-4" />, 
      label: 'Relatórios',
      href: '/dashboard/admin/relatorios',
      admin: true
    },
    { 
      icon: <Package className="w-4 h-4" />, 
      label: 'Gerenciar Banners',
      href: '/dashboard/admin/banners',
      admin: true
    },
    { 
      icon: <Users className="w-4 h-4" />, 
      label: 'Usuários',
      href: '/dashboard/admin/usuarios',
      admin: true
    }
  ];

  // Combinar itens baseado no tipo de usuário
  const menuItems = isAdmin ? [...menuItemsAdmin, ...menuItemsComuns] : menuItemsComuns;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de acionamento */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-2 py-5 flex items-center gap-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/70 rounded-full transition-colors",
          isOpen && "bg-gray-100/80 dark:bg-gray-800/70",
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {(usuario && 'fotoPerfil' in usuario && usuario.fotoPerfil) ? (
          <Avatar className="h-8 w-8 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage src={usuario.fotoPerfil} alt={usuario.nome} />
            <AvatarFallback className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/80 text-white">
              {usuario.nome.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <User className="h-4 w-4" />
          </div>
        )}
        
        <span className={cn(
          "text-sm font-medium hidden sm:block",
          !logado && "text-gray-600 dark:text-gray-300"
        )}>
          {logado ? (
            <span className="flex flex-col items-start leading-none">
              <span className="text-xs text-gray-500 dark:text-gray-400">Olá,</span>
              <span className="font-medium truncate max-w-[100px]">{usuario?.nome?.split(' ')[0] || 'Usuário'}</span>
            </span>
          ) : 'Entrar'}
        </span>
        
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-500 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
          >
            {logado ? (
              <>
                {/* Cabeçalho para usuário logado */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                      {usuario && temCampo(usuario, 'fotoPerfil') && (usuario as any).fotoPerfil ? (
                        <AvatarImage src={(usuario as any).fotoPerfil} alt={usuario.nome || 'Usuário'} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/80 text-white">
                          {usuario?.nome ? usuario.nome.substring(0, 2).toUpperCase() : 'UN'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium text-sm">
                        {usuario?.nome || 'Usuário'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {usuario?.email || 'usuario@exemplo.com'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Resumo financeiro - mostrado apenas se tiver os dados extras */}
                {usuario && temCampo(usuario, 'totalGasto') && (
                  <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800 border-b border-gray-200 dark:border-gray-800">
                    <div className="p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Total em compras
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {formatarPreco((usuario && temCampo(usuario, 'totalGasto')) ? (usuario as any).totalGasto as number : 0)}
                      </p>
                    </div>
                    
                    <div className="p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Cashback disponível
                      </p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {formatarPreco((usuario && temCampo(usuario, 'cashbackDisponivel')) ? (usuario as any).cashbackDisponivel as number : 0)}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Menu de navegação */}
                <div className="py-2">
                  {isAdmin && (
                    <>
                      {/* Itens de Admin */}
                      <div className="px-4 py-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Administração
                        </p>
                      </div>
                      {menuItemsAdmin.map((item, index) => (
                        <Link 
                          key={`admin-${index}`}
                          href={item.href}
                          className={cn(
                            "flex items-center px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors gap-3",
                            item.highlight && "bg-[#f29798]/5 dark:bg-[#f29798]/10",
                            item.admin && "border-l-2 border-[#ff0080]/30 ml-2"
                          )}
                        >
                          <div className={cn(
                            "p-1.5 rounded-full",
                            item.highlight 
                              ? "bg-[#ff0080]/10 dark:bg-[#ff0080]/20 text-[#ff0080] dark:text-[#ff0080]"
                              : item.admin
                              ? "bg-[#ff0080]/10 dark:bg-[#ff0080]/20 text-[#ff0080] dark:text-[#ff0080]"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          )}>
                            {item.icon}
                          </div>
                          
                          <span className="text-sm font-medium flex-grow">
                            {item.label}
                          </span>
                          
                          {item.badge && (
                            <span className="bg-[#f29798]/10 text-[#27b99a] text-xs px-2 py-0.5 rounded-full dark:bg-[#f29798]/20 dark:text-[#27b99a]">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                      
                      {/* Separador */}
                      <div className="mx-4 my-2 border-t border-gray-200 dark:border-gray-700"></div>
                      
                      {/* Label para itens comuns */}
                      <div className="px-4 py-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Minha Conta
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Itens Comuns */}
                  {menuItemsComuns.map((item, index) => (
                    <Link 
                      key={`comum-${index}`}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors gap-3",
                        item.highlight && "bg-[#f29798]/5 dark:bg-[#f29798]/10"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-full",
                        item.highlight 
                          ? "bg-[#27b99a]/10 dark:bg-[#27b99a]/20 text-[#27b99a] dark:text-[#27b99a]"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      )}>
                        {item.icon}
                      </div>
                      
                      <span className="text-sm font-medium flex-grow">
                        {item.label}
                      </span>
                      
                      {item.badge && (
                        <span className="bg-[#f29798]/10 text-[#27b99a] text-xs px-2 py-0.5 rounded-full dark:bg-[#f29798]/20 dark:text-[#27b99a]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                
                {/* Área promocional */}
                <div className="p-3 mx-3 my-2 bg-gradient-to-r from-[#27b99a]/10 to-[#27b99a]/5 dark:from-[#27b99a]/20 dark:to-[#27b99a]/10 rounded-2xl border border-[#27b99a]/20 dark:border-[#27b99a]/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
                      <Gift className="w-4 h-4 text-[#27b99a]" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        Indique amigos e ganhe
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        R$ 15 em compras para cada
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#27b99a]" />
                  </div>
                </div>

                {/* Rodapé */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-2">
                  <Button 
                    onClick={() => {
                      if (onLogout) {
                        onLogout();
                      } else {
                        logout(); // Usar logout direto do hook
                      }
                      setIsOpen(false); // Fechar dropdown após logout
                    }} 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> 
                    <span>Sair</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Opções para usuário deslogado */}
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Bem-vindo(a)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Entre ou cadastre-se para acessar sua conta
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <Link href="/login" className="w-full">
                      <Button className="w-full bg-[#27b99a] hover:bg-[#27b99a]/90 text-white rounded-full">
                        Entrar
                      </Button>
                    </Link>
                    
                    <Link href="/registro" className="w-full">
                      <Button variant="outline" className="w-full rounded-full border-[#27b99a]/50 hover:bg-[#27b99a]/10 hover:text-[#27b99a]">
                        Criar conta
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-800 p-3">
                  <div className="flex flex-col gap-2">
                    <Link 
                      href="#"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-[#27b99a] dark:hover:text-[#27b99a] rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" /> 
                      <span>Rastrear pedido</span>
                    </Link>
                    <Link 
                      href="#"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-[#27b99a] dark:hover:text-[#27b99a] rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <Calendar className="w-4 h-4" /> 
                      <span>Nossos prazos de entrega</span>
                    </Link>
                    <Link 
                      href="#"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-[#27b99a] dark:hover:text-[#27b99a] rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" /> 
                      <span>Formas de pagamento</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
