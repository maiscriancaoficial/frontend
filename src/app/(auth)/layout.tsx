'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo - Imagem e branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[15%] w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-[20%] right-[15%] w-60 h-60 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute top-[40%] right-[25%] w-20 h-20 rounded-full bg-white/20"></div>
          <div className="absolute bottom-[35%] left-[20%] w-16 h-16 rounded-full bg-white/20"></div>
        </div>

        <div className="z-10 flex flex-col items-start space-y-6 mt-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
            <h1 className="text-[#12756a] text-4xl font-bold mb-4">Área do cliente</h1>
            <p className="text-gray-600 max-w-md leading-relaxed">
              Entre com seus dados de acesso para gerenciar seus pedidos, favoritos e dados cadastrais.
            </p>
          </div>
        </div>
        
        {/* Padrão geométrico moderno */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Formas geométricas abstratas */}
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          
          {/* Linhas curvas */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,30 Q50,0 100,30 V100 H0 Z" fill="rgba(255,255,255,0.03)" />
            <path d="M0,50 Q50,20 100,50 V100 H0 Z" fill="rgba(255,255,255,0.04)" />
            <path d="M0,70 Q50,40 100,70 V100 H0 Z" fill="rgba(255,255,255,0.05)" />
          </svg>
          
          {/* Pontos decorativos */}
          <div className="absolute top-[25%] left-[10%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[30%] left-[15%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[28%] left-[20%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[75%] right-[10%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[80%] right-[15%] w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="absolute top-[78%] right-[20%] w-1 h-1 bg-white/60 rounded-full"></div>
        </div>
      </div>
      
      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white relative">
        {/* Elementos decorativos sutis */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#27b99a] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#27b99a] to-transparent"></div>
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
