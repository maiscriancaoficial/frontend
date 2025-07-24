'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListaBanners } from './components/lista-banners';
import { FiltroBanners } from './components/filtro-banners';
import { ModalBanner } from './components/modal-banner';
import { toast } from 'sonner';

// Interface para dados do banner
export interface BannerDados {
  id: string;
  titulo: string;
  descricao?: string;
  fotoDesktop: string;
  fotoMobile?: string;
  ordem: number;
  ativo: boolean;
  botao1Label?: string;
  botao1Link?: string;
  botao1Cor?: string;
  botao1CorFonte?: string;
  botao1Tamanho?: string;
  botao2Label?: string;
  botao2Link?: string;
  botao2Cor?: string;
  botao2CorFonte?: string;
  botao2Tamanho?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerDados[]>([]);
  const [bannerParaEditar, setBannerParaEditar] = useState<BannerDados | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  // Carregar banners da API
  const carregarBanners = async () => {
    try {
      setCarregando(true);
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data.map((banner: any) => ({
          ...banner,
          createdAt: new Date(banner.createdAt),
          updatedAt: new Date(banner.updatedAt)
        })));
      } else {
        toast.error('Erro ao carregar banners');
      }
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
      toast.error('Erro ao carregar banners');
    } finally {
      setCarregando(false);
    }
  };

  // Carregar banners ao montar o componente
  useEffect(() => {
    carregarBanners();
  }, []);
  
  // Banners filtrados com base no texto de busca
  const bannersFiltrados = banners.filter(banner => 
    banner.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
    (banner.descricao && banner.descricao.toLowerCase().includes(filtroTexto.toLowerCase()))
  );

  // Funções para manipulação de banners
  const handleNovoBanner = () => {
    setBannerParaEditar(null);
    setModalAberto(true);
  };

  const handleEditarBanner = (banner: BannerDados) => {
    setBannerParaEditar(banner);
    setModalAberto(true);
  };

  const handleAlterarStatus = async (id: string) => {
    try {
      const banner = banners.find(b => b.id === id);
      if (!banner) return;

      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banner,
          ativo: !banner.ativo
        }),
      });

      if (response.ok) {
        await carregarBanners();
        toast.success(`Banner ${!banner.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      } else {
        toast.error('Erro ao alterar status do banner');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do banner');
    }
  };

  const handleExcluirBanner = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) {
      return;
    }

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarBanners();
        toast.success('Banner excluído com sucesso!');
      } else {
        toast.error('Erro ao excluir banner');
      }
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      toast.error('Erro ao excluir banner');
    }
  };

  const handleSalvarBanner = async (bannerData: Omit<BannerDados, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setSalvando(true);
      
      if (bannerParaEditar) {
        // Atualizar banner existente
        const response = await fetch(`/api/banners/${bannerParaEditar.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        });

        if (response.ok) {
          await carregarBanners();
          toast.success('Banner atualizado com sucesso!');
          setModalAberto(false);
        } else {
          toast.error('Erro ao atualizar banner');
        }
      } else {
        // Criar novo banner
        const response = await fetch('/api/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        });

        if (response.ok) {
          await carregarBanners();
          toast.success('Banner criado com sucesso!');
          setModalAberto(false);
        } else {
          toast.error('Erro ao criar banner');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      toast.error('Erro ao salvar banner');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Banners</h2>
            <p className="text-gray-500 dark:text-gray-400">Gerencie os banners do carrossel da página inicial</p>
          </div>
        </div>
        
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff9898] mb-4" />
            <h3 className="text-lg font-medium mb-1">Carregando banners...</h3>
            <p className="text-gray-500 dark:text-gray-400">Aguarde um momento</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Banners</h2>
          <p className="text-gray-500 dark:text-gray-400">Gerencie os banners do carrossel da página inicial</p>
        </div>
        
        <Button
          onClick={handleNovoBanner}
          disabled={salvando}
          className="flex items-center gap-2 rounded-3xl bg-gradient-to-r from-[#ff9898] to-[#ff0080] hover:from-[#ff7878] hover:to-[#e6006b] transition-all shadow-md hover:shadow-lg"
        >
          {salvando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle size={16} />
          )}
          <span>Novo Banner</span>
        </Button>
      </div>
      
      {/* Estatísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Banners</CardTitle>
            <ImageIcon className="h-4 w-4 text-[#ff9898]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {banners.filter(b => b.ativo).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banners Ativos</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.filter(b => b.ativo).length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Visíveis no site
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banners Inativos</CardTitle>
            <div className="h-4 w-4 rounded-full bg-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.filter(b => !b.ativo).length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ocultos do site
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtro de busca */}
      <FiltroBanners onBuscar={setFiltroTexto} />
      
      {/* Lista de banners */}
      {banners.length === 0 ? (
        <Card className="rounded-3xl border border-gray-100 dark:border-gray-800">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-full mb-4">
              <ImageIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">Nenhum banner cadastrado</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Adicione banners para exibir no carrossel da página inicial</p>
            <Button onClick={handleNovoBanner} variant="outline" className="rounded-3xl">
              Criar primeiro banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ListaBanners 
          banners={bannersFiltrados} 
          onEditar={handleEditarBanner}
          onAlterarStatus={handleAlterarStatus}
          onExcluir={handleExcluirBanner}
        />
      )}
      
      {/* Modal de criação/edição */}
      <ModalBanner 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        bannerParaEditar={bannerParaEditar} 
        onSalvar={handleSalvarBanner}
        salvando={salvando}
      />
    </div>
  );
}
