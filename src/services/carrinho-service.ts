import { ProdutoCard } from "@/types/produto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrinho {
  produto: ProdutoCard;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  // Dados de personalização para livros
  personalizacao?: {
    nomePersonagem: string;
    genero: 'menino' | 'menina';
    avatar?: {
      pele?: string;
      cabelo?: string;
      olhos?: string;
      roupa?: string;
      corCabelo?: string;
      corRoupa?: string;
      acessorios?: string[];
    };
    elementos?: {
      peles: any[];
      cabelos: any[];
      olhos: any[];
      roupas: any[];
      coresCabelo: any[];
      coresRoupa: any[];
      acessorios: any[];
    };
  };
}

interface CarrinhoStore {
  itens: ItemCarrinho[];
  total: number;
  quantidade: number;
  desconto: number;
  
  // Métodos
  adicionarAoCarrinho: (produto: ProdutoCard, quantidade: number, personalizacao?: ItemCarrinho['personalizacao']) => void;
  removerDoCarrinho: (produtoId: number) => void;
  atualizarQuantidade: (produtoId: number, quantidade: number) => void;
  limparCarrinho: () => void;
  aplicarCupom: (codigo: string) => boolean;
  calcularSubtotal: () => number;
  calcularDesconto: () => number;
}

// Simulação de cupons válidos
const cuponsValidos = [
  { codigo: "FLORES10", desconto: 0.1 },
  { codigo: "BEMVINDO20", desconto: 0.2 },
  { codigo: "FRETE", desconto: 0.05 },
];

export const useCarrinhoStore = create<CarrinhoStore>()(
  persist(
    (set, get) => ({
      itens: [],
      total: 0,
      quantidade: 0,
      desconto: 0,
      
      adicionarAoCarrinho: (produto, quantidade, personalizacao) => {
        const itens = [...get().itens];
        
        // Para livros personalizados, verificar se já existe um item com a mesma personalização
        let itemIndex = -1;
        if (personalizacao) {
          itemIndex = itens.findIndex(item => 
            item.produto.id === produto.id && 
            item.personalizacao?.nomePersonagem === personalizacao.nomePersonagem &&
            item.personalizacao?.genero === personalizacao.genero
          );
        } else {
          itemIndex = itens.findIndex(item => item.produto.id === produto.id && !item.personalizacao);
        }
        
        if (itemIndex !== -1) {
          // O produto já existe no carrinho, atualize a quantidade
          itens[itemIndex].quantidade += quantidade;
          itens[itemIndex].precoTotal = itens[itemIndex].quantidade * itens[itemIndex].precoUnitario;
        } else {
          // O produto não existe no carrinho, adicione-o
          const precoUnitario = produto.precoPromocional || produto.preco;
          const precoTotal = precoUnitario * quantidade;
          
          itens.push({
            produto,
            quantidade,
            precoUnitario,
            precoTotal,
            personalizacao,
          });
        }
        
        // Calcular totais
        const total = itens.reduce((sum, item) => sum + item.precoTotal, 0);
        const quantidadeTotal = itens.reduce((sum, item) => sum + item.quantidade, 0);
        
        set({ itens, total, quantidade: quantidadeTotal });
      },
      
      removerDoCarrinho: (produtoId) => {
        const itens = get().itens.filter(item => item.produto.id !== produtoId);
        
        // Calcular totais
        const total = itens.reduce((sum, item) => sum + item.precoTotal, 0);
        const quantidade = itens.reduce((sum, item) => sum + item.quantidade, 0);
        
        set({ itens, total, quantidade });
      },
      
      atualizarQuantidade: (produtoId, quantidade) => {
        if (quantidade <= 0) {
          get().removerDoCarrinho(produtoId);
          return;
        }
        
        const itens = [...get().itens];
        const itemIndex = itens.findIndex(item => item.produto.id === produtoId);
        
        if (itemIndex !== -1) {
          itens[itemIndex].quantidade = quantidade;
          itens[itemIndex].precoTotal = quantidade * itens[itemIndex].precoUnitario;
          
          // Calcular totais
          const total = itens.reduce((sum, item) => sum + item.precoTotal, 0);
          const quantidadeTotal = itens.reduce((sum, item) => sum + item.quantidade, 0);
          
          set({ itens, total, quantidade: quantidadeTotal });
        }
      },
      
      limparCarrinho: () => {
        set({ itens: [], total: 0, quantidade: 0 });
      },
      
      aplicarCupom: (codigo) => {
        const cupom = cuponsValidos.find(c => c.codigo === codigo.toUpperCase());
        
        if (!cupom) return false;
        
        // Calcular o desconto baseado no subtotal
        const subtotal = get().calcularSubtotal();
        const valorDesconto = subtotal * cupom.desconto;
        
        // Atualizar o desconto e o total
        const total = subtotal - valorDesconto;
        
        set({ total, desconto: valorDesconto });
        return true;
      },
      
      calcularSubtotal: () => {
        // Soma o preço total de todos os itens no carrinho
        return get().itens.reduce((sum, item) => sum + item.precoTotal, 0);
      },
      
      calcularDesconto: () => {
        // Retorna o valor do desconto atual
        return get().desconto;
      }
    }),
    {
      name: "carrinho-storage", // nome único para o storage
    }
  )
);
