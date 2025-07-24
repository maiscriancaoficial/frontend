import { Metadata } from 'next'
import { MenuConta } from '@/components/conta/menu-conta'
import { PageTitle } from '@/components/ui/page-title'

export const metadata: Metadata = {
  title: 'Minha Conta - Mais criança',
  description: 'Gerencie seus pedidos, dados pessoais, favoritos e cashback',
}

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // A autenticação é verificada pelo middleware
  // Não precisamos duplicar essa verificação aqui

  return (
    <div className="container mx-auto px-4 py-10">
      <PageTitle
        title="Minha Conta"
        subtitle="Gerencie seus pedidos, dados pessoais e mais"
      />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="md:w-1/4">
          <MenuConta />
        </div>
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
