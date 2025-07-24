"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProdutoDetalhado } from '@/services/produto-service-single';
import { Star, StarHalf, User } from 'lucide-react';

interface ProdutoDescricaoProps {
  produto: ProdutoDetalhado;
}

export function ProdutoDescricao({ produto }: ProdutoDescricaoProps) {
  // Formatar a data para exibição
  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Renderiza estrelas para uma avaliação específica
  const renderizarEstrelasAvaliacao = (nota: number) => {
    const estrelas = [];
    const estrelasCompletas = Math.floor(nota);
    const temMeiaEstrela = nota % 1 >= 0.5;
    
    // Adicionar estrelas completas
    for (let i = 0; i < estrelasCompletas; i++) {
      estrelas.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    }
    
    // Adicionar meia estrela se necessário
    if (temMeiaEstrela) {
      estrelas.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    }
    
    // Adicionar estrelas vazias
    const estrelasVazias = 5 - estrelasCompletas - (temMeiaEstrela ? 1 : 0);
    for (let i = 0; i < estrelasVazias; i++) {
      estrelas.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" />);
    }
    
    return <div className="flex">{estrelas}</div>;
  };
  
  // Calcular estatísticas das avaliações
  const estatisticasAvaliacoes = () => {
    if (!produto.avaliacoes || produto.avaliacoes.length === 0) {
      return {
        media: 0,
        total: 0,
        distribuicao: [0, 0, 0, 0, 0]
      };
    }
    
    const total = produto.avaliacoes.length;
    const soma = produto.avaliacoes.reduce((sum, av) => sum + av.avaliacao, 0);
    const media = soma / total;
    
    // Distribuição por número de estrelas (5, 4, 3, 2, 1)
    const distribuicao = [0, 0, 0, 0, 0];
    produto.avaliacoes.forEach(av => {
      distribuicao[5 - Math.floor(av.avaliacao)]++;
    });
    
    return { media, total, distribuicao };
  };
  
  const stats = estatisticasAvaliacoes();

  return (
    <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-10">
      <Tabs defaultValue="descricao" className="w-full">
        <TabsList className="mb-4 w-full justify-start border-b dark:border-gray-800">
          <TabsTrigger value="descricao" className="relative text-base">
            Descrição
          </TabsTrigger>
          <TabsTrigger value="avaliacoes" className="relative text-base">
            Avaliações ({stats.total})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="descricao" className="mt-6">
          {produto.descricaoLonga ? (
            <div
              className="prose prose-pink max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: produto.descricaoLonga }}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              {produto.descricao || "Sem descrição detalhada disponível para este produto."}
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="avaliacoes">
          {produto.avaliacoes && produto.avaliacoes.length > 0 ? (
            <div className="space-y-6">
              {/* Resumo das avaliações */}
              <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-gray-900 dark:text-white">
                    {stats.media.toFixed(1)}
                  </div>
                  <div className="flex mt-2">
                    {renderizarEstrelasAvaliacao(stats.media)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Baseado em {stats.total} avaliações
                  </div>
                </div>
                
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((estrelas) => {
                    const quantidade = stats.distribuicao[5 - estrelas];
                    const porcentagem = stats.total > 0 
                      ? (quantidade / stats.total) * 100 
                      : 0;
                    
                    return (
                      <div key={estrelas} className="flex items-center text-sm mb-1">
                        <span className="w-12">{estrelas} estrelas</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${porcentagem}%` }}
                            ></div>
                          </div>
                        </div>
                        <span>{quantidade}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Lista de avaliações */}
              <div className="space-y-6">
                {produto.avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="border-b dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-800/30 flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-pink-700 dark:text-pink-300" />
                        </div>
                        <div>
                          <div className="font-medium">{avaliacao.nome}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatarData(avaliacao.data)}
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {renderizarEstrelasAvaliacao(avaliacao.avaliacao)}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-3">
                      {avaliacao.comentario}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">
                Este produto ainda não possui avaliações.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
