'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Heart, 
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MobileFooter() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  // Simular contagem de itens no carrinho e favoritos
  useEffect(() => {
    setCartCount(3); // Simular 3 itens no carrinho
    setFavCount(2); // Simular 2 favoritos
  }, []);

  // Links do footer mobile
  const navigationItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      active: pathname === '/'
    },
    {
      label: 'Buscar',
      href: '/busca',
      icon: Search,
      active: pathname === '/busca'
    },
    {
      label: 'Carrinho',
      href: '/carrinho',
      icon: ShoppingBag,
      active: pathname === '/carrinho',
      count: cartCount
    },
    {
      label: 'Favoritos',
      href: '/favoritos',
      icon: Heart,
      active: pathname === '/favoritos',
      count: favCount
    },
    {
      label: 'Conta',
      href: '/minha-conta',
      icon: User,
      active: pathname === '/minha-conta' || pathname.startsWith('/minha-conta/')
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)] z-40 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between px-2">
        {navigationItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className="relative flex-1"
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex flex-col items-center justify-center py-3",
                item.active 
                  ? "text-[#ff0080] dark:text-[#27b99a]" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
              
              {/* Contador (para carrinho e favoritos) */}
              {item.count && item.count > 0 && (
                <span className="absolute top-1 right-[calc(50%-10px)] bg-[#27b99a] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {item.count > 9 ? '9+' : item.count}
                </span>
              )}
              
              {/* Indicador de ativo */}
              {item.active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 w-12 h-0.5 bg-[#ff0080] dark:bg-[#27b99a] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
