import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const cliente = await prisma.usuario.findUnique({
      where: {
        id,
        role: 'CLIENTE'
      },
      include: {
        pedidos: {
          select: {
            id: true,
            createdAt: true,
            valorTotal: true,
            status: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            pedidos: true
          }
        }
      }
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Formatar dados
    const ultimoPedido = cliente.pedidos[0];
    const totalGasto = cliente.pedidos.reduce((sum: number, pedido: any) => sum + (pedido.valorTotal || 0), 0);

    const clienteFormatado = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpfCnpj: cliente.cpfCnpj,
      fotoPerfil: cliente.fotoPerfil,
      dataCadastro: cliente.createdAt.toISOString(),
      ultimaCompra: ultimoPedido?.createdAt?.toISOString(),
      totalGasto,
      totalCompras: cliente._count.pedidos,
      ativo: cliente.pedidos.length > 0 || 
             cliente.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      verificado: !!cliente.cpfCnpj,
      premium: cliente._count.pedidos > 5 || totalGasto > 500,
      endereco: {
        rua: cliente.rua,
        numero: cliente.numero,
        complemento: cliente.complemento,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        estado: cliente.estado,
        cep: cliente.cep
      },
      createdAt: cliente.createdAt.toISOString(),
      updatedAt: cliente.updatedAt.toISOString()
    };

    return NextResponse.json(clienteFormatado);

  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      nome,
      email,
      telefone,
      cpfCnpj,
      fotoPerfil,
      endereco
    } = body;

    // Verificar se cliente existe
    const clienteExistente = await prisma.usuario.findUnique({
      where: {
        id,
        role: 'CLIENTE'
      }
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se email já existe em outro cliente
    if (email && email !== clienteExistente.email) {
      const emailExistente = await prisma.usuario.findUnique({
        where: { email }
      });

      if (emailExistente) {
        return NextResponse.json(
          { error: 'Email já cadastrado' },
          { status: 400 }
        );
      }
    }

    // Atualizar cliente
    const clienteAtualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nome: nome || clienteExistente.nome,
        email: email || clienteExistente.email,
        telefone,
        cpfCnpj,
        fotoPerfil,
        rua: endereco?.rua,
        numero: endereco?.numero,
        complemento: endereco?.complemento,
        bairro: endereco?.bairro,
        cidade: endereco?.cidade,
        estado: endereco?.estado,
        cep: endereco?.cep
      },
      include: {
        pedidos: {
          select: {
            id: true,
            createdAt: true,
            valorTotal: true,
            status: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            pedidos: true
          }
        }
      }
    });

    // Formatar resposta
    const ultimoPedido = clienteAtualizado.pedidos[0];
    const totalGasto = clienteAtualizado.pedidos.reduce((sum: number, pedido: any) => sum + (pedido.valorTotal || 0), 0);

    const clienteFormatado = {
      id: clienteAtualizado.id,
      nome: clienteAtualizado.nome,
      email: clienteAtualizado.email,
      telefone: clienteAtualizado.telefone,
      cpfCnpj: clienteAtualizado.cpfCnpj,
      fotoPerfil: clienteAtualizado.fotoPerfil,
      dataCadastro: clienteAtualizado.createdAt.toISOString(),
      ultimaCompra: ultimoPedido?.createdAt?.toISOString(),
      totalGasto,
      totalCompras: clienteAtualizado._count.pedidos,
      ativo: clienteAtualizado.pedidos.length > 0 || 
             clienteAtualizado.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      verificado: !!clienteAtualizado.cpfCnpj,
      premium: clienteAtualizado._count.pedidos > 5 || totalGasto > 500,
      endereco: {
        rua: clienteAtualizado.rua,
        numero: clienteAtualizado.numero,
        complemento: clienteAtualizado.complemento,
        bairro: clienteAtualizado.bairro,
        cidade: clienteAtualizado.cidade,
        estado: clienteAtualizado.estado,
        cep: clienteAtualizado.cep
      },
      createdAt: clienteAtualizado.createdAt.toISOString(),
      updatedAt: clienteAtualizado.updatedAt.toISOString()
    };

    return NextResponse.json(clienteFormatado);

  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar se cliente existe
    const clienteExistente = await prisma.usuario.findUnique({
      where: {
        id,
        role: 'CLIENTE'
      },
      include: {
        _count: {
          select: {
            pedidos: true
          }
        }
      }
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se cliente tem pedidos
    if (clienteExistente._count.pedidos > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir cliente com pedidos associados' },
        { status: 400 }
      );
    }

    // Excluir cliente
    await prisma.usuario.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Cliente excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
