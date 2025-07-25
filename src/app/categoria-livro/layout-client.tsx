'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function CategoriaLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Verificar se estamos na rota de personalizar avatar
  const isAvatarPersonalizationPage = pathname?.includes('/personalizar-avatar');
  
  return (
    <>
      {!isAvatarPersonalizationPage && <Header />}
      <main className={`min-h-screen ${isAvatarPersonalizationPage ? 'pb-0' : ''}`}>
        {children}
      </main>
      {!isAvatarPersonalizationPage && <Footer />}
    </>
  );
}
