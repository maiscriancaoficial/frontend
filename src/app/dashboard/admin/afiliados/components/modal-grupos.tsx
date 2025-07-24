'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Users, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface GrupoAfiliado {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  tipoComissao: 'porcentagem' | 'fixo';
  valorComissao: number;
  tipoEventoComissao: 'acesso' | 'clique' | 'checkout' | 'cupom';
  metodoSaque: 'pix' | 'ted' | 'boleto';
  valorMinimoSaque: number;
  totalAfiliados: number;
  createdAt: Date;
}

interface ModalGruposProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalGrupos({ isOpen, onClose }: ModalGruposProps) {
  const [grupos, setGrupos] = useState<GrupoAfiliado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editandoGrupo, setEditandoGrupo] = useState<GrupoAfiliado | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Dados do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [tipoComissao, setTipoComissao] = useState<'porcentagem' | 'fixo'>('porcentagem');
  const [valorComissao, setValorComissao] = useState(10);
  const [tipoEventoComissao, setTipoEventoComissao] = useState<'acesso' | 'clique' | 'checkout' | 'cupom'>('checkout');
  const [metodoSaque, setMetodoSaque] = useState<'pix' | 'ted' | 'boleto'>('pix');
  const [valorMinimoSaque, setValorMinimoSaque] = useState(50);

  useEffect(() => {
    if (isOpen) {
      carregarGrupos();
    }
  }, [isOpen]);

  const carregarGrupos = async () => {
    setCarregando(true);
    try {
      const response = await fetch('/api/grupos-afiliados');
      if (response.ok) {
        const data = await response.json();
        setGrupos(data.grupos || []);
      }
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setAtivo(true);
    setTipoComissao('porcentagem');
    setValorComissao(10);
    setTipoEventoComissao('checkout');
    setMetodoSaque('pix');
    setValorMinimoSaque(50);
    setEditandoGrupo(null);
  };

  const handleSalvar = async () => {
    try {
      const dadosGrupo = {
        nome,
        descricao,
        ativo,
        tipoComissao,
        valorComissao,
        tipoEventoComissao,
        metodoSaque,
        valorMinimoSaque,
      };

      let response;
      if (editandoGrupo) {
        response = await fetch(`/api/grupos-afiliados/${editandoGrupo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosGrupo),
        });
      } else {
        response = await fetch('/api/grupos-afiliados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosGrupo),
        });
      }

      if (response.ok) {
        await carregarGrupos();
        setMostrarFormulario(false);
        limparFormulario();
      }
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
    }
  };

  const handleEditar = (grupo: GrupoAfiliado) => {
    setEditandoGrupo(grupo);
    setNome(grupo.nome);
    setDescricao(grupo.descricao);
    setAtivo(grupo.ativo);
    setTipoComissao(grupo.tipoComissao);
    setValorComissao(grupo.valorComissao);
    setTipoEventoComissao(grupo.tipoEventoComissao);
    setMetodoSaque(grupo.metodoSaque);
    setValorMinimoSaque(grupo.valorMinimoSaque);
    setMostrarFormulario(true);
  };

  const handleExcluir = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      try {
        const response = await fetch(`/api/grupos-afiliados/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await carregarGrupos();
        }
      } catch (error) {
        console.error('Erro ao excluir grupo:', error);
      }
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-2">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gerenciar Grupos de Afiliados
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure grupos com comissões e regras específicas
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Grupos Cadastrados ({grupos.length})
            </h3>
            <Button
              onClick={() => {
                limparFormulario();
                setMostrarFormulario(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl"
            >
              <Plus size={16} className="mr-2" />
              Novo Grupo
            </Button>
          </div>

          {mostrarFormulario && (
            <Card className="mb-6 rounded-3xl border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {editandoGrupo ? 'Editar Grupo' : 'Novo Grupo'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome do Grupo *</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Afiliados Premium"
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativo"
                      checked={ativo}
                      onCheckedChange={setAtivo}
                    />
                    <Label htmlFor="ativo">Grupo Ativo</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição do grupo..."
                    className="rounded-2xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tipo de Comissão</Label>
                    <Select value={tipoComissao} onValueChange={(value: 'porcentagem' | 'fixo') => setTipoComissao(value)}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="porcentagem">Porcentagem</SelectItem>
                        <SelectItem value="fixo">Valor Fixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Valor da Comissão</Label>
                    <Input
                      type="number"
                      value={valorComissao}
                      onChange={(e) => setValorComissao(Number(e.target.value))}
                      className="rounded-2xl"
                    />
                  </div>
                  <div>
                    <Label>Evento de Comissão</Label>
                    <Select value={tipoEventoComissao} onValueChange={(value: 'acesso' | 'clique' | 'checkout' | 'cupom') => setTipoEventoComissao(value)}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acesso">Por Acesso</SelectItem>
                        <SelectItem value="clique">Por Clique</SelectItem>
                        <SelectItem value="checkout">Por Checkout</SelectItem>
                        <SelectItem value="cupom">Por Cupom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Método de Saque</Label>
                    <Select value={metodoSaque} onValueChange={(value: 'pix' | 'ted' | 'boleto') => setMetodoSaque(value)}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="ted">TED</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Valor Mínimo para Saque</Label>
                    <Input
                      type="number"
                      value={valorMinimoSaque}
                      onChange={(e) => setValorMinimoSaque(Number(e.target.value))}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSalvar}
                    className="bg-gradient-to-r from-[#27b99a] to-[#239d84] hover:from-[#239d84] hover:to-[#1e8a73] text-white rounded-2xl"
                  >
                    {editandoGrupo ? 'Atualizar' : 'Criar'} Grupo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMostrarFormulario(false);
                      limparFormulario();
                    }}
                    className="rounded-2xl"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {carregando ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : grupos.length === 0 ? (
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Nenhum grupo cadastrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Crie o primeiro grupo de afiliados para organizar suas comissões
                </p>
                <Button
                  onClick={() => {
                    limparFormulario();
                    setMostrarFormulario(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl"
                >
                  <Plus size={16} className="mr-2" />
                  Criar Primeiro Grupo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grupos.map((grupo) => (
                <Card key={grupo.id} className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {grupo.nome}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {grupo.descricao}
                        </p>
                        <Badge className={`${grupo.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} rounded-xl border-0`}>
                          {grupo.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditar(grupo)}
                          className="rounded-xl hover:bg-blue-100 text-blue-600"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExcluir(grupo.id)}
                          className="rounded-xl hover:bg-red-100 text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Comissão:</span>
                        <div className="flex items-center gap-1">
                          {grupo.tipoComissao === 'porcentagem' ? (
                            <Percent size={14} className="text-blue-600" />
                          ) : (
                            <DollarSign size={14} className="text-green-600" />
                          )}
                          <span className="font-medium">
                            {grupo.tipoComissao === 'porcentagem' 
                              ? `${grupo.valorComissao}%` 
                              : formatarMoeda(grupo.valorComissao)
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Evento:</span>
                        <Badge className="bg-purple-100 text-purple-800 rounded-xl border-0 text-xs">
                          {grupo.tipoEventoComissao === 'checkout' && 'Checkout'}
                          {grupo.tipoEventoComissao === 'clique' && 'Clique'}
                          {grupo.tipoEventoComissao === 'acesso' && 'Acesso'}
                          {grupo.tipoEventoComissao === 'cupom' && 'Cupom'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Saque mín.:</span>
                        <span className="font-medium">{formatarMoeda(grupo.valorMinimoSaque)}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Afiliados:</span>
                        <Badge className="bg-blue-100 text-blue-800 rounded-xl border-0">
                          {grupo.totalAfiliados || 0}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
