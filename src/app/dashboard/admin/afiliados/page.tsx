'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Users, TrendingUp, DollarSign, Award, Eye, EyeOff, BarChart3, Settings, UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiltroAfiliados } from './components/filtro-afiliados';
import { TabelaAfiliados, AfiliadoDados } from './components/tabela-afiliados';
import { CardsAfiliados } from './components/cards-afiliados';
import { ModalAfiliado } from './components/modal-afiliado';
import { ModalConfiguracoes } from './components/modal-configuracoes';
import { ModalGrupos } from './components/modal-grupos';
import { ModalConfigGlobal } from './components/modal-config-global';



export default function AdminAfiliadosPage() {
  const [afiliados, setAfiliados] = useState<AfiliadoDados[]>([]);
  const [filtroAtual, setFiltroAtual] = useState({ tipo: '', valor: '' });
  const [modalAberto, setModalAberto] = useState(false);
  const [modalConfigAberto, setModalConfigAberto] = useState(false);
  const [afiliadoEmEdicao, setAfiliadoEmEdicao] = useState<AfiliadoDados | null>(null);
  const [afiliadoConfig, setAfiliadoConfig] = useState<AfiliadoDados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [visualizacaoCards, setVisualizacaoCards] = useState(true);
  const [mostrarMetricasAvancadas, setMostrarMetricasAvancadas] = useState(false);
  const [modalGruposAberto, setModalGruposAberto] = useState(false);
  const [modalConfigGlobalAberto, setModalConfigGlobalAberto] = useState(false);
  
  // Carregar afiliados ao montar o componente
  useEffect(() => {
    carregarAfiliados();
  }, []);
  
  // Recarregar quando filtros mudarem
  useEffect(() => {
    if (!carregando) {
      carregarAfiliados();
    }
  }, [filtroAtual]);
  
  const carregarAfiliados = async () => {
    setCarregando(true);
    try {
      const params = new URLSearchParams();
      if (filtroAtual.tipo && filtroAtual.valor) {
        if (filtroAtual.tipo === 'busca') {
          params.append('busca', filtroAtual.valor);
        } else if (filtroAtual.tipo === 'status') {
          if (filtroAtual.valor !== 'todos') {
            params.append('status', filtroAtual.valor);
          }
        }
      }
      
      const response = await fetch(`/api/afiliados?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar afiliados');
      }
      
      const data = await response.json();
      setAfiliados(data.afiliados || []);
    } catch (error) {
      console.error('Erro ao carregar afiliados:', error);
      // Em caso de erro, manter lista vazia
      setAfiliados([]);
    } finally {
      setCarregando(false);
    }
  };
  
  // A filtragem agora é feita pela API
  const afiliadosFiltrados = afiliados;
  
  // Contagem de status para os badges
  const totalAtivos = afiliados.filter(a => a.ativo).length;
  const totalInativos = afiliados.filter(a => !a.ativo).length;
  const totalPendentes = afiliados.filter(a => a.pendente).length;
  
  // Handlers
  const handleFiltrar = (filtro: string, valor: string) => {
    setFiltroAtual({ tipo: filtro, valor });
  };
  
  const handleLimparFiltros = () => {
    setFiltroAtual({ tipo: '', valor: '' });
  };
  
  const handleExportar = () => {
    alert('Função de exportação será implementada em breve!');
  };
  
  const handleEditar = (afiliado: AfiliadoDados) => {
    setAfiliadoEmEdicao(afiliado);
    setModalAberto(true);
  };
  
  const handleAlterarStatus = async (id: string, novoStatus: boolean) => {
    try {
      const response = await fetch(`/api/afiliados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: novoStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao alterar status do afiliado');
      }
      
      // Atualizar localmente
      setAfiliados(afiliados.map(afiliado => 
        afiliado.id === id ? { ...afiliado, ativo: novoStatus } : afiliado
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do afiliado');
    }
  };
  
  const handleExcluir = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este afiliado?')) {
      try {
        const response = await fetch(`/api/afiliados/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erro ao excluir afiliado');
        }
        
        // Remover localmente
        setAfiliados(afiliados.filter(afiliado => afiliado.id !== id));
      } catch (error) {
        console.error('Erro ao excluir afiliado:', error);
        alert('Erro ao excluir afiliado');
      }
    }
  };
  
  const handleSalvarAfiliado = async (afiliado: AfiliadoDados) => {
    try {
      if (afiliadoEmEdicao) {
        // Edição
        const response = await fetch(`/api/afiliados/${afiliado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(afiliado),
        });
        
        if (!response.ok) {
          throw new Error('Erro ao atualizar afiliado');
        }
        
        const afiliadoAtualizado = await response.json();
        setAfiliados(afiliados.map(item => 
          item.id === afiliado.id ? afiliadoAtualizado : item
        ));
      } else {
        // Novo afiliado
        const response = await fetch('/api/afiliados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(afiliado),
        });
        
        if (!response.ok) {
          throw new Error('Erro ao criar afiliado');
        }
        
        const novoAfiliado = await response.json();
        setAfiliados([...afiliados, novoAfiliado]);
      }
      
      setModalAberto(false);
      setAfiliadoEmEdicao(null);
    } catch (error) {
      console.error('Erro ao salvar afiliado:', error);
      alert('Erro ao salvar afiliado');
    }
  };
  
  const handleAbrirModal = () => {
    setAfiliadoEmEdicao(null);
    setModalAberto(true);
  };
  
  const handleConfigurar = (afiliado: AfiliadoDados) => {
    setAfiliadoConfig(afiliado);
    setModalConfigAberto(true);
  };
  
  const handleSalvarConfiguracoes = (configuracoes: any) => {
    if (afiliadoConfig) {
      setAfiliados(afiliados.map(afiliado => 
        afiliado.id === afiliadoConfig.id 
          ? { ...afiliado, ...configuracoes }
          : afiliado
      ));
    }
    setModalConfigAberto(false);
    setAfiliadoConfig(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Afiliados</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie o programa de afiliados da sua floricultura</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVisualizacaoCards(!visualizacaoCards)}
              className="rounded-2xl border-[#27b99a] text-[#27b99a] hover:bg-[#27b99a] hover:text-white transition-all duration-300"
            >
              {visualizacaoCards ? <BarChart3 size={16} /> : <Users size={16} />}
            </Button>
            
            {visualizacaoCards && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarMetricasAvancadas(!mostrarMetricasAvancadas)}
                className="rounded-2xl border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080] hover:text-white transition-all duration-300"
              >
                {mostrarMetricasAvancadas ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setModalGruposAberto(true)}
              className="rounded-2xl border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              <UsersIcon size={16} className="mr-2" />
              Gerenciar Grupos
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setModalConfigGlobalAberto(true)}
              className="rounded-2xl border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300"
            >
              <Settings size={16} className="mr-2" />
              Configurações Globais
            </Button>
          </div>
          
          <Button
            onClick={handleAbrirModal}
            className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <UserPlus size={16} className="mr-2" />
            Novo Afiliado
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#27b99a] to-[#239d84] rounded-2xl p-3 shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Afiliados</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{afiliados.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-3 shadow-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Afiliados Ativos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#ff0080] to-[#e6006e] rounded-2xl p-3 shadow-lg">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comissões</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ {afiliados.reduce((acc, a) => acc + a.totalGanhos, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-3 shadow-lg">
                <Award size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FiltroAfiliados 
        totalAtivos={totalAtivos}
        totalInativos={totalInativos}
        totalPendentes={totalPendentes}
        onFiltrar={handleFiltrar}
        onLimpar={handleLimparFiltros}
        onExportar={handleExportar}
      />
      
      {carregando ? (
        <Card className="rounded-3xl border-0 shadow-lg">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27b99a] mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Carregando afiliados...</p>
          </CardContent>
        </Card>
      ) : afiliadosFiltrados.length === 0 ? (
        <Card className="rounded-3xl border-0 shadow-lg">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-r from-[#27b99a] to-[#239d84] p-4 rounded-2xl mb-4 shadow-lg">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Nenhum afiliado encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              {filtroAtual.tipo && filtroAtual.valor 
                ? 'Tente ajustar seus filtros de busca para encontrar afiliados' 
                : 'Comece adicionando o primeiro afiliado ao seu programa'}
            </p>
            <Button 
              onClick={handleAbrirModal} 
              className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl px-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <UserPlus size={16} className="mr-2" />
              Adicionar afiliado
            </Button>
          </CardContent>
        </Card>
      ) : visualizacaoCards ? (
        <CardsAfiliados 
          afiliados={afiliadosFiltrados}
          onEditar={handleEditar}
          onConfigurar={handleConfigurar}
          onAlterarStatus={handleAlterarStatus}
          onExcluir={handleExcluir}
          mostrarMetricasAvancadas={mostrarMetricasAvancadas}
        />
      ) : (
        <TabelaAfiliados 
          afiliados={afiliadosFiltrados}
          onEditar={handleEditar}
          onAlterarStatus={handleAlterarStatus}
          onExcluir={handleExcluir}
        />
      )}
      
      <ModalAfiliado 
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        afiliadoParaEditar={afiliadoEmEdicao}
        onSalvar={handleSalvarAfiliado}
      />
      
      <ModalConfiguracoes 
        isOpen={modalConfigAberto}
        onClose={() => setModalConfigAberto(false)}
        afiliado={afiliadoConfig}
        onSalvar={handleSalvarConfiguracoes}
      />
      
      <ModalGrupos 
        isOpen={modalGruposAberto}
        onClose={() => setModalGruposAberto(false)}
      />
      
      <ModalConfigGlobal 
        isOpen={modalConfigGlobalAberto}
        onClose={() => setModalConfigGlobalAberto(false)}
      />
    </div>
  );
}
