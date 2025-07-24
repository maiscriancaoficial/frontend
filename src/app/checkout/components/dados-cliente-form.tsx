'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, CheckCircle2, CreditCard, Shield } from 'lucide-react';
import { InputSuave } from './input-suave';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DadosClienteFormProps {
  onDadosCompletos: (completo: boolean) => void;
}

export function DadosClienteForm({ onDadosCompletos }: DadosClienteFormProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('FISICA');
  const [cpfCnpj, setCpfCnpj] = useState('');
  
  // Estado de animação
  const [animacaoCompleta, setAnimacaoCompleta] = useState(false);
  
  // Efeito para ativar a animação após o componente montar
  useEffect(() => {
    setTimeout(() => setAnimacaoCompleta(true), 100);
  }, []);
  
  // Validar CPF (simplificado)
  const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    
    // Verificação simples para demonstração
    return true;
  };
  
  // Validar CNPJ (simplificado)
  const validarCNPJ = (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    
    // Verificação simples para demonstração
    return true;
  };
  
  // Validar email
  const validarEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Verificar se todos os campos obrigatórios estão preenchidos e válidos
  const dadosValidos = (): boolean => {
    if (!nome || !email || !telefone) return false;
    if (!validarEmail(email)) return false;
    
    if (tipoPessoa === 'FISICA' && !validarCPF(cpfCnpj)) return false;
    if (tipoPessoa === 'JURIDICA' && !validarCNPJ(cpfCnpj)) return false;
    
    return true;
  };
  
  // Formatar CPF
  const formatarCPF = (value: string): string => {
    const digits = value.replace(/\D/g, '').substring(0, 11);
    
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };
  
  // Formatar CNPJ
  const formatarCNPJ = (value: string): string => {
    const digits = value.replace(/\D/g, '').substring(0, 14);
    
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };
  
  // Formatar telefone
  const formatarTelefone = (value: string): string => {
    const digits = value.replace(/\D/g, '').substring(0, 11);
    
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
  };
  
  // Lidar com mudança de CPF/CNPJ
  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (tipoPessoa === 'FISICA') {
      setCpfCnpj(formatarCPF(value));
    } else {
      setCpfCnpj(formatarCNPJ(value));
    }
    
    // Verificar validade e notificar componente pai
    setTimeout(() => {
      onDadosCompletos(dadosValidos());
    }, 100);
  };
  
  // Lidar com mudança de telefone
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTelefone(formatarTelefone(value));
    
    // Verificar validade e notificar componente pai
    setTimeout(() => {
      onDadosCompletos(dadosValidos());
    }, 100);
  };
  
  // Lidar com mudança de tipo de pessoa
  const handleTipoPessoaChange = (value: string) => {
    setTipoPessoa(value);
    setCpfCnpj(''); // Limpar CPF/CNPJ ao mudar o tipo
  };
  
  return (
    <Card className="shadow-lg border-0 rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] p-6 text-white shadow-sm rounded-t-3xl">
        <motion.div 
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-white/20 shadow-inner border border-white/30">
              <AvatarFallback className="text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-lg">Dados Pessoais</h3>
              <p className="text-sm text-white/80">Informações para contato e identificação</p>
            </div>
          </div>
        </motion.div>
      </div>
      <CardContent className="p-6 pt-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: animacaoCompleta ? 1 : 0, y: animacaoCompleta ? 0 : 10 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Tipo de pessoa */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <Label className="text-sm font-medium flex items-center gap-1.5 mb-3">
                <User className="h-4 w-4 text-[#f29798]" />
                Tipo de pessoa
              </Label>
              <RadioGroup 
                value={tipoPessoa}
                className="flex space-x-4"
                onValueChange={handleTipoPessoaChange}
              >
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  <RadioGroupItem value="FISICA" id="fisica" className="text-[#27b99a]" />
                  <Label htmlFor="fisica" className="cursor-pointer font-medium text-sm">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  <RadioGroupItem value="JURIDICA" id="juridica" className="text-[#27b99a]" />
                  <Label htmlFor="juridica" className="cursor-pointer font-medium text-sm">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium flex items-center gap-1.5">
                <User className="h-4 w-4 text-[#27b99a]" />
                Nome {tipoPessoa === 'FISICA' ? 'Completo' : 'da Empresa'}
              </Label>
              <InputSuave
                id="nome"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setTimeout(() => onDadosCompletos(dadosValidos()), 100);
                }}
                placeholder={tipoPessoa === 'FISICA' ? 'Ex: João da Silva' : 'Ex: Empresa XYZ LTDA'}
                className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
              />
            </div>
            
            {/* CPF/CNPJ */}
            <div className="space-y-2">
              <Label htmlFor="cpfCnpj" className="text-sm font-medium flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-[#f29798]" />
                {tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
              </Label>
              <div className="relative">
                <InputSuave
                  id="cpfCnpj"
                  value={cpfCnpj}
                  onChange={handleCpfCnpjChange}
                  placeholder={tipoPessoa === 'FISICA' ? '000.000.000-00' : '00.000.000/0000-00'}
                  className={`rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6 ${
                    cpfCnpj && ((tipoPessoa === 'FISICA' && validarCPF(cpfCnpj)) || 
                    (tipoPessoa === 'JURIDICA' && validarCNPJ(cpfCnpj)))
                      ? 'border-green-500 pr-10'
                      : ''
                  }`}
                />
                {cpfCnpj && ((tipoPessoa === 'FISICA' && validarCPF(cpfCnpj)) || 
                  (tipoPessoa === 'JURIDICA' && validarCNPJ(cpfCnpj))) && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-[#27b99a]" />
                  Email
                </Label>
                <div className="relative">
                  <InputSuave
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setTimeout(() => onDadosCompletos(dadosValidos()), 100);
                    }}
                    placeholder="seu@email.com"
                    className={`rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6 ${email && validarEmail(email) ? 'border-green-500 pr-10' : ''}`}
                  />
                  {email && validarEmail(email) && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-[#27b99a]" />
                  Telefone
                </Label>
                <InputSuave
                  id="telefone"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  placeholder="(00) 0 0000-0000"
                  className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
                />
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-[#27b99a]/5 to-[#27b99a]/10 p-4 text-sm text-[#27b99a]/90 flex items-start mt-4 border border-[#27b99a]/20 shadow-sm">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
              </motion.div>
              <p className="text-xs leading-relaxed">
                Seus dados estão protegidos e nunca serão compartilhados com terceiros. Utilizamos criptografia de ponta a ponta para garantir sua segurança.                
              </p>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
