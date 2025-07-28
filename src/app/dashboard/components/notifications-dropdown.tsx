'use client';

import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Star,
  ArrowUpRight,
  X,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Tipos de notificação
type NotificationType = 'pedido' | 'venda' | 'estoque' | 'avaliacao' | 'sistema' | 'financeiro';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: {
    orderId?: string;
    productId?: string;
    userId?: string;
    amount?: number;
  };
}

// Mock de notificações em tempo real
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'pedido',
    title: 'Novo Pedido Recebido',
    message: 'Pedido #1234 - Rosa Vermelha Premium por Maria Silva',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min atrás
    read: false,
    priority: 'high',
    metadata: { orderId: '1234', amount: 89.90 }
  },
  {
    id: '2',
    type: 'venda',
    title: 'Meta de Vendas Atingida',
    message: 'Parabéns! Você atingiu 80% da meta mensal',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
    read: false,
    priority: 'medium',
    metadata: { amount: 12500.00 }
  },
  {
    id: '3',
    type: 'estoque',
    title: 'Estoque Baixo',
    message: 'Rosa Branca Premium - Apenas 3 unidades restantes',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    read: false,
    priority: 'high',
    metadata: { productId: 'rosa-branca-premium' }
  },
  {
    id: '4',
    type: 'avaliacao',
    title: 'Nova Avaliação 5 Estrelas',
    message: 'João Santos avaliou "Buquê Romântico" com 5 estrelas',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1h atrás
    read: true,
    priority: 'low',
    metadata: { userId: 'joao-santos' }
  },
  {
    id: '5',
    type: 'financeiro',
    title: 'Pagamento Processado',
    message: 'Pedido #1230 - Pagamento de R$ 156,90 confirmado',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    read: true,
    priority: 'medium',
    metadata: { orderId: '1230', amount: 156.90 }
  },
  {
    id: '6',
    type: 'sistema',
    title: 'Backup Concluído',
    message: 'Backup automático dos dados realizado com sucesso',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h atrás
    read: true,
    priority: 'low'
  }
];

// Configurações visuais por tipo
const notificationConfig = {
  pedido: {
    icon: ShoppingBag,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  venda: {
    icon: TrendingUp,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  estoque: {
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  avaliacao: {
    icon: Star,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  sistema: {
    icon: CheckCircle,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800'
  },
  financeiro: {
    icon: DollarSign,
    color: 'text-[#27b99a] dark:text-[#27b99a]',
    bgColor: 'bg-[#27b99a]/10 dark:bg-[#27b99a]/20',
    borderColor: 'border-[#27b99a]/20 dark:border-[#27b99a]/30'
  }
};

// Função para formatar tempo relativo
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d atrás`;
};

// Função para formatar valor monetário
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<NotificationType | 'all'>('all');

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || notification.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Contar não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Marcar como lida
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Remover notificação
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#ff0080]/10 dark:bg-[#27b99a]/20 rounded-full">
                  <Bell className="h-4 w-4 text-[#ff0080] dark:text-[#27b99a]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Notificações
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {unreadCount} não lidas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs text-[#ff0080] dark:text-[#27b99a] hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10 rounded-full px-3"
                  >
                    Marcar todas
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 rounded-2xl border-gray-200 dark:border-gray-700 focus:border-[#ff0080] dark:focus:border-[#27b99a] focus:ring-[#ff0080]/20 dark:focus:ring-[#27b99a]/20"
                />
              </div>
              
              <div className="flex gap-1 overflow-x-auto pb-1">
                {(['all', 'pedido', 'venda', 'estoque', 'avaliacao', 'financeiro', 'sistema'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "text-xs rounded-full px-3 py-1 whitespace-nowrap",
                      selectedFilter === filter 
                        ? "bg-[#ff0080] dark:bg-[#27b99a] text-white hover:bg-[#ff0080]/90 dark:hover:bg-[#27b99a]/90" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {filter === 'all' ? 'Todas' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto mb-3">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedFilter !== 'all' 
                    ? 'Nenhuma notificação encontrada' 
                    : 'Nenhuma notificação ainda'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredNotifications.map((notification) => {
                  const config = notificationConfig[notification.type];
                  const IconComponent = config.icon;
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group",
                        !notification.read && "bg-blue-50/30 dark:bg-blue-900/10"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-full flex-shrink-0",
                          config.bgColor
                        )}>
                          <IconComponent className={cn("h-4 w-4", config.color)} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={cn(
                                  "text-sm font-medium truncate",
                                  !notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                                )}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-[#ff0080] dark:bg-[#27b99a] rounded-full flex-shrink-0" />
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeAgo(notification.timestamp)}
                                  </span>
                                  
                                  {notification.priority === 'high' && (
                                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                      Urgente
                                    </Badge>
                                  )}
                                  
                                  {notification.metadata?.amount && (
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                      {formatCurrency(notification.metadata.amount)}
                                    </Badge>
                                  )}
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-[#ff0080] dark:text-[#27b99a] hover:bg-[#ff0080]/10 dark:hover:bg-[#27b99a]/10 font-medium rounded-2xl"
              >
                Ver histórico completo
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
