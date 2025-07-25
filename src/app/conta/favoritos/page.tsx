'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Heart, 
  Search, 
  Grid3X3 as Grid, 
  List, 
  ShoppingCart,
  Star,
  Filter,
  Package,
  BookOpen,
  Trash2,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface FavoritoItem {
  id: string
  tipo: 'produto' | 'livro'
  item: {
    id: string
    titulo: string
    descricao?: string
    preco: number
    precoPromocional?: number | null
    fotoPrincipal?: string | null
    categoria: string
    estoque?: number
    autor?: string
    faixaEtaria?: string
    ativo: boolean
  }
  dataFavorito: string
}

export default function FavoritosPage() {
  const { usuario } = useAuth()
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [visualizacao, setVisualizacao] = useState<'grid' | 'list'>('grid')

  // Função para obter token do localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  // Buscar favoritos do usuário
  useEffect(() => {
    if (usuario) {
      buscarFavoritos()
    } else {
      setLoading(false)
    }
  }, [usuario])

  const buscarFavoritos = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/conta/favoritos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.sucesso) {
        setFavoritos(data.favoritos)
      } else {
        console.error('Erro ao buscar favoritos:', data.mensagem)
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const removerFavoritoItem = async (id: string, tipo: 'produto' | 'livro', itemId: string) => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch('/api/conta/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tipo, itemId })
      })

      const data = await response.json()
      if (data.sucesso && data.acao === 'removido') {
        setFavoritos(favoritos.filter(f => f.id !== id))
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
    }
  }

  if (!usuario) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso restrito</h3>
          <p className="text-gray-600">Faça login para ver seus favoritos</p>
        </div>
      </div>
    )
  }

  const favoritosFiltrados = favoritos.filter(favorito => {
    const matchSearch = favorito.item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = filtroCategoria === 'todas' || favorito.item.categoria === filtroCategoria
    return matchSearch && matchCategoria
  })

  const categorias = [...new Set(favoritos.map(f => f.item.categoria))]
  const totalFavoritos = favoritos.length
  const emPromocao = favoritos.filter(f => f.item.precoPromocional).length
  const indisponiveis = favoritos.filter(f => !f.item.ativo).length

  const removerFavorito = async (id: string) => {
    const favorito = favoritos.find(f => f.id === id)
    if (!favorito) return
    
    await removerFavoritoItem(id, favorito.tipo, favorito.item.id)
  }

  const adicionarAoCarrinho = (produtoId: string) => {
    // Implementar lógica do carrinho
    console.log('Adicionando ao carrinho:', produtoId)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Heart className="h-6 w-6 text-[#ff0080]" />
            <span>Meus Favoritos</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Produtos que você salvou para comprar depois
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-3 py-1">
            {totalFavoritos} produtos
          </Badge>
          
          <div className="flex border rounded-lg">
            <Button
              variant={visualizacao === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setVisualizacao('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={visualizacao === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setVisualizacao('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{totalFavoritos}</p>
              </div>
              <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-[#ff0080]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Promoção</p>
                <p className="text-2xl font-bold text-green-600">{emPromocao}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Indisponíveis</p>
                <p className="text-2xl font-bold text-red-600">{indisponiveis}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
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
            placeholder="Buscar produtos favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff0080] focus:border-transparent"
          >
            <option value="todas">Todas as categorias</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      {favoritosFiltrados.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filtroCategoria !== 'todas' ? 'Nenhum favorito encontrado' : 'Nenhum favorito ainda'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroCategoria !== 'todas' 
                ? 'Tente ajustar os filtros de busca'
                : 'Quando você favoritar produtos, eles aparecerão aqui'
              }
            </p>
            {!searchTerm && filtroCategoria === 'todas' && (
              <Link href="/produtos">
                <Button className="bg-[#ff0080] hover:bg-[#ff0080]/90">
                  <Heart className="h-4 w-4 mr-2" />
                  Explorar Produtos
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={visualizacao === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {favoritosFiltrados.map((favorito) => (
            <Card key={favorito.id} className="hover:shadow-md transition-shadow">
              <CardContent className={visualizacao === 'grid' ? 'p-6' : 'p-6'}>
                <div className={visualizacao === 'grid' ? 'space-y-4' : 'flex items-center space-x-4'}>
                  {/* Product Image */}
                  <div className={visualizacao === 'grid' 
                    ? 'aspect-square bg-gradient-to-br from-[#ff0080]/10 to-[#ff0080]/5 rounded-lg flex items-center justify-center'
                    : 'w-20 h-20 bg-gradient-to-br from-[#ff0080]/10 to-[#ff0080]/5 rounded-lg flex items-center justify-center flex-shrink-0'
                  }>
                    <Heart className="h-8 w-8 text-[#ff0080]/30" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {favorito.item.titulo}
                        </h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {favorito.item.categoria}
                        </Badge>
                      </div>
                      
                      {!favorito.item.ativo && (
                        <Badge variant="destructive" className="text-xs">
                          Indisponível
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        (4.5)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {favorito.item.precoPromocional ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-[#ff0080]">
                              R$ {favorito.item.precoPromocional.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              R$ {favorito.item.preco.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            R$ {favorito.item.preco.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => adicionarAoCarrinho(favorito.item.id)}
                          disabled={!favorito.item.ativo}
                          className="bg-[#ff0080] hover:bg-[#ff0080]/90"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {favorito.item.ativo ? 'Comprar' : 'Indisponível'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removerFavoritoItem(favorito.id, favorito.tipo, favorito.item.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
