'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent, Banknote, Archive } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface PrecosEstoqueFormProps {
  formData: any;
  atualizarFormData: (data: any) => void;
}

export function PrecosEstoqueForm({ formData, atualizarFormData }: PrecosEstoqueFormProps) {
  const [temPromocao, setTemPromocao] = useState<boolean>(!!formData.precoPromocional);
  const [desconto, setDesconto] = useState<number>(
    formData.preco && formData.precoPromocional 
      ? Math.round(100 - (formData.precoPromocional * 100 / formData.preco))
      : 0
  );
  
  // Função para formatar input como valor monetário
  const formatarValorMonetario = (valor: string): string => {
    // Remove tudo que não for número
    const numeros = valor.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para obter valor com decimais
    const valorNumerico = parseFloat(numeros) / 100;
    
    // Formata o número como moeda brasileira
    return valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Função para converter string formatada para número
  const converterParaNumero = (valor: string): number => {
    // Remove tudo que não for número ou ponto/vírgula
    const numerosEPontuacao = valor.replace(/[^\d,\.]/g, '');
    
    // Substitui vírgulas por pontos
    const numerosComPonto = numerosEPontuacao.replace(/,/g, '.');
    
    // Converte para número
    return parseFloat(numerosComPonto) || 0;
  };
  
  // Atualizar preço
  const atualizarPreco = (valorFormatado: string) => {
    const valor = converterParaNumero(valorFormatado);
    atualizarFormData({ preco: valor });
    
    // Se tiver preço promocional, atualiza o desconto
    if (temPromocao && formData.precoPromocional) {
      setDesconto(Math.round(100 - (formData.precoPromocional * 100 / valor)));
    }
  };
  
  // Atualizar preço promocional
  const atualizarPrecoPromocional = (valorFormatado: string) => {
    const valor = converterParaNumero(valorFormatado);
    atualizarFormData({ precoPromocional: valor });
    
    // Calcula e atualiza o desconto
    if (formData.preco) {
      setDesconto(Math.round(100 - (valor * 100 / formData.preco)));
    }
  };
  
  // Atualizar desconto e calcular preço promocional
  const atualizarDesconto = (novoDesconto: number) => {
    setDesconto(novoDesconto);
    
    // Calcula o novo preço promocional
    if (formData.preco) {
      const novoPrecoPromocional = formData.preco * (1 - novoDesconto / 100);
      atualizarFormData({
        precoPromocional: parseFloat(novoPrecoPromocional.toFixed(2))
      });
    }
  };
  
  // Alterna a promoção
  const alternarPromocao = (ativo: boolean) => {
    setTemPromocao(ativo);
    
    // Se ativou a promoção, calcula o preço promocional com 10% de desconto
    if (ativo) {
      const valorDesconto = desconto > 0 ? desconto : 10;
      setDesconto(valorDesconto);
      
      if (formData.preco) {
        const precoPromocional = formData.preco * (1 - valorDesconto / 100);
        atualizarFormData({
          precoPromocional: parseFloat(precoPromocional.toFixed(2))
        });
      }
    } else {
      // Se desativou, remove o preço promocional
      atualizarFormData({ precoPromocional: undefined });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Preços</h3>
      
      <Card className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6 space-y-5">
          {/* Preço */}
          <div className="space-y-2">
            <Label htmlFor="preco">Preço*</Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              <Input
                id="preco"
                placeholder="R$ 0,00"
                value={
                  formData.preco !== undefined
                    ? `R$ ${formatarValorMonetario(formData.preco.toString())}`
                    : 'R$ 0,00'
                }
                onChange={(e) => {
                  const valor = e.target.value.replace(/^R\$\s?/, '');
                  atualizarPreco(valor);
                }}
                className="rounded-2xl pl-9 border-green-200 dark:border-green-800 focus:border-[#27b99a] focus:ring-[#27b99a]/20"
              />
            </div>
          </div>
          
          {/* Preço Promocional */}
          <div className="space-y-2">
            <Label htmlFor="precoPromocional">Preço Promocional</Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
              <Input
                id="precoPromocional"
                placeholder="R$ 0,00"
                value={
                  formData.precoPromocional !== undefined
                    ? `R$ ${formatarValorMonetario(formData.precoPromocional.toString())}`
                    : 'R$ 0,00'
                }
                onChange={(e) => {
                  const valor = e.target.value.replace(/^R\$\s?/, '');
                  atualizarPrecoPromocional(valor);
                }}
                className="rounded-2xl pl-9 border-orange-200 dark:border-orange-800 focus:border-[#27b99a] focus:ring-[#27b99a]/20"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Deixe vazio se não houver promoção
            </p>
          </div>
          
          {/* Promoção */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="promocao">Preço Promocional Ativo</Label>
              <Switch
                id="promocao"
                checked={temPromocao}
                onCheckedChange={alternarPromocao}
              />
            </div>
            
            {temPromocao && (
              <div className="pt-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Preço Promocional */}
                  <div className="space-y-2">
                    <Label htmlFor="precoPromocional">Valor Promocional</Label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      <Input
                        id="precoPromocional"
                        placeholder="R$ 0,00"
                        value={
                          formData.precoPromocional !== undefined
                            ? `R$ ${formatarValorMonetario(formData.precoPromocional.toString())}`
                            : 'R$ 0,00'
                        }
                        onChange={(e) => {
                          const valor = e.target.value.replace(/^R\$\s?/, '');
                          atualizarPrecoPromocional(valor);
                        }}
                        className="rounded-lg pl-9 border-green-200 dark:border-green-800"
                      />
                    </div>
                  </div>
                  
                  {/* Desconto */}
                  <div className="space-y-2">
                    <Label htmlFor="desconto">Desconto (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                      <Input
                        id="desconto"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0%"
                        value={desconto}
                        onChange={(e) => atualizarDesconto(parseInt(e.target.value) || 0)}
                        className="rounded-lg pl-9 border-amber-200 dark:border-amber-800"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between px-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Economia:
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-500">
                    {formData.preco && formData.precoPromocional ? (
                      `R$ ${formatarValorMonetario((formData.preco - formData.precoPromocional).toFixed(2))}`
                    ) : (
                      'R$ 0,00'
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
