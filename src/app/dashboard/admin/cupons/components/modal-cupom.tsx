'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CupomDados } from "../page";

interface ModalCupomProps {
  isOpen: boolean;
  onClose: () => void;
  cupomParaEditar: CupomDados | null;
  onSalvar: (cupom: CupomDados) => void;
}

export function ModalCupom({ isOpen, onClose, cupomParaEditar, onSalvar }: ModalCupomProps) {
  // Estado inicial do formulário
  const cupomVazio: CupomDados = {
    id: '',
    titulo: '',
    codigo: '',
    descricao: '',
    tipoDesconto: 'PORCENTAGEM' as const,
    valorDesconto: 0,
    dataExpiracao: undefined,
    qtdMaxPorUsuario: undefined,
    ativo: true,
    utilizados: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Estado do formulário
  const [formulario, setFormulario] = useState<CupomDados>(cupomVazio);
  
  // Quando o modal abrir com um cupom para editar
  useEffect(() => {
    if (cupomParaEditar) {
      setFormulario(cupomParaEditar);
    } else {
      setFormulario(cupomVazio);
    }
  }, [cupomParaEditar, isOpen]);

  // Manipuladores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convertendo valores numéricos
    if (type === 'number') {
      setFormulario(prev => ({ 
        ...prev, 
        [name]: value === '' ? undefined : Number(value)
      }));
    } else {
      setFormulario(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormulario(prev => ({ ...prev, ativo: checked }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormulario(prev => ({ ...prev, [field]: value }));
  };
  
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setFormulario(prev => ({
      ...prev,
      dataExpiracao: value || undefined
    }));
  };

  const handleSalvar = async () => {
    try {
      // Aqui faria a chamada para API para salvar ou atualizar
      onSalvar(formulario);
    } catch (error) {
      console.error("Erro ao salvar cupom:", error);
    }
  };
  
  // Formatar data para o campo input date
  const formatarDataParaInput = (data: string | undefined): string => {
    if (!data) return '';
    // Se já está no formato YYYY-MM-DD, retorna direto
    if (data.match(/^\d{4}-\d{2}-\d{2}$/)) return data;
    // Se é uma data ISO, converte para YYYY-MM-DD
    try {
      return new Date(data).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-gray-900 border shadow-lg rounded-[20px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold">
            {cupomParaEditar ? "Editar cupom" : "Novo cupom"}
          </DialogTitle>
          <DialogDescription>
            {cupomParaEditar 
              ? "Altere os detalhes do cupom promocional" 
              : "Preencha os detalhes para criar um novo cupom promocional"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-2 space-y-6">
          {/* Título e Código */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formulario.titulo}
                onChange={handleInputChange}
                placeholder="Ex: Black Friday 50%"
                className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                name="codigo"
                value={formulario.codigo}
                onChange={handleInputChange}
                placeholder="Ex: BLACK50"
                className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30 uppercase"
              />
              <p className="text-xs text-gray-500">Use apenas letras e números, sem espaços</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formulario.descricao || ''}
              onChange={handleInputChange}
              placeholder="Descreva este cupom promocional"
              className="min-h-[80px] rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
            />
          </div>
          
          {/* Tipo de Desconto e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoDesconto">Tipo de Desconto</Label>
              <Select
                value={formulario.tipoDesconto}
                onValueChange={(value) => handleSelectChange(value, "tipoDesconto")}
              >
                <SelectTrigger id="tipoDesconto" className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo de desconto</SelectLabel>
                    <SelectItem value="PORCENTAGEM">Porcentagem (%)</SelectItem>
                    <SelectItem value="FIXO">Valor fixo (R$)</SelectItem>
                    <SelectItem value="SEQUENCIAL_POR_UNIDADE">Progressivo por unidade (%)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valorDesconto">
                {formulario.tipoDesconto === 'PORCENTAGEM' || formulario.tipoDesconto === 'SEQUENCIAL_POR_UNIDADE' 
                  ? 'Percentual de Desconto (%)' 
                  : 'Valor do Desconto (R$)'}
              </Label>
              <div className="flex items-center">
                <Input
                  id="valorDesconto"
                  name="valorDesconto"
                  type="number"
                  value={formulario.valorDesconto}
                  onChange={handleInputChange}
                  min="0"
                  step={formulario.tipoDesconto === 'FIXO' ? "0.01" : "1"}
                  placeholder={formulario.tipoDesconto === 'FIXO' ? "0,00" : "0"}
                  className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
                />
              </div>
            </div>
          </div>
          
          {/* Data de Expiração e Limite por Usuário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataExpiracao">Data de Expiração</Label>
              <Input
                id="dataExpiracao"
                name="dataExpiracao"
                type="date"
                value={formatarDataParaInput(formulario.dataExpiracao)}
                onChange={handleDataChange}
                className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
              />
              <p className="text-xs text-gray-500">Deixe em branco para não expirar</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qtdMaxPorUsuario">Máximo por Usuário</Label>
              <Input
                id="qtdMaxPorUsuario"
                name="qtdMaxPorUsuario"
                type="number"
                value={formulario.qtdMaxPorUsuario === undefined ? '' : formulario.qtdMaxPorUsuario}
                onChange={handleInputChange}
                min="1"
                placeholder="Ilimitado"
                className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
              />
              <p className="text-xs text-gray-500">Deixe em branco para uso ilimitado</p>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="ativo" className="text-base font-medium">
              Cupom ativo
            </Label>
            <Switch
              id="ativo"
              checked={formulario.ativo}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 dark:bg-gray-800 p-6">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="rounded-2xl border-gray-300 hover:bg-gray-100 text-gray-700"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar} 
            className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {cupomParaEditar ? "Salvar alterações" : "Criar cupom"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
