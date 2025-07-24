import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar estatísticas dos avatares
    const [
      totalAvatares,
      avataresAtivos,
      avataresInativos,
      avataresMasculinos,
      avataresFemininos,
      avataresUnissex,
      totalElementos,
      elementosAtivos
    ] = await Promise.all([
      prisma.avatar.count(),
      prisma.avatar.count({ where: { ativo: true } }),
      prisma.avatar.count({ where: { ativo: false } }),
      prisma.avatar.count({ where: { tipo: 'MASCULINO' } }),
      prisma.avatar.count({ where: { tipo: 'FEMININO' } }),
      prisma.avatar.count({ where: { tipo: 'UNISSEX' } }),
      prisma.avatarElemento.count(),
      prisma.avatarElemento.count({ where: { ativo: true } })
    ]);

    // Estatísticas por tipo de elemento
    const elementosPorTipo = await prisma.avatarElemento.groupBy({
      by: ['tipo'],
      where: { ativo: true },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    // Avatares mais usados (com mais elementos)
    const avataresMaisCompletos = await prisma.avatar.findMany({
      where: { ativo: true },
      include: {
        _count: {
          select: {
            elementos: true
          }
        }
      },
      take: 5
    });

    const estatisticas = {
      total: totalAvatares,
      ativos: avataresAtivos,
      inativos: avataresInativos,
      porTipo: {
        masculino: avataresMasculinos,
        feminino: avataresFemininos,
        unissex: avataresUnissex
      },
      elementos: {
        total: totalElementos,
        ativos: elementosAtivos,
        inativos: totalElementos - elementosAtivos,
        porTipo: elementosPorTipo.map((item: any) => ({
          tipo: item.tipo,
          quantidade: item._count.id
        }))
      },
      avataresMaisCompletos: avataresMaisCompletos.map((avatar: any) => ({
        id: avatar.id,
        nome: avatar.nome,
        tipo: avatar.tipo,
        totalElementos: avatar._count?.elementos || 0
      }))
    };

    return NextResponse.json({
      success: true,
      estatisticas
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas dos avatares:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
