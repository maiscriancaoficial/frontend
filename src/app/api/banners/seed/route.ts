import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Criar banners de exemplo para teste
export async function GET() {
  try {
    // Limpar banners existentes (apenas para desenvolvimento)
    await prisma.banner.deleteMany();

    // Criar banners de exemplo
    const bannersExemplo = [
      {
        titulo: 'Aventuras Mágicas',
        descricao: 'Histórias repletas de aventuras onde seu filho é o protagonista',
        fotoDesktop: '/bg-hero.png',
        fotoMobile: '/bg-hero.png',
        ordem: 1,
        ativo: true,
        botao1Label: 'Ver Aventuras',
        botao1Link: '/categoria/aventura',
        botao1Cor: '#ff0080',
        botao1CorFonte: '#ffffff',
        botao2Label: 'Como Funciona',
        botao2Link: '/como-funciona',
        botao2Cor: 'transparent',
        botao2CorFonte: '#ffffff'
      },
      {
        titulo: 'Contos de Fadas Personalizados',
        descricao: 'Magia e encantamento com seu filho como protagonista',
        fotoDesktop: '/bg-hero.png',
        fotoMobile: '/bg-hero.png',
        ordem: 2,
        ativo: true,
        botao1Label: 'Ver Contos',
        botao1Link: '/categoria/contos-de-fadas',
        botao1Cor: '#27b99a',
        botao1CorFonte: '#ffffff',
        botao2Label: 'Personalizar',
        botao2Link: '/personalizar',
        botao2Cor: 'transparent',
        botao2CorFonte: '#ffffff'
      },
      {
        titulo: 'Mundo dos Animais',
        descricao: 'Histórias educativas com animais especiais e seu filho',
        fotoDesktop: '/bg-hero.png',
        fotoMobile: '/bg-hero.png',
        ordem: 3,
        ativo: false,
        botao1Label: 'Explorar',
        botao1Link: '/categoria/animais',
        botao1Cor: '#ffa500',
        botao1CorFonte: '#ffffff'
      }
    ];

    const bannersCriados = await Promise.all(
      bannersExemplo.map(banner => 
        prisma.banner.create({ data: banner })
      )
    );

    return NextResponse.json({
      message: 'Banners de exemplo criados com sucesso!',
      banners: bannersCriados,
      total: bannersCriados.length
    });

  } catch (error) {
    console.error('Erro ao criar banners de exemplo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
