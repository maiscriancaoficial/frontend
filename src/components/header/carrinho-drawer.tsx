"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Truck, 
  Gift, 
  CreditCard, 
  Loader2, 
  ShieldCheck, 
  Clock,
  Check,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useCarrinhoStore, type ItemCarrinho } from '@/services/carrinho-service';

interface CarrinhoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Funções auxiliares para trabalhar com diferentes tipos de itens
function getTitulo(item: ItemCarrinho): string {
  return item.produto.titulo || '';
}

function getPreco(item: ItemCarrinho): number {
  return item.produto.preco || 0;
}

function getPrecoPromocional(item: ItemCarrinho): number | null {
  return item.produto.precoPromocional || null;
}

function getImagem(item: ItemCarrinho): string {
  return item.produto.fotoPrincipal || '/images/placeholder.jpg';
}

function getId(item: ItemCarrinho): string {
  return item.produto.id?.toString() || '';
}

function getSlug(item: ItemCarrinho): string {
  return item.produto.slug || '';
}

function getUniqueKey(item: ItemCarrinho, index: number): string {
  const baseId = getId(item);
  if (item.personalizacao) {
    return `${baseId}-${item.personalizacao.nomePersonagem}-${item.personalizacao.genero}-${index}`;
  }
  return `${baseId}-${index}`;
}

export function CarrinhoDrawer({
  isOpen,
  onClose
}: CarrinhoDrawerProps) {
  const { 
    itens: produtos, 
    desconto: valorDesconto,
    atualizarQuantidade,
    removerDoCarrinho,
    aplicarCupom,
    calcularSubtotal
  } = useCarrinhoStore();
  
  const [cupom, setCupom] = useState('');
  const [cep, setCep] = useState('');
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [valorFrete, setValorFrete] = useState<number | null>(null);
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<'itens' | 'entrega' | 'pagamento'>('itens');
  
  // Calcular subtotal usando o store
  const subtotal = calcularSubtotal();
  
  // Atualizar quantidade do produto
  const onUpdateQuantidade = (id: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(id);
    } else {
      atualizarQuantidade(id, quantidade);
    }
  };
  
  // Remover item do carrinho
  const onRemoveItem = (id: number) => {
    removerDoCarrinho(id);
  };

  // Total com frete e desconto
  const total = subtotal + (valorFrete || 0) - valorDesconto;

  const handleCalcularFrete = () => {
    if (cep.length === 8 || cep.length === 9) {
      setCarregandoFrete(true);
      
      // Simulando cálculo de frete
      setTimeout(() => {
        setValorFrete(15.9);
        setCarregandoFrete(false);
      }, 1000);
    }
  };

  const handleQuantidade = (id: number, acao: 'aumentar' | 'diminuir') => {
    const produto = produtos.find(p => p.produto.id === id);
    if (!produto) return;

    const novaQuantidade = acao === 'aumentar' 
      ? produto.quantidade + 1 
      : Math.max(1, produto.quantidade - 1);
    
    // Se a nova quantidade for 0, remover o item
    if (novaQuantidade <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantidade(id, novaQuantidade);
    }
  };

  const handleAplicarCupom = () => {
    const sucesso = aplicarCupom(cupom);
    if (sucesso) {
      setCupomAplicado(true);
    }
  };

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com blur effect */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 0.6, backdropFilter: 'blur(2px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer com animação suave */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 1.2 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col rounded-l-[2rem]"
          >
            {/* Cabeçalho com design refinado */}
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] text-white rounded-bl-3xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full shadow-inner">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Seu Carrinho
                    <Badge className="bg-white/30 hover:bg-white/40 text-white text-xs rounded-full">
                      {produtos.length}
                    </Badge>
                  </h2>
                  <p className="text-sm opacity-90 mt-0.5">
                    {produtos.length > 0 ? `${produtos.length} ${produtos.length === 1 ? 'item' : 'itens'} adicionados` : 'Carrinho vazio'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Espaçamento superior */}
            <div className="py-1"></div>

            {/* Conteúdo principal */}
            <div className="flex-grow overflow-y-auto p-4">
              {produtos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4">
                      <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Seu carrinho está vazio</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                      Adicione itens ao seu carrinho para continuar suas compras.
                    </p>
                    <Button 
                      onClick={onClose} 
                      className="bg-[#f29798] hover:bg-[#f29798]/80 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                    >
                      Explorar produtos
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {secaoAtiva === 'itens' && (
                    <motion.div
                      key="itens-section"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 mb-6"
                    >
                      {/* Lista de produtos */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-700 dark:text-gray-200">Seus produtos</h3>
                        <Badge variant="outline" className="text-xs font-normal bg-[#f29798]/10 text-[#f29798] border-[#f29798]/20 px-2 rounded-full">
                          {produtos.length} {produtos.length === 1 ? 'item' : 'itens'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {produtos.map((produto, index) => (
                          <motion.div 
                            key={getUniqueKey(produto, index)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="group flex gap-3 p-3 bg-white dark:bg-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow"
                          >
                            {/* Imagem */}
                            <div className="relative h-20 w-20 bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 group-hover:border-[#f29798]/30 transition-colors">
                              <Image
                                src={getImagem(produto)}
                                alt={getTitulo(produto)}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>

                            {/* Informações */}
                            <div className="flex-grow flex flex-col">
                              <Link href={`/produto/${getSlug(produto)}`} className="font-medium text-sm mb-1 hover:text-[#27b99a] dark:hover:text-[#27b99a] line-clamp-2 transition-colors">
                                {getTitulo(produto)}
                              </Link>
                              {produto.personalizacao && (
                                <p className="text-xs text-gray-500 mb-1">
                                  Personagem: {produto.personalizacao.nomePersonagem} ({produto.personalizacao.genero})
                                </p>
                              )}
                              
                              <div className="mt-auto flex items-center justify-between gap-2">
                                <div>
                                  <div className="text-sm font-semibold text-[#27b99a] dark:text-[#27b99a]">
                                    {formatarPreco(getPrecoPromocional(produto) || getPreco(produto))}
                                  </div>
                                  {getPrecoPromocional(produto) && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                      {formatarPreco(getPreco(produto))}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 rounded-full px-1 py-0.5 border border-gray-100 dark:border-gray-600">
                                  <div className="flex border rounded-full overflow-hidden shadow-sm">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 rounded-l-full border-r border-gray-200 dark:border-gray-700 hover:bg-[#27b99a]/10 transition-colors duration-200"
                                      onClick={() => handleQuantidade(produto.produto.id, 'diminuir')}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <div className="flex items-center justify-center h-8 w-9 bg-white dark:bg-gray-800 text-sm font-medium">
                                      {produto.quantidade}
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 rounded-r-full border-l border-gray-200 dark:border-gray-700 hover:bg-[#27b99a]/10 transition-colors duration-200"
                                      onClick={() => handleQuantidade(produto.produto.id, 'aumentar')}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Botão remover */}
                            <div className="flex items-center">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => onRemoveItem && onRemoveItem(produto.produto.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 hover:shadow-md"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}



                  {/* Cupom de desconto */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl mb-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
                      <div className="bg-[#27b99a]/10 dark:bg-[#27b99a]/20 p-1.5 rounded-full">
                        <Gift className="w-4 h-4 text-[#27b99a]" />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">Cupom de Desconto</span>
                      {cupomAplicado && (
                        <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 font-normal text-xs rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Aplicado
                        </Badge>
                      )}
                    </h3>

                    <div className="flex w-full rounded-full border border-gray-200 dark:border-gray-600 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <Input
                        placeholder="LIVROS10"
                        value={cupom}
                        onChange={(e) => setCupom(e.target.value)}
                        disabled={cupomAplicado}
                        className="flex-1 border-0 rounded-l-full bg-white dark:bg-gray-800 py-6 text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      
                      <Button 
                        onClick={handleAplicarCupom}
                        disabled={!cupom || cupomAplicado}
                        className={cn(
                          "rounded-r-full py-6 px-5 font-medium border-0",
                          !cupomAplicado
                            ? "bg-[#ff0080] hover:bg-[#ff0080]/90 text-white"
                            : "bg-[#27b99a] hover:bg-[#27b99a]/90 text-white cursor-not-allowed"
                        )}
                      >
                        {cupomAplicado ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span>Aplicar</span>
                        )}
                      </Button>
                    </div>
                    
                    {cupomAplicado && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3" />
                        <span>Cupom aplicado! Desconto de {formatarPreco(valorDesconto)} no seu pedido</span>
                      </motion.div>
                    )}
                  </motion.div>
                </>
              )}
            </div>

            {/* Rodapé com resumo e ações */}
            {produtos.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                {/* Resumo */}
                <div className="space-y-3 mb-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>{formatarPreco(subtotal)}</span>
                  </div>
                  
                  {valorFrete !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Frete</span>
                      <span>{formatarPreco(valorFrete)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-700 text-lg">
                    <span>Total</span>
                    <span className="text-[#27b99a] dark:text-[#27b99a]">{formatarPreco(total)}</span>
                  </div>
                  
                  <div className="flex justify-end items-center text-sm text-gray-600 dark:text-gray-400">
                    <CreditCard className="w-4 h-4 mr-1" />
                    <span>10x de {formatarPreco(total / 10)} sem juros</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col gap-3">
                  <Button className="bg-[#27b99a] hover:bg-[#27b99a]/90 text-white w-full py-6 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Finalizar Compra
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  
                  <Link href="/carrinho" className="text-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#27b99a] dark:hover:text-[#27b99a]">
                    Ver carrinho completo
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
