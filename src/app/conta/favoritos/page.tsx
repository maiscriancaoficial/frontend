import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { ProductCard } from '@/components/conta/product-card'

// Esta é uma página de demonstração, você precisará criar uma tabela para favoritos
// e implementar a lógica para adicionar/remover produtos favoritos

export default async function FavoritosPage() {
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

  // Simulando produtos favoritos (você precisaria implementar esta funcionalidade)
  // Buscando produtos em destaque para demonstração
  const produtosFavoritos = await prisma.produto.findMany({
    where: { emDestaque: true },
    take: 4,
    include: {
      categoriasLink: {
        include: {
          categoria: true
        }
      }
    }
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Meus Favoritos</h2>
      
      {produtosFavoritos.length === 0 ? (
        <div className="text-center py-10">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-gray-300" />
          </div>
          <p className="text-gray-500 mb-4">Você ainda não adicionou nenhum produto aos favoritos.</p>
          <Link href="/produtos">
            <Button className="bg-pink-600 hover:bg-pink-700">
              Explorar produtos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {produtosFavoritos.map((produto) => (
            <ProductCard 
              key={produto.id} 
              produto={produto} 
              categorias={produto.categoriasLink.map(link => link.categoria)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
