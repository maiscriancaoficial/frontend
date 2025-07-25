'use client'

import { useAuth } from '@/lib/auth/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Crown, 
  Shield, 
  LogOut,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export function HeaderConta() {
  const { usuario, logout } = useAuth()

  if (!usuario) {
    return null
  }

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="h-4 w-4" />
      case 'FUNCIONARIO':
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador'
      case 'FUNCIONARIO':
        return 'Funcionário'
      case 'CLIENTE':
        return 'Cliente'
      case 'ASSINANTE':
        return 'Assinante'
      case 'AFILIADO':
        return 'Afiliado'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'FUNCIONARIO':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ASSINANTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'AFILIADO':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="flex items-center justify-between">
      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-16 w-16 border-4 border-white shadow-lg ring-2 ring-[#ff0080]/10">
            <AvatarImage 
              src={usuario.fotoPerfil || undefined} 
              alt={usuario.nome}
            />
            <AvatarFallback className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/80 text-white font-bold text-lg">
              {getInitials(usuario.nome)}
            </AvatarFallback>
          </Avatar>
          
          {/* Status Online */}
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full shadow-sm">
            <div className="h-full w-full bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {usuario.nome}
            </h1>
            <Badge 
              variant="outline" 
              className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getRoleColor(usuario.role)}`}
            >
              {getRoleIcon(usuario.role)}
              <span className="font-medium">{getRoleLabel(usuario.role)}</span>
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span>📧</span>
              <span>{usuario.email}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Link href="/conta/perfil">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-gray-200 hover:border-[#ff0080] hover:text-[#ff0080] transition-colors rounded-full"
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Button>
        </Link>
        
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors rounded-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  )
}
