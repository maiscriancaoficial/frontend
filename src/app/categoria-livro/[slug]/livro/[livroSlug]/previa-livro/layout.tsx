// Este é um layout root sem header e footer para a prévia do livro
import React from 'react';
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

// Configurações para garantir que esse layout substitua completamente qualquer layout pai
export const metadata = {
  title: "Prévia do Livro | Mais Criança",
  description: "Visualize seu livro infantil personalizado",
};

// Configurações para o Next.js
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function PreviaLivroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Este layout substitui completamente o layout global,
  // removendo o header e footer padrão da aplicação
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Prévia do Livro | Mais Criança</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Visualize seu livro infantil personalizado" />
      </head>
      <body className={`${geistSans.variable} font-sans overflow-x-hidden`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          {/* Renderiza APENAS o conteúdo da página, sem header nem footer */}
          <div className="min-h-screen w-full">
            {children}
          </div>
          
          {/* Adiciona Toaster para feedback visual */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
