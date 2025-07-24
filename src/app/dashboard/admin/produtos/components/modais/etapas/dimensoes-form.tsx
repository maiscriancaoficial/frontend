'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Scale, 
  Ruler, 
  MoveHorizontal,
  MoveVertical,
  Box
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DimensoesFormProps {
  formData: any;
  atualizarFormData: (data: any) => void;
}

const tamanhosDisponiveis = [
  { valor: 'PP', rotulo: 'PP - Muito Pequeno' },
  { valor: 'P', rotulo: 'P - Pequeno' },
  { valor: 'M', rotulo: 'M - Médio' },
  { valor: 'G', rotulo: 'G - Grande' },
  { valor: 'GG', rotulo: 'GG - Muito Grande' }
];

export function DimensoesForm({ formData, atualizarFormData }: DimensoesFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Dimensões do Produto</h3>
      
      <Card className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
        <CardContent className="p-6 space-y-5">
          {/* Peso */}
          <div className="space-y-2">
            <Label htmlFor="peso">Peso (kg)</Label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="peso"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.peso || ''}
                onChange={(e) => atualizarFormData({ 
                  peso: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                className="pl-9 focus-visible:ring-primary/20"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Peso em quilogramas (kg)
            </p>
          </div>
          
          {/* Tamanho (seleção) */}
          <div className="space-y-2">
            <Label htmlFor="tamanho">Tamanho</Label>
            <Select
              value={formData.tamanho || ''}
              onValueChange={(value) => atualizarFormData({ tamanho: value })}
            >
              <SelectTrigger id="tamanho" className="focus-visible:ring-primary/20">
                <SelectValue placeholder="Selecione um tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sem_tamanho">-- Sem tamanho --</SelectItem>
                {tamanhosDisponiveis.map((tamanho) => (
                  <SelectItem key={tamanho.valor} value={tamanho.valor}>
                    {tamanho.rotulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tamanho padrão do produto (opcional)
            </p>
          </div>
          
          {/* Dimensões precisas */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-medium">Dimensões precisas</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Altura */}
              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <div className="relative">
                  <MoveVertical className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="altura"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={formData.altura || ''}
                    onChange={(e) => atualizarFormData({ 
                      altura: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    className="pl-9 focus-visible:ring-primary/20"
                  />
                </div>
              </div>
              
              {/* Largura */}
              <div className="space-y-2">
                <Label htmlFor="largura">Largura (cm)</Label>
                <div className="relative">
                  <MoveHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="largura"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={formData.largura || ''}
                    onChange={(e) => atualizarFormData({ 
                      largura: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    className="pl-9 focus-visible:ring-primary/20"
                  />
                </div>
              </div>
              
              {/* Comprimento */}
              <div className="space-y-2">
                <Label htmlFor="comprimento">Comprimento (cm)</Label>
                <div className="relative">
                  <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="comprimento"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={formData.comprimento || ''}
                    onChange={(e) => atualizarFormData({ 
                      comprimento: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    className="pl-9 focus-visible:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Ruler className="h-3 w-3 mr-1" />
              <span>Dimensões em centímetros (cm)</span>
            </div>
            
            {/* Calculadora de cubagem */}
            {formData.altura && formData.largura && formData.comprimento && (
              <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-900">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Volume do produto:
                  </span>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    {(formData.altura * formData.largura * formData.comprimento / 1000).toFixed(2)} litros
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Cubagem:
                  </span>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    {(formData.altura * formData.largura * formData.comprimento / 1000000).toFixed(6)} m³
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
