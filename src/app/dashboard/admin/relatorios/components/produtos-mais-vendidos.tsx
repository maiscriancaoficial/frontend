'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUp, ArrowDown } from "lucide-react";

// Interface para o produto
interface Produto {
  id: string;
  titulo: string;
  categoria?: {
    nome: string;
  };
  quantidadeVendida: number;
  numeroVendas: number;
  receita: number;
  preco: number;
  estoque: number;
  ativo: boolean;
  galeria?: string[];
}

export function ProdutosMaisVendidos() {
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState<{
    coluna: keyof Produto | null;
    ordem: "asc" | "desc";
  }>({
    coluna: "quantidadeVendida",
    ordem: "desc"
  });

  // Carregar produtos mais vendidos da API
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/relatorios/metricas?periodo=30');
        const data = await response.json();
        
        if (data.success && data.metricas.produtos.maisVendidos) {
          // Transformar dados da API para o formato esperado
          const produtosFormatados = data.metricas.produtos.maisVendidos.map((produto: any) => ({
            id: produto.id,
            titulo: produto.titulo || produto.nome,
            categoria: produto.categoria ? { nome: produto.categoria } : undefined,
            quantidadeVendida: produto.quantidadeVendida,
            numeroVendas: produto.numeroVendas,
            receita: produto.receita,
            preco: produto.preco,
            estoque: produto.estoque || 0,
            ativo: produto.ativo !== false,
            galeria: produto.galeria || []
          }));
          setProdutos(produtosFormatados);
        } else {
          setError('Erro ao carregar produtos');
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  if (loading) {
    return (
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Filtrar produtos por busca
  const produtosFiltrados = produtos.filter(produto => 
    busca === "" || 
    produto.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    (produto.categoria?.nome || '').toLowerCase().includes(busca.toLowerCase())
  );
  
  // Ordenar produtos
  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (!ordenacao.coluna) return 0;
    
    let valorA: any;
    let valorB: any;
    
    // Mapear colunas para propriedades corretas
    switch (ordenacao.coluna) {
      case 'titulo':
        valorA = a.titulo;
        valorB = b.titulo;
        break;
      case 'quantidadeVendida':
        valorA = a.quantidadeVendida;
        valorB = b.quantidadeVendida;
        break;
      case 'preco':
        valorA = a.preco;
        valorB = b.preco;
        break;
      case 'estoque':
        valorA = a.estoque;
        valorB = b.estoque;
        break;
      case 'receita':
        valorA = a.receita;
        valorB = b.receita;
        break;
      default:
        valorA = a[ordenacao.coluna];
        valorB = b[ordenacao.coluna];
    }
    
    // Tratar valores undefined
    if (valorA === undefined && valorB === undefined) return 0;
    if (valorA === undefined) return 1;
    if (valorB === undefined) return -1;
    
    if (typeof valorA === 'string' && typeof valorB === 'string') {
      return ordenacao.ordem === 'asc' 
        ? valorA.localeCompare(valorB) 
        : valorB.localeCompare(valorA);
    }
    
    if (valorA < valorB) return ordenacao.ordem === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordenacao.ordem === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Alternar ordenação
  const alternarOrdenacao = (coluna: keyof Produto) => {
    setOrdenacao(atual => ({
      coluna: coluna,
      ordem: atual.coluna === coluna && atual.ordem === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Formatação de valores
  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };
  
  // Renderizar ícone de ordenação
  const renderIconeOrdenacao = (coluna: keyof Produto) => {
    if (ordenacao.coluna !== coluna) return null;
    return ordenacao.ordem === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };
  
  // Estilo do cabeçalho da tabela
  const estiloThOrdenavel = "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
  
  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Produtos Mais Vendidos</CardTitle>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produtos..."
              className="pl-10 border-gray-300 dark:border-gray-700 rounded-[10px]"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className={estiloThOrdenavel} 
                onClick={() => alternarOrdenacao("titulo")}
              >
                <div className="flex items-center">
                  Produto
                  {renderIconeOrdenacao("titulo")}
                </div>
              </TableHead>
              <TableHead className="">
                Categoria
              </TableHead>
              <TableHead
                className={`${estiloThOrdenavel} text-right`}
                onClick={() => alternarOrdenacao("quantidadeVendida")}
              >
                <div className="flex items-center justify-end">
                  Quantidade
                  {renderIconeOrdenacao("quantidadeVendida")}
                </div>
              </TableHead>
              <TableHead
                className={`${estiloThOrdenavel} text-right`}
                onClick={() => alternarOrdenacao("preco")}
              >
                <div className="flex items-center justify-end">
                  Valor
                  {renderIconeOrdenacao("preco")}
                </div>
              </TableHead>
              <TableHead
                className={`${estiloThOrdenavel} text-right`}
                onClick={() => alternarOrdenacao("estoque")}
              >
                <div className="flex items-center justify-end">
                  Estoque
                  {renderIconeOrdenacao("estoque")}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtosOrdenados.length > 0 ? (
              produtosOrdenados.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.titulo}</TableCell>
                  <TableCell>{produto.categoria?.nome || 'Sem categoria'}</TableCell>
                  <TableCell className="text-right">{produto.quantidadeVendida}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(produto.preco)}</TableCell>
                  <TableCell className="text-right">{produto.estoque}</TableCell>
                  <TableCell>
                    <Badge className={
                      produto.estoque > 10 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200" :
                      produto.estoque > 0 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-200" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200"
                    }>
                      {produto.estoque > 10 ? 'Em Estoque' : produto.estoque > 0 ? 'Baixo Estoque' : 'Sem Estoque'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
