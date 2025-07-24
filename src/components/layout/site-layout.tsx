'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { MobileFooter } from './mobile-footer';
import { ChatFlutuante } from './chat-flutuante';
import { CookiesConsent } from './cookies-consent';

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      
      {/* Conteúdo principal com padding-top para compensar o header fixo */}
      <main className="flex-grow pt-36 md:pt-32 lg:pb-8 pb-24">
        {children}
      </main>
      
      <Footer />
      
      {/* Footer mobile */}
      <MobileFooter />
      
      {/* Componentes flutuantes */}
      <ChatFlutuante />
      <CookiesConsent />
    </div>
  );
}
