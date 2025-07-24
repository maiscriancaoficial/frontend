import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import { Wallet, ArrowRight, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CashbackPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <div>Acesso negado</div>
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  })

  if (!usuario) {
    return <div>Usuário não encontrado</div>
  }

  // Implementação futura: buscar saldo de cashback e histórico de transações
  // Por enquanto, usamos dados simulados para demonstração
  const saldoCashback = 85.50;
  const historicoTransacoes = [
    {
      id: '1',
      tipo: 'credito',
      descricao: 'Cashback do pedido #458982',
      valor: 45.50,
      data: new Date(2025, 6, 10), // 10/07/2025
    },
    {
      id: '2',
      tipo: 'credito',
      descricao: 'Cashback do pedido #421651',
      valor: 32.00,
      data: new Date(2025, 5, 25), // 25/06/2025
    },
    {
      id: '3',
      tipo: 'credito',
      descricao: 'Bônus de aniversário',
      valor: 15.00,
      data: new Date(2025, 5, 15), // 15/06/2025
    },
    {
      id: '4',
      tipo: 'debito',
      descricao: 'Utilizado no pedido #478125',
      valor: 7.00,
      data: new Date(2025, 5, 5), // 05/06/2025
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Meu Cashback</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-6 h-6" />
              <h3 className="text-lg font-medium">Saldo disponível</h3>
            </div>
            <div className="text-3xl font-bold">{formatCurrency(saldoCashback)}</div>
            <div className="mt-6">
              <Button 
                variant="secondary" 
                className="bg-white text-pink-600 hover:bg-pink-50"
              >
                Usar no próximo pedido
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-3">Como funciona</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                <ArrowDown className="h-3 w-3 text-pink-600" />
              </div>
              <span>Receba 5% de volta em todas as compras</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                <ArrowDown className="h-3 w-3 text-pink-600" />
              </div>
              <span>Saldo acumulado por 6 meses</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                <ArrowDown className="h-3 w-3 text-pink-600" />
              </div>
              <span>Use em qualquer pedido futuro</span>
            </li>
          </ul>
        </div>
      </div>
      
      <h3 className="font-medium text-lg mb-4 pb-2 border-b">Histórico de transações</h3>
      
      {historicoTransacoes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Você ainda não possui transações de cashback.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historicoTransacoes.map((transacao) => (
            <div
              key={transacao.id}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{transacao.descricao}</div>
                <div className="text-sm text-gray-500">
                  {format(transacao.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              <div className={`text-lg font-medium ${transacao.tipo === 'credito' ? 'text-green-600' : 'text-red-600'}`}>
                {transacao.tipo === 'credito' ? '+' : '-'}{formatCurrency(transacao.valor)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
