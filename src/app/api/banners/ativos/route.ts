import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar apenas banners ativos para o slider da home
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        ativo: true
      },
      orderBy: [
        { ordem: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Erro ao buscar banners ativos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
