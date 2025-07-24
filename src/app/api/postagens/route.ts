import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todas as postagens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const status = searchParams.get('status');
    const busca = searchParams.get('busca');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (categoria && categoria !== 'todas') {
      where.categoriaBlogId = categoria;
    }

    if (status && status !== 'todos') {
      where.ativo = status === 'publicado';
    }

    if (busca) {
      where.OR = [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { resumo: { contains: busca, mode: 'insensitive' } },
        { conteudo: { contains: busca, mode: 'insensitive' } }
      ];
    }

    const [postagens, total] = await Promise.all([
      prisma.postagem.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          categoriaBlog: true,
          tagsBlogLink: {
            include: {
              tagBlog: true
            }
          }
        }
      }),
      prisma.postagem.count({ where })
    ]);

    // Formatar dados para o frontend
    const postagensFormatadas = postagens.map(postagem => ({
      id: postagem.id,
      titulo: postagem.titulo,
      slug: postagem.slug,
      conteudo: postagem.conteudo,
      resumo: postagem.resumo,
      fotoCapa: postagem.fotoCapa,
      categoriaBlogId: postagem.categoriaBlogId,
      categoriaId: postagem.categoriaId,
      categoriaNome: postagem.categoriaBlog?.nome || 'Sem categoria',
      autor: postagem.autor,
      palavrasChave: postagem.palavrasChave,
      pontuacaoSEO: postagem.pontuacaoSEO,
      ativo: postagem.ativo,
      visualizacoes: postagem.visualizacoes,
      createdAt: postagem.createdAt.toISOString(),
      updatedAt: postagem.updatedAt.toISOString(),
      tags: postagem.tagsBlogLink.map(link => link.tagBlog.nome)
    }));

    return NextResponse.json({
      postagens: postagensFormatadas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova postagem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      titulo, 
      conteudo, 
      resumo, 
      fotoCapa, 
      categoriaBlogId, 
      autor, 
      palavrasChave, 
      pontuacaoSEO, 
      ativo = false,
      tags = []
    } = body;

    if (!titulo || !conteudo) {
      return NextResponse.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar slug único
    const baseSlug = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Verificar se slug já existe e criar um único
    while (await prisma.postagem.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Criar postagem
    const postagem = await prisma.postagem.create({
      data: {
        titulo,
        slug,
        conteudo,
        resumo,
        fotoCapa,
        categoriaBlogId,
        autor,
        palavrasChave,
        pontuacaoSEO,
        ativo
      }
    });

    // Processar tags se fornecidas
    if (tags.length > 0) {
      for (const tagNome of tags) {
        // Buscar ou criar tag
        let tag = await prisma.tagBlog.findUnique({
          where: { nome: tagNome }
        });

        if (!tag) {
          const tagSlug = tagNome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

          tag = await prisma.tagBlog.create({
            data: {
              nome: tagNome,
              slug: tagSlug
            }
          });
        }

        // Criar relacionamento postagem-tag
        await prisma.postagemTagBlog.create({
          data: {
            postagemId: postagem.id,
            tagBlogId: tag.id
          }
        });
      }
    }

    // Buscar postagem criada com relacionamentos
    const postagemCompleta = await prisma.postagem.findUnique({
      where: { id: postagem.id },
      include: {
        categoriaBlog: true,
        tagsBlogLink: {
          include: {
            tagBlog: true
          }
        }
      }
    });

    return NextResponse.json(postagemCompleta, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
