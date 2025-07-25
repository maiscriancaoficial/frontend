'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { cn } from '@/lib/utils'
import { 
  ShoppingBag, 
  Heart, 
  Wallet, 
  BookOpen,
  RotateCcw,
  User
} from 'lucide-react'

interface NavigationData {
  totalPedidos: number
  totalFavoritos: number
  saldoCashback: number
  totalReembolsos: number
}

const getNavigationItems = (data: NavigationData) => [
  {
    label: 'Meus Pedidos',
    href: '/conta/pedidos',
    icon: ShoppingBag,
    badge: data.totalPedidos > 0 ? data.totalPedidos.toString() : undefined,
  },
  {
    label: 'Meus Favoritos',
    href: '/conta/favoritos',
    icon: Heart,
    badge: data.totalFavoritos > 0 ? data.totalFavoritos.toString() : undefined,
  },
  {
    label: 'Cashback',
    href: '/conta/cashback',
    icon: Wallet,
    badge: data.saldoCashback > 0 ? `R$ ${data.saldoCashback.toFixed(0)}` : undefined,
  },
  {
    label: 'Meus Livros',
    href: '/conta/livros',
    icon: BookOpen,
  },
  {
    label: 'Reembolsos',
    href: '/conta/reembolsos',
    icon: RotateCcw,
    badge: data.totalReembolsos > 0 ? data.totalReembolsos.toString() : undefined,
  },
  {
    label: 'Meu Perfil',
    href: '/conta/perfil',
    icon: User,
  },
]

export default function NavigationConta() {
  const pathname = usePathname()
  const { usuario } = useAuth()
  const [navigationData, setNavigationData] = useState<NavigationData>({
    totalPedidos: 0,
    totalFavoritos: 0,
    saldoCashback: 0,
    totalReembolsos: 0
  })

  // Função para obter token do localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  // Buscar dados das APIs
  useEffect(() => {
    if (usuario) {
      buscarDadosNavegacao()
    }
  }, [usuario])

  const buscarDadosNavegacao = async () => {
    const token = getToken()
    if (!token) {
      console.log('NavigationConta: Token não encontrado')
      return
    }

    console.log('NavigationConta: Buscando dados das APIs...')
    try {
      // Buscar favoritos
      const favoritosResponse = await fetch('/api/conta/favoritos', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const favoritosData = await favoritosResponse.json()
      console.log('NavigationConta - Favoritos:', favoritosData)
      
      // Buscar cashback
      const cashbackResponse = await fetch('/api/conta/cashback', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const cashbackData = await cashbackResponse.json()
      console.log('NavigationConta - Cashback:', cashbackData)
      
      // Buscar reembolsos
      const reembolsosResponse = await fetch('/api/conta/reembolsos', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const reembolsosData = await reembolsosResponse.json()
      console.log('NavigationConta - Reembolsos:', reembolsosData)

      const newData = {
        totalPedidos: 0, // TODO: Implementar API de pedidos
        totalFavoritos: favoritosData.sucesso ? favoritosData.favoritos.length : 0,
        saldoCashback: cashbackData.sucesso ? cashbackData.saldoDisponivel : 0,
        totalReembolsos: reembolsosData.sucesso ? reembolsosData.solicitacoes.length : 0
      }
      
      console.log('NavigationConta - Dados finais:', newData)
      setNavigationData(newData)
    } catch (error) {
      console.error('NavigationConta - Erro ao buscar dados:', error)
    }
  }

  const navigationItems = getNavigationItems(navigationData)

  return (
    <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-hide py-4">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap group
              ${
                isActive
                  ? 'bg-[#ff0080] text-white shadow-sm rounded-2xl'
                  : 'text-gray-600 hover:text-[#ff0080] hover:bg-[#ff0080]/10 hover:shadow-sm rounded-2xl'
              }
            `}
          >
            <Icon className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-white" : "text-gray-500 group-hover:text-[#ff0080]"
            )} />
            
            <span className="text-sm">{item.label}</span>
            
            {/* Badge */}
            {item.badge && (
              <span className={cn(
                "px-2 py-1 text-xs font-bold rounded-full transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-[#ff0080]/10 text-[#ff0080] group-hover:bg-[#ff0080]/20"
              )}>
                {item.badge}
              </span>
            )}
            
            {/* Active indicator */}
            {isActive && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#ff0080] rounded-full"></div>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
