import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar livros com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const busca = searchParams.get('busca') || '';
    const categoria = searchParams.get('categoria') || '';
    const ativo = searchParams.get('ativo');
    const emDestaque = searchParams.get('emDestaque');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } },
        { sku: { contains: busca, mode: 'insensitive' } }
      ];
    }

    if (ativo !== null && ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    if (emDestaque !== null && emDestaque !== undefined) {
      where.emDestaque = emDestaque === 'true';
    }

    if (categoria) {
      where.categoriasLink = {
        some: {
          categoria: {
            slug: categoria
          }
        }
      };
    }

    // Buscar livros
    const [livros, total] = await Promise.all([
      prisma.livro.findMany({
        where,
        skip,
        take: limit,
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
          },
          beneficios: {
            orderBy: { ordem: 'asc' }
          },
          paginas: {
            orderBy: { numero: 'asc' }
          },
          _count: {
            select: {
              personalizacoes: true,
              itensPedido: true,
              paginas: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.livro.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      livros,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo livro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      titulo, // Frontend envia titulo
      nome,
      autor,
      descricao, 
      descricaoCompleta,
      faixaEtaria,
      numeroPaginas,
      precoDigital,
      precoFisico,
      preco, 
      precoPromocional,
      sku,
      capa,
      imagemCapa,
      capaVerso,
      tipo,
      estoque,
      ativo, 
      emDestaque,
      categorias,
      tags,
      beneficios,
      paginas
    } = body;

    // Mapear titulo para nome se titulo estiver presente e não for vazio
    const nomeParaSalvar = (titulo && titulo.trim() !== '') ? titulo : (nome && nome.trim() !== '') ? nome : 'Livro sem título';

    console.log('Dados recebidos para criação:', body);

    // Verificar se SKU já existe
    if (sku) {
      const skuExistente = await prisma.livro.findUnique({
        where: { sku }
      });

      if (skuExistente) {
        return NextResponse.json(
          { error: 'Já existe um livro com este SKU' },
          { status: 400 }
        );
      }
    }

    // Usar transação para criar livro com relacionamentos (com timeout aumentado)
    const livro = await prisma.$transaction(async (tx) => {
      // Criar livro
      const novoLivro = await tx.livro.create({
        data: {
          nome: nomeParaSalvar,
          autor,
          descricao,
          descricaoCompleta,
          faixaEtaria,
          numeroPaginas,
          precoDigital,
          precoFisico,
          preco: preco || precoFisico || 0,
          precoPromocional,
          sku,
          capa: imagemCapa || capa,
          imagemCapa,
          capaVerso,
          tipo: tipo || 'virtual',
          estoque: estoque || 0,
          ativo: ativo ?? true,
          emDestaque: emDestaque ?? false
        }
      });

      // Criar relacionamentos com categorias
      if (categorias && Array.isArray(categorias)) {
        await tx.livroCategoria.createMany({
          data: categorias.map((categoriaId: string) => ({
            livroId: novoLivro.id,
            categoriaId
          }))
        });
      }

      // Criar relacionamentos com tags
      if (tags && Array.isArray(tags)) {
        await tx.livroTag.createMany({
          data: tags.map((tagId: string) => ({
            livroId: novoLivro.id,
            tagId
          }))
        });
      }

      // Criar benefícios
      if (beneficios && Array.isArray(beneficios)) {
        await tx.livroBeneficio.createMany({
          data: beneficios.map((beneficio: any, index: number) => ({
            livroId: novoLivro.id,
            titulo: beneficio.titulo,
            descricao: beneficio.descricao,
            icone: beneficio.icone,
            ordem: index + 1
          }))
        });
      }

      // Criar páginas
      if (paginas && Array.isArray(paginas)) {
        await tx.pagina.createMany({
          data: paginas.map((pagina: any, index: number) => ({
            livroId: novoLivro.id,
            numero: index + 1,
            arquivo: pagina.arquivo,
            conteudo: pagina.conteudo
          }))
        });
      }

      // Retornar apenas o livro criado (sem relacionamentos para otimizar)
      return novoLivro;
    }, {
      timeout: 15000 // 15 segundos de timeout
    });

    console.log('Livro criado com sucesso:', livro);

    return NextResponse.json({
      success: true,
      livro
    });

  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
