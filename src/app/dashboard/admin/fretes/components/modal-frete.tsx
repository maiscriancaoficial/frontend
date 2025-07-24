'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TipoFrete } from "@prisma/client";

interface ModalFreteProps {
  isOpen: boolean;
  onClose: () => void;
  freteParaEditar?: any;
}

export function ModalFrete({ isOpen, onClose, freteParaEditar }: ModalFreteProps) {
  const [formulario, setFormulario] = useState({
    titulo: freteParaEditar?.titulo || "",
    descricao: freteParaEditar?.descricao || "",
    tipoFrete: freteParaEditar?.tipoFrete || "POR_CEP",
    valor: freteParaEditar?.valor || 0,
    prazo: freteParaEditar?.prazo || 1,
    cepInicial: freteParaEditar?.cepInicial || "",
    cepFinal: freteParaEditar?.cepFinal || "",
    ativo: freteParaEditar?.ativo ?? true,
    produtosVinculados: freteParaEditar?.produtosVinculados || [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormulario(prev => ({ ...prev, ativo: checked }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormulario(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvar = async () => {
    try {
      // Aqui faria a chamada para API para salvar ou atualizar
      console.log("Salvando frete:", formulario);
      // Após salvar, fechar o modal
      onClose();
    } catch (error) {
      console.error("Erro ao salvar frete:", error);
    }
  };

  const renderCamposEspecificos = () => {
    switch (formulario.tipoFrete) {
      case "POR_CEP":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cepInicial">CEP Inicial</Label>
                <Input
                  id="cepInicial"
                  name="cepInicial"
                  value={formulario.cepInicial}
                  onChange={handleInputChange}
                  placeholder="00000000"
                  className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
                />
                <p className="text-xs text-gray-500">Digite apenas números</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cepFinal">CEP Final</Label>
                <Input
                  id="cepFinal"
                  name="cepFinal"
                  value={formulario.cepFinal}
                  onChange={handleInputChange}
                  placeholder="99999999"
                  className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
                />
                <p className="text-xs text-gray-500">Digite apenas números</p>
              </div>
            </div>
          </>
        );
      // Adicione outros casos conforme necessário para outros tipos de frete
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-gray-900 border shadow-lg rounded-[20px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold">
            {freteParaEditar ? "Editar opção de frete" : "Nova opção de frete"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* Nome da opção de frete */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Nome da opção de frete</Label>
            <Input
              id="titulo"
              name="titulo"
              value={formulario.titulo}
              onChange={handleInputChange}
              placeholder="Ex: Entrega para São Paulo"
              className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
            />
          </div>

          {/* Descrição (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formulario.descricao}
              onChange={handleInputChange}
              placeholder="Descreva esta opção de frete"
              className="min-h-[80px] rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
            />
          </div>

          {/* Tipo de frete e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoFrete">Tipo de frete</Label>
              <Select
                value={formulario.tipoFrete}
                onValueChange={(value) => handleSelectChange(value, "tipoFrete")}
              >
                <SelectTrigger id="tipoFrete" className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POR_CEP">Faixa de CEP</SelectItem>
                  <SelectItem value="POR_CIDADE">Por Cidade</SelectItem>
                  <SelectItem value="POR_ESTADO">Por Estado</SelectItem>
                  <SelectItem value="POR_REGIAO">Por Região</SelectItem>
                  <SelectItem value="POR_KM">Por Distância (KM)</SelectItem>
                  <SelectItem value="POR_PRODUTO">Específico por Produto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor do frete (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formulario.valor}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0,00"
                className="rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
              />
            </div>
          </div>

          {/* Prazo de entrega */}
          <div className="space-y-2">
            <Label htmlFor="prazo">Prazo de entrega (dias)</Label>
            <Input
              id="prazo"
              name="prazo"
              type="number"
              value={formulario.prazo}
              onChange={handleInputChange}
              min="1"
              className="max-w-[200px] rounded-[10px] focus-visible:ring-primary/20 border-gray-200 dark:border-gray-700 focus-within:border-primary/30"
            />
          </div>

          {/* Campos específicos com base no tipo de frete */}
          <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h4 className="font-medium">Configurações específicas</h4>
            {renderCamposEspecificos()}
          </div>

          {/* Produtos vinculados (opcional) */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Produtos vinculados (opcional)</h4>
                <p className="text-sm text-gray-500">
                  Se desejar, selecione os produtos específicos para os quais esta
                  opção de frete estará disponível. Deixe em branco para aplicar a
                  todos os produtos.
                </p>
              </div>
              <Button variant="outline" type="button" size="sm">
                Selecionar produtos
              </Button>
            </div>
          </div>

          {/* Status ativo/inativo */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Ativo</h4>
              <p className="text-sm text-gray-500">
                Opções de frete inativas não serão exibidas aos clientes
              </p>
            </div>
            <Switch
              checked={formulario.ativo}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>

        <DialogFooter className="p-6 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSalvar}>
            Criar opção de frete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
