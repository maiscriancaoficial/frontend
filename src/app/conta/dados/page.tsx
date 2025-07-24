import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FormularioDados } from '@/components/conta/formulario-dados'

export default async function DadosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <div>Acesso negado</div>
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      tipoPessoa: true,
      cpfCnpj: true,
      cep: true,
      rua: true,
      numero: true,
      complemento: true,
      bairro: true,
      cidade: true,
      estado: true,
      pais: true,
    },
  })

  if (!usuario) {
    return <div>Usuário não encontrado</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Meus Dados</h2>
      
      <div className="bg-pink-50 rounded-lg p-4 mb-6">
        <p className="text-pink-700 text-sm">
          Mantenha seus dados sempre atualizados para facilitar suas compras.
        </p>
      </div>
      
      <FormularioDados usuario={usuario} />
    </div>
  )
}
