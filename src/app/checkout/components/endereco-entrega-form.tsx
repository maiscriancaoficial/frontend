'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Search, Building, Home } from 'lucide-react';
import { InputSuave } from './input-suave';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface EnderecoEntregaFormProps {
  onEnderecoCompleto: (completo: boolean) => void;
}

export function EnderecoEntregaForm({ onEnderecoCompleto }: EnderecoEntregaFormProps) {
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [cepEncontrado, setCepEncontrado] = useState(false);

  // Validar se todos os campos obrigatórios estão preenchidos
  const camposObrigatoriosPreenchidos = Boolean(cep && rua && numero && bairro && cidade && estado);

  // Enviar status de formulário completo para o componente pai
  useEffect(() => {
    onEnderecoCompleto(camposObrigatoriosPreenchidos);
  }, [camposObrigatoriosPreenchidos, onEnderecoCompleto]);

  // Buscar endereço por CEP (simulado)
  const buscarCep = () => {
    if (cep.length !== 8) return;
    
    setCarregandoCep(true);
    // Simular uma chamada de API
    setTimeout(() => {
      // Dados simulados
      setRua('Av. das Flores');
      setBairro('Jardim Primavera');
      setCidade('São Paulo');
      setEstado('SP');
      setCepEncontrado(true);
      setCarregandoCep(false);
      
      // Focar no campo número após preencher o endereço
      document.getElementById('numero')?.focus();
    }, 1200);
  };

  // Formatar CEP ao digitar
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, '').substring(0, 8);
    setCep(valor);
    
    if (valor.length === 8) {
      buscarCep();
    } else {
      setCepEncontrado(false);
    }
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
                <MapPin className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-lg">Endereço de Entrega</h3>
              <p className="text-sm text-white/80">Informe onde você deseja receber seu pedido</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <CardContent className="p-6 pt-8 space-y-6">
        {/* Campo de CEP com busca */}
        <div className="space-y-2 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <Label htmlFor="cep" className="text-sm font-medium flex items-center gap-1.5">
            <Home className="h-4 w-4 text-[#27b99a]" />
            CEP
          </Label>
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <InputSuave
                id="cep"
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                className={`rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6 pr-10 ${cepEncontrado ? 'border-green-500 dark:border-green-500' : ''}`}
                disabled={carregandoCep}
              />
              {cepEncontrado && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </motion.div>
              )}
            </div>
            <Button
              onClick={buscarCep}
              disabled={cep.length !== 8 || carregandoCep}
              className="rounded-full py-6 px-5 bg-[#ff0080] hover:bg-[#ff0080]/90 text-white font-medium"
            >
              {carregandoCep ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Buscando...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rua/Logradouro */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="rua" className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#27b99a]" />
              Rua/Avenida
            </Label>
            <InputSuave
              id="rua"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              placeholder="Nome da rua ou avenida"
              className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
            />
          </div>

          {/* Número */}
          <div className="space-y-2">
            <Label htmlFor="numero" className="text-sm font-medium flex items-center gap-1.5">
              <Building className="h-4 w-4 text-[#27b99a]" />
              Número
            </Label>
            <InputSuave
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="123"
              className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Complemento */}
          <div className="space-y-2">
            <Label htmlFor="complemento" className="text-sm font-medium flex items-center gap-1.5">
              <Home className="h-4 w-4 text-[#27b99a]" />
              Complemento <span className="text-gray-500 text-xs ml-1">(opcional)</span>
            </Label>
            <InputSuave
              id="complemento"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Apto, Bloco, Casa, etc."
              className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
            />
          </div>
          
          {/* Bairro */}
          <div className="space-y-2">
            <Label htmlFor="bairro" className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#27b99a]" />
              Bairro
            </Label>
            <InputSuave
              id="bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Nome do bairro"
              className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cidade */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="cidade" className="text-sm font-medium flex items-center gap-1.5">
              <Building className="h-4 w-4 text-[#27b99a]" />
              Cidade
            </Label>
            <InputSuave
              id="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Nome da cidade"
              className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
            />
          </div>
          
          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado" className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#27b99a]" />
              Estado
            </Label>
            <InputSuave
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="UF"
              className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 py-6"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
