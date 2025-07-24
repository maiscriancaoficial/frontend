'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CalendarIcon, CreditCard, Download, FileDown, Filter, RefreshCw, ShoppingBag, Tag, User, X } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function FiltrosRelatorio() {
  const [dataDe, setDataDe] = useState<Date | undefined>(undefined);
  const [dataAte, setDataAte] = useState<Date | undefined>(undefined);
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("vendas");
  const [filtrosVisivel, setFiltrosVisivel] = useState(false);
  
  // Estados para filtros adicionais
  const [statusPedido, setStatusPedido] = useState<string>("todos");
  const [metodoPagamento, setMetodoPagamento] = useState<string>("todos");
  const [filtroValorMinimo, setFiltroValorMinimo] = useState<string>("");
  const [filtroValorMaximo, setFiltroValorMaximo] = useState<string>("");
  
  // Função para limpar filtros
  const limparFiltros = () => {
    setDataDe(undefined);
    setDataAte(undefined);
    setStatusPedido("todos");
    setMetodoPagamento("todos");
    setFiltroValorMinimo("");
    setFiltroValorMaximo("");
  };
  
  // Função para exportar relatório
  const exportarRelatorio = (formato: string) => {
    console.log(`Exportando relatório em formato ${formato}...`);
    // Implementar lógica de exportação
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filtros e Exportação</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Personalize seu relatório e exporte os resultados</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2 border-gray-300 dark:border-gray-700"
            onClick={() => setFiltrosVisivel(!filtrosVisivel)}
          >
            <Filter className="h-4 w-4" />
            {filtrosVisivel ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
          
          <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
            <SelectTrigger className="w-full sm:w-[200px] border-gray-300 dark:border-gray-700">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Vendas</span>
                </div>
              </SelectItem>
              <SelectItem value="clientes">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Clientes</span>
                </div>
              </SelectItem>
              <SelectItem value="produtos">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Produtos</span>
                </div>
              </SelectItem>
              <SelectItem value="pagamentos">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Pagamentos</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto flex items-center gap-2 border-gray-300 dark:border-gray-700"
              >
                <FileDown className="h-4 w-4" />
                Exportar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="end">
              <div className="flex flex-col">
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start gap-2 rounded-none h-10"
                  onClick={() => exportarRelatorio('csv')}
                >
                  <Download className="h-4 w-4" />
                  <span>CSV</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start gap-2 rounded-none h-10"
                  onClick={() => exportarRelatorio('excel')}
                >
                  <Download className="h-4 w-4" />
                  <span>Excel</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start gap-2 rounded-none h-10"
                  onClick={() => exportarRelatorio('pdf')}
                >
                  <Download className="h-4 w-4" />
                  <span>PDF</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline"
            size="icon"
            className="border-gray-300 dark:border-gray-700"
            onClick={limparFiltros}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filtrosVisivel && (
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-de" className="text-gray-700 dark:text-gray-300">Data Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="data-de"
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataDe ? format(dataDe, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dataDe}
                      onSelect={setDataDe}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-ate" className="text-gray-700 dark:text-gray-300">Data Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="data-ate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataAte ? format(dataAte, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dataAte}
                      onSelect={setDataAte}
                      initialFocus
                      locale={ptBR}
                      disabled={(date) => dataDe ? date < dataDe : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status-pedido" className="text-gray-700 dark:text-gray-300">Status do Pedido</Label>
                <Select value={statusPedido} onValueChange={setStatusPedido}>
                  <SelectTrigger id="status-pedido" className="border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="aguardando">Aguardando pagamento</SelectItem>
                    <SelectItem value="confirmado">Pagamento confirmado</SelectItem>
                    <SelectItem value="em-transito">Em trânsito</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metodo-pagamento" className="text-gray-700 dark:text-gray-300">Método de Pagamento</Label>
                <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                  <SelectTrigger id="metodo-pagamento" className="border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Todos os métodos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os métodos</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="debito">Cartão de Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor-minimo" className="text-gray-700 dark:text-gray-300">Valor Mínimo (R$)</Label>
                <Input
                  id="valor-minimo"
                  type="number"
                  value={filtroValorMinimo}
                  onChange={(e) => setFiltroValorMinimo(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor-maximo" className="text-gray-700 dark:text-gray-300">Valor Máximo (R$)</Label>
                <Input
                  id="valor-maximo"
                  type="number"
                  value={filtroValorMaximo}
                  onChange={(e) => setFiltroValorMaximo(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                className="border-gray-300 dark:border-gray-700 flex items-center gap-2"
                onClick={limparFiltros}
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white"
              >
                Aplicar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
