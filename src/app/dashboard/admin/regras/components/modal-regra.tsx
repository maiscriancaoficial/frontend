'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { FormularioRegra } from './formulario-regra';
import { CamposEspecificosRegra } from './campos-especificos-regra';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ModalRegraProps {
  aberto: boolean;
  regra?: any;
  onFechar: () => void;
  onSalvar: (dados: any) => void;
}

export function ModalRegra({ aberto, regra, onFechar, onSalvar }: ModalRegraProps) {
  const [dados, setDados] = useState(regra || {});
  const [erro, setErro] = useState('');
  
  // Função para atualizar dados do formulário
  const atualizarDados = (campo: string, valor: any) => {
    setDados((atual: Record<string, any>) => ({
      ...atual,
      [campo]: valor
    }));
  };
  
  // Função para salvar os dados
  const salvarRegra = (dadosFormulario: any) => {
    // Validações básicas
    if (!dadosFormulario.nome.trim()) {
      setErro('O nome da regra é obrigatório');
      return;
    }
    
    if (dadosFormulario.status === 'agendada' && 
        (!dadosFormulario.dataInicio || !dadosFormulario.dataFim)) {
      setErro('Para regras agendadas, as datas de início e término são obrigatórias');
      return;
    }
    
    // Validações específicas por tipo
    if (dadosFormulario.tipo === 'desconto') {
      if (dadosFormulario.tipoDesconto === 'percentual' && 
          (dadosFormulario.percentualDesconto <= 0 || dadosFormulario.percentualDesconto > 100)) {
        setErro('O percentual de desconto deve estar entre 0 e 100%');
        return;
      }
      
      if (dadosFormulario.tipoDesconto === 'fixo' && dadosFormulario.valorDesconto <= 0) {
        setErro('O valor do desconto deve ser maior que zero');
        return;
      }
    }
    
    // Se tudo estiver correto, salvar os dados
    setErro('');
    onSalvar(dadosFormulario);
    onFechar();
  };
  
  // Função para lidar com o fechamento do modal
  const fecharModal = () => {
    setErro('');
    onFechar();
  };
  
  return (
    <Dialog open={aberto} onOpenChange={fecharModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg !p-0">
        <div className="rounded-xl overflow-hidden p-6">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-800 dark:text-gray-200">
            {regra?.id ? 'Editar Regra' : 'Nova Regra'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Configure as propriedades da regra e suas condições de aplicação
          </DialogDescription>
        </DialogHeader>
        
        {erro && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-4">
          <FormularioRegra
            regra={dados}
            onSalvar={salvarRegra}
            onCancelar={fecharModal}
          />
          
          {/* Campos específicos baseados no tipo e status */}
          <div className="mt-4">
            <CamposEspecificosRegra
              tipo={dados.tipo || 'desconto'}
              status={dados.status || 'ativa'}
              dados={dados}
              onChange={atualizarDados}
            />
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
