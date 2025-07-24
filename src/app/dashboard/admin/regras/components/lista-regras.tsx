'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  Percent, 
  Clock, 
  Tag, 
  User, 
  ShoppingCart,
  Search,
  CheckCircle2,
  XCircle,
  Truck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Tipos para as regras
type TipoRegra = 'desconto' | 'frete' | 'restricao' | 'condicional';
type StatusRegra = 'ativa' | 'inativa' | 'agendada';
type CondicaoRegra = 'cliente' | 'produto' | 'carrinho' | 'data' | 'localizacao';

interface Regra {
  id: string;
  nome: string;
  tipo: TipoRegra;
  status: StatusRegra;
  condicoes: CondicaoRegra[];
  prioridade: number;
  descricao: string;
}

// Dados mockados para exibição
const regrasMock: Regra[] = [
  {
    id: '1',
    nome: 'Desconto de 10% para Aniversariantes',
    tipo: 'desconto',
    status: 'ativa',
    condicoes: ['cliente', 'data'],
    prioridade: 1,
    descricao: 'Desconto automático de 10% para clientes no mês do seu aniversário.'
  },
  {
    id: '2',
    nome: 'Frete Grátis para Compras acima de R$ 200',
    tipo: 'frete',
    status: 'ativa',
    condicoes: ['carrinho'],
    prioridade: 2,
    descricao: 'Frete grátis automático para compras com valor acima de R$ 200.'
  },
  {
    id: '3',
    nome: 'Desconto de 5% em Buquês de Rosas',
    tipo: 'desconto',
    status: 'ativa',
    condicoes: ['produto'],
    prioridade: 3,
    descricao: 'Aplica desconto de 5% em todos os buquês que contenham rosas vermelhas.'
  },
  {
    id: '4',
    nome: 'Restrição de Compra por Região',
    tipo: 'restricao',
    status: 'ativa',
    condicoes: ['localizacao'],
    prioridade: 4,
    descricao: 'Restringe a entrega apenas para as regiões Sul e Sudeste.'
  },
  {
    id: '5',
    nome: 'Desconto de 15% na Black Friday',
    tipo: 'desconto',
    status: 'agendada',
    condicoes: ['data'],
    prioridade: 1,
    descricao: 'Desconto automático de 15% em todas as compras durante a Black Friday.'
  },
  {
    id: '6',
    nome: 'Frete Reduzido para Clientes Premium',
    tipo: 'frete',
    status: 'ativa',
    condicoes: ['cliente'],
    prioridade: 2,
    descricao: 'Desconto de 50% no frete para clientes com perfil premium.'
  },
  {
    id: '7',
    nome: 'Limite de Compra por Cliente',
    tipo: 'restricao',
    status: 'inativa',
    condicoes: ['cliente', 'carrinho'],
    prioridade: 5,
    descricao: 'Limita a quantidade de itens específicos que um cliente pode comprar por mês.'
  }
];

interface ListaRegrasProps {
  onNovaRegra: () => void;
  onEditarRegra: (regra: any) => void;
}

export function ListaRegras({ onNovaRegra, onEditarRegra }: ListaRegrasProps) {
  const [regras, setRegras] = useState<Regra[]>(regrasMock);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(true);
  
  // Filtrar as regras
  const regrasFiltradas = regras.filter(regra => {
    // Filtro de status
    if (filtroStatus !== "todos" && regra.status !== filtroStatus) return false;
    
    // Filtro de tipo
    if (filtroTipo !== "todos" && regra.tipo !== filtroTipo) return false;
    
    // Filtro de busca
    if (busca && !regra.nome.toLowerCase().includes(busca.toLowerCase()) && 
        !regra.descricao.toLowerCase().includes(busca.toLowerCase())) return false;
    
    // Filtro de ativas/inativas
    if (!mostrarInativas && regra.status === 'inativa') return false;
    
    return true;
  });
  
  // Função para excluir regra
  const excluirRegra = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta regra?')) {
      setRegras(regras => regras.filter(regra => regra.id !== id));
    }
  };
  
  // Função para editar regra
  const editarRegra = (id: string) => {
    const regra = regras.find(r => r.id === id);
    if (regra) {
      onEditarRegra(regra);
    }
  };
  
  // Função para renderizar o ícone baseado no tipo de regra
  const renderIconeTipo = (tipo: TipoRegra) => {
    switch (tipo) {
      case 'desconto':
        return <Percent className="h-5 w-5 text-green-500" />;
      case 'frete':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'restricao':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'condicional':
        return <Tag className="h-5 w-5 text-purple-500" />;
    }
  };
  
  // Função para renderizar o ícone das condições
  const renderIconeCondicao = (condicao: CondicaoRegra) => {
    switch (condicao) {
      case 'cliente':
        return <User className="h-4 w-4" />;
      case 'produto':
        return <Tag className="h-4 w-4" />;
      case 'carrinho':
        return <ShoppingCart className="h-4 w-4" />;
      case 'data':
        return <Clock className="h-4 w-4" />;
      case 'localizacao':
        return <Percent className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Regras do Site</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Gerencie descontos, fretes e restrições aplicados automaticamente
            </CardDescription>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white"
            onClick={onNovaRegra}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar regras..."
              className="pl-10 border-gray-300 dark:border-gray-700 rounded-[10px]"
            />
          </div>
          
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativa">Ativas</SelectItem>
              <SelectItem value="inativa">Inativas</SelectItem>
              <SelectItem value="agendada">Agendadas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-700">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="desconto">Desconto</SelectItem>
              <SelectItem value="frete">Frete</SelectItem>
              <SelectItem value="restricao">Restrição</SelectItem>
              <SelectItem value="condicional">Condicional</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="mostrar-inativas"
              checked={mostrarInativas}
              onCheckedChange={setMostrarInativas}
              className="data-[state=checked]:bg-pink-500"
            />
            <Label htmlFor="mostrar-inativas" className="text-gray-700 dark:text-gray-300">
              Mostrar inativas
            </Label>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Condições</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12 text-right">Prioridade</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regrasFiltradas.length > 0 ? (
                regrasFiltradas.map((regra) => (
                  <TableRow key={regra.id}>
                    <TableCell>
                      {renderIconeTipo(regra.tipo)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-gray-800 dark:text-gray-200">{regra.nome}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{regra.descricao}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        regra.tipo === 'desconto' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                        regra.tipo === 'frete' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                        regra.tipo === 'restricao' ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" :
                        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      }>
                        {regra.tipo === 'desconto' ? 'Desconto' : 
                         regra.tipo === 'frete' ? 'Frete' : 
                         regra.tipo === 'restricao' ? 'Restrição' : 'Condicional'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {regra.condicoes.map((condicao, index) => (
                          <div 
                            key={index} 
                            className="p-1 bg-gray-100 dark:bg-gray-800 rounded"
                            title={
                              condicao === 'cliente' ? 'Baseado no cliente' :
                              condicao === 'produto' ? 'Baseado no produto' :
                              condicao === 'carrinho' ? 'Baseado no carrinho' :
                              condicao === 'data' ? 'Baseado na data' : 'Baseado na localização'
                            }
                          >
                            {renderIconeCondicao(condicao)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        regra.status === 'ativa' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                        regra.status === 'inativa' ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" :
                        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      }>
                        {regra.status === 'ativa' ? (
                          <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                        ) : regra.status === 'inativa' ? (
                          <XCircle className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1 inline" />
                        )}
                        {regra.status === 'ativa' ? 'Ativa' : 
                         regra.status === 'inativa' ? 'Inativa' : 'Agendada'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{regra.prioridade}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editarRegra(regra.id)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => excluirRegra(regra.id)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma regra encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
