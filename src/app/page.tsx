import { SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Flower, Coffee, Gift, Sparkles, Cake, Heart, Star, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProdutosDestaque } from '@/components/produto/produtos-destaque';
import { getProdutosDestaque } from '@/services/produto-service';
import { getLivrosDestaque } from '@/services/livro-service';
import { CTARedondo } from '@/components/cta/cta-redondo';
import CategoriasCarrossel from '@/components/categorias/categorias-carrossel';
import { ProdutosCarrosselNetflix } from '@/components/produto/produtos-carrossel-netflix';
import { BannerSlider } from '@/components/home/banner-slider';

// Definindo o caminho padrão para imagens de categorias quando não houver imagemCapa
const imagensCategoria = {
  'buque-de-flores': '/featured/buque.jpg',
  'cesta-cafe-da-manha': '/featured/cafe.jpg',
  'arranjos-de-flores': '/featured/arranjo.jpg',
  'cesta-de-chocolate': '/featured/chocolate.jpg',
  'default': '/featured/default.jpg'
};

// Interface para a categoria na página inicial
interface CategoriaDestaque {
  id: string;
  name: string;
  image: string;
  href: string;
  icon?: string;
  description?: string;
  highlight?: boolean;
}

// Interface para as categorias do prisma
interface CategoriaDB {
  id: string;
  titulo: string;
  slug: string;
  imagemCapa: string | null;
  updatedAt: Date;
}


// async function getCategorias(): Promise<CategoriaDestaque[]> {
//   try {
//     // Busca as categorias no banco de dados
//     const categorias = await prisma.categoria.findMany({
//       where: {
//         ativo: true,
//         destaque: true
//       },
//       take: 4,
//       orderBy: {
//         id: 'asc'
//       }
//     });

//     // Mapeia as categorias para o formato necessário para exibição
//     return categorias.map((categoria, index) => {
//       // Verificação de segurança para a imagem
//       let imagemUrl = '/featured/default.jpg';
      
//       // Se tiver imagemCapa e for uma URL local (começa com /)
//       if (categoria.imagemCapa && categoria.imagemCapa.startsWith('/')) {
//         imagemUrl = categoria.imagemCapa;
//       } else {
//         // Usa o mapa de imagens baseado no slug
//         imagemUrl = imagensCategoria[categoria.slug as keyof typeof imagensCategoria] || 
//                     imagensCategoria['default'];
//       }
      
//       // Mapeando ícones baseados nos slugs
//       const getIcon = (slug: string) => {
//         const iconMap: Record<string, string> = {
//           'aventura': 'Sparkles',
//           'contos-de-fadas': 'Heart',
//           'animais': 'Dog',
//           'educativos': 'BookOpen',
//           'personalizados': 'Star',
//           'alfabetizacao': 'Pencil',
//           'natureza': 'Leaf',
//           'familia': 'Users'
//         };
//         return iconMap[slug] || 'BookOpen';
//       };
      
//       // Descrições curtas para as categorias
//       const getDescription = (slug: string) => {
//         const descMap: Record<string, string> = {
//           'aventura': 'Histórias repletas de aventuras',
//           'contos-de-fadas': 'Magia e encantamento',
//           'animais': 'Histórias com animais especiais',
//           'educativos': 'Aprendizado com diversão',
//           'personalizados': 'Seu filho como protagonista',
//           'alfabetizacao': 'Primeiros passos na leitura',
//           'natureza': 'Descobrindo o meio ambiente',
//           'familia': 'Histórias sobre amor e família'
//         };
//         return descMap[slug] || 'Histórias incríveis para crianças';
//       };
      
//       return {
//         id: categoria.id,
//         name: categoria.titulo,
//         image: imagemUrl,
//         href: `/categoria/${categoria.slug}`,
//         icon: getIcon(categoria.slug),
//         description: getDescription(categoria.slug),
//         highlight: index < 2 // Destaque para as primeiras duas categorias
//       };
//     });
//   } catch (error) {
//     console.error('Erro ao carregar categorias:', error);
//     // Em caso de erro, retorna categorias fictícias como fallback
//     return [
//       { 
//         id: '1', 
//         name: 'Aventuras Mágicas', 
//         image: '/featured/aventura.jpg', 
//         href: '/categoria/aventura',
//         icon: 'Sparkles',
//         description: 'Histórias repletas de aventuras',
//         highlight: true
//       },
//       { 
//         id: '2', 
//         name: 'Contos de Fadas', 
//         image: '/featured/contos.jpg', 
//         href: '/categoria/contos-de-fadas',
//         icon: 'Heart',
//         description: 'Magia e encantamento',
//         highlight: true
//       },
//       { 
//         id: '3', 
//         name: 'Mundo dos Animais', 
//         image: '/featured/animais.jpg', 
//         href: '/categoria/animais',
//         icon: 'Dog',
//         description: 'Histórias com animais especiais',
//         highlight: false
//       },
//       { 
//         id: '4', 
//         name: 'Livros Educativos', 
//         image: '/featured/educativos.jpg', 
//         href: '/categoria/educativos',
//         icon: 'BookOpen',
//         description: 'Aprendizado com diversão',
//         highlight: false
//       },
//     ];
//   }
// }

// Componente do servidor para os livros em destaque
async function ProdutosDestaqueSection() {
  const livros = await getLivrosDestaque();
  return <ProdutosDestaque livros={livros} />;
}



// Função para buscar categorias de livros para o carrossel (dados mockados por enquanto)
async function getCategoriasLivros() {
  // Como não há modelo Categoria no schema, vamos usar dados mockados
  // que representam as categorias de livros infantis
  return [
    {
      id: '1',
      titulo: 'Aventura',
      slug: 'aventura',
      icone: 'floresNaturais' as const,
      cor: '#ff0080'
    },
    {
      id: '2',
      titulo: 'Educativo',
      slug: 'educativo',
      icone: 'vasosDecorativos' as const,
      cor: '#27b99a'
    },
    {
      id: '3',
      titulo: 'Fantasia',
      slug: 'fantasia',
      icone: 'arranjos' as const,
      cor: '#ff9898'
    },
    {
      id: '4',
      titulo: 'Super-Heróis',
      slug: 'super-herois',
      icone: 'bonsai' as const,
      cor: '#ffa500'
    },
    {
      id: '5',
      titulo: 'Contos Clássicos',
      slug: 'contos-classicos',
      icone: 'plantasInterna' as const,
      cor: '#9b59b6'
    },
    {
      id: '6',
      titulo: 'Animais',
      slug: 'animais',
      icone: 'suculentas' as const,
      cor: '#e74c3c'
    },
    {
      id: '7',
      titulo: 'Ciências',
      slug: 'ciencias',
      icone: 'cestas' as const,
      cor: '#3498db'
    },
    {
      id: '8',
      titulo: 'Jogos e Atividades',
      slug: 'jogos',
      icone: 'acessorios' as const,
      cor: '#f39c12'
    }
  ];
}

// Componente do servidor para o carrossel estilo Netflix
async function CarrosselNetflixSection() {
  const produtos = await getProdutosDestaque(12); // Buscando 12 produtos
  return <ProdutosCarrosselNetflix 
    titulo="Descubra Novidades"
    subtitulo="Os produtos mais recentes da nossa floricultura"
    badgeTexto="Novidades"
    produtos={produtos}
  />;
}



export default async function Home() {
  // const featuredCategories = await getCategorias(); // Comentado - função não funcional
  const categoriasLivros = await getCategoriasLivros();

  return (
    <SiteLayout>
      <div className="container mx-auto px-4">
        {/* Banner Slider */}
        <BannerSlider />

         {/* Carrossel de Categorias com Ícones - Dados Reais */}
         <CategoriasCarrossel 
            categorias={categoriasLivros}
          />

       
     

        
        {/* Produtos em destaque */}
        <ProdutosDestaqueSection />
      
        
        {/* CTA Redondo */}
        <div className="container mx-auto px-4 py-8">
          <CTARedondo 
            titulo="Livros infantis personalizados" 
            descricao="As mais encantadoras histórias onde seu filho é o protagonista. Desperte a imaginação e crie memórias inesquecíveis."
            botaoTexto="Ver coleção especial"
            botaoUrl="/colecao/especial"
            varianteCor="rosa"
          />
        </div>
        
        {/* Carrossel estilo Netflix */}
        <CarrosselNetflixSection />
        
      </div>
    </SiteLayout>
  );
}