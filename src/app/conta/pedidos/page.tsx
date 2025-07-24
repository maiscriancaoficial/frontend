import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { OrderStatus } from '@/components/conta/order-status'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export default async function PedidosPage() {
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

  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: usuario.id },
    orderBy: { createdAt: 'desc' },
    include: {
      itens: {
        include: { produto: true },
      },
    },
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Meus Pedidos</h2>
      
      {pedidos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Você ainda não realizou nenhum pedido.</p>
          <Link href="/produtos">
            <Button className="bg-pink-600 hover:bg-pink-700">
              Ver produtos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map((pedido) => (
            <div 
              key={pedido.id} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Pedido:</span>
                    <span className="font-medium">{pedido.codigo.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(pedido.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <OrderStatus status={pedido.status} />
                  <div className="mt-1 font-bold text-lg text-pink-600">
                    {formatCurrency(pedido.valorTotal)}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-medium">
                          {item.quantidade}x
                        </div>
                        <div>{item.produto.titulo}</div>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.valorTotal)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">
                      {pedido.itens.reduce((acc, item) => acc + item.quantidade, 0)} itens
                    </div>
                  </div>
                  <Link href={`/conta/pedidos/${pedido.id}`}>
                    <Button variant="outline" className="border-pink-200 hover:bg-pink-50 text-pink-600">
                      <Eye className="w-4 h-4 mr-2" />
                      Detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
