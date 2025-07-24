import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar postagem por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postagem = await prisma.postagem.findUnique({
      where: { id: params.id },
      include: {
        categoriaBlog: true,
        tagsBlogLink: {
          include: {
            tagBlog: true
          }
        }
      }
    });

    if (!postagem) {
      return NextResponse.json(
        { error: 'Postagem não encontrada' },
        { status: 404 }
      );
    }

    // Formatar dados para o frontend
    const postagemFormatada = {
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
    };

    return NextResponse.json(postagemFormatada);
  } catch (error) {
    console.error('Erro ao buscar postagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar postagem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      ativo,
      tags = []
    } = body;

    if (!titulo || !conteudo) {
      return NextResponse.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se postagem existe
    const postagemExistente = await prisma.postagem.findUnique({
      where: { id: params.id }
    });

    if (!postagemExistente) {
      return NextResponse.json(
        { error: 'Postagem não encontrada' },
        { status: 404 }
      );
    }

    // Gerar novo slug se título mudou
    let slug = postagemExistente.slug;
    if (titulo !== postagemExistente.titulo) {
      const baseSlug = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      slug = baseSlug;
      let counter = 1;

      // Verificar se slug já existe (excluindo a postagem atual)
      while (await prisma.postagem.findFirst({ 
        where: { 
          slug,
          id: { not: params.id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Atualizar postagem
    const postagem = await prisma.postagem.update({
      where: { id: params.id },
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

    // Remover tags antigas
    await prisma.postagemTagBlog.deleteMany({
      where: { postagemId: params.id }
    });

    // Processar novas tags
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

    // Buscar postagem atualizada com relacionamentos
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

    return NextResponse.json(postagemCompleta);
  } catch (error) {
    console.error('Erro ao atualizar postagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir postagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se postagem existe
    const postagem = await prisma.postagem.findUnique({
      where: { id: params.id }
    });

    if (!postagem) {
      return NextResponse.json(
        { error: 'Postagem não encontrada' },
        { status: 404 }
      );
    }

    // Excluir relacionamentos com tags primeiro
    await prisma.postagemTagBlog.deleteMany({
      where: { postagemId: params.id }
    });

    // Excluir postagem
    await prisma.postagem.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Postagem excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir postagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
