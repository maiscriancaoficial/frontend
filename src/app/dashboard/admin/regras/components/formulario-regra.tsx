'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Tipos para as regras
export type TipoRegra = 'desconto' | 'frete' | 'restricao' | 'condicional';
export type StatusRegra = 'ativa' | 'inativa' | 'agendada';
export type CondicaoRegra = 'cliente' | 'produto' | 'carrinho' | 'data' | 'localizacao';

// Interface para o formulário
export interface FormularioRegraProps {
  regra?: {
    id?: string;
    nome: string;
    tipo: TipoRegra;
    status: StatusRegra;
    condicoes: CondicaoRegra[];
    prioridade: number;
    descricao: string;
    [key: string]: any; // Para campos específicos do tipo de regra
  };
  onSalvar: (dados: any) => void;
  onCancelar: () => void;
}

export function FormularioRegra({ regra, onSalvar, onCancelar }: FormularioRegraProps) {
  // Definir estado inicial com base na regra fornecida ou valores padrão
  const [dados, setDados] = useState({
    id: regra?.id || '',
    nome: regra?.nome || '',
    tipo: regra?.tipo || 'desconto' as TipoRegra,
    status: regra?.status || 'ativa' as StatusRegra,
    condicoes: regra?.condicoes || [] as CondicaoRegra[],
    prioridade: regra?.prioridade || 1,
    descricao: regra?.descricao || '',
    
    // Campos específicos para desconto
    percentualDesconto: regra?.percentualDesconto || 0,
    valorDesconto: regra?.valorDesconto || 0,
    valorMinimoCompra: regra?.valorMinimoCompra || 0,
    
    // Campos específicos para frete
    tipoFrete: regra?.tipoFrete || 'gratis',
    percentualFrete: regra?.percentualFrete || 0,
    valorFixoFrete: regra?.valorFixoFrete || 0,
    
    // Campos específicos para restrição
    tipoRestricao: regra?.tipoRestricao || 'quantidade',
    valorRestricao: regra?.valorRestricao || 0,
    
    // Campos para agendamento
    dataInicio: regra?.dataInicio || '',
    dataFim: regra?.dataFim || '',
  });

  // Função para atualizar dados do formulário
  const atualizarDados = (campo: string, valor: any) => {
    setDados(atual => ({
      ...atual,
      [campo]: valor
    }));
  };

  // Função para alternar condições
  const alternarCondicao = (condicao: CondicaoRegra) => {
    setDados(atual => {
      const condicoes = [...atual.condicoes];
      
      if (condicoes.includes(condicao)) {
        return {
          ...atual,
          condicoes: condicoes.filter(c => c !== condicao)
        };
      } else {
        return {
          ...atual,
          condicoes: [...condicoes, condicao]
        };
      }
    });
  };

  // Função para submeter o formulário
  const submeterFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar(dados);
  };

  return (
    <form onSubmit={submeterFormulario}>
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
            {regra?.id ? 'Editar Regra' : 'Nova Regra'}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure as propriedades da regra e suas condições de aplicação
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-700 dark:text-gray-300">Nome da Regra</Label>
              <Input
                id="nome"
                value={dados.nome}
                onChange={(e) => atualizarDados('nome', e.target.value)}
                placeholder="Ex: Desconto de 10% para Aniversariantes"
                className="border-gray-300 dark:border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-gray-700 dark:text-gray-300">Tipo de Regra</Label>
              <Select 
                value={dados.tipo} 
                onValueChange={(valor) => atualizarDados('tipo', valor)}
              >
                <SelectTrigger id="tipo" className="border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desconto">Desconto</SelectItem>
                  <SelectItem value="frete">Frete</SelectItem>
                  <SelectItem value="restricao">Restrição</SelectItem>
                  <SelectItem value="condicional">Condicional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Status e prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Select 
                value={dados.status} 
                onValueChange={(valor) => atualizarDados('status', valor as StatusRegra)}
              >
                <SelectTrigger id="status" className="border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="inativa">Inativa</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prioridade" className="text-gray-700 dark:text-gray-300">
                Prioridade (1 = mais alta)
              </Label>
              <Input
                id="prioridade"
                type="number"
                min="1"
                max="10"
                value={dados.prioridade}
                onChange={(e) => atualizarDados('prioridade', parseInt(e.target.value))}
                className="border-gray-300 dark:border-gray-700"
                required
              />
            </div>
          </div>
          
          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-gray-700 dark:text-gray-300">Descrição</Label>
            <Textarea
              id="descricao"
              value={dados.descricao}
              onChange={(e) => atualizarDados('descricao', e.target.value)}
              placeholder="Descreva o propósito e funcionamento desta regra"
              className="border-gray-300 dark:border-gray-700 min-h-[100px]"
            />
          </div>

          {/* Condições de aplicação */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 block mb-2">
              Condições de Aplicação
            </Label>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="cond-cliente"
                  checked={dados.condicoes.includes('cliente')}
                  onCheckedChange={() => alternarCondicao('cliente')}
                  className="data-[state=checked]:bg-pink-500"
                />
                <Label htmlFor="cond-cliente" className="text-gray-700 dark:text-gray-300">
                  Cliente
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="cond-produto"
                  checked={dados.condicoes.includes('produto')}
                  onCheckedChange={() => alternarCondicao('produto')}
                  className="data-[state=checked]:bg-pink-500"
                />
                <Label htmlFor="cond-produto" className="text-gray-700 dark:text-gray-300">
                  Produto
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="cond-carrinho"
                  checked={dados.condicoes.includes('carrinho')}
                  onCheckedChange={() => alternarCondicao('carrinho')}
                  className="data-[state=checked]:bg-pink-500"
                />
                <Label htmlFor="cond-carrinho" className="text-gray-700 dark:text-gray-300">
                  Carrinho
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="cond-data"
                  checked={dados.condicoes.includes('data')}
                  onCheckedChange={() => alternarCondicao('data')}
                  className="data-[state=checked]:bg-pink-500"
                />
                <Label htmlFor="cond-data" className="text-gray-700 dark:text-gray-300">
                  Data
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="cond-localizacao"
                  checked={dados.condicoes.includes('localizacao')}
                  onCheckedChange={() => alternarCondicao('localizacao')}
                  className="data-[state=checked]:bg-pink-500"
                />
                <Label htmlFor="cond-localizacao" className="text-gray-700 dark:text-gray-300">
                  Localização
                </Label>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
              onClick={onCancelar}
            >
              Cancelar
            </Button>
            
            <Button 
              type="submit"
              className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white"
            >
              {regra?.id ? 'Salvar Alterações' : 'Criar Regra'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
