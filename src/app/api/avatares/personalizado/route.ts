import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar avatar personalizado por usuário e livro
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    const livroId = searchParams.get('livroId');

    if (!usuarioId || !livroId) {
      return NextResponse.json(
        { error: 'usuarioId e livroId são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar avatar personalizado existente
    const avatarPersonalizado = await prisma.livroPersonalizado.findFirst({
      where: {
        usuarioId,
        livroId
      },
      include: {
        avatar: {
          include: {
            elementos: {
              where: { ativo: true },
              orderBy: { ordem: 'asc' }
            }
          }
        },
        livro: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    if (!avatarPersonalizado) {
      return NextResponse.json({
        success: true,
        avatarPersonalizado: null
      });
    }

    return NextResponse.json({
      success: true,
      avatarPersonalizado
    });

  } catch (error) {
    console.error('Erro ao buscar avatar personalizado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Salvar/Atualizar avatar personalizado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      usuarioId, 
      livroId, 
      avatarId, 
      nomePersonagem, 
      dadosPersonalizados 
    } = body;

    if (!usuarioId || !livroId) {
      return NextResponse.json(
        { error: 'usuarioId e livroId são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe um avatar personalizado
    const existente = await prisma.livroPersonalizado.findFirst({
      where: {
        usuarioId,
        livroId
      }
    });

    let avatarPersonalizado;

    if (existente) {
      // Atualizar existente
      avatarPersonalizado = await prisma.livroPersonalizado.update({
        where: { id: existente.id },
        data: {
          avatarId,
          nomePersonagem,
          dadosPersonalizados,
          status: 'pronto',
          updatedAt: new Date()
        },
        include: {
          avatar: {
            include: {
              elementos: {
                where: { ativo: true },
                orderBy: { ordem: 'asc' }
              }
            }
          },
          livro: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      });
    } else {
      // Criar novo
      avatarPersonalizado = await prisma.livroPersonalizado.create({
        data: {
          usuarioId,
          livroId,
          avatarId,
          nomePersonagem,
          dadosPersonalizados,
          status: 'pronto'
        },
        include: {
          avatar: {
            include: {
              elementos: {
                where: { ativo: true },
                orderBy: { ordem: 'asc' }
              }
            }
          },
          livro: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      avatarPersonalizado
    });

  } catch (error) {
    console.error('Erro ao salvar avatar personalizado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
