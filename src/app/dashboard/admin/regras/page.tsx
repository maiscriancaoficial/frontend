'use client';

import { useState } from 'react';
import { ListaRegras } from './components/lista-regras';
import { ModalRegra } from './components/modal-regra';

export default function AdminRegrasPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [regraAtual, setRegraAtual] = useState<any>(null);
  
  // Função para abrir o modal de nova regra
  const abrirModalNovaRegra = () => {
    setRegraAtual(null);
    setModalAberto(true);
  };
  
  // Função para abrir o modal de edição de regra
  const abrirModalEditarRegra = (regra: any) => {
    setRegraAtual(regra);
    setModalAberto(true);
  };
  
  // Função para fechar o modal
  const fecharModal = () => {
    setModalAberto(false);
    setRegraAtual(null);
  };
  
  // Função para salvar a regra (seria integrada com a API)
  const salvarRegra = (dados: any) => {
    console.log('Regra salva:', dados);
    // Aqui faria a integração com a API para salvar os dados
    
    // Exemplo de sucesso na interface
    alert(dados.id ? 'Regra atualizada com sucesso!' : 'Regra criada com sucesso!');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Regras</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Configure regras automáticas para descontos, fretes e restrições no seu site
        </p>
      </div>
      
      <ListaRegras 
        onNovaRegra={abrirModalNovaRegra}
        onEditarRegra={abrirModalEditarRegra}
      />
      
      <ModalRegra 
        aberto={modalAberto} 
        regra={regraAtual}
        onFechar={fecharModal}
        onSalvar={salvarRegra}
      />
    </div>
  );
}
