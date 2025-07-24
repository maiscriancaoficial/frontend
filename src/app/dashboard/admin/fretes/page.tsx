'use client';

import { useState } from 'react';
import { Plus, FileText, Package, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ResumoCartao } from './components/resumo-cartao';
import { FiltroFretes } from './components/filtro-fretes';
import { TabelaFretes, FreteTabela } from './components/tabela-fretes';
import { BotoesStatus } from './components/botoes-status';
import { ModalFrete } from './components/modal-frete';

// Dados de exemplo
const fretesExemplo: FreteTabela[] = [
  {
    id: '1',
    titulo: 'Minas Gerais',
    tipoFrete: 'POR_CEP',
    configEspecifica: 'CEP: 30000000 a 39999999',
    valor: 25.50,
    prazo: 10,
    ativo: true
  },
  {
    id: '2',
    titulo: 'São Paulo',
    tipoFrete: 'POR_CEP',
    configEspecifica: 'CEP: 01000000 a 09999999',
    valor: 18.90,
    prazo: 7,
    ativo: true
  },
  {
    id: '3',
    titulo: 'Rio de Janeiro',
    tipoFrete: 'POR_CEP',
    configEspecifica: 'CEP: 20000000 a 28999999',
    valor: 22.00,
    prazo: 8,
    ativo: true
  },
  {
    id: '4',
    titulo: 'Nordeste',
    tipoFrete: 'POR_REGIAO',
    configEspecifica: 'Estados: BA, PE, CE, MA, RN',
    valor: 35.00,
    prazo: 15,
    ativo: false
  },
  {
    id: '5',
    titulo: 'Sergipe',
    tipoFrete: 'POR_CEP',
    configEspecifica: 'CEP: 49000000 a 49999999',
    valor: 38.50,
    prazo: 12,
    ativo: true
  }
];

export default function AdminFretesPage() {
  const [statusAtivo, setStatusAtivo] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [freteEditando, setFreteEditando] = useState<FreteTabela | undefined>(undefined);
  
  // Filtra os fretes baseado no status selecionado
  const fretesFiltrados = statusAtivo === 'todos' 
    ? fretesExemplo
    : statusAtivo === 'ativos'
      ? fretesExemplo.filter(f => f.ativo)
      : fretesExemplo.filter(f => !f.ativo);
  
  // Contadores
  const contadores = {
    todos: fretesExemplo.length,
    ativos: fretesExemplo.filter(f => f.ativo).length,
    inativos: fretesExemplo.filter(f => !f.ativo).length,
  };

  const handleEditar = (freteId: string) => {
    const frete = fretesExemplo.find(f => f.id === freteId);
    if (frete) {
      setFreteEditando(frete);
      setModalAberto(true);
    }
  };

  const handleNovo = () => {
    setFreteEditando(undefined);
    setModalAberto(true);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Frete</h2>
        <p className="text-gray-500 dark:text-gray-400">Gerenciamento de fretes</p>
      </div>
      
      {/* Cartões de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResumoCartao 
          titulo="Total de Opções" 
          valor={contadores.todos}
          descricao="Opções de frete cadastradas"
          icone={<FileText size={24} />}
        />
        
        <ResumoCartao 
          titulo="Opções Ativas" 
          valor={contadores.ativos}
          descricao="Opções disponíveis para uso"
          icone={<Package size={24} />}
        />
        
        <ResumoCartao 
          titulo="Opções Desativadas" 
          valor={contadores.inativos}
          descricao="Opções temporariamente inativas"
          icone={<XCircle size={24} />}
        />
      </div>
      
      {/* Título e Botão Novo */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Gerenciamento de Frete</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Crie e gerencie diferentes opções de frete para sua loja
          </p>
        </div>
        
        <Button onClick={handleNovo} className="min-w-[180px]">
          <Plus className="h-4 w-4 mr-2" /> 
          Nova opção de frete
        </Button>
      </div>
      
      {/* Botões de status e filtro */}
      <div>
        <BotoesStatus 
          statusAtivo={statusAtivo} 
          onStatusChange={setStatusAtivo}
          contadores={contadores}
        />
        
        <FiltroFretes />
      </div>
      
      {/* Tabela de fretes */}
      <TabelaFretes 
        fretes={fretesFiltrados}
        onEditar={handleEditar}
        onExcluir={(id) => console.log('Excluir', id)}
        onAlternarStatus={(id) => console.log('Alternar status', id)}
      />
      
      {/* Modal de criação/edição */}
      <ModalFrete 
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        freteParaEditar={freteEditando}
      />
    </div>
  );
}
