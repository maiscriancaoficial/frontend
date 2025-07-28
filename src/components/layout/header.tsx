'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../../../public/logo-azul-rosa.png';
import { 
  Search,
  ShoppingCart,
  Heart,
  Bell,
  Moon,
  Sun,
  User,
  ChevronDown,
  Loader2,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { CarrinhoDrawer } from '../header/carrinho-drawer';
import { FavoritosDrawer } from '../header/favoritos-drawer';
import { NotificacoesDrawer } from '../header/notificacoes-drawer';
import { PerfilDropdown } from '../header/perfil-dropdown';
import { useCarrinhoStore } from '@/services/carrinho-service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Interface para os resultados da busca
interface LivroSearchResult {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  thumbnail: string;
  categoria: {
    id: string;
    titulo: string;
    slug: string;
  } | null;
  emDestaque: boolean;
  sku: string;
  autor?: string;
  faixaEtaria?: string;
}

// Componente para a barra de pesquisa com AJAX
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LivroSearchResult[]>([]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/livros/busca?q=${encodeURIComponent(searchQuery)}&limit=6`);
          const data = await response.json();
          
          if (data.success) {
            setSearchResults(data.livros);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Erro ao buscar livros:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden bg-white dark:bg-gray-800 focus-within:ring-2 ring-[#ff0080]/20 dark:ring-[#27b99a]/40">
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button variant="ghost" size="icon" className="mr-1">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden z-50 border border-gray-100 dark:border-gray-700"
          >
            <div className="max-h-96 overflow-y-auto">
              {searchResults.map((livro) => (
                <Link
                  key={livro.id}
                  href={livro.categoria ? `/categoria-livro/${livro.categoria.slug}/livro/${livro.slug}` : `/livro/${livro.slug}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onClick={() => setSearchResults([])}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={livro.thumbnail}
                      alt={livro.nome}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-book.jpg';
                      }}
                    />
                  </div>

                  {/* Informações do livro */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                          {livro.nome}
                        </h4>
                        
                        {/* Categoria */}
                        {livro.categoria && (
                          <span className="inline-block px-2 py-0.5 bg-[#ff0080]/10 text-[#ff0080] text-xs rounded-full mt-1">
                            {livro.categoria.titulo}
                          </span>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="text-right flex-shrink-0">
                        {livro.precoPromocional ? (
                          <div className="space-y-0.5">
                            <div className="text-xs text-gray-400 line-through">
                              {formatPrice(livro.preco)}
                            </div>
                            <div className="text-sm font-semibold text-[#27b99a]">
                              {formatPrice(livro.precoPromocional)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(livro.preco)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Ver todos os resultados */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50">
                <Link
                  href={`/busca?q=${encodeURIComponent(searchQuery)}`}
                  className="block text-center text-sm text-[#ff0080] hover:text-[#ff0080]/80 font-medium transition-colors"
                  onClick={() => setSearchResults([])}
                >
                  Ver todos os resultados para "{searchQuery}"
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente para o campo de CEP
const CepSearch = () => {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<{cep: string, city: string, state: string, neighborhood: string, street: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Buscar CEP do localStorage ao montar o componente
  useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress(parsedAddress);
        setCep(parsedAddress.cep);
      } catch (e) {
        console.error('Erro ao carregar endereço salvo:', e);
      }
    }
  }, []);

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    setCep(formattedCep);
    
    if (formattedCep.length === 9) {
      buscarCep(formattedCep);
    } else {
      setError(null);
    }
  };

  const buscarCep = async (cepValue: string) => {
    if (!cepValue || cepValue.length !== 9) return;
    
    setLoading(true);
    setError(null);
    
    // Removendo hífen para a consulta na API
    const cepLimpo = cepValue.replace('-', '');
    
    try {
      // Em produção: usar API real como ViaCEP
      // const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      // const data = await response.json();
      
      // Para demonstração, estamos simulando a resposta da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulando resposta da API
      const data = {
        cep: cepValue,
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
        erro: false
      };
      
      if (data.erro) {
        setError('CEP não encontrado');
      } else {
        const novoEndereco = {
          cep: data.cep,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        };
        
        setAddress(novoEndereco);
        
        // Salvar no localStorage
        localStorage.setItem('userAddress', JSON.stringify(novoEndereco));
      }
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.');
      console.error('Erro na busca de CEP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarEndereco = () => {
    if (address) {
      localStorage.setItem('userAddress', JSON.stringify(address));
      setModalOpen(false);
      toast.success('Endereço salvo com sucesso!');
    }
  };

  return (
    <>
      <div className="hidden lg:flex relative cursor-pointer" onClick={() => setModalOpen(true)}>
        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 bg-white dark:bg-gray-800 transition-all hover:border-[#27b99a] hover:shadow-md">
          <MapPin className="h-4 w-4 text-[#27b99a]" />
          {address ? (
            <div className="text-sm truncate max-w-[200px]">
              <span className="font-medium">{address.city}, {address.state}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-400">Digite seu CEP</span>
          )}
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-none rounded-[20px] shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800 font-medium">Qual é o seu CEP?</DialogTitle>
            <DialogDescription className="text-gray-500">
              Informe seu CEP para mostrarmos produtos disponíveis em sua região.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-600">CEP</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={handleCepChange}
                  className="flex-1 bg-gray-50 border-gray-100 rounded-full focus-visible:ring-[#27b99a]/20 placeholder:text-gray-400"
                  maxLength={9}
                />
                <Button 
                  onClick={() => buscarCep(cep)}
                  disabled={cep.length !== 9 || loading}
                  className="bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full font-normal"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            {address && (
              <div className="space-y-3 border border-gray-100 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium text-gray-700">Endereço encontrado:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">CEP:</span> {address.cep}</p>
                  <p><span className="font-medium">Rua:</span> {address.street}</p>
                  <p><span className="font-medium">Bairro:</span> {address.neighborhood}</p>
                  <p><span className="font-medium">Cidade:</span> {address.city}</p>
                  <p><span className="font-medium">Estado:</span> {address.state}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-800">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSalvarEndereco} 
              disabled={!address}
              className="bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-full font-normal"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Categorias para o menu
const categories = [
  { name: 'Novidades', href: '/categoria-livro/novidades' },
  { name: 'Lançamentos', href: '/categoria-livro/lancamentos' },
  { name: 'Aventuras Mágicas', href: '/categoria-livro/aventura' },
  { name: 'Contos de Fadas', href: '/categoria-livro/contos-de-fadas' },
  { name: 'Mundo dos Animais', href: '/categoria-livro/animais' },
  { name: 'Livros Educativos', href: '/categoria-livro/educativos' },
  { name: 'Personalizados', href: '/categoria-livro/personalizados' },
  { name: 'Alfabetização', href: '/categoria-livro/alfabetizacao' },
  { name: 'Para Colorir', href: '/categoria-livro/para-colorir' },
  { name: 'Infantil', href: '/categoria-livro/infantil' },
  { name: 'Primeiros Passos', href: '/categoria-livro/primeiros-passos' },
  { name: 'Natureza', href: '/categoria-livro/natureza' },
  { name: 'Ciências', href: '/categoria-livro/ciencias' },
  { name: 'Matemática', href: '/categoria-livro/matematica' },
  { name: 'Idiomas', href: '/categoria-livro/idiomas' },
  { name: 'Artes', href: '/categoria-livro/artes' },
];

// Componente principal do Header
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { itens, quantidade } = useCarrinhoStore();
  const [favoritosCount, setFavoritosCount] = useState(0);
  
  // Estados para controlar os drawers e dropdowns
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [favoritosOpen, setFavoritosOpen] = useState(false);
  const [notificacoesOpen, setNotificacoesOpen] = useState(false);

  const { logout, usuario, autenticado } = useAuth();

  // Efeito para detectar rolagem
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carregar contadores reais do localStorage
  useEffect(() => {
    const carregarContadores = () => {
      try {
        // Carregar favoritos
        const favoritosStorage = JSON.parse(localStorage.getItem('favoritos') || '[]');
        if (Array.isArray(favoritosStorage)) {
          setFavoritosCount(favoritosStorage.length);
        }
      } catch (error) {
        console.error('Erro ao carregar contadores:', error);
        setFavoritosCount(0);
      }
    };
    
    carregarContadores();
    
    // Escutar eventos de atualização
    const handleCarrinhoAtualizado = () => carregarContadores();
    const handleFavoritosAtualizado = () => carregarContadores();
    
    window.addEventListener('carrinho-atualizado', handleCarrinhoAtualizado);
    window.addEventListener('favoritos-atualizado', handleFavoritosAtualizado);
    
    return () => {
      window.removeEventListener('carrinho-atualizado', handleCarrinhoAtualizado);
      window.removeEventListener('favoritos-atualizado', handleFavoritosAtualizado);
    };
  }, []);
  

  
  const notificacoes = [
    {
      id: '1',
      tipo: 'oferta',
      titulo: 'Promoção de Primavera',
      mensagem: 'Aproveite 30% de desconto em buquês selecionados até o final da semana!',
      data: 'Há 2 horas',
      link: '/promocao-primavera',
      lida: false
    },
    {
      id: '2',
      tipo: 'lancamento',
      titulo: 'Novos Arranjos Disponíveis',
      mensagem: 'Acabamos de receber novas orquídeas exóticas para compor arranjos únicos.',
      data: 'Há 1 dia',
      imagem: '/notificacoes/orquideas-exoticas.jpg',
      link: '/lancamentos/orquideas',
      lida: false
    },
    {
      id: '3',
      tipo: 'pedido',
      titulo: 'Seu pedido foi entregue',
      mensagem: 'Pedido #12345 foi entregue com sucesso no endereço informado.',
      data: 'Há 3 dias',
      lida: true
    }
  ];
  
  const dadosUsuario = usuario;

  // Funções de manipulação dos produtos
  const handleUpdateQuantidade = (id: string, quantidade: number) => {
    console.log(`Atualizando quantidade do produto ${id} para ${quantidade}`);
  };
  
  const handleRemoverItemCarrinho = (id: string) => {
    console.log(`Removendo produto ${id} do carrinho`);
  };
  
  const handleRemoverFavorito = (id: string) => {
    console.log(`Removendo produto ${id} dos favoritos`);
  };
  
  const handleAddToCart = (id: string) => {
    console.log(`Adicionando produto ${id} ao carrinho`);
    setCarrinhoOpen(true);
  };
  
  const handleMarcarNotificacaoLida = (id: string) => {
    console.log(`Marcando notificação ${id} como lida`);
  };
  
  const handleMarcarTodasNotificacoesLidas = () => {
    console.log('Marcando todas as notificações como lidas');
  };
  
  const handleLogout = () => {
    console.log('Realizando logout via useAuth');
    logout();
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900",
      isScrolled ? "shadow-md py-2" : "py-4"
    )}>
      {/* Parte superior do header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src={logoImage} 
                alt="Mais criança"
                width={120} 
                height={40}
                priority
                className="h-10 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Barra de pesquisa - apenas em desktop */}
          <div className="hidden md:block flex-grow max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Campo de CEP */}
          <CepSearch />

          {/* Ações do usuário */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Carrinho */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setCarrinhoOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {quantidade > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff0080] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {quantidade}
                </span>
              )}
            </Button>

            {/* Favoritos */}
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => setFavoritosOpen(true)}
            >
              <Heart className="h-5 w-5" />
              {favoritosCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#27b99a] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritosCount}
                </span>
              )}
            </Button>

            {/* Alternador de tema */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>

            {/* Perfil de Usuário */}
            <PerfilDropdown 
              usuario={usuario ? {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
              } : undefined}
              logado={autenticado} 
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* Barra de pesquisa - apenas em mobile */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Menu de categorias */}
      <nav className="border-t border-gray-200 dark:border-gray-800 mt-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 relative">
          {/* Container com scroll horizontal e fade nas bordas */}
          <div className="relative overflow-hidden">
            {/* Gradiente fade esquerdo */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
            
            {/* Gradiente fade direito */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
            
            {/* Container scrollável */}
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex space-x-6 py-2 whitespace-nowrap px-8">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#ff0080] dark:hover:text-[#27b99a] transition-colors duration-200 py-2 flex-shrink-0"
                  >
                    <motion.span
                      whileHover={{ y: -2 }}
                      className="inline-block"
                    >
                      {category.name}
                    </motion.span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawers e Dropdowns personalizados */}
      <CarrinhoDrawer 
        isOpen={carrinhoOpen} 
        onClose={() => setCarrinhoOpen(false)} 
      />

      <FavoritosDrawer
        isOpen={favoritosOpen}
        onClose={() => setFavoritosOpen(false)}
      />

      <NotificacoesDrawer
        isOpen={notificacoesOpen}
        onClose={() => setNotificacoesOpen(false)}
        notificacoes={notificacoes as any} // Casting temporário para resolver problema de tipagem
        onMarcarComoLida={handleMarcarNotificacaoLida}
        onMarcarTodasComoLidas={handleMarcarTodasNotificacoesLidas}
      />
    </header>
  );
}
