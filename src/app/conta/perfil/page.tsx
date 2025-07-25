'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save,
  Edit,
  Shield,
  Calendar,
  Crown
} from 'lucide-react'

export default function PerfilPage() {
  const { usuario } = useAuth()
  const [editando, setEditando] = useState(false)
  const [dadosForm, setDadosForm] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    telefone: usuario?.telefone || '',
    cep: usuario?.cep || '',
    rua: usuario?.rua || '',
    numero: usuario?.numero || '',
    complemento: usuario?.complemento || '',
    bairro: usuario?.bairro || '',
    cidade: usuario?.cidade || '',
    estado: usuario?.estado || '',
  })

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

  const handleSalvar = () => {
    // Aqui você implementaria a chamada para a API
    console.log('Salvando dados:', dadosForm)
    setEditando(false)
  }

  const handleCancelar = () => {
    setDadosForm({
      nome: usuario?.nome || '',
      email: usuario?.email || '',
      telefone: usuario?.telefone || '',
      cep: usuario?.cep || '',
      rua: usuario?.rua || '',
      numero: usuario?.numero || '',
      complemento: usuario?.complemento || '',
      bairro: usuario?.bairro || '',
      cidade: usuario?.cidade || '',
      estado: usuario?.estado || '',
    })
    setEditando(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <User className="h-6 w-6 text-[#ff0080]" />
            <span>Meu Perfil</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
        
        {!editando ? (
          <Button 
            onClick={() => setEditando(true)}
            className="bg-[#ff0080] hover:bg-[#ff0080]/90"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSalvar}
              className="bg-[#ff0080] hover:bg-[#ff0080]/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-[#ff0080]/10">
                <AvatarImage 
                  src={usuario.fotoPerfil || undefined} 
                  alt={usuario.nome}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/80 text-white font-bold text-xl">
                  {getInitials(usuario.nome)}
                </AvatarFallback>
              </Avatar>
              
              {editando && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-[#ff0080] hover:bg-[#ff0080]/90"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {usuario.nome}
            </h2>
            
            <p className="text-gray-600 mb-3">{usuario.email}</p>
            
            <Badge 
              variant="outline" 
              className={`flex items-center justify-center space-x-1 w-fit mx-auto ${getRoleColor(usuario.role)}`}
            >
              {getRoleIcon(usuario.role)}
              <span>{getRoleLabel(usuario.role)}</span>
            </Badge>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Membro desde {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-[#ff0080]" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={dadosForm.nome}
                  onChange={(e) => setDadosForm({...dadosForm, nome: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={dadosForm.email}
                  onChange={(e) => setDadosForm({...dadosForm, email: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={dadosForm.telefone}
                  onChange={(e) => setDadosForm({...dadosForm, telefone: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={dadosForm.cep}
                  onChange={(e) => setDadosForm({...dadosForm, cep: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-[#ff0080]" />
              <span>Endereço</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={dadosForm.rua}
                  onChange={(e) => setDadosForm({...dadosForm, rua: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="Nome da rua"
                />
              </div>
              
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={dadosForm.numero}
                  onChange={(e) => setDadosForm({...dadosForm, numero: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="123"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={dadosForm.complemento}
                  onChange={(e) => setDadosForm({...dadosForm, complemento: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="Apto, casa, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={dadosForm.bairro}
                  onChange={(e) => setDadosForm({...dadosForm, bairro: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="Nome do bairro"
                />
              </div>
              
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={dadosForm.cidade}
                  onChange={(e) => setDadosForm({...dadosForm, cidade: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="Nome da cidade"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={dadosForm.estado}
                  onChange={(e) => setDadosForm({...dadosForm, estado: e.target.value})}
                  disabled={!editando}
                  className={!editando ? 'bg-gray-50' : ''}
                  placeholder="SP"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
