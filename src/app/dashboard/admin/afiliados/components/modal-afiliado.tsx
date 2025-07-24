'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AfiliadoDados } from './tabela-afiliados';

interface ModalAfiliadoProps {
  isOpen: boolean;
  onClose: () => void;
  afiliadoParaEditar: AfiliadoDados | null;
  onSalvar: (afiliado: AfiliadoDados) => void;
}

export function ModalAfiliado({
  isOpen,
  onClose,
  afiliadoParaEditar,
  onSalvar,
}: ModalAfiliadoProps) {
  const [abaAtiva, setAbaAtiva] = useState('dados');
  
  // Dados pessoais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [codigoAfiliado, setCodigoAfiliado] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [pendente, setPendente] = useState(false);
  
  // Dados de comissão
  const [tipoComissao, setTipoComissao] = useState<'porcentagem' | 'fixo'>('porcentagem');
  const [valorComissao, setValorComissao] = useState('');
  
  // Reset e carregamento de dados
  useEffect(() => {
    if (afiliadoParaEditar) {
      // Dados pessoais
      setNome(afiliadoParaEditar.nome);
      setEmail(afiliadoParaEditar.email);
      setCodigoAfiliado(afiliadoParaEditar.codigoAfiliado);
      setAtivo(afiliadoParaEditar.ativo);
      setPendente(afiliadoParaEditar.pendente);
      
      // Dados de comissão
      setTipoComissao(afiliadoParaEditar.tipoComissao);
      setValorComissao(afiliadoParaEditar.valorComissao.toString());
    } else {
      // Valores padrão para novo afiliado
      setNome('');
      setEmail('');
      setCodigoAfiliado(gerarCodigoAfiliado());
      setAtivo(true);
      setPendente(true);
      setTipoComissao('porcentagem');
      setValorComissao('10');
    }
  }, [afiliadoParaEditar]);
  
  const gerarCodigoAfiliado = () => {
    // Gera um código aleatório com 6 caracteres alfanuméricos
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  };
  
  const handleChangeTipoComissao = (valor: string) => {
    setTipoComissao(valor as 'porcentagem' | 'fixo');
    // Redefine o valor da comissão com base no tipo
    if (valor === 'porcentagem') {
      setValorComissao('10');
    } else {
      setValorComissao('50');
    }
  };
  
  const handleChangeValorComissao = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    setValorComissao(valor);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!nome || !email || !codigoAfiliado) return;
    
    const valorComissaoNumerico = parseFloat(valorComissao) || 0;
    
    const afiliadoAtualizado: AfiliadoDados = {
      id: afiliadoParaEditar?.id || crypto.randomUUID(),
      nome,
      email,
      codigoAfiliado,
      ativo,
      pendente,
      dataRegistro: afiliadoParaEditar?.dataRegistro || new Date(),
      ultimaVenda: afiliadoParaEditar?.ultimaVenda || null,
      totalVendas: afiliadoParaEditar?.totalVendas || 0,
      totalGanhos: afiliadoParaEditar?.totalGanhos || 0,
      cliques: afiliadoParaEditar?.cliques || 0,
      conversoes: afiliadoParaEditar?.conversoes || 0,
      taxaConversao: afiliadoParaEditar?.taxaConversao || 0,
      tipoComissao,
      valorComissao: valorComissaoNumerico,
    };
    
    onSalvar(afiliadoAtualizado);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 border shadow-lg rounded-[20px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-amber-800 dark:text-amber-300 flex items-center">
            <div className="bg-gradient-to-r from-amber-600 to-amber-400 w-6 h-6 rounded-full mr-2"></div>
            {afiliadoParaEditar ? 'Editar Afiliado' : 'Novo Afiliado'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="grid grid-cols-2 mb-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <TabsTrigger 
                value="dados" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300 rounded-lg shadow-sm"
              >
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger 
                value="comissao" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300 rounded-lg shadow-sm"
              >
                Comissão
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-amber-700 dark:text-amber-300">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  className="border-amber-200 dark:border-amber-900 focus:border-amber-400 focus:ring-amber-400 rounded-[10px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-700 dark:text-amber-300">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="border-amber-200 dark:border-amber-900 focus:border-amber-400 focus:ring-amber-400 rounded-[10px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-amber-700 dark:text-amber-300">
                    Código de Afiliado <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex">
                    <Input
                      id="codigo"
                      value={codigoAfiliado}
                      onChange={(e) => setCodigoAfiliado(e.target.value.toUpperCase())}
                      placeholder="ABC123"
                      className="border-amber-200 dark:border-amber-900 focus:border-amber-400 focus:ring-amber-400 rounded-[10px]"
                      required
                      maxLength={6}
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setCodigoAfiliado(gerarCodigoAfiliado())}
                      className="ml-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:border-amber-900 dark:hover:bg-amber-900/30 dark:hover:border-amber-700 text-amber-700 dark:text-amber-400 rounded-[10px]"
                    >
                      Gerar
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-amber-700 dark:text-amber-300 mb-3 font-medium">Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-[10px] border border-amber-100 dark:border-amber-900/50">
                    <div>
                      <Label htmlFor="ativo" className="font-medium">Ativo</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Afiliado pode fazer login e gerar comissões
                      </p>
                    </div>
                    <Switch 
                      id="ativo" 
                      checked={ativo} 
                      onCheckedChange={setAtivo}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-[10px] border border-amber-100 dark:border-amber-900/50">
                    <div>
                      <Label htmlFor="pendente" className="font-medium">Pendente de Aprovação</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Aguardando revisão manual
                      </p>
                    </div>
                    <Switch 
                      id="pendente" 
                      checked={pendente} 
                      onCheckedChange={setPendente}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comissao" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="tipoComissao" className="text-amber-700 dark:text-amber-300">
                  Tipo de Comissão
                </Label>
                <Select 
                  value={tipoComissao} 
                  onValueChange={handleChangeTipoComissao}
                >
                  <SelectTrigger className="border-amber-200 dark:border-amber-900 focus:border-amber-400 focus:ring-amber-400 rounded-[10px]">
                    <SelectValue placeholder="Selecione o tipo de comissão" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px]">
                    <SelectItem value="porcentagem">Porcentagem sobre venda</SelectItem>
                    <SelectItem value="fixo">Valor fixo por venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorComissao" className="text-amber-700 dark:text-amber-300">
                  {tipoComissao === 'porcentagem' ? 'Porcentagem (%)' : 'Valor Fixo (R$)'}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-amber-500">
                      {tipoComissao === 'porcentagem' ? '%' : 'R$'}
                    </span>
                  </div>
                  <Input
                    id="valorComissao"
                    value={valorComissao}
                    onChange={handleChangeValorComissao}
                    placeholder={tipoComissao === 'porcentagem' ? '10' : '50.00'}
                    className="pl-8 border-amber-200 dark:border-amber-900 focus:border-amber-400 focus:ring-amber-400 rounded-[10px]"
                  />
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-[10px] p-4 mt-4">
                <h4 className="text-amber-700 dark:text-amber-300 font-medium mb-2">Como funciona</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {tipoComissao === 'porcentagem' 
                    ? `O afiliado receberá ${valorComissao || '0'}% do valor total de cada venda que for realizada através do seu link de afiliado.`
                    : `O afiliado receberá R$ ${valorComissao || '0'} para cada venda que for realizada através do seu link de afiliado, independente do valor da venda.`
                  }
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="p-6 pt-4 border-t border-amber-100 dark:border-amber-900 flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
              {afiliadoParaEditar && (
                <span>
                  <span className="font-medium mr-1">Criado em:</span> 
                  {new Date(afiliadoParaEditar.dataRegistro).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:border-amber-900 dark:hover:bg-amber-900/30 dark:hover:border-amber-700 text-amber-700 dark:text-amber-400 rounded-[10px]"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white rounded-[10px]"
              >
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
