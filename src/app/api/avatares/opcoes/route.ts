import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os avatares ativos com seus elementos
    const avatares = await prisma.avatar.findMany({
      where: {
        ativo: true
      },
      include: {
        elementos: {
          where: {
            ativo: true
          },
          orderBy: {
            ordem: 'asc'
          }
        }
      }
    });

    // Organizar elementos por tipo
    const opcoes = {
      peles: [] as Array<{ id: string; nome: string; cor?: string; arquivo: string }>,
      cabelos: [] as Array<{ id: string; nome: string; cor?: string; arquivo: string }>,
      coresCabelo: [] as Array<{ id: string; nome: string; cor: string }>,
      olhos: [] as Array<{ id: string; nome: string; arquivo: string }>,
      roupas: [] as Array<{ id: string; nome: string; cor?: string; arquivo: string }>,
      coresRoupa: [] as Array<{ id: string; nome: string; cor: string }>,
      shorts: [] as Array<{ id: string; nome: string; arquivo: string }>,
      oculos: [] as Array<{ id: string; nome: string; arquivo: string }>,
      chapeus: [] as Array<{ id: string; nome: string; arquivo: string }>,
      bones: [] as Array<{ id: string; nome: string; arquivo: string }>,
      aderecos: [] as Array<{ id: string; nome: string; arquivo: string }>
    };
    
    // Organizar fotos principais por tipo
    const fotosPrincipais: { [key: string]: string } = {};

    console.log('🔍 Avatares encontrados:', avatares.length);
    avatares.forEach(avatar => {
      console.log(`📸 Avatar ${avatar.nome} (${avatar.tipo}): fotoPrincipal = ${avatar.fotoPrincipal}`);
    });

    // Processar todos os elementos
    avatares.forEach(avatar => {
      // Armazenar foto principal por tipo
      if (avatar.fotoPrincipal && avatar.tipo) {
        console.log(`🎯 Processando avatar ${avatar.nome} (${avatar.tipo}): ${avatar.fotoPrincipal}`);
        
        if (avatar.tipo === 'MASCULINO') {
          if (!fotosPrincipais['menino']) {
            fotosPrincipais['menino'] = avatar.fotoPrincipal;
          }
        } else if (avatar.tipo === 'FEMININO') {
          if (!fotosPrincipais['menina']) {
            fotosPrincipais['menina'] = avatar.fotoPrincipal;
          }
        } else if (avatar.tipo === 'UNISSEX') {
          // UNISSEX serve para ambos os tipos se não houver específicos
          if (!fotosPrincipais['menino']) {
            fotosPrincipais['menino'] = avatar.fotoPrincipal;
          }
          if (!fotosPrincipais['menina']) {
            fotosPrincipais['menina'] = avatar.fotoPrincipal;
          }
        }
      }
      
      avatar.elementos.forEach(elemento => {
        const item = {
          id: elemento.id,
          nome: elemento.nome,
          cor: elemento.cor || undefined,
          arquivo: elemento.arquivo
        };

        switch (elemento.tipo) {
          case 'COR_AVATAR':
            opcoes.peles.push(item);
            break;
          case 'CABELO':
            opcoes.cabelos.push(item);
            break;
          case 'COR_CABELO':
            opcoes.coresCabelo.push({ ...item, cor: elemento.cor || '#000000' });
            break;
          case 'OLHOS':
            opcoes.olhos.push(item);
            break;
          case 'ROUPA':
            opcoes.roupas.push(item);
            break;
          case 'COR_ROUPA':
            opcoes.coresRoupa.push({ ...item, cor: elemento.cor || '#000000' });
            break;
          case 'SHORTS':
            opcoes.shorts.push(item);
            break;
          case 'OCULOS':
            opcoes.oculos.push(item);
            break;
          case 'CHAPEU':
            opcoes.chapeus.push(item);
            break;
          case 'BONE':
            opcoes.bones.push(item);
            break;
          case 'ADERECOS':
          case 'BRINCOS':
          case 'COLAR':
          case 'PULSEIRA':
          case 'RELOGIO':
          case 'MOCHILA':
          case 'OUTROS':
            opcoes.aderecos.push(item);
            break;
        }
      });
    });

    // Remover duplicatas baseado no ID
    Object.keys(opcoes).forEach(key => {
      const items = opcoes[key as keyof typeof opcoes];
      opcoes[key as keyof typeof opcoes] = items.filter((item, index, self) => 
        index === self.findIndex(i => i.id === item.id)
      ) as any;
    });

    console.log('🏁 Fotos principais finais:', fotosPrincipais);

    return NextResponse.json({
      success: true,
      opcoes,
      fotosPrincipais, // Fotos principais por tipo
      total: {
        peles: opcoes.peles.length,
        cabelos: opcoes.cabelos.length,
        coresCabelo: opcoes.coresCabelo.length,
        olhos: opcoes.olhos.length,
        roupas: opcoes.roupas.length,
        coresRoupa: opcoes.coresRoupa.length,
        shorts: opcoes.shorts.length,
        oculos: opcoes.oculos.length,
        chapeus: opcoes.chapeus.length,
        bones: opcoes.bones.length,
        aderecos: opcoes.aderecos.length
      }
    });

  } catch (error) {
    console.error('Erro ao buscar opções de avatar:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      opcoes: null
    }, { status: 500 });
  }
}
