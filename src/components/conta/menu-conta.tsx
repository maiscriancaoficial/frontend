'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Wallet, 
  LogOut
} from 'lucide-react'

const menuItems = [
  {
    label: 'Meus Pedidos',
    href: '/conta/pedidos',
    icon: ShoppingBag,
  },
  {
    label: 'Meus Favoritos',
    href: '/conta/favoritos',
    icon: Heart,
  },
  {
    label: 'Meus Dados',
    href: '/conta/dados',
    icon: User,
  },
  {
    label: 'Meu Cashback',
    href: '/conta/cashback',
    icon: Wallet,
  },
]

export function MenuConta() {
  const pathname = usePathname()

  return (
    <nav className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4">
        <h2 className="text-white font-medium text-lg">Menu da Conta</h2>
      </div>
      <div className="p-2">
        <ul>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-pink-50 text-pink-600'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-pink-600'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-pink-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
          <li className="border-t border-gray-100 mt-2 pt-2">
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-600 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Sair</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
