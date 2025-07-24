import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET - Listar grupos de afiliados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ativo = searchParams.get('ativo');

    const where: any = {};
    if (ativo !== null) {
      where.ativo = ativo === 'true';
    }

    const grupos = await prisma.grupoAfiliado.findMany({
      where,
      include: {
        _count: {
          select: {
            afiliados: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const gruposFormatados = grupos.map(grupo => ({
      id: grupo.id,
      nome: grupo.nome,
      descricao: grupo.descricao,
      ativo: grupo.ativo,
      tipoComissao: grupo.tipoComissao,
      valorComissao: grupo.valorComissao,
      tipoEventoComissao: grupo.tipoEventoComissao,
      metodoSaque: grupo.metodoSaque,
      valorMinimoSaque: grupo.valorMinimoSaque,
      totalAfiliados: grupo._count.afiliados,
      createdAt: grupo.createdAt,
      updatedAt: grupo.updatedAt
    }));

    return NextResponse.json({
      success: true,
      grupos: gruposFormatados
    });

  } catch (error) {
    console.error('Erro ao buscar grupos de afiliados:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo grupo de afiliados
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nome,
      descricao,
      ativo = true,
      tipoComissao,
      valorComissao,
      tipoEventoComissao,
      metodoSaque,
      valorMinimoSaque
    } = body;

    // Validações
    if (!nome || !tipoComissao || !valorComissao || !tipoEventoComissao || !metodoSaque || !valorMinimoSaque) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    if (valorComissao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor da comissão deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (valorMinimoSaque <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor mínimo de saque deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Verificar se já existe um grupo com o mesmo nome
    const grupoExistente = await prisma.grupoAfiliado.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive'
        }
      }
    });

    if (grupoExistente) {
      return NextResponse.json(
        { success: false, error: 'Já existe um grupo com este nome' },
        { status: 400 }
      );
    }

    const novoGrupo = await prisma.grupoAfiliado.create({
      data: {
        nome,
        descricao,
        ativo,
        tipoComissao,
        valorComissao,
        tipoEventoComissao,
        metodoSaque,
        valorMinimoSaque
      },
      include: {
        _count: {
          select: {
            afiliados: true
          }
        }
      }
    });

    const grupoFormatado = {
      id: novoGrupo.id,
      nome: novoGrupo.nome,
      descricao: novoGrupo.descricao,
      ativo: novoGrupo.ativo,
      tipoComissao: novoGrupo.tipoComissao,
      valorComissao: novoGrupo.valorComissao,
      tipoEventoComissao: novoGrupo.tipoEventoComissao,
      metodoSaque: novoGrupo.metodoSaque,
      valorMinimoSaque: novoGrupo.valorMinimoSaque,
      totalAfiliados: novoGrupo._count.afiliados,
      createdAt: novoGrupo.createdAt,
      updatedAt: novoGrupo.updatedAt
    };

    return NextResponse.json({
      success: true,
      grupo: grupoFormatado
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar grupo de afiliados:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
