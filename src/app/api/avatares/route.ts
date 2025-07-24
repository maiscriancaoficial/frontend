import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar avatares com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const busca = searchParams.get('busca') || '';
    const tipo = searchParams.get('tipo') || '';
    const ativo = searchParams.get('ativo');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } }
      ];
    }

    if (tipo) {
      where.tipo = tipo;
    }

    if (ativo !== null && ativo !== '') {
      where.ativo = ativo === 'true';
    }

    // Buscar avatares
    const [avatares, total] = await Promise.all([
      prisma.avatar.findMany({
        where,
        include: {
          elementos: {
            where: { ativo: true },
            orderBy: { ordem: 'asc' }
          },
          _count: {
            select: {
              elementos: true,
              livrosPersonalizados: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.avatar.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      avatares,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erro ao buscar avatares:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo avatar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, tipo, descricao, fotoPrincipal, ativo = true, elementos = [] } = body;

    console.log('Dados recebidos na API:', { nome, tipo, descricao, fotoPrincipal, ativo, elementos });

    // Validações
    if (!nome || !tipo) {
      return NextResponse.json(
        { error: 'Nome e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe avatar com mesmo nome
    const avatarExistente = await prisma.avatar.findFirst({
      where: { nome }
    });

    if (avatarExistente) {
      return NextResponse.json(
        { error: 'Já existe um avatar com este nome' },
        { status: 400 }
      );
    }

    // Criar avatar com elementos
    const avatar = await prisma.avatar.create({
      data: {
        nome,
        tipo,
        descricao,
        fotoPrincipal,
        ativo,
        elementos: {
          create: elementos.map((elemento: any, index: number) => ({
            tipo: elemento.tipo,
            nome: elemento.nome,
            arquivo: elemento.imagens?.[0] || '', // Primeira imagem como arquivo principal
            cor: elemento.cor,
            ordem: index,
            ativo: elemento.ativo ?? true
          }))
        }
      },
      include: {
        elementos: {
          where: { ativo: true },
          orderBy: { ordem: 'asc' }
        },
        _count: {
          select: {
            elementos: true,
            livrosPersonalizados: true
          }
        }
      }
    });

    console.log('Avatar criado com sucesso:', avatar);

    return NextResponse.json({
      success: true,
      avatar
    });

  } catch (error) {
    console.error('Erro ao criar avatar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
