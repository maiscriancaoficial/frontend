import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Estatísticas de produtos
export async function GET(request: NextRequest) {
  try {
    // Buscar estatísticas em paralelo
    const [
      totalProdutos,
      produtosPublicados,
      produtosRascunho,
      produtosDestaque,
      produtosSemEstoque,
      valorTotalEstoque
    ] = await Promise.all([
      // Total de produtos
      prisma.produto.count(),
      
      // Produtos publicados (ativos)
      prisma.produto.count({
        where: { ativo: true }
      }),
      
      // Produtos em rascunho (inativos)
      prisma.produto.count({
        where: { ativo: false }
      }),
      
      // Produtos em destaque
      prisma.produto.count({
        where: { emDestaque: true }
      }),
      
      // Produtos inativos
      prisma.produto.count({
        where: { ativo: false }
      }),
      
      // Valor total do estoque (soma dos preços dos produtos ativos)
      prisma.produto.aggregate({
        where: { ativo: true },
        _sum: { preco: true }
      })
    ]);

    const estatisticas = {
      totalProdutos: totalProdutos || 0,
      produtosEmEstoque: produtosPublicados || 0, // Produtos ativos como "em estoque"
      produtosForaEstoque: produtosRascunho || 0, // Produtos inativos como "fora de estoque"
      totalVendidos: 0, // Campo não implementado ainda
      crescimentoProdutos: 0, // Campo não implementado ainda
      crescimentoVendas: 0, // Campo não implementado ainda
      // Campos adicionais para compatibilidade
      produtosPublicados: produtosPublicados || 0,
      produtosRascunho: produtosRascunho || 0,
      produtosDestaque: produtosDestaque || 0,
      produtosSemEstoque: produtosSemEstoque || 0,
      valorTotalEstoque: valorTotalEstoque._sum?.preco || 0,
      percentualPublicados: totalProdutos > 0 ? Math.round((produtosPublicados / totalProdutos) * 100) : 0,
      percentualDestaque: totalProdutos > 0 ? Math.round((produtosDestaque / totalProdutos) * 100) : 0
    };

    return NextResponse.json({
      success: true,
      estatisticas
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
