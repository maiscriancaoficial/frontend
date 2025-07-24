'use client';

import { TipoRegra, StatusRegra } from './formulario-regra';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CamposEspecificosRegraProps {
  tipo: TipoRegra;
  status: StatusRegra;
  dados: Record<string, any>;
  onChange: (campo: string, valor: any) => void;
}

export function CamposEspecificosRegra({ tipo, status, dados, onChange }: CamposEspecificosRegraProps) {
  // Função para renderizar campos específicos baseados no tipo de regra
  const renderizarCamposPorTipo = () => {
    switch (tipo) {
      case 'desconto':
        return (
          <div className="space-y-4 border rounded-lg p-4 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Configuração do Desconto</h4>
            
            <div className="space-y-4">
              <RadioGroup
                value={dados.tipoDesconto || "percentual"}
                onValueChange={(valor) => onChange('tipoDesconto', valor)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentual" id="percentual" className="text-pink-500" />
                  <Label htmlFor="percentual" className="text-gray-700 dark:text-gray-300">Desconto Percentual (%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixo" id="fixo" className="text-pink-500" />
                  <Label htmlFor="fixo" className="text-gray-700 dark:text-gray-300">Valor Fixo (R$)</Label>
                </div>
              </RadioGroup>
              
              {dados.tipoDesconto !== "fixo" && (
                <div className="space-y-2">
                  <Label htmlFor="percentualDesconto" className="text-gray-700 dark:text-gray-300">
                    Percentual de Desconto (%)
                  </Label>
                  <Input
                    id="percentualDesconto"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={dados.percentualDesconto || 0}
                    onChange={(e) => onChange('percentualDesconto', parseFloat(e.target.value))}
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>
              )}
              
              {dados.tipoDesconto === "fixo" && (
                <div className="space-y-2">
                  <Label htmlFor="valorDesconto" className="text-gray-700 dark:text-gray-300">
                    Valor do Desconto (R$)
                  </Label>
                  <Input
                    id="valorDesconto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={dados.valorDesconto || 0}
                    onChange={(e) => onChange('valorDesconto', parseFloat(e.target.value))}
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="valorMinimoCompra" className="text-gray-700 dark:text-gray-300">
                  Valor Mínimo da Compra (R$)
                </Label>
                <Input
                  id="valorMinimoCompra"
                  type="number"
                  min="0"
                  step="0.01"
                  value={dados.valorMinimoCompra || 0}
                  onChange={(e) => onChange('valorMinimoCompra', parseFloat(e.target.value))}
                  className="border-gray-300 dark:border-gray-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Defina 0 para não ter valor mínimo
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'frete':
        return (
          <div className="space-y-4 border rounded-lg p-4 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Configuração do Frete</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipoFrete" className="text-gray-700 dark:text-gray-300">Tipo de Frete</Label>
                <Select 
                  value={dados.tipoFrete || 'gratis'} 
                  onValueChange={(valor) => onChange('tipoFrete', valor)}
                >
                  <SelectTrigger id="tipoFrete" className="border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Selecione o tipo de frete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratis">Frete Grátis</SelectItem>
                    <SelectItem value="percentual">Desconto Percentual</SelectItem>
                    <SelectItem value="fixo">Desconto de Valor Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {dados.tipoFrete === 'percentual' && (
                <div className="space-y-2">
                  <Label htmlFor="percentualFrete" className="text-gray-700 dark:text-gray-300">
                    Percentual de Desconto no Frete (%)
                  </Label>
                  <Input
                    id="percentualFrete"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={dados.percentualFrete || 0}
                    onChange={(e) => onChange('percentualFrete', parseFloat(e.target.value))}
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>
              )}
              
              {dados.tipoFrete === 'fixo' && (
                <div className="space-y-2">
                  <Label htmlFor="valorFixoFrete" className="text-gray-700 dark:text-gray-300">
                    Valor Fixo de Desconto no Frete (R$)
                  </Label>
                  <Input
                    id="valorFixoFrete"
                    type="number"
                    min="0"
                    step="0.01"
                    value={dados.valorFixoFrete || 0}
                    onChange={(e) => onChange('valorFixoFrete', parseFloat(e.target.value))}
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="valorMinimoFrete" className="text-gray-700 dark:text-gray-300">
                  Valor Mínimo da Compra para Frete (R$)
                </Label>
                <Input
                  id="valorMinimoFrete"
                  type="number"
                  min="0"
                  step="0.01"
                  value={dados.valorMinimoFrete || 0}
                  onChange={(e) => onChange('valorMinimoFrete', parseFloat(e.target.value))}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
        );
        
      case 'restricao':
        return (
          <div className="space-y-4 border rounded-lg p-4 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Configuração da Restrição</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipoRestricao" className="text-gray-700 dark:text-gray-300">Tipo de Restrição</Label>
                <Select 
                  value={dados.tipoRestricao || 'quantidade'} 
                  onValueChange={(valor) => onChange('tipoRestricao', valor)}
                >
                  <SelectTrigger id="tipoRestricao" className="border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Selecione o tipo de restrição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quantidade">Limite de Quantidade</SelectItem>
                    <SelectItem value="region">Restrição por Região</SelectItem>
                    <SelectItem value="usuario">Restrição por Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {dados.tipoRestricao === 'quantidade' && (
                <div className="space-y-2">
                  <Label htmlFor="valorRestricao" className="text-gray-700 dark:text-gray-300">
                    Quantidade Máxima Permitida
                  </Label>
                  <Input
                    id="valorRestricao"
                    type="number"
                    min="1"
                    value={dados.valorRestricao || 1}
                    onChange={(e) => onChange('valorRestricao', parseInt(e.target.value))}
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>
              )}
              
              {dados.tipoRestricao === 'region' && (
                <div className="space-y-2">
                  <Label htmlFor="regioesPermitidas" className="text-gray-700 dark:text-gray-300">
                    Regiões Permitidas
                  </Label>
                  <Select 
                    value={dados.regioesPermitidas || 'todas'} 
                    onValueChange={(valor) => onChange('regioesPermitidas', valor)}
                  >
                    <SelectTrigger id="regioesPermitidas" className="border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Selecione as regiões" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="sul-sudeste">Sul e Sudeste</SelectItem>
                      <SelectItem value="norte-nordeste">Norte e Nordeste</SelectItem>
                      <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Selecione um tipo de regra para visualizar suas configurações específicas.
              </p>
            </div>
          </div>
        );
    }
  };
  
  // Renderizar campos de agendamento se o status for "agendada"
  const renderizarCamposAgendamento = () => {
    if (status !== 'agendada') return null;
    
    return (
      <div className="space-y-4 mt-4 border rounded-lg p-4 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">Período de Agendamento</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicio" className="text-gray-700 dark:text-gray-300">Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dataInicio"
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dados.dataInicio 
                    ? format(new Date(dados.dataInicio), "PPP", { locale: ptBR }) 
                    : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dados.dataInicio ? new Date(dados.dataInicio) : undefined}
                  onSelect={(date) => onChange('dataInicio', date?.toISOString() || '')}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataFim" className="text-gray-700 dark:text-gray-300">Data de Término</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dataFim"
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dados.dataFim 
                    ? format(new Date(dados.dataFim), "PPP", { locale: ptBR }) 
                    : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dados.dataFim ? new Date(dados.dataFim) : undefined}
                  onSelect={(date) => onChange('dataFim', date?.toISOString() || '')}
                  initialFocus
                  locale={ptBR}
                  disabled={(date) => 
                    dados.dataInicio ? date < new Date(dados.dataInicio) : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderizarCamposPorTipo()}
      {renderizarCamposAgendamento()}
    </div>
  );
}
