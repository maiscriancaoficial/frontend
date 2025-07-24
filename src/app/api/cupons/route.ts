import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos os cupons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const busca = searchParams.get('busca');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (status && status !== 'todos') {
      where.ativo = status === 'ativos';
    }

    if (busca) {
      where.OR = [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { codigo: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } }
      ];
    }

    const [cupons, total] = await Promise.all([
      prisma.cupom.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          cuponsUtilizados: true
        }
      }),
      prisma.cupom.count({ where })
    ]);

    // Formatar dados para o frontend
    const cuponsFormatados = cupons.map(cupom => ({
      id: cupom.id,
      titulo: cupom.titulo,
      codigo: cupom.codigo,
      descricao: cupom.descricao,
      tipoDesconto: cupom.tipoDesconto,
      valorDesconto: cupom.valorDesconto,
      dataExpiracao: cupom.dataExpiracao?.toISOString(),
      qtdMaxPorUsuario: cupom.qtdMaxPorUsuario,
      ativo: cupom.ativo,
      utilizados: cupom.cuponsUtilizados.length,
      createdAt: cupom.createdAt.toISOString(),
      updatedAt: cupom.updatedAt.toISOString()
    }));

    return NextResponse.json({
      cupons: cuponsFormatados,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erro ao buscar cupons:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo cupom
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      titulo, 
      codigo, 
      descricao, 
      tipoDesconto, 
      valorDesconto, 
      dataExpiracao, 
      qtdMaxPorUsuario, 
      ativo = true
    } = body;

    if (!titulo || !codigo || !tipoDesconto || valorDesconto === undefined) {
      return NextResponse.json(
        { error: 'Título, código, tipo de desconto e valor são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se código já existe
    const cupomExistente = await prisma.cupom.findUnique({
      where: { codigo }
    });

    if (cupomExistente) {
      return NextResponse.json(
        { error: 'Código de cupom já existe' },
        { status: 400 }
      );
    }

    // Criar cupom
    const cupom = await prisma.cupom.create({
      data: {
        titulo,
        codigo: codigo.toUpperCase(),
        descricao,
        tipoDesconto,
        valorDesconto,
        dataExpiracao: dataExpiracao ? new Date(dataExpiracao) : null,
        qtdMaxPorUsuario,
        ativo
      },
      include: {
        cuponsUtilizados: true
      }
    });

    // Formatar resposta
    const cupomFormatado = {
      id: cupom.id,
      titulo: cupom.titulo,
      codigo: cupom.codigo,
      descricao: cupom.descricao,
      tipoDesconto: cupom.tipoDesconto,
      valorDesconto: cupom.valorDesconto,
      dataExpiracao: cupom.dataExpiracao?.toISOString(),
      qtdMaxPorUsuario: cupom.qtdMaxPorUsuario,
      ativo: cupom.ativo,
      utilizados: cupom.cuponsUtilizados.length,
      createdAt: cupom.createdAt.toISOString(),
      updatedAt: cupom.updatedAt.toISOString()
    };

    return NextResponse.json(cupomFormatado, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
