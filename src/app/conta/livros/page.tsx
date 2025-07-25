'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Search, 
  Download, 
  Eye, 
  Star,
  Calendar,
  Filter
} from 'lucide-react'

interface Livro {
  id: string
  titulo: string
  autor?: string
  categoria: string
  faixaEtaria?: string
  formato: string
  tamanho?: string
  dataCompra: string
  status: string
  rating?: number
  capa?: string
}


export default function MeusLivrosPage() {
  const { usuario } = useAuth()
  const [livros, setLivros] = useState<Livro[]>([])
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

  // Buscar livros (placeholder - implementar quando houver API)
  useEffect(() => {
    if (usuario) {
      // Por enquanto, deixar vazio até implementar API de livros
      setLoading(false)
    }
  }, [usuario])

  if (!usuario) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso restrito</h3>
          <p className="text-gray-600">Faça login para ver seus livros</p>
        </div>
      </div>
    )
  }

  const livrosFiltrados = livros.filter(livro => {
    const matchSearch = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || livro.status.toLowerCase() === filtroStatus.toLowerCase()
    return matchSearch && matchStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponível':
        return 'bg-green-100 text-green-800'
      case 'lendo':
        return 'bg-blue-100 text-blue-800'
      case 'concluído':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-[#ff0080]" />
            <span>Meus Livros</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie sua biblioteca pessoal de livros digitais
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-3 py-1">
            {livros.length} livros
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar livros..."
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
            <option value="disponível">Disponível</option>
            <option value="lendo">Lendo</option>
            <option value="concluído">Concluído</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {livrosFiltrados.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filtroStatus !== 'todos' ? 'Nenhum livro encontrado' : 'Nenhum livro ainda'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filtroStatus !== 'todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Quando você comprar livros, eles aparecerão aqui'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livrosFiltrados.map((livro) => (
            <Card key={livro.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-[#ff0080]/10 to-[#ff0080]/5 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-[#ff0080]/30" />
                </div>
                <Badge 
                  className={`absolute top-3 right-3 ${getStatusColor(livro.status)}`}
                >
                  {livro.status}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {livro.titulo}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Categoria:</span>
                    <Badge variant="outline" className="text-xs">
                      {livro.categoria}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Formato:</span>
                    <span className="font-medium">{livro.formato}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Tamanho:</span>
                    <span className="font-medium">{livro.tamanho}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Comprado em:</span>
                    <span className="font-medium">
                      {new Date(livro.dataCompra).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (livro.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-[#ff0080] hover:bg-[#ff0080]/90">
                    <Eye className="h-4 w-4 mr-1" />
                    Ler
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
