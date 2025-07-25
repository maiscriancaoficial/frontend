'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface ItemPedido {
  id: string
  produto: {
    titulo: string
  }
  quantidade: number
  valorTotal: number
}

interface Pedido {
  id: string
  codigo: string
  status: string
  valorTotal: number
  dataPedido: string
  dataEntrega?: string | null
  itens: ItemPedido[]
}


export default function PedidosPage() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
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

  // Buscar pedidos do usuário
  useEffect(() => {
    if (usuario) {
      buscarPedidos()
    }
  }, [usuario])

  const buscarPedidos = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch('/api/conta/pedidos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.sucesso) {
          setPedidos(data.pedidos || [])
        }
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!usuario) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso restrito</h3>
          <p className="text-gray-600">Faça login para ver seus pedidos</p>
        </div>
      </div>
    )
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchSearch = 
      pedido.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.itens.some(item => item.produto.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchStatus = filtroStatus === 'todos' || pedido.status.toLowerCase() === filtroStatus.toLowerCase()
    return matchSearch && matchStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregue':
        return <CheckCircle className="h-4 w-4" />
      case 'em trânsito':
        return <Truck className="h-4 w-4" />
      case 'processando':
        return <Clock className="h-4 w-4" />
      case 'cancelado':
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregue':
        return 'bg-green-100 text-green-800'
      case 'em trânsito':
        return 'bg-blue-100 text-blue-800'
      case 'processando':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalPedidos = pedidos.length
  const totalGasto = pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0)
  const pedidosEntregues = pedidos.filter(p => p.status === 'Entregue').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-[#ff0080]" />
            <span>Meus Pedidos</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o status dos seus pedidos e histórico de compras
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-3 py-1">
            {totalPedidos} pedidos
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-[#ff0080]">
                  R$ {totalGasto.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-[#ff0080]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos Entregues</p>
                <p className="text-2xl font-bold text-green-600">{pedidosEntregues}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
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
            placeholder="Buscar pedidos ou produtos..."
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
            <option value="processando">Processando</option>
            <option value="em trânsito">Em trânsito</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {pedidosFiltrados.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filtroStatus !== 'todos' ? 'Nenhum pedido encontrado' : 'Nenhum pedido ainda'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroStatus !== 'todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Quando você fizer pedidos, eles aparecerão aqui'
              }
            </p>
            {!searchTerm && filtroStatus === 'todos' && (
              <Link href="/produtos">
                <Button className="bg-[#ff0080] hover:bg-[#ff0080]/90">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ver Produtos
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Pedido {pedido.codigo}
                      </h3>
                      <Badge className={`flex items-center space-x-1 ${getStatusColor(pedido.status)}`}>
                        {getStatusIcon(pedido.status)}
                        <span>{pedido.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Pedido em {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</span>
                      </span>
                      {pedido.dataEntrega && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Entregue em {new Date(pedido.dataEntrega).toLocaleDateString('pt-BR')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#ff0080]">
                      R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {pedido.itens.reduce((acc, item) => acc + item.quantidade, 0)} itens
                    </p>
                  </div>
                </div>
                
                {/* Items */}
                <div className="space-y-2 mb-4">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="px-2 py-1 text-xs">
                          {item.quantidade}x
                        </Badge>
                        <span className="text-gray-700">{item.produto.titulo}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        R$ {item.valorTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Link href={`/conta/pedidos/${pedido.id}`}>
                    <Button variant="outline" size="sm" className="border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080]/5">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
