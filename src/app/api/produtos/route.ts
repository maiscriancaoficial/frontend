import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// GET - Listar produtos com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const status = searchParams.get('status');
    const ativo = searchParams.get('ativo');
    const emDestaque = searchParams.get('emDestaque');
    const busca = searchParams.get('busca');
    const precoMin = searchParams.get('precoMin');
    const precoMax = searchParams.get('precoMax');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (categoria && categoria !== 'todas') {
      where.categoriasLink = {
        some: {
          categoria: {
            slug: categoria
          }
        }
      };
    }

    if (status && status !== 'todos') {
      if (status === 'publicado') {
        where.ativo = true;
      } else if (status === 'inativo') {
        where.ativo = false;
      }
    }

    if (ativo !== null && ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    if (emDestaque !== null && emDestaque !== undefined) {
      where.emDestaque = emDestaque === 'true';
    }

    if (precoMin || precoMax) {
      where.preco = {};
      if (precoMin) where.preco.gte = parseFloat(precoMin);
      if (precoMax) where.preco.lte = parseFloat(precoMax);
    }

    if (busca) {
      where.OR = [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } },
        { sku: { contains: busca, mode: 'insensitive' } }
      ];
    }

    // Buscar produtos
    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        include: {
          categoriasLink: {
            include: {
              categoria: true
            }
          },
          tagsLink: {
            include: {
              tag: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.produto.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      produtos,
      total,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validações básicas
    if (!data.titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }
    
    if (!data.preco || data.preco <= 0) {
      return NextResponse.json(
        { error: 'Preço é obrigatório e deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Gerar slug único
    let baseSlug = slugify(data.titulo, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.produto.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Gerar SKU único se não fornecido
    let sku = data.sku;
    if (!sku) {
      // Gerar SKU baseado no título + timestamp para garantir unicidade
      let baseSku = data.titulo.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4);
      if (baseSku.length < 4) {
        baseSku = baseSku.padEnd(4, 'X');
      }
      
      // Adicionar timestamp para garantir unicidade
      const timestamp = Date.now().toString().slice(-4);
      sku = `${baseSku}${timestamp}`;
      
      // Verificar se SKU já existe (improvável, mas por segurança)
      let skuCounter = 1;
      while (await prisma.produto.findUnique({ where: { sku } })) {
        sku = `${baseSku}${timestamp}${skuCounter}`;
        skuCounter++;
      }
    } else {
      // Verificar se SKU fornecido já existe
      const existingSku = await prisma.produto.findUnique({ where: { sku } });
      if (existingSku) {
        return NextResponse.json(
          { error: `SKU '${sku}' já está em uso` },
          { status: 400 }
        );
      }
    }

    // Criar produto
    const produto = await prisma.produto.create({
      data: {
        titulo: data.titulo,
        slug,
        sku,
        descricao: data.descricao,
        descricaoLonga: data.descricaoLonga,
        preco: data.preco,
        precoPromocional: data.precoPromocional || null,
        fotoPrincipal: data.fotoPrincipal,
        galeria: data.galeria || data.fotos || [],
        ativo: data.ativo !== undefined ? data.ativo : (data.status === 'publicado' ? true : false),
        emDestaque: data.emDestaque !== undefined ? data.emDestaque : (data.destaque || false),
        palavrasChave: data.palavrasChave,
        // Campos opcionais do modelo
        estoque: data.estoque || 0,
        peso: data.peso,
        altura: data.altura,
        largura: data.largura,
        comprimento: data.comprimento,
        tamanho: data.tamanho,
        pontuacaoSEO: data.pontuacaoSEO,
        // Relacionamentos serão criados separadamente se necessário
      },
      include: {
        categoriasLink: {
          include: {
            categoria: true
          }
        },
        tagsLink: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, produto }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    
    // Log detalhado do erro para debug
    console.error('Detalhes do erro:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    });
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
