"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

interface LivroGeneroFormProps {
  slug: string;
  categoriaSlug: string;
  livroNome: string;
  livroCapa: string;
  livroPreco: number;
  livroPrecoPromocional?: number;
}

export function LivroGeneroForm({ 
  slug, 
  categoriaSlug, 
  livroNome, 
  livroCapa, 
  livroPreco, 
  livroPrecoPromocional 
}: LivroGeneroFormProps) {
  const [genero, setGenero] = useState<'menino' | 'menina' | null>(null);
  const [nome, setNome] = useState('');
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (genero && nome.trim()) {
      router.push(`/categoria-livro/${categoriaSlug}/livro/${slug}/personalizar-avatar?genero=${genero}&nome=${encodeURIComponent(nome)}`);
    }
  };

  const desconto = livroPrecoPromocional ? Math.round(((livroPreco - livroPrecoPromocional) / livroPreco) * 100) : 0;

  return (
    <div className="w-full rounded-lg overflow-hidden bg-white shadow-md">
      <div className="flex flex-col lg:flex-row">
        {/* Coluna da capa (direita em desktop) */}
        <div className="lg:order-2 w-full lg:w-2/5 relative">
          <div className="relative w-full aspect-[3/4] lg:h-full">
            <Image 
              src={livroCapa}
              alt={livroNome}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            {desconto > 0 && (
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[#e8094c] text-white flex items-center justify-center font-bold text-lg">
                {desconto}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Coluna do formulário (esquerda em desktop) */}
        <div className="lg:order-1 w-full lg:w-3/5 p-6 lg:p-8">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="text-lg font-medium text-[#e8094c] mb-1">
              Livro Digital Personalizado
            </div>
            <h1 className="text-2xl font-bold text-black mb-3">
              {livroNome}
            </h1>
            
            <div className="flex items-baseline">
              {livroPrecoPromocional ? (
                <>
                  <span className="text-2xl font-bold text-[#e8094c] mr-2">
                    R$ {livroPrecoPromocional.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    R$ {livroPreco.toFixed(2).replace('.', ',')}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#5aa7a0]">
                  R$ {livroPreco.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1 text-gray-700">
                Nome da criança
              </label>
              <Input 
                id="nome" 
                type="text" 
                placeholder="Comece pelo nome do pequeno..." 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="rounded-full border-gray-300 focus:border-[#e8094c] focus:ring focus:ring-[#e8094c]/20"
                required
              />
            </div>
            
            <div>
              <div className="block text-sm font-medium mb-3 text-gray-700">
                Escolha o gênero
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                    genero === 'menino' 
                      ? 'border-[#5aa7a0] bg-[#5aa7a0] text-white' 
                      : 'border-gray-300 bg-white hover:border-[#5aa7a0]'
                  }`}
                  onClick={() => setGenero('menino')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="3" />
                    <path d="M12 8v11" />
                    <path d="m9 14 3 3 3-3" />
                  </svg>
                  <span className="font-medium">MENINO</span>
                </button>

                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                    genero === 'menina' 
                      ? 'border-[#e8094c] bg-[#e8094c] text-white' 
                      : 'border-gray-300 bg-white hover:border-[#e8094c]'
                  }`}
                  onClick={() => setGenero('menina')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="3" />
                    <path d="M12 8v11" />
                    <path d="M9 16h6" />
                  </svg>
                  <span className="font-medium">MENINA</span>
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={!genero || !nome.trim()}
              className="w-full bg-[#e8094c] hover:bg-[#e8094c]/90 rounded-full py-6 text-white font-bold text-lg"
            >
              CRIAR LIVRO
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
