import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar cupom por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cupom = await prisma.cupom.findUnique({
      where: { id: params.id },
      include: {
        cuponsUtilizados: true
      }
    });

    if (!cupom) {
      return NextResponse.json(
        { error: 'Cupom não encontrado' },
        { status: 404 }
      );
    }

    // Formatar dados para o frontend
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

    return NextResponse.json(cupomFormatado);
  } catch (error) {
    console.error('Erro ao buscar cupom:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cupom
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      ativo
    } = body;

    // Verificar se cupom existe
    const cupomExistente = await prisma.cupom.findUnique({
      where: { id: params.id }
    });

    if (!cupomExistente) {
      return NextResponse.json(
        { error: 'Cupom não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se código já existe em outro cupom
    if (codigo && codigo !== cupomExistente.codigo) {
      const cupomComCodigo = await prisma.cupom.findUnique({
        where: { codigo: codigo.toUpperCase() }
      });

      if (cupomComCodigo) {
        return NextResponse.json(
          { error: 'Código de cupom já existe' },
          { status: 400 }
        );
      }
    }

    // Atualizar cupom
    const cupomAtualizado = await prisma.cupom.update({
      where: { id: params.id },
      data: {
        titulo: titulo || cupomExistente.titulo,
        codigo: codigo ? codigo.toUpperCase() : cupomExistente.codigo,
        descricao: descricao !== undefined ? descricao : cupomExistente.descricao,
        tipoDesconto: tipoDesconto || cupomExistente.tipoDesconto,
        valorDesconto: valorDesconto !== undefined ? valorDesconto : cupomExistente.valorDesconto,
        dataExpiracao: dataExpiracao !== undefined 
          ? (dataExpiracao ? new Date(dataExpiracao) : null)
          : cupomExistente.dataExpiracao,
        qtdMaxPorUsuario: qtdMaxPorUsuario !== undefined ? qtdMaxPorUsuario : cupomExistente.qtdMaxPorUsuario,
        ativo: ativo !== undefined ? ativo : cupomExistente.ativo
      },
      include: {
        cuponsUtilizados: true
      }
    });

    // Formatar resposta
    const cupomFormatado = {
      id: cupomAtualizado.id,
      titulo: cupomAtualizado.titulo,
      codigo: cupomAtualizado.codigo,
      descricao: cupomAtualizado.descricao,
      tipoDesconto: cupomAtualizado.tipoDesconto,
      valorDesconto: cupomAtualizado.valorDesconto,
      dataExpiracao: cupomAtualizado.dataExpiracao?.toISOString(),
      qtdMaxPorUsuario: cupomAtualizado.qtdMaxPorUsuario,
      ativo: cupomAtualizado.ativo,
      utilizados: cupomAtualizado.cuponsUtilizados.length,
      createdAt: cupomAtualizado.createdAt.toISOString(),
      updatedAt: cupomAtualizado.updatedAt.toISOString()
    };

    return NextResponse.json(cupomFormatado);
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir cupom
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se cupom existe
    const cupom = await prisma.cupom.findUnique({
      where: { id: params.id },
      include: {
        cuponsUtilizados: true,
        pedidos: true
      }
    });

    if (!cupom) {
      return NextResponse.json(
        { error: 'Cupom não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se cupom foi utilizado
    if (cupom.cuponsUtilizados.length > 0 || cupom.pedidos.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir cupom que já foi utilizado' },
        { status: 400 }
      );
    }

    // Excluir cupom
    await prisma.cupom.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Cupom excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cupom:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
