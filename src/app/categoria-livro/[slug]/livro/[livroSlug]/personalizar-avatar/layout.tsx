// Este é um layout específico para a página de personalização de avatar
// Ele não inclui o header e o footer global do site
import React from 'react';
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Personalizar seu Avatar | Mais Criança",
  description: "Personalize seu avatar para o livro infantil personalizado",
};

// Garantimos que este layout substitua qualquer layout pai

export default function AvatarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans overflow-x-hidden bg-gray-50`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          {/* Renderiza apenas o conteúdo da página, sem header nem footer */}
          <div className="min-h-screen">
            {children}
          </div>
          
          {/* Adiciona Toaster para feedback visual */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
