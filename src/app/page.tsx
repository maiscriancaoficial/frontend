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
import { LivrosDestaque } from '@/components/livro/livros-destaque';
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

async function getCategorias(): Promise<CategoriaDestaque[]> {
  try {
    // Busca as categorias no banco de dados
    const categorias = await prisma.categoria.findMany({
      where: {
        ativo: true,
        destaque: true
      },
      take: 4,
      orderBy: {
        id: 'asc'
      }
    });

    // Mapeia as categorias para o formato necessário para exibição
    return categorias.map((categoria, index) => {
      // Verificação de segurança para a imagem
      let imagemUrl = '/featured/default.jpg';
      
      // Se tiver imagemCapa e for uma URL local (começa com /)
      if (categoria.imagemCapa && categoria.imagemCapa.startsWith('/')) {
        imagemUrl = categoria.imagemCapa;
      } else {
        // Usa o mapa de imagens baseado no slug
        imagemUrl = imagensCategoria[categoria.slug as keyof typeof imagensCategoria] || 
                    imagensCategoria['default'];
      }
      
      // Mapeando ícones baseados nos slugs
      const getIcon = (slug: string) => {
        const iconMap: Record<string, string> = {
          'aventura': 'Sparkles',
          'contos-de-fadas': 'Heart',
          'animais': 'Dog',
          'educativos': 'BookOpen',
          'personalizados': 'Star',
          'alfabetizacao': 'Pencil',
          'natureza': 'Leaf',
          'familia': 'Users'
        };
        return iconMap[slug] || 'BookOpen';
      };
      
      // Descrições curtas para as categorias
      const getDescription = (slug: string) => {
        const descMap: Record<string, string> = {
          'aventura': 'Histórias repletas de aventuras',
          'contos-de-fadas': 'Magia e encantamento',
          'animais': 'Histórias com animais especiais',
          'educativos': 'Aprendizado com diversão',
          'personalizados': 'Seu filho como protagonista',
          'alfabetizacao': 'Primeiros passos na leitura',
          'natureza': 'Descobrindo o meio ambiente',
          'familia': 'Histórias sobre amor e família'
        };
        return descMap[slug] || 'Histórias especiais para seu filho';
      };
      
      return {
        id: categoria.id,
        name: categoria.titulo,
        image: imagemUrl,
        href: `/categoria/${categoria.slug}`,
        icon: getIcon(categoria.slug),
        description: getDescription(categoria.slug),
        highlight: index < 2 // Destaque para as primeiras duas categorias
      };
    });
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    // Em caso de erro, retorna categorias fictícias como fallback
    return [
      { 
        id: '1', 
        name: 'Aventuras Mágicas', 
        image: '/featured/aventura.jpg', 
        href: '/categoria/aventura',
        icon: 'Sparkles',
        description: 'Histórias repletas de aventuras',
        highlight: true
      },
      { 
        id: '2', 
        name: 'Contos de Fadas', 
        image: '/featured/contos.jpg', 
        href: '/categoria/contos-de-fadas',
        icon: 'Heart',
        description: 'Magia e encantamento',
        highlight: true
      },
      { 
        id: '3', 
        name: 'Mundo dos Animais', 
        image: '/featured/animais.jpg', 
        href: '/categoria/animais',
        icon: 'Dog',
        description: 'Histórias com animais especiais',
        highlight: false
      },
      { 
        id: '4', 
        name: 'Livros Educativos', 
        image: '/featured/educativos.jpg', 
        href: '/categoria/educativos',
        icon: 'BookOpen',
        description: 'Aprendizado com diversão',
        highlight: false
      },
    ];
  }
}

// Componente do servidor para os produtos em destaque
async function ProdutosDestaqueSection() {
  const produtos = await getProdutosDestaque();
  return <ProdutosDestaque produtos={produtos} />;
}

// Componente do servidor para o carrossel estilo Netflix
async function CarrosselNetflixSection() {
  const produtos = await getProdutosDestaque(12); // Buscando 12 produtos
  return <ProdutosCarrosselNetflix 
    titulo="Descubra Novidades"
    subtitulo="Os produtos mais recentes da nossa floricultura"
    badgeTexto="Lançamentos"
    produtos={produtos}
  />;
}

// Componente do servidor para os livros em destaque
async function LivrosDestaqueSection() {
  const livros = await getLivrosDestaque(10); // Buscando todos os 10 livros em destaque
  return <LivrosDestaque livros={livros} />;
}

export default async function Home() {
  const featuredCategories = await getCategorias();

  return (
    <SiteLayout>
      <div className="container mx-auto px-4">
        {/* Banner Slider */}
        <BannerSlider />

         {/* Carrossel de Categorias com Ícones */}
         <CategoriasCarrossel 
           categorias={[
             {
               id: '1',
               titulo: 'Aventura',
               slug: 'aventura',
               icone: 'floresNaturais',
               cor: '#ff0080'
             },
             {
               id: '2',
               titulo: 'Contos de Fadas',
               slug: 'contos-de-fadas',
               icone: 'arranjos',
               cor: '#27b99a'
             },
             {
               id: '3',
               titulo: 'Animais',
               slug: 'animais',
               icone: 'plantasInterna',
               cor: '#ff9898'
             },
             {
               id: '4',
               titulo: 'Educativos',
               slug: 'educativos',
               icone: 'suculentas',
               cor: '#ffa500'
             }
           ]}
         />

       
        {/* Livros digitais em destaque */}
        <LivrosDestaqueSection />

        
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
        
        {/* Categorias em destaque */}
        <section className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div className="w-full">
              <Badge className="mb-3 bg-[#ff0080]/10 hover:bg-[#ff0080]/10 text-[#ff0080] dark:bg-[#ff0080]/20 dark:text-[#ff0080]">
                Explore Nossas Histórias
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black dark:text-white hover:text-[#ff0080] dark:hover:text-[#ff0080] transition-colors">
                Categorias em Destaque
              </h2>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mb-4 md:mb-0">
                  Explore nossa coleção de livros infantis personalizados, organizados por temas, faixas etárias e interesses para cada criança.
                </p>
                
                <Button variant="outline" className="border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 dark:border-[#ff0080]/30 dark:text-[#ff0080] dark:hover:bg-[#ff0080]/20 whitespace-nowrap rounded-full transition-all hover:scale-105">
                  <Link href="/categorias" className="flex items-center">
                    Ver todas as categorias <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => {
              // Escolhendo o ícone certo baseado na string
              let IconComponent;
              switch(category.icon) {
                case 'Flower': IconComponent = Flower; break;
                case 'Coffee': IconComponent = Coffee; break;
                case 'Gift': IconComponent = Gift; break;
                case 'Sparkles': IconComponent = Sparkles; break;
                case 'Heart': IconComponent = Heart; break;
                case 'Cake': IconComponent = Cake; break;
                case 'Star': IconComponent = Star; break;
                default: IconComponent = ShoppingBag;
              }
              
              return (
                <Link 
                  key={index} 
                  href={category.href}
                  className={cn(
                    "group relative flex flex-col rounded-3xl overflow-hidden hover:shadow-lg transition-all",
                    "border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 h-full",
                    category.highlight ? "ring-2 ring-[#ff0080]/50" : ""
                  )}
                >
                  <div className="h-14 w-14 rounded-full bg-[#27b99a]/10 dark:bg-[#27b99a]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-[#ff0080]/10 dark:group-hover:bg-[#ff0080]/20">
                    <IconComponent className="h-6 w-6 text-[#27b99a] dark:text-[#27b99a] group-hover:text-[#ff0080] dark:group-hover:text-[#ff0080]" />
                  </div>
                  
                  {category.highlight && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-[#ff0080] to-[#ff0080]/80 hover:from-[#ff0080] hover:to-[#ff0080]/70 rounded-full px-3">
                      Popular
                    </Badge>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ff0080] dark:group-hover:text-[#ff0080] transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {category.description}
                  </p>
                  
                  <div className="mt-auto flex items-center text-[#ff0080] dark:text-[#ff0080] text-sm font-medium">
                    Explorar
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Botão removido daqui e movido para o topo da seção */}
        </section>
        
        {/* Carrossel estilo Netflix */}
        <CarrosselNetflixSection />
        
      </div>
    </SiteLayout>
  );
}