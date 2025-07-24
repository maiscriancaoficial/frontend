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

// GET - Buscar banner por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Erro ao buscar banner:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('[BANNER API] PUT - Dados recebidos:', JSON.stringify(body, null, 2));
    
    // Validar dados
    const validatedData = bannerSchema.parse(body);
    console.log('[BANNER API] PUT - Dados validados:', JSON.stringify(validatedData, null, 2));

    // Verificar se o banner existe
    const bannerExistente = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!bannerExistente) {
      return NextResponse.json(
        { error: 'Banner não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar banner
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: validatedData
    });

    return NextResponse.json(banner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[BANNER API] PUT - Erro de validação:', error.issues);
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: error.issues,
          message: 'Verifique os dados enviados'
        },
        { status: 400 }
      );
    }

    console.error('[BANNER API] PUT - Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o banner existe
    const bannerExistente = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!bannerExistente) {
      return NextResponse.json(
        { error: 'Banner não encontrado' },
        { status: 404 }
      );
    }

    // Excluir banner
    await prisma.banner.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Banner excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir banner:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
