'use client';

import { useEffect, useState } from 'react';
import { X, Mail, User, Phone, MapPin, BadgeCheck, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClienteDados } from '../page';

interface ModalClienteProps {
  isOpen: boolean;
  onClose: () => void;
  clienteParaEditar: ClienteDados | null;
  onSalvar: (cliente: ClienteDados) => void;
}

export function ModalCliente({ 
  isOpen, 
  onClose, 
  clienteParaEditar, 
  onSalvar 
}: ModalClienteProps) {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [verificado, setVerificado] = useState(false);
  const [premium, setPremium] = useState(false);
  
  // Endereço
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  
  // Controle de abas
  const [abaAtiva, setAbaAtiva] = useState('dados');
  
  // Preencher o formulário quando editar um cliente existente
  useEffect(() => {
    if (clienteParaEditar) {
      setNome(clienteParaEditar.nome || '');
      setEmail(clienteParaEditar.email || '');
      setTelefone(clienteParaEditar.telefone || '');
      setAtivo(clienteParaEditar.ativo);
      setVerificado(clienteParaEditar.verificado);
      setPremium(clienteParaEditar.premium || false);
      
      // Endereço
      if (clienteParaEditar.endereco) {
        setRua(clienteParaEditar.endereco.rua || '');
        setNumero(clienteParaEditar.endereco.numero || '');
        setComplemento(clienteParaEditar.endereco.complemento || '');
        setBairro(clienteParaEditar.endereco.bairro || '');
        setCidade(clienteParaEditar.endereco.cidade || '');
        setEstado(clienteParaEditar.endereco.estado || '');
        setCep(clienteParaEditar.endereco.cep || '');
      } else {
        resetarEndereco();
      }
    } else {
      // Reset para valores padrão quando criar novo cliente
      resetarFormulario();
    }
  }, [clienteParaEditar]);
  
  const resetarFormulario = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setAtivo(true);
    setVerificado(false);
    setPremium(false);
    resetarEndereco();
  };
  
  const resetarEndereco = () => {
    setRua('');
    setNumero('');
    setComplemento('');
    setBairro('');
    setCidade('');
    setEstado('');
    setCep('');
  };
  
  // Formatar telefone
  const formatarTelefone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numeroLimpo = value.replace(/\D/g, '');
    
    // Aplica a formatação
    if (numeroLimpo.length <= 2) {
      return `(${numeroLimpo}`;
    } else if (numeroLimpo.length <= 6) {
      return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2)}`;
    } else if (numeroLimpo.length <= 10) {
      return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 6)}-${numeroLimpo.slice(6)}`;
    } else {
      return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7, 11)}`;
    }
  };
  
  const handleChangeTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value));
  };
  
  // Formatação de CEP
  const formatarCep = (value: string) => {
    const cepLimpo = value.replace(/\D/g, '');
    
    if (cepLimpo.length <= 5) {
      return cepLimpo;
    } else {
      return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5, 8)}`;
    }
  };
  
  const handleChangeCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCep(formatarCep(e.target.value));
  };
  
  // Validação do formulário
  const validarFormulario = (): boolean => {
    // Validação simples para os campos obrigatórios
    if (!nome.trim()) {
      alert('Nome é obrigatório!');
      return false;
    }
    
    if (!email.trim()) {
      alert('Email é obrigatório!');
      return false;
    }
    
    // Validação de email com regex simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, informe um email válido!');
      return false;
    }
    
    return true;
  };
  
  // Submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    const endereco = {
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep
    };
    
    // Verifica se tem algum campo de endereço preenchido
    const temEndereco = Object.values(endereco).some(value => value.trim() !== '');
    
    const clienteAtualizado: ClienteDados = {
      id: clienteParaEditar?.id || '',
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone || undefined,
      dataCadastro: clienteParaEditar?.dataCadastro || new Date(),
      ultimaCompra: clienteParaEditar?.ultimaCompra,
      totalGasto: clienteParaEditar?.totalGasto,
      totalCompras: clienteParaEditar?.totalCompras,
      ativo,
      verificado,
      premium,
      endereco: temEndereco ? endereco : undefined
    };
    
    onSalvar(clienteAtualizado);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white dark:bg-gray-900 border shadow-lg rounded-[20px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-teal-800 dark:text-teal-300 flex items-center">
            <div className="bg-gradient-to-r from-teal-600 to-teal-400 w-6 h-6 rounded-full mr-2"></div>
            {clienteParaEditar ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="grid grid-cols-2 mb-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <TabsTrigger 
                value="dados" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-300 rounded-lg shadow-sm"
              >
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger 
                value="endereco" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-300 rounded-lg shadow-sm"
              >
                Endereço
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center text-teal-700 dark:text-teal-300">
                  <User size={14} className="mr-1" />
                  Nome <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-teal-700 dark:text-teal-300">
                    <Mail size={14} className="mr-1" />
                    Email <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="flex items-center text-teal-700 dark:text-teal-300">
                    <Phone size={14} className="mr-1" />
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={telefone}
                    onChange={handleChangeTelefone}
                    placeholder="(00) 00000-0000"
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-teal-100 dark:border-teal-900/50">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="ativo" 
                    checked={ativo} 
                    onCheckedChange={setAtivo} 
                    className="data-[state=checked]:bg-teal-600"
                  />
                  <Label htmlFor="ativo" className="cursor-pointer flex items-center text-teal-700 dark:text-teal-300">
                    <BadgeCheck size={14} className="mr-1" />
                    Cliente ativo
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="verificado" 
                    checked={verificado} 
                    onCheckedChange={setVerificado} 
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="verificado" className="cursor-pointer flex items-center text-teal-700 dark:text-teal-300">
                    <BadgeCheck size={14} className="mr-1" />
                    Verificado
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="premium" 
                    checked={premium} 
                    onCheckedChange={setPremium} 
                    className="data-[state=checked]:bg-amber-600"
                  />
                  <Label htmlFor="premium" className="cursor-pointer flex items-center text-teal-700 dark:text-teal-300">
                    <Crown size={14} className="mr-1" />
                    Premium
                  </Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="endereco" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rua" className="flex items-center text-teal-700 dark:text-teal-300">
                  <MapPin size={14} className="mr-1" />
                  Rua / Logradouro
                </Label>
                <Input
                  id="rua"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Nome da rua"
                  className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero" className="text-teal-700 dark:text-teal-300">
                    Número
                  </Label>
                  <Input
                    id="numero"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="123"
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complemento" className="text-teal-700 dark:text-teal-300">
                    Complemento
                  </Label>
                  <Input
                    id="complemento"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Apto 101, Bloco B, etc."
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro" className="text-teal-700 dark:text-teal-300">
                    Bairro
                  </Label>
                  <Input
                    id="bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Nome do bairro"
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cep" className="text-teal-700 dark:text-teal-300">
                    CEP
                  </Label>
                  <Input
                    id="cep"
                    value={cep}
                    onChange={handleChangeCep}
                    placeholder="00000-000"
                    maxLength={9}
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade" className="text-teal-700 dark:text-teal-300">
                    Cidade
                  </Label>
                  <Input
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Nome da cidade"
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-teal-700 dark:text-teal-300">
                    Estado
                  </Label>
                  <Input
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="UF"
                    maxLength={2}
                    className="border-teal-200 dark:border-teal-900 focus:border-teal-400 focus:ring-teal-400 rounded-[10px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="p-6 pt-4 border-t border-teal-100 dark:border-teal-900 flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="flex items-center text-sm text-teal-600 dark:text-teal-400">
              {clienteParaEditar && (
                <span>
                  Cliente desde: {new Intl.DateTimeFormat('pt-BR').format(new Date(clienteParaEditar.dataCadastro))}
                </span>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                onClick={onClose}
                variant="outline"
                className="border-teal-200 hover:border-teal-300 dark:border-teal-900 dark:hover:border-teal-800 text-teal-700 dark:text-teal-300 rounded-[10px]"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-[10px]"
              >
                {clienteParaEditar ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
