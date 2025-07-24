'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
// Tipos (definidos localmente em vez de importados do Prisma)
type StatusPedido = 
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAGAMENTO_APROVADO'
  | 'EM_PREPARACAO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO'
  | 'ESTORNADO';

type MetodoPagamento = 
  | 'PIX'
  | 'CARTAO_CREDITO'
  | 'CARTAO_DEBITO'
  | 'BOLETO'
  | 'DINHEIRO'
  | 'TRANSFERENCIA';
import { Search, X, Filter } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface FiltroPedidosProps {
  onAplicarFiltros: (filtros: any) => void;
  onLimparFiltros: () => void;
  filtrosAtivos?: any;
}

export function FiltrosPedidos({ onAplicarFiltros, onLimparFiltros, filtrosAtivos }: FiltroPedidosProps) {
  const [termoBusca, setTermoBusca] = useState("");
  const [status, setStatus] = useState<string>("");
  const [metodoPagamento, setMetodoPagamento] = useState<string>("");
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  // Função para aplicar os filtros
  const aplicarFiltros = () => {
    const filtros = {
      termo: termoBusca,
      status: status || undefined,
      metodoPagamento: metodoPagamento || undefined,
      valorMinimo: valorMinimo ? parseFloat(valorMinimo) : undefined,
      valorMaximo: valorMaximo ? parseFloat(valorMaximo) : undefined,
      dataInicio,
      dataFim
    };
    
    onAplicarFiltros(filtros);
    setFiltrosAbertos(false);
  };

  // Função para limpar os filtros
  const limparFiltros = () => {
    setTermoBusca("");
    setStatus("");
    setMetodoPagamento("");
    setValorMinimo("");
    setValorMaximo("");
    setDataInicio(undefined);
    setDataFim(undefined);
    onLimparFiltros();
  };

  // Formatação de data
  const formatarData = (date?: Date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4 mb-6">
      <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca por termo */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="pl-9 rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                placeholder="Buscar por código, cliente ou email..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
              />
              {termoBusca && (
                <button
                  onClick={() => setTermoBusca("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Botão de filtros avançados */}
            <Popover open={filtrosAbertos} onOpenChange={setFiltrosAbertos}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros Avançados
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 rounded-xl p-6" align="end">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium mb-4">Filtros Avançados</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status do Pedido</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status" className="rounded-lg">
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="">Todos os status</SelectItem>
                        <SelectItem value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</SelectItem>
                        <SelectItem value="PAGAMENTO_APROVADO">Pagamento Aprovado</SelectItem>
                        <SelectItem value="EM_PREPARACAO">Em Preparação</SelectItem>
                        <SelectItem value="ENVIADO">Enviado</SelectItem>
                        <SelectItem value="ENTREGUE">Entregue</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                        <SelectItem value="ESTORNADO">Estornado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pagamento">Método de Pagamento</Label>
                    <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                      <SelectTrigger id="pagamento" className="rounded-lg">
                        <SelectValue placeholder="Todos os métodos" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="">Todos os métodos</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                        <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                        <SelectItem value="BOLETO">Boleto</SelectItem>
                        <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                        <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full border-none">
                    <AccordionItem value="valor" className="border-b-0">
                      <AccordionTrigger className="py-2 text-sm">
                        Filtrar por valor
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="valor-minimo" className="text-xs">Valor Mínimo</Label>
                            <Input
                              id="valor-minimo"
                              type="number"
                              placeholder="R$ 0,00"
                              className="h-8 text-sm rounded-lg"
                              value={valorMinimo}
                              onChange={(e) => setValorMinimo(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="valor-maximo" className="text-xs">Valor Máximo</Label>
                            <Input
                              id="valor-maximo"
                              type="number"
                              placeholder="R$ 999,99"
                              className="h-8 text-sm rounded-lg"
                              value={valorMaximo}
                              onChange={(e) => setValorMaximo(e.target.value)}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Accordion type="single" collapsible className="w-full border-none">
                    <AccordionItem value="data" className="border-b-0">
                      <AccordionTrigger className="py-2 text-sm">
                        Filtrar por data
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Data Inicial</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start text-left text-xs font-normal rounded-lg",
                                    !dataInicio && "text-gray-500"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-3 w-3" />
                                  {dataInicio ? formatarData(dataInicio) : "Selecionar data"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={dataInicio}
                                  onSelect={setDataInicio}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs">Data Final</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start text-left text-xs font-normal rounded-lg",
                                    !dataFim && "text-gray-500"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-3 w-3" />
                                  {dataFim ? formatarData(dataFim) : "Selecionar data"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                  mode="single"
                                  selected={dataFim}
                                  onSelect={setDataFim}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex justify-between pt-4 space-x-2">
                    <Button variant="outline" size="sm" onClick={limparFiltros}>
                      Limpar Filtros
                    </Button>
                    <Button size="sm" onClick={aplicarFiltros}>
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Botão de busca - visível apenas em telas menores */}
            <Button className="md:hidden rounded-full" onClick={aplicarFiltros}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
