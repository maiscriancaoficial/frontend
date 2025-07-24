"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, Tag, Sparkles, ChevronRight, Gift, ShoppingBag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Notificacao {
  id: string;
  tipo: 'oferta' | 'lancamento' | 'novidade' | 'pedido';
  titulo: string;
  mensagem: string;
  data: string;
  link?: string;
  imagem?: string;
  lida: boolean;
}

interface NotificacoesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notificacoes: Notificacao[];
  onMarcarComoLida?: (id: string) => void;
  onMarcarTodasComoLidas?: () => void;
}

export function NotificacoesDrawer({
  isOpen,
  onClose,
  notificacoes = [],
  onMarcarComoLida,
  onMarcarTodasComoLidas
}: NotificacoesDrawerProps) {
  
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;
  
  const getIconePorTipo = (tipo: Notificacao['tipo']) => {
    switch(tipo) {
      case 'oferta':
        return <Tag className="w-5 h-5 text-green-500" />;
      case 'lancamento':
        return <Gift className="w-5 h-5 text-[#27b99a]" />;
      case 'novidade':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'pedido':
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getCorPorTipo = (tipo: Notificacao['tipo']) => {
    switch(tipo) {
      case 'oferta':
        return 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30';
      case 'lancamento':
        return 'bg-[#27b99a]/10 dark:bg-[#27b99a]/20 border-[#27b99a]/20 dark:border-[#27b99a]/30';
      case 'novidade':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30';
      case 'pedido':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800';
    }
  };
  
  const getTituloPorTipo = (tipo: Notificacao['tipo']) => {
    switch(tipo) {
      case 'oferta':
        return 'Oferta Especial';
      case 'lancamento':
        return 'Novo Lançamento';
      case 'novidade':
        return 'Novidade';
      case 'pedido':
        return 'Atualização de Pedido';
      default:
        return 'Notificação';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com blur effect */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 0.6, backdropFilter: 'blur(2px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer com animação suave */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 1.2 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col rounded-l-[2rem]"
          >
            {/* Cabeçalho com design refinado */}
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-[#ff0080] to-[#ff0080]/90 text-white rounded-bl-3xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-full shadow-inner">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Notificações
                    {notificacoesNaoLidas > 0 && (
                      <Badge className="bg-white/30 hover:bg-white/40 text-white text-xs rounded-full px-2.5">
                        {notificacoesNaoLidas}
                      </Badge>
                    )}
                  </h2>
                  <p className="text-sm opacity-90 mt-0.5">
                    {notificacoesNaoLidas > 0 ? `${notificacoesNaoLidas} não ${notificacoesNaoLidas === 1 ? 'lida' : 'lidas'}` : 'Nenhuma não lida'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Abas */}
            <div className="flex border-b border-gray-100 dark:border-gray-800">
              <button className="flex-1 py-3 px-2 text-sm font-medium text-[#f29798] border-b-2 border-[#f29798] dark:text-[#f29798] dark:border-[#f29798]">
                Todas
              </button>
              <button className="flex-1 py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#f29798] dark:hover:text-[#f29798]">
                Ofertas
              </button>
              <button className="flex-1 py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#f29798] dark:hover:text-[#f29798]">
                Lançamentos
              </button>
              <button className="flex-1 py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#f29798] dark:hover:text-[#f29798]">
                Pedidos
              </button>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-grow overflow-y-auto">
              {notificacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900 rounded-3xl shadow-inner mx-4 my-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-md mb-6">
                    <Bell className="w-16 h-16 text-[#f29798]/40 dark:text-[#f29798]/30" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Nenhuma notificação</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                    Você não tem notificações no momento. Fique atento às novas ofertas e lançamentos.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center px-4 py-3">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200 text-sm">Recentes</h3>
                    {notificacoesNaoLidas > 0 && (
                      <Button 
                        onClick={() => onMarcarTodasComoLidas?.()}
                        variant="ghost" 
                        size="sm"
                        className="text-xs text-gray-500 hover:text-pink-600"
                      >
                        Marcar todas como lidas
                      </Button>
                    )}
                  </div>
                  
                  {/* Lista de notificações */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {notificacoes.map((notificacao, index) => {
                      const NotificationLink = notificacao.link 
                        ? ({ children }: { children: React.ReactNode }) => 
                            <Link href={notificacao.link || '#'} className="block">{children}</Link>
                        : ({ children }: { children: React.ReactNode }) => 
                            <div>{children}</div>;
                            
                      return (
                        <NotificationLink key={notificacao.id}>
                          <motion.div 
                            key={notificacao.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "flex items-start gap-3 p-4 border rounded-2xl bg-white dark:bg-gray-800",
                              !notificacao.lida 
                                ? "border-l-4 border-l-[#f29798] border-gray-100 dark:border-gray-700 shadow-md" 
                                : "border-gray-100 dark:border-gray-800 shadow-sm",
                              "hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg"
                            )}
                          >
                            {/* Indicador não lida */}
                            {!notificacao.lida && (
                              <div className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-[#f29798]"></div>
                            )}
                            
                            {/* Ícone */}
                            <div className={cn(
                              "shrink-0 h-12 w-12 rounded-full flex items-center justify-center shadow-inner",
                              getCorPorTipo(notificacao.tipo)
                            )}>
                              {getIconePorTipo(notificacao.tipo)}
                            </div>
                            
                            {/* Conteúdo */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <Badge 
                                  variant="secondary" 
                                  className={cn(
                                    "text-[10px] h-4 px-1.5 font-normal rounded-full",
                                    notificacao.tipo === 'oferta' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                    notificacao.tipo === 'lancamento' && "bg-[#27b99a]/10 text-[#27b99a] dark:bg-[#27b99a]/20 dark:text-[#27b99a]",
                                    notificacao.tipo === 'novidade' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                    notificacao.tipo === 'pedido' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  )}
                                >
                                  {getTituloPorTipo(notificacao.tipo)}
                                </Badge>
                                
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1 inline" />
                                  {notificacao.data}
                                </span>
                              </div>
                              
                              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1 truncate">
                                {notificacao.titulo}
                              </h4>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {notificacao.mensagem}
                              </p>
                              
                              {/* Imagem opcional */}
                              {notificacao.imagem && (
                                <div className="mt-2 relative h-20 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                                  <Image
                                    src={notificacao.imagem}
                                    alt={notificacao.titulo}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              
                              {notificacao.link && (
                                <div className="mt-2 text-xs text-right">
                                  <span className="text-[#27b99a] dark:text-[#27b99a] font-medium flex items-center justify-end">
                                    Ver mais <ChevronRight className="w-3 h-3 ml-0.5" />
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </NotificationLink>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Rodapé */}
            {notificacoes.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                <Button className="bg-[#27b99a] hover:bg-[#27b99a]/90 text-white w-full py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Ver todas as notificações
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
