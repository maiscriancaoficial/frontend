'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, Eye, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ItemCarrinho {
  id: string;
  // Campos unificados (funciona para livros e produtos)
  titulo?: string;           // Para produtos
  livroNome?: string;        // Para livros
  preco?: number;            // Para produtos
  livroPreco?: number;       // Para livros
  precoPromocional?: number | null;     // Para produtos
  livroPrecoPromocional?: number;       // Para livros
  quantidade: number;
  fotoPrincipal?: string;    // Para produtos
  livroCapa?: string;        // Para livros
  slug?: string;
  categoria?: { titulo: string; slug: string };
  
  // Campos específicos para livros personalizados
  nomePersonagem?: string;
  avatar?: any;
  tipo?: string;
  adicionadoEm?: string;
  livroId?: string;
}

// Funções auxiliares para detectar tipo e extrair dados
const isLivro = (item: ItemCarrinho) => {
  return item.livroNome || item.nomePersonagem || item.tipo === 'livro';
};

const getTitulo = (item: ItemCarrinho) => {
  return item.titulo || item.livroNome || 'Item sem título';
};

const getImagem = (item: ItemCarrinho) => {
  return item.fotoPrincipal || item.livroCapa || '/images/placeholder.jpg';
};

const getPreco = (item: ItemCarrinho) => {
  return item.preco || item.livroPreco || 0;
};

const getPrecoPromocional = (item: ItemCarrinho) => {
  return item.precoPromocional || item.livroPrecoPromocional || null;
};

const CarrinhoItens = () => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [quantidade, setQuantidade] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho) {
      const itensCarrinho = JSON.parse(carrinho);
      setItens(itensCarrinho);
      setQuantidade(itensCarrinho.reduce((acc: number, item: ItemCarrinho) => acc + item.quantidade, 0));
    }
  }, []);

  const removerDoCarrinho = (id: string) => {
    const novoCarrinho = itens.filter((item) => item.id !== id);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    setItens(novoCarrinho);
    setQuantidade(novoCarrinho.reduce((acc: number, item: ItemCarrinho) => acc + item.quantidade, 0));
    toast.success("Item removido do carrinho!");
  };

  const atualizarQuantidade = (id: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }
    
    const novoCarrinho = itens.map((item) => {
      if (item.id === id) {
        return { ...item, quantidade: novaQuantidade };
      }
      return item;
    });
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    setItens(novoCarrinho);
    setQuantidade(novoCarrinho.reduce((acc: number, item: ItemCarrinho) => acc + item.quantidade, 0));
  };

  if (itens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart size={40} className="text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Seu carrinho está vazio</h3>
        <p className="text-center text-gray-500 max-w-md">
          Adicione livros personalizados ao seu carrinho para continuar.
        </p>
        <Button asChild className="bg-[#ff007d] hover:bg-[#ff007d]/90 text-white rounded-full px-8">
          <Link href="/">
            Explorar Livros
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Seus Livros</h3>
              <p className="text-sm text-gray-500">{quantidade} {quantidade === 1 ? 'item selecionado' : 'itens selecionados'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {itens.map((item) => {
          const precoFinal = getPrecoPromocional(item) || getPreco(item);
          const precoTotal = precoFinal * item.quantidade;
          const ehLivro = isLivro(item);
          
          return (
            <div key={item.id} className="p-6">
              <div className="flex gap-6">
                {/* Thumbnail do item */}
                <div className="w-32 h-40 rounded-3xl overflow-hidden relative flex-shrink-0 bg-gray-50 shadow-sm">
                  <Image 
                    src={getImagem(item)}
                    alt={getTitulo(item)}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Informações do item */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">{getTitulo(item)}</h4>
                  
                  {/* Mostrar personagem apenas para livros */}
                  {ehLivro && item.nomePersonagem && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">👤</span>
                      </div>
                      <span className="text-sm text-gray-600">Personagem: <span className="font-medium">{item.nomePersonagem}</span></span>
                    </div>
                  )}
                  
                  {/* Botões de ação - apenas para livros */}
                  {ehLivro && (
                    <div className="flex items-center gap-3 mb-4">
                      <Button
                        onClick={() => {
                          // Navegar para prévia do livro
                          const slug = getTitulo(item).toLowerCase().replace(/\s+/g, '-');
                          router.push(`/categoria-livro/aventura/livro/${slug}/previa-livro`);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-[#ff007d] border-[#ff007d]/20 hover:bg-[#ff007d]/5 rounded-full"
                      >
                        <Eye size={16} />
                        Ver Prévia
                      </Button>
                      <Button
                        onClick={() => {
                          // Navegar para edição do avatar
                          const slug = getTitulo(item).toLowerCase().replace(/\s+/g, '-');
                          router.push(`/categoria-livro/aventura/livro/${slug}/personalizar-avatar`);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-[#27b99a] border-[#27b99a]/20 hover:bg-[#27b99a]/5 rounded-full"
                      >
                        <Edit3 size={16} />
                        Editar Avatar
                      </Button>
                    </div>
                  )}
                  
                  {/* Controles de quantidade e preço */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors rounded-l-full"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center flex items-center justify-center font-medium text-sm bg-gray-50">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors rounded-r-full"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <Button
                        onClick={() => removerDoCarrinho(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-lg text-gray-900">
                        R$ {precoTotal.toFixed(2)}
                      </div>
                      {getPrecoPromocional(item) && (
                        <div className="text-sm text-gray-500 line-through">
                          R$ {(getPreco(item) * item.quantidade).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild className="text-gray-600 border-gray-200 hover:bg-gray-50">
            <Link href="/">
              Continuar Comprando
            </Link>
          </Button>
          <div className="text-sm text-gray-500">
            {quantidade} {quantidade === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </div>
    </div>
  );
};

export { CarrinhoItens };
