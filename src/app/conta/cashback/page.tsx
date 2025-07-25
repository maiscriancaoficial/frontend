'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Wallet, 
  Search, 
  ArrowUp, 
  ArrowDown,
  TrendingUp,
  Gift,
  ShoppingCart,
  Calendar,
  Filter,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface TransacaoCashback {
  id: string
  tipo: 'CREDITO' | 'DEBITO'
  descricao: string
  valor: number
  data: string
  status: string
  pedidoId?: string | null
}

export default function CashbackPage() {
  const { usuario } = useAuth()
  const [transacoes, setTransacoes] = useState<TransacaoCashback[]>([])
  const [loading, setLoading] = useState(true)
  const [saldoDisponivel, setSaldoDisponivel] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')

  // Função para obter token do localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  // Buscar dados do cashback
  useEffect(() => {
    if (usuario) {
      buscarCashback()
    }
  }, [usuario])

  const buscarCashback = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/conta/cashback', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.sucesso) {
        setTransacoes(data.transacoes)
        setSaldoDisponivel(data.saldoDisponivel)
      } else {
        console.error('Erro ao buscar cashback:', data.mensagem)
      }
    } catch (error) {
      console.error('Erro ao buscar cashback:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!usuario) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso restrito</h3>
          <p className="text-gray-600">Faça login para ver seu cashback</p>
        </div>
      </div>
    )
  }

  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchSearch = transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTipo = filtroTipo === 'todos' || 
      (filtroTipo === 'credito' && transacao.tipo === 'CREDITO') ||
      (filtroTipo === 'debito' && transacao.tipo === 'DEBITO')
    return matchSearch && matchTipo
  })

  // Cálculos
  const saldoAtual = saldoDisponivel
  
  const totalGanho = transacoes
    .filter(t => t.tipo === 'CREDITO' && t.status === 'APROVADO')
    .reduce((acc, t) => acc + t.valor, 0)
  
  const totalUtilizado = transacoes
    .filter(t => t.tipo === 'DEBITO')
    .reduce((acc, t) => acc + t.valor, 0)
  
  const pendente = transacoes
    .filter(t => t.status === 'PENDENTE')
    .reduce((acc, t) => acc + t.valor, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800'
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Utilizado':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === 'CREDITO' ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-[#ff0080]" />
            <span>Meu Cashback</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Ganhe dinheiro de volta em suas compras
          </p>
        </div>
        
        <Button className="bg-[#ff0080] hover:bg-[#ff0080]/90">
          <Plus className="h-4 w-4 mr-2" />
          Usar Cashback
        </Button>
      </div>

      {/* Saldo Principal */}
      <Card className="bg-gradient-to-r from-[#ff0080] to-[#ff0080]/80 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Wallet className="h-6 w-6" />
                <span className="text-lg font-medium opacity-90">Saldo Disponível</span>
              </div>
              <div className="text-4xl font-bold mb-4">
                R$ {saldoAtual.toFixed(2).replace('.', ',')}
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Usar no Pedido
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Ver Regras
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Cashback Rate</div>
                <div className="text-2xl font-bold">5%</div>
                <div className="text-xs opacity-75">em todas as compras</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ganho</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalGanho.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Utilizado</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {totalUtilizado.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  R$ {pendente.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transações</p>
                <p className="text-2xl font-bold text-gray-900">{transacoes.length}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Como Funciona */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-[#ff0080]" />
            <span>Como Funciona o Cashback</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-[#ff0080]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="h-6 w-6 text-[#ff0080]" />
              </div>
              <h3 className="font-semibold mb-2">1. Faça suas Compras</h3>
              <p className="text-sm text-gray-600">Compre normalmente em nossa loja e ganhe 5% de volta</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-[#ff0080]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet className="h-6 w-6 text-[#ff0080]" />
              </div>
              <h3 className="font-semibold mb-2">2. Acumule Cashback</h3>
              <p className="text-sm text-gray-600">O valor é creditado após a confirmação do pedido</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-[#ff0080]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="h-6 w-6 text-[#ff0080]" />
              </div>
              <h3 className="font-semibold mb-2">3. Use como Desconto</h3>
              <p className="text-sm text-gray-600">Utilize em qualquer pedido futuro como desconto</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar transações ou pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff0080] focus:border-transparent"
          >
            <option value="todos">Todos os tipos</option>
            <option value="credito">Créditos</option>
            <option value="debito">Débitos</option>
          </select>
        </div>
      </div>

      {/* Histórico de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {transacoesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filtroTipo !== 'todos' ? 'Nenhuma transação encontrada' : 'Nenhuma transação ainda'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || filtroTipo !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Quando você fizer compras, o cashback aparecerá aqui'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transacoesFiltradas.map((transacao) => (
                <div key={transacao.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transacao.tipo === 'CREDITO' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getTipoIcon(transacao.tipo)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{transacao.descricao}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(transacao.data).toLocaleDateString('pt-BR')}</span>
                        {transacao.pedidoId && (
                          <>
                            <span>•</span>
                            <span>Pedido: {transacao.pedidoId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      transacao.tipo === 'CREDITO' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transacao.tipo === 'CREDITO' ? '+' : '-'}R$ {transacao.valor.toFixed(2).replace('.', ',')}
                    </div>
                    <Badge className={getStatusColor(transacao.status)}>
                      {transacao.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
