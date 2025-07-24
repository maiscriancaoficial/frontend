import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET - Listar afiliados com filtros
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

    // Filtro por status
    if (status && status !== 'todos') {
      if (status === 'ativo') {
        where.ativo = true;
      } else if (status === 'inativo') {
        where.ativo = false;
      } else if (status === 'pendente') {
        where.pendente = true;
      }
    }

    // Filtro por busca
    if (busca) {
      where.OR = [
        { codigoAfiliado: { contains: busca, mode: 'insensitive' } },
        { usuario: { nome: { contains: busca, mode: 'insensitive' } } },
        { usuario: { email: { contains: busca, mode: 'insensitive' } } }
      ];
    }

    // Buscar afiliados
    const [afiliados, total] = await Promise.all([
      prisma.afiliado.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              fotoPerfil: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              vendas: true,
              comissoes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.afiliado.count({ where })
    ]);

    // Formatar dados para o frontend
    const afiliadosFormatados = afiliados.map(afiliado => ({
      id: afiliado.id,
      nome: afiliado.usuario.nome,
      email: afiliado.usuario.email,
      telefone: afiliado.usuario.telefone,
      fotoPerfil: afiliado.usuario.fotoPerfil,
      codigoAfiliado: afiliado.codigoAfiliado,
      ativo: afiliado.ativo,
      pendente: afiliado.pendente,
      tipoComissao: afiliado.tipoComissao.toLowerCase(),
      valorComissao: afiliado.valorComissao,
      totalVendas: afiliado.totalVendas,
      totalGanhos: afiliado.totalGanhos,
      cliques: afiliado.cliques,
      conversoes: afiliado.conversoes,
      taxaConversao: afiliado.taxaConversao,
      ultimaVenda: afiliado.ultimaVenda,
      linkAfiliado: afiliado.linkAfiliado,
      observacoes: afiliado.observacoes,
      dataRegistro: afiliado.createdAt.toISOString(),
      createdAt: afiliado.createdAt.toISOString(),
      updatedAt: afiliado.updatedAt.toISOString()
    }));

    return NextResponse.json({
      afiliados: afiliadosFormatados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar afiliados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo afiliado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      usuarioId,
      codigoAfiliado,
      tipoComissao = 'PORCENTAGEM',
      valorComissao = 10,
      linkAfiliado,
      observacoes
    } = body;

    // Validações básicas
    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    if (!codigoAfiliado) {
      return NextResponse.json(
        { error: 'Código do afiliado é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se já existe afiliado para este usuário
    const afiliadoExistente = await prisma.afiliado.findUnique({
      where: { usuarioId }
    });

    if (afiliadoExistente) {
      return NextResponse.json(
        { error: 'Usuário já possui cadastro de afiliado' },
        { status: 400 }
      );
    }

    // Verificar se o código do afiliado já existe
    const codigoExistente = await prisma.afiliado.findUnique({
      where: { codigoAfiliado }
    });

    if (codigoExistente) {
      return NextResponse.json(
        { error: 'Código do afiliado já está em uso' },
        { status: 400 }
      );
    }

    // Criar afiliado
    const novoAfiliado = await prisma.afiliado.create({
      data: {
        usuarioId,
        codigoAfiliado,
        tipoComissao: tipoComissao.toUpperCase(),
        valorComissao: parseFloat(valorComissao),
        linkAfiliado,
        observacoes
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            fotoPerfil: true,
            createdAt: true
          }
        }
      }
    });

    // Atualizar role do usuário para AFILIADO
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { role: 'AFILIADO' }
    });

    // Formatar resposta
    const afiliadoFormatado = {
      id: novoAfiliado.id,
      nome: novoAfiliado.usuario.nome,
      email: novoAfiliado.usuario.email,
      telefone: novoAfiliado.usuario.telefone,
      fotoPerfil: novoAfiliado.usuario.fotoPerfil,
      codigoAfiliado: novoAfiliado.codigoAfiliado,
      ativo: novoAfiliado.ativo,
      pendente: novoAfiliado.pendente,
      tipoComissao: novoAfiliado.tipoComissao.toLowerCase(),
      valorComissao: novoAfiliado.valorComissao,
      totalVendas: novoAfiliado.totalVendas,
      totalGanhos: novoAfiliado.totalGanhos,
      cliques: novoAfiliado.cliques,
      conversoes: novoAfiliado.conversoes,
      taxaConversao: novoAfiliado.taxaConversao,
      ultimaVenda: novoAfiliado.ultimaVenda,
      linkAfiliado: novoAfiliado.linkAfiliado,
      observacoes: novoAfiliado.observacoes,
      dataRegistro: novoAfiliado.createdAt.toISOString(),
      createdAt: novoAfiliado.createdAt.toISOString(),
      updatedAt: novoAfiliado.updatedAt.toISOString()
    };

    return NextResponse.json(afiliadoFormatado, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar afiliado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
