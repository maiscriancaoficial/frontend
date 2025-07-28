'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, X, ChevronRight, Receipt, Lock, Award } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ItemCarrinho {
  id: string;
  titulo: string;
  preco: number;
  precoPromocional?: number | null;
  fotoPrincipal: string;
  quantidade: number;
  slug: string;
  categoria?: { titulo: string; slug: string };
  // Campos específicos de livros
  livroId?: string;
  livroNome?: string;
  livroPreco?: number;
  livroPrecoPromocional?: number | null;
  livroCapa?: string;
  avatar?: any;
  nomePersonagem?: string;
  tipo?: string;
  adicionadoEm?: string;
}

// Funções auxiliares para trabalhar com diferentes tipos de itens
function getPreco(item: ItemCarrinho): number {
  return item.preco ?? item.livroPreco ?? 0;
}

function getPrecoPromocional(item: ItemCarrinho): number | null {
  return item.precoPromocional ?? item.livroPrecoPromocional ?? null;
}

export function CarrinhoResumo() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  
  useEffect(() => {
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho) {
      setItens(JSON.parse(carrinho));
    }
    
    // Escutar eventos de atualização do carrinho
    const handleCarrinhoAtualizado = () => {
      const carrinhoAtualizado = localStorage.getItem('carrinho');
      if (carrinhoAtualizado) {
        setItens(JSON.parse(carrinhoAtualizado));
      } else {
        setItens([]);
      }
    };
    
    window.addEventListener('carrinho-atualizado', handleCarrinhoAtualizado);
    
    return () => {
      window.removeEventListener('carrinho-atualizado', handleCarrinhoAtualizado);
    };
  }, []);
  
  const handleAplicarCupom = () => {
    if (!cupom) return;
    
    setCarregando(true);
    // Simulando um delay de rede
    setTimeout(() => {
      // Simular validação de cupom
      const cuponsValidos = ['FLORES10', 'DESCONTO15', 'PRIMEIRA20'];
      const resultado = cuponsValidos.includes(cupom.toUpperCase());
      
      if (resultado) {
        setCupomAplicado(true);
        toast.success(`Cupom ${cupom.toUpperCase()} aplicado com sucesso!`);
      } else {
        toast.error(`Cupom ${cupom.toUpperCase()} inválido ou expirado.`);
      }
      setCarregando(false);
    }, 800);
  };
  
  // Calcular valores
  const subtotal = itens.reduce((acc, item) => {
    const precoPromocional = getPrecoPromocional(item);
    const preco = precoPromocional || getPreco(item);
    const quantidade = item.quantidade || 1;
    return acc + (preco * quantidade);
  }, 0);
  
  const desconto = cupomAplicado ? subtotal * 0.1 : 0; // 10% de desconto
  const total = subtotal - desconto; // Sem frete para produtos digitais

  // Se não houver itens, não mostra o resumo
  if (itens.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-4">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            <Receipt className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Resumo da Compra</h3>
            <p className="text-sm text-gray-500">Detalhes do seu pedido</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Valores */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
          </div>
          
          {cupomAplicado && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Desconto (10%)</span>
              <span className="text-green-600 font-medium">-R$ {desconto.toFixed(2)}</span>
            </div>
          )}
          
          {/* Cupom */}
          {!cupomAplicado ? (
            <div className="pt-2">
              <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
                Cupom de desconto
              </label>
              <div className="flex gap-2">
                <Input 
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  placeholder="FLORES10"
                  className="rounded-full border-gray-200 dark:border-gray-700"
                />
                <Button
                  onClick={handleAplicarCupom}
                  disabled={!cupom || carregando}
                  className="rounded-full bg-black hover:bg-gray-800 text-white dark:bg-black dark:text-white dark:hover:bg-gray-800"
                >
                  {carregando ? "Aplicando..." : "Aplicar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl p-3">
              <div className="flex items-center">
                <Gift className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">{cupom.toUpperCase()}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50"
                onClick={() => setCupomAplicado(false)}
              >
                <X size={14} />
              </Button>
            </div>
          )}
          
          <div className="border-t border-gray-100 dark:border-gray-800 my-3 pt-3"></div>
          
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <Button
          asChild
          className="w-full h-12 bg-[#ff007d] hover:bg-[#ff007d]/90 text-white rounded-full font-medium"
        >
          <Link href="/checkout">
            Finalizar Compra
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            <span>Garantia de qualidade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
