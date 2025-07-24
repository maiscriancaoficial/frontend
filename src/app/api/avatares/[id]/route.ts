import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar avatar por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const avatar = await prisma.avatar.findUnique({
      where: { id },
      include: {
        elementos: {
          where: { ativo: true },
          orderBy: [{ tipo: 'asc' }, { ordem: 'asc' }]
        },
        _count: {
          select: {
            elementos: true,
            livrosPersonalizados: true
          }
        }
      }
    });

    if (!avatar) {
      return NextResponse.json(
        { error: 'Avatar não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      avatar
    });

  } catch (error) {
    console.error('Erro ao buscar avatar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar avatar
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, tipo, descricao, fotoPrincipal, ativo, elementos } = body;

    console.log('Dados recebidos para atualização:', { nome, tipo, descricao, fotoPrincipal, ativo, elementos: elementos?.length || 0 });

    // Verificar se avatar existe
    const avatarExistente = await prisma.avatar.findUnique({
      where: { id }
    });

    if (!avatarExistente) {
      return NextResponse.json(
        { error: 'Avatar não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se nome já existe (exceto o próprio avatar)
    if (nome && nome !== avatarExistente.nome) {
      const nomeExistente = await prisma.avatar.findFirst({
        where: { 
          nome,
          id: { not: id }
        }
      });

      if (nomeExistente) {
        return NextResponse.json(
          { error: 'Já existe um avatar com este nome' },
          { status: 400 }
        );
      }
    }

    // Usar transação para atualizar avatar e elementos
    const avatar = await prisma.$transaction(async (tx) => {
      // Atualizar dados básicos do avatar
      const avatarAtualizado = await tx.avatar.update({
        where: { id },
        data: {
          ...(nome && { nome }),
          ...(tipo && { tipo }),
          ...(descricao !== undefined && { descricao }),
          ...(fotoPrincipal !== undefined && { fotoPrincipal }),
          ...(ativo !== undefined && { ativo })
        }
      });

      // Se elementos foram enviados, processar eles
      if (elementos && Array.isArray(elementos)) {
        console.log('Processando elementos:', elementos);
        
        // Primeiro, desativar todos os elementos existentes
        await tx.avatarElemento.updateMany({
          where: { avatarId: id },
          data: { ativo: false }
        });

        // Depois, criar/atualizar os elementos enviados
        for (let i = 0; i < elementos.length; i++) {
          const elemento = elementos[i];
          
          if (elemento.id) {
            // Atualizar elemento existente
            await tx.avatarElemento.update({
              where: { id: elemento.id },
              data: {
                nome: elemento.nome,
                tipo: elemento.tipo,
                cor: elemento.cor || null,
                arquivo: elemento.imagens?.[0] || null,
                ordem: i + 1,
                ativo: elemento.ativo ?? true
              }
            });
          } else {
            // Criar novo elemento
            await tx.avatarElemento.create({
              data: {
                avatarId: id,
                nome: elemento.nome,
                tipo: elemento.tipo,
                cor: elemento.cor || null,
                arquivo: elemento.imagens?.[0] || null,
                ordem: i + 1,
                ativo: elemento.ativo ?? true
              }
            });
          }
        }
      }

      // Retornar avatar atualizado com elementos
      return await tx.avatar.findUnique({
        where: { id },
        include: {
          elementos: {
            where: { ativo: true },
            orderBy: [{ tipo: 'asc' }, { ordem: 'asc' }]
          },
          _count: {
            select: {
              elementos: true,
              livrosPersonalizados: true
            }
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      avatar
    });

  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir avatar
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se avatar existe
    const avatar = await prisma.avatar.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            livrosPersonalizados: true
          }
        }
      }
    });

    if (!avatar) {
      return NextResponse.json(
        { error: 'Avatar não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se avatar está sendo usado
    if (avatar._count.livrosPersonalizados > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir avatar que está sendo usado em livros personalizados' },
        { status: 400 }
      );
    }

    // Excluir avatar (elementos serão excluídos automaticamente por cascade)
    await prisma.avatar.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Avatar excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir avatar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
