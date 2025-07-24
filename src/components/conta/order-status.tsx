'use client'

import { StatusPedido } from '@prisma/client'

const statusConfig = {
  AGUARDANDO_PAGAMENTO: {
    label: 'Aguardando Pagamento',
    color: 'bg-yellow-100 text-yellow-800',
  },
  PAGAMENTO_APROVADO: {
    label: 'Pagamento Aprovado',
    color: 'bg-blue-100 text-blue-800',
  },
  EM_PREPARACAO: {
    label: 'Em Preparação',
    color: 'bg-indigo-100 text-indigo-800',
  },
  ENVIADO: {
    label: 'Enviado',
    color: 'bg-purple-100 text-purple-800',
  },
  ENTREGUE: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800',
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
  },
  ESTORNADO: {
    label: 'Estornado',
    color: 'bg-gray-100 text-gray-800',
  },
}

type OrderStatusProps = {
  status: StatusPedido
}

export function OrderStatus({ status }: OrderStatusProps) {
  const config = statusConfig[status] || { 
    label: 'Status Desconhecido', 
    color: 'bg-gray-100 text-gray-800' 
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${config.color}`}>
      {config.label}
    </span>
  )
}
