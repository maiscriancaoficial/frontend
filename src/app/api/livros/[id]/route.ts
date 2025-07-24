import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar livro por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const livro = await prisma.livro.findUnique({
      where: { id },
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
      }
    });

    if (!livro) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      livro
    });

  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar livro
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const nomeParaSalvar = (titulo && titulo.trim() !== '') ? titulo : (nome && nome.trim() !== '') ? nome : undefined;

    console.log('Dados recebidos para atualização:', body);

    // Verificar se livro existe
    const livroExistente = await prisma.livro.findUnique({
      where: { id }
    });

    if (!livroExistente) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se SKU já existe (exceto o próprio livro)
    if (sku && sku !== livroExistente.sku) {
      const skuExistente = await prisma.livro.findFirst({
        where: { 
          sku,
          id: { not: id }
        }
      });

      if (skuExistente) {
        return NextResponse.json(
          { error: 'Já existe um livro com este SKU' },
          { status: 400 }
        );
      }
    }

    // Usar transação para atualizar livro e relacionamentos (com timeout aumentado)
    const livro = await prisma.$transaction(async (tx) => {
      // Atualizar dados básicos do livro
      const livroAtualizado = await tx.livro.update({
        where: { id },
        data: {
          ...(nomeParaSalvar && { nome: nomeParaSalvar }),
          ...(autor !== undefined && { autor }),
          ...(descricao !== undefined && { descricao }),
          ...(descricaoCompleta !== undefined && { descricaoCompleta }),
          ...(faixaEtaria !== undefined && { faixaEtaria }),
          ...(numeroPaginas !== undefined && { numeroPaginas }),
          ...(precoDigital !== undefined && { precoDigital }),
          ...(precoFisico !== undefined && { precoFisico }),
          ...(preco !== undefined && { preco }),
          ...(precoPromocional !== undefined && { precoPromocional }),
          ...(sku !== undefined && { sku }),
          ...(imagemCapa !== undefined && { capa: imagemCapa }),
          ...(imagemCapa !== undefined && { imagemCapa }),
          ...(capa !== undefined && !imagemCapa && { capa }),
          ...(capaVerso !== undefined && { capaVerso }),
          ...(tipo !== undefined && { tipo }),
          ...(estoque !== undefined && { estoque }),
          ...(ativo !== undefined && { ativo }),
          ...(emDestaque !== undefined && { emDestaque })
        }
      });

      // Atualizar categorias
      if (categorias && Array.isArray(categorias)) {
        // Remover categorias existentes
        await tx.livroCategoria.deleteMany({
          where: { livroId: id }
        });

        // Adicionar novas categorias
        if (categorias.length > 0) {
          await tx.livroCategoria.createMany({
            data: categorias.map((categoria: any) => ({
              livroId: id,
              categoriaId: typeof categoria === 'string' ? categoria : categoria.categoriaId
            }))
          });
        }
      }

      // Atualizar tags
      if (tags && Array.isArray(tags)) {
        // Remover tags existentes
        await tx.livroTag.deleteMany({
          where: { livroId: id }
        });

        // Adicionar novas tags
        if (tags.length > 0) {
          await tx.livroTag.createMany({
            data: tags.map((tag: any) => ({
              livroId: id,
              tagId: typeof tag === 'string' ? tag : tag.tagId
            }))
          });
        }
      }

      // Atualizar benefícios
      if (beneficios && Array.isArray(beneficios)) {
        // Remover benefícios existentes
        await tx.livroBeneficio.deleteMany({
          where: { livroId: id }
        });

        // Adicionar novos benefícios
        if (beneficios.length > 0) {
          await tx.livroBeneficio.createMany({
            data: beneficios.map((beneficio: any, index: number) => ({
              livroId: id,
              titulo: beneficio.titulo,
              descricao: beneficio.descricao,
              icone: beneficio.icone,
              ordem: index + 1
            }))
          });
        }
      }

      // Atualizar páginas
      if (paginas && Array.isArray(paginas)) {
        // Remover páginas existentes
        await tx.pagina.deleteMany({
          where: { livroId: id }
        });

        // Adicionar novas páginas
        if (paginas.length > 0) {
          await tx.pagina.createMany({
            data: paginas.map((pagina: any, index: number) => ({
              livroId: id,
              numero: index + 1,
              arquivo: pagina.arquivo,
              conteudo: pagina.conteudo
            }))
          });
        }
      }

      // Retornar apenas o livro atualizado (sem relacionamentos para otimizar)
      return livroAtualizado;
    }, {
      timeout: 15000 // 15 segundos de timeout
    });

    return NextResponse.json({
      success: true,
      livro
    });

  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir livro
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se livro existe
    const livro = await prisma.livro.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            itensPedido: true,
            personalizacoes: true
          }
        }
      }
    });

    if (!livro) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se livro tem pedidos ou personalizações
    if (livro._count.itensPedido > 0 || livro._count.personalizacoes > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um livro que possui pedidos ou personalizações' },
        { status: 400 }
      );
    }

    // Excluir livro (relacionamentos serão excluídos automaticamente por cascade)
    await prisma.livro.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Livro excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
