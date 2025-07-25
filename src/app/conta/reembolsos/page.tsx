'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  RotateCcw, 
  Search, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Plus
} from 'lucide-react'

interface SolicitacaoReembolso {
  id: string
  pedidoId: string
  itemPedidoId: string
  motivo: string
  descricao?: string
  valor: number
  status: string
  dataSolicitacao: string
  dataProcessamento?: string | null
  observacoes?: string | null
  dadosPagamento?: any
}


export default function ReembolsosPage() {
  const { usuario } = useAuth()
  const [reembolsos, setReembolsos] = useState<SolicitacaoReembolso[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  // Função para obter token do localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  // Buscar reembolsos
  useEffect(() => {
    if (usuario) {
      buscarReembolsos()
    }
  }, [usuario])

  const buscarReembolsos = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/conta/reembolsos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.sucesso) {
        setReembolsos(data.solicitacoes)
      } else {
        console.error('Erro ao buscar reembolsos:', data.mensagem)
      }
    } catch (error) {
      console.error('Erro ao buscar reembolsos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!usuario) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso restrito</h3>
          <p className="text-gray-600">Faça login para ver seus reembolsos</p>
        </div>
      </div>
    )
  }

  const reembolsosFiltrados = reembolsos.filter(reembolso => {
    const matchSearch = 
      reembolso.pedidoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reembolso.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || reembolso.status.toLowerCase() === filtroStatus.toLowerCase()
    return matchSearch && matchStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4" />
      case 'em análise':
        return <Clock className="h-4 w-4" />
      case 'negado':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return 'bg-green-100 text-green-800'
      case 'em análise':
        return 'bg-yellow-100 text-yellow-800'
      case 'negado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalReembolsos = reembolsos.length
  const totalAprovado = reembolsos.filter(r => r.status === 'Aprovado').reduce((sum, r) => sum + r.valor, 0)
  const emAnalise = reembolsos.filter(r => r.status === 'Em análise').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <RotateCcw className="h-6 w-6 text-[#ff0080]" />
            <span>Reembolsos</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe suas solicitações de reembolso
          </p>
        </div>
        
        <Button className="bg-[#ff0080] hover:bg-[#ff0080]/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Solicitações</p>
                <p className="text-2xl font-bold text-gray-900">{totalReembolsos}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reembolsado</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalAprovado.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-yellow-600">{emAnalise}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por pedido ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff0080] focus:border-transparent"
          >
            <option value="todos">Todos os status</option>
            <option value="aprovado">Aprovado</option>
            <option value="em análise">Em análise</option>
            <option value="negado">Negado</option>
          </select>
        </div>
      </div>

      {/* Reembolsos List */}
      {reembolsosFiltrados.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filtroStatus !== 'todos' ? 'Nenhum reembolso encontrado' : 'Nenhuma solicitação ainda'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroStatus !== 'todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Quando você solicitar reembolsos, eles aparecerão aqui'
              }
            </p>
            {!searchTerm && filtroStatus === 'todos' && (
              <Button className="bg-[#ff0080] hover:bg-[#ff0080]/90">
                <Plus className="h-4 w-4 mr-2" />
                Solicitar Reembolso
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reembolsosFiltrados.map((reembolso) => (
            <Card key={reembolso.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Pedido {reembolso.pedidoId}
                      </h3>
                      <Badge className={`flex items-center space-x-1 ${getStatusColor(reembolso.status)}`}>
                        {getStatusIcon(reembolso.status)}
                        <span>{reembolso.status}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-2">Motivo: {reembolso.motivo}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Valor:</span>
                        <p className="font-medium text-lg text-[#ff0080]">
                          R$ {reembolso.valor.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Motivo:</span>
                        <p className="font-medium">{reembolso.motivo}</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Solicitado em:</span>
                        <p className="font-medium">
                          {new Date(reembolso.dataSolicitacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    {reembolso.dataProcessamento && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Processado em:</span>
                        <span className="font-medium ml-1">
                          {new Date(reembolso.dataProcessamento).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    
                    {reembolso.observacoes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {reembolso.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
