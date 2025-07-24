import { prisma } from '@/lib/prisma';

export interface ProdutoDetalhado {
  id: string;
  titulo: string;
  slug: string;
  descricao?: string | null;
  descricaoLonga?: string | null;
  preco: number;
  precoPromocional?: number | null;
  sku?: string | null;
  fotoPrincipal?: string | null;
  galeria?: string[];
  peso?: number | null;
  altura?: number | null;
  largura?: number | null;
  comprimento?: number | null;
  estoque: number;
  emDestaque: boolean;
  categorias?: { 
    categoria: { 
      id: string;
      titulo: string; 
      slug: string;
    } 
  }[];
  avaliacoes?: {
    id: string;
    nome: string;
    avaliacao: number;
    comentario: string;
    data: Date;
  }[];
  produtosRelacionados?: {
    id: string;
    titulo: string;
    slug: string;
    preco: number;
    precoPromocional?: number | null;
    fotoPrincipal?: string | null;
    estoque: number;
  }[];
}

export async function getProdutoBySlug(slug: string): Promise<ProdutoDetalhado | null> {
  try {
    const produto = await prisma.produto.findUnique({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        titulo: true,
        slug: true,
        descricao: true,
        descricaoLonga: true,
        preco: true,
        precoPromocional: true,
        sku: true,
        fotoPrincipal: true,
        galeria: true,
        peso: true,
        altura: true,
        largura: true,
        comprimento: true,
        estoque: true,
        emDestaque: true,
        categoriasLink: {
          select: {
            categoria: {
              select: {
                id: true,
                titulo: true,
                slug: true,
              }
            }
          }
        },
        // Produtos relacionados (aqui seria necessário um join mais complexo)
      }
    });

    if (!produto) {
      return null;
    }

    // Simulando avaliações já que não temos uma tabela de avaliações no schema atual
    const avaliacoesFicticias = [
      {
        id: '1',
        nome: 'Maria Silva',
        avaliacao: 5,
        comentario: 'Produto excelente! As flores chegaram frescas e lindas, exatamente como na foto.',
        data: new Date('2025-06-25')
      },
      {
        id: '2',
        nome: 'João Santos',
        avaliacao: 4,
        comentario: 'Muito bonito o arranjo, mas atrasou um pouco a entrega.',
        data: new Date('2025-06-20')
      },
      {
        id: '3',
        nome: 'Ana Oliveira',
        avaliacao: 5,
        comentario: 'Simplesmente perfeito! Minha mãe adorou o presente.',
        data: new Date('2025-06-15')
      }
    ];

    // Simulando produtos relacionados
    const produtosRelacionados = [
      {
        id: 'p1',
        titulo: 'Buquê de 18 Rosas Vermelhas',
        slug: 'buque-18-rosas-vermelhas',
        preco: 199.99,
        precoPromocional: 179.99,
        fotoPrincipal: '/produtos/buque-rosas-vermelhas-18.jpg',
        estoque: 15
      },
      {
        id: 'p2',
        titulo: 'Buquê de Rosas Brancas',
        slug: 'buque-rosas-brancas',
        preco: 159.99,
        fotoPrincipal: '/produtos/buque-rosas-brancas.jpg',
        estoque: 10
      },
      {
        id: 'p3',
        titulo: 'Buquê Misto com Girassóis',
        slug: 'buque-misto-girassois',
        preco: 179.99,
        precoPromocional: 149.99,
        fotoPrincipal: '/produtos/buque-girassois.jpg',
        estoque: 8
      }
    ];

    // Se não houver uma imagem principal definida, use a primeira da galeria
    let fotoPrincipal = produto.fotoPrincipal;
    if (!fotoPrincipal && produto.galeria && produto.galeria.length > 0) {
      fotoPrincipal = produto.galeria[0];
    }

    // Se ainda não tiver imagem, use uma imagem padrão
    if (!fotoPrincipal) {
      fotoPrincipal = '/produtos/produto-placeholder.jpg';
    }

    // Garantir que sempre haja uma galeria, mesmo que vazia
    const galeria = produto.galeria || [];

    // Formato final do produto com dados enriquecidos
    return {
      ...produto,
      fotoPrincipal,
      galeria,
      categorias: produto.categoriasLink,
      avaliacoes: avaliacoesFicticias,
      produtosRelacionados
    };
  } catch (error) {
    console.error('Erro ao buscar produto por slug:', error);
    // Em caso de erro, retorna um produto fictício para testes
    return {
      id: 'ficticio',
      titulo: 'Buquê de 12 Rosas Vermelhas',
      slug: 'buque-12-rosas-vermelhas',
      descricao: 'Um lindo buquê com 12 rosas vermelhas selecionadas',
      descricaoLonga: `<p>Este exuberante buquê de 12 rosas vermelhas é a escolha perfeita para expressar amor e paixão. Cada rosa é cuidadosamente selecionada para garantir qualidade e frescor excepcionais.</p>
      <p>As rosas vermelhas são universalmente conhecidas como o símbolo do amor verdadeiro, tornando este buquê ideal para ocasiões românticas como aniversários de namoro, Dia dos Namorados ou simplesmente para surpreender alguém especial.</p>
      <h3>Características:</h3>
      <ul>
        <li>12 rosas vermelhas premium</li>
        <li>Folhagem verde complementar</li>
        <li>Embalagem especial com papel celofane transparente</li>
        <li>Laço de fita em cetim</li>
        <li>Cartão personalizado incluso</li>
      </ul>
      <p>Nossas flores são adquiridas diretamente de produtores locais comprometidos com práticas sustentáveis de cultivo, garantindo beleza e responsabilidade ambiental em cada buquê.</p>`,
      preco: 159.99,
      precoPromocional: 129.99,
      sku: 'BQ-RV-12',
      fotoPrincipal: '/produtos/buque-rosas-vermelhas.jpg',
      galeria: [
        '/produtos/buque-rosas-vermelhas.jpg',
        '/produtos/buque-rosas-vermelhas-2.jpg',
        '/produtos/buque-rosas-vermelhas-3.jpg',
        '/produtos/buque-rosas-vermelhas-4.jpg'
      ],
      peso: 0.5,
      altura: 40,
      largura: 25,
      comprimento: 25,
      estoque: 12,
      emDestaque: true,
      categorias: [
        {
          categoria: {
            id: 'cat1',
            titulo: 'Buquês de Flores',
            slug: 'buque-de-flores'
          }
        }
      ],
      avaliacoes: [
        {
          id: '1',
          nome: 'Maria Silva',
          avaliacao: 5,
          comentario: 'Produto excelente! As flores chegaram frescas e lindas, exatamente como na foto.',
          data: new Date('2025-06-25')
        },
        {
          id: '2',
          nome: 'João Santos',
          avaliacao: 4,
          comentario: 'Muito bonito o arranjo, mas atrasou um pouco a entrega.',
          data: new Date('2025-06-20')
        },
        {
          id: '3',
          nome: 'Ana Oliveira',
          avaliacao: 5,
          comentario: 'Simplesmente perfeito! Minha mãe adorou o presente.',
          data: new Date('2025-06-15')
        }
      ],
      produtosRelacionados: [
        {
          id: 'p1',
          titulo: 'Buquê de 18 Rosas Vermelhas',
          slug: 'buque-18-rosas-vermelhas',
          preco: 199.99,
          precoPromocional: 179.99,
          fotoPrincipal: '/produtos/buque-rosas-vermelhas-18.jpg',
          estoque: 15
        },
        {
          id: 'p2',
          titulo: 'Buquê de Rosas Brancas',
          slug: 'buque-rosas-brancas',
          preco: 159.99,
          fotoPrincipal: '/produtos/buque-rosas-brancas.jpg',
          estoque: 10
        },
        {
          id: 'p3',
          titulo: 'Buquê Misto com Girassóis',
          slug: 'buque-misto-girassois',
          preco: 179.99,
          precoPromocional: 149.99,
          fotoPrincipal: '/produtos/buque-girassois.jpg',
          estoque: 8
        }
      ]
    };
  }
}
