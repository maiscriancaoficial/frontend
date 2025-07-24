'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Categoria = {
  id: string
  titulo: string
  slug: string
}

type Produto = {
  id: string
  titulo: string
  preco: number
  precoPromocional?: number | null
  fotoPrincipal?: string | null
  slug: string
}

type ProductCardProps = {
  produto: Produto
  categorias: Categoria[]
}

export function ProductCard({ produto, categorias }: ProductCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  
  const handleRemoveFavorite = async () => {
    setIsRemoving(true)
    
    // Simulando remoção (você deve implementar a lógica real)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast.success('Produto removido dos favoritos')
    setIsRemoving(false)
  }

  const handleAddToCart = () => {
    // Simulando adição ao carrinho (você deve implementar a lógica real)
    toast.success('Produto adicionado ao carrinho')
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        {produto.fotoPrincipal ? (
          <Image
            src={produto.fotoPrincipal}
            alt={produto.titulo}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
        <button 
          onClick={handleRemoveFavorite}
          disabled={isRemoving}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        >
          <Trash2 className="w-4 h-4 text-pink-600" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {categorias.map(categoria => (
            <Link 
              key={categoria.id} 
              href={`/categorias/${categoria.slug}`}
              className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full"
            >
              {categoria.titulo}
            </Link>
          ))}
        </div>
        
        <Link href={`/produtos/${produto.slug}`}>
          <h3 className="font-medium text-lg line-clamp-2 mb-2 hover:text-pink-600 transition-colors">
            {produto.titulo}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 mb-4">
          {produto.precoPromocional ? (
            <>
              <span className="font-bold text-lg text-pink-600">
                {formatCurrency(produto.precoPromocional)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(produto.preco)}
              </span>
            </>
          ) : (
            <span className="font-bold text-lg text-pink-600">
              {formatCurrency(produto.preco)}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAddToCart}
            className="bg-pink-600 hover:bg-pink-700 flex-1 h-9"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
