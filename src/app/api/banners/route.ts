import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação para banner
const bannerSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().nullable().optional(),
  fotoDesktop: z.string().min(1, 'Foto desktop é obrigatória'),
  fotoMobile: z.string().nullable().optional(),
  ordem: z.number().int().min(0),
  ativo: z.boolean(),
  botao1Label: z.string().nullable().optional(),
  botao1Link: z.string().nullable().optional(),
  botao1Cor: z.string().nullable().optional(),
  botao1CorFonte: z.string().nullable().optional(),
  botao1Tamanho: z.string().nullable().optional(),
  botao2Label: z.string().nullable().optional(),
  botao2Link: z.string().nullable().optional(),
  botao2Cor: z.string().nullable().optional(),
  botao2CorFonte: z.string().nullable().optional(),
  botao2Tamanho: z.string().nullable().optional(),
});

// GET - Listar todos os banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { ordem: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[BANNER API] POST - Dados recebidos:', JSON.stringify(body, null, 2));
    
    // Validar dados
    const validatedData = bannerSchema.parse(body);
    console.log('[BANNER API] POST - Dados validados:', JSON.stringify(validatedData, null, 2));

    // Criar banner
    const banner = await prisma.banner.create({
      data: validatedData
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[BANNER API] POST - Erro de validação:', error.issues);
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: error.issues,
          message: 'Verifique os dados enviados'
        },
        { status: 400 }
      );
    }

    console.error('[BANNER API] POST - Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
