import { Metadata } from 'next'
import { HeaderConta } from '@/components/conta/header-conta'
import NavigationConta from '@/components/conta/navigation-conta'

export const metadata: Metadata = {
  title: 'Minha Conta - Mais criança',
  description: 'Gerencie seus pedidos, dados pessoais, favoritos e cashback',
}

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Compacto e Moderno */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <HeaderConta />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <NavigationConta />
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
