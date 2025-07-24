import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET - Buscar grupo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const grupo = await prisma.grupoAfiliado.findUnique({
      where: { id },
      include: {
        afiliados: {
          select: {
            id: true,
            usuario: {
              select: {
                nome: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            afiliados: true
          }
        }
      }
    });

    if (!grupo) {
      return NextResponse.json(
        { success: false, error: 'Grupo não encontrado' },
        { status: 404 }
      );
    }

    const grupoFormatado = {
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
      afiliados: grupo.afiliados,
      createdAt: grupo.createdAt,
      updatedAt: grupo.updatedAt
    };

    return NextResponse.json({
      success: true,
      grupo: grupoFormatado
    });

  } catch (error) {
    console.error('Erro ao buscar grupo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar grupo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      nome,
      descricao,
      ativo,
      tipoComissao,
      valorComissao,
      tipoEventoComissao,
      metodoSaque,
      valorMinimoSaque
    } = body;

    // Verificar se o grupo existe
    const grupoExistente = await prisma.grupoAfiliado.findUnique({
      where: { id }
    });

    if (!grupoExistente) {
      return NextResponse.json(
        { success: false, error: 'Grupo não encontrado' },
        { status: 404 }
      );
    }

    // Validações
    if (nome && nome.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (valorComissao !== undefined && valorComissao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor da comissão deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (valorMinimoSaque !== undefined && valorMinimoSaque <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor mínimo de saque deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Verificar se já existe outro grupo com o mesmo nome
    if (nome && nome !== grupoExistente.nome) {
      const nomeExistente = await prisma.grupoAfiliado.findFirst({
        where: {
          nome: {
            equals: nome,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        }
      });

      if (nomeExistente) {
        return NextResponse.json(
          { success: false, error: 'Já existe um grupo com este nome' },
          { status: 400 }
        );
      }
    }

    const grupoAtualizado = await prisma.grupoAfiliado.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(ativo !== undefined && { ativo }),
        ...(tipoComissao && { tipoComissao }),
        ...(valorComissao !== undefined && { valorComissao }),
        ...(tipoEventoComissao && { tipoEventoComissao }),
        ...(metodoSaque && { metodoSaque }),
        ...(valorMinimoSaque !== undefined && { valorMinimoSaque })
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
      id: grupoAtualizado.id,
      nome: grupoAtualizado.nome,
      descricao: grupoAtualizado.descricao,
      ativo: grupoAtualizado.ativo,
      tipoComissao: grupoAtualizado.tipoComissao,
      valorComissao: grupoAtualizado.valorComissao,
      tipoEventoComissao: grupoAtualizado.tipoEventoComissao,
      metodoSaque: grupoAtualizado.metodoSaque,
      valorMinimoSaque: grupoAtualizado.valorMinimoSaque,
      totalAfiliados: grupoAtualizado._count.afiliados,
      createdAt: grupoAtualizado.createdAt,
      updatedAt: grupoAtualizado.updatedAt
    };

    return NextResponse.json({
      success: true,
      grupo: grupoFormatado
    });

  } catch (error) {
    console.error('Erro ao atualizar grupo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir grupo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar se o grupo existe
    const grupo = await prisma.grupoAfiliado.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            afiliados: true
          }
        }
      }
    });

    if (!grupo) {
      return NextResponse.json(
        { success: false, error: 'Grupo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se há afiliados vinculados ao grupo
    if (grupo._count.afiliados > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Não é possível excluir o grupo. Há ${grupo._count.afiliados} afiliado(s) vinculado(s) a este grupo.` 
        },
        { status: 400 }
      );
    }

    await prisma.grupoAfiliado.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Grupo excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir grupo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
