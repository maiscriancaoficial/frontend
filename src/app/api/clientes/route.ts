import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar clientes com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const busca = searchParams.get('busca');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {
      role: 'CLIENTE' // Apenas usuários com role CLIENTE
    };

    // Filtro por status
    if (status === 'ativos') {
      // Considerar ativo se tem pedidos recentes ou foi criado recentemente
      where.OR = [
        {
          pedidos: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 dias
              }
            }
          }
        },
        {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias
          }
        }
      ];
    } else if (status === 'inativos') {
      where.AND = [
        {
          pedidos: {
            none: {
              createdAt: {
                gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
              }
            }
          }
        },
        {
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      ];
    } else if (status === 'premium') {
      // Considerar premium se tem mais de 5 pedidos ou gastou mais de R$ 500
      where.OR = [
        {
          pedidos: {
            some: {
              valorTotal: {
                gte: 500
              }
            }
          }
        }
      ];
    } else if (status === 'verificados') {
      where.cpfCnpj = {
        not: null
      };
    }

    // Filtro por busca
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { email: { contains: busca, mode: 'insensitive' } },
        { telefone: { contains: busca, mode: 'insensitive' } },
        { cpfCnpj: { contains: busca, mode: 'insensitive' } }
      ];
    }

    // Buscar clientes
    const [clientes, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
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
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.usuario.count({ where })
    ]);

    // Formatar dados para o frontend
    const clientesFormatados = clientes.map(cliente => {
      const ultimoPedido = cliente.pedidos[0];
      const totalGasto = cliente.pedidos.reduce((sum: number, pedido: any) => sum + (pedido.valorTotal || 0), 0);
      
      return {
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
    });

    return NextResponse.json({
      clientes: clientesFormatados,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      nome,
      email,
      telefone,
      cpfCnpj,
      fotoPerfil,
      endereco
    } = body;

    // Validações básicas
    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    // Criar cliente
    const novoCliente = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: 'temp123', // Senha temporária - cliente deve redefinir
        role: 'CLIENTE',
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
      }
    });

    // Formatar resposta
    const clienteFormatado = {
      id: novoCliente.id,
      nome: novoCliente.nome,
      email: novoCliente.email,
      telefone: novoCliente.telefone,
      cpfCnpj: novoCliente.cpfCnpj,
      fotoPerfil: novoCliente.fotoPerfil,
      dataCadastro: novoCliente.createdAt.toISOString(),
      totalGasto: 0,
      totalCompras: 0,
      ativo: true,
      verificado: !!novoCliente.cpfCnpj,
      premium: false,
      endereco: {
        rua: novoCliente.rua,
        numero: novoCliente.numero,
        complemento: novoCliente.complemento,
        bairro: novoCliente.bairro,
        cidade: novoCliente.cidade,
        estado: novoCliente.estado,
        cep: novoCliente.cep
      },
      createdAt: novoCliente.createdAt.toISOString(),
      updatedAt: novoCliente.updatedAt.toISOString()
    };

    return NextResponse.json(clienteFormatado, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
