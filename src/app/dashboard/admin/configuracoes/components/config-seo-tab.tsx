'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Globe, 
  Search, 
  Code,
  Save,
  Tag,
  BarChart2,
  Share2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function ConfigSeoTab() {
  // Estado para configurações de SEO básico
  const [metaTitle, setMetaTitle] = useState('Mais criança - Flores e Presentes Online');
  const [metaDescription, setMetaDescription] = useState('Compre flores frescas, arranjos, buquês e presentes online. Entrega rápida em todo o Brasil. Floricultura com os melhores preços.');
  const [metaKeywords, setMetaKeywords] = useState('floricultura, flores, buquê, arranjos, presentes, flores online');
  const [urlCanonica, setUrlCanonica] = useState('https://maiscrianca.com.br');
  const [imgSocial, setImgSocial] = useState('/images/social-share.jpg');
  
  // Estado para configurações avançadas de SEO
  const [sitemapAtivo, setSitemapAtivo] = useState(true);
  const [robotsTxtAtivo, setRobotsTxtAtivo] = useState(true);
  const [compressionAtiva, setCompressionAtiva] = useState(true);
  const [sslForce, setSslForce] = useState(true);
  const [indexacao, setIndexacao] = useState(true);
  
  // Estado para integrações de análise
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleTagManager, setGoogleTagManager] = useState('');
  const [facebookPixel, setFacebookPixel] = useState('');
  
  // Estado para código personalizado
  const [headerCode, setHeaderCode] = useState('');
  const [footerCode, setFooterCode] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configurações de SEO salvas');
    // Aqui implementaria a lógica para salvar no banco
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basico" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="basico" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Search className="h-4 w-4 mr-2" />
            Básico
          </TabsTrigger>
          <TabsTrigger value="avancado" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Code className="h-4 w-4 mr-2" />
            Avançado
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
            <Share2 className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basico">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Meta Tags Básicas</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure as meta tags principais para melhorar o SEO do seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title" className="text-gray-700 dark:text-gray-300">
                  Meta Title <span className="text-pink-500">*</span>
                </Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  required
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Recomendado: 50-60 caracteres</span>
                  <span className={`${metaTitle.length > 60 ? 'text-red-500' : ''}`}>{metaTitle.length}/60</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description" className="text-gray-700 dark:text-gray-300">
                  Meta Description <span className="text-pink-500">*</span>
                </Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  rows={3}
                  required
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Recomendado: 120-155 caracteres</span>
                  <span className={`${metaDescription.length > 155 ? 'text-red-500' : ''}`}>{metaDescription.length}/155</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-keywords" className="text-gray-700 dark:text-gray-300">
                  Meta Keywords
                </Label>
                <Textarea
                  id="meta-keywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  rows={2}
                  placeholder="Separe as palavras-chave por vírgulas"
                />
                <p className="text-xs text-gray-500">
                  Palavras-chave separadas por vírgulas. Tenha em mente que o uso de meta keywords tem menos relevância nos buscadores modernos.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metaKeywords.split(',').map((keyword, index) => (
                    keyword.trim() && (
                      <Badge key={index} className="bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-200">
                        {keyword.trim()}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url-canonica" className="text-gray-700 dark:text-gray-300">
                  URL Canônica
                </Label>
                <Input
                  id="url-canonica"
                  value={urlCanonica}
                  onChange={(e) => setUrlCanonica(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  placeholder="https://seusite.com"
                />
                <p className="text-xs text-gray-500">
                  A URL canônica ajuda a evitar conteúdo duplicado informando aos mecanismos de busca qual URL é a "oficial".
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="avancado">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Configurações Avançadas</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure opções avançadas de SEO para seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="sitemap-ativo" className="font-medium text-gray-700 dark:text-gray-300">
                    Sitemap Automático
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gera automaticamente um sitemap XML para indexação em buscadores
                  </p>
                </div>
                <Switch 
                  id="sitemap-ativo" 
                  checked={sitemapAtivo} 
                  onCheckedChange={setSitemapAtivo}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="robots-ativo" className="font-medium text-gray-700 dark:text-gray-300">
                    Robots.txt Personalizado
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gera um arquivo robots.txt para controlar o acesso de bots ao site
                  </p>
                </div>
                <Switch 
                  id="robots-ativo" 
                  checked={robotsTxtAtivo} 
                  onCheckedChange={setRobotsTxtAtivo}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="ssl-force" className="font-medium text-gray-700 dark:text-gray-300">
                    Forçar HTTPS
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Redireciona automaticamente HTTP para HTTPS
                  </p>
                </div>
                <Switch 
                  id="ssl-force" 
                  checked={sslForce} 
                  onCheckedChange={setSslForce}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="compressao-ativa" className="font-medium text-gray-700 dark:text-gray-300">
                    Compressão GZIP
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprime recursos para carregamento mais rápido
                  </p>
                </div>
                <Switch 
                  id="compressao-ativa" 
                  checked={compressionAtiva} 
                  onCheckedChange={setCompressionAtiva}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-[10px] border border-gray-200 dark:border-gray-800">
                <div>
                  <Label htmlFor="indexacao" className="font-medium text-gray-700 dark:text-gray-300">
                    Permitir Indexação
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permite que mecanismos de busca indexem seu site
                  </p>
                </div>
                <Switch 
                  id="indexacao" 
                  checked={indexacao} 
                  onCheckedChange={setIndexacao}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
              
              {!indexacao && (
                <div className="p-3 rounded-[10px] bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-300">
                  <p className="text-sm font-medium">
                    Atenção: Seu site não será indexado pelos mecanismos de busca enquanto essa opção estiver desativada.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm mt-6">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Código Personalizado</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Adicione código personalizado no cabeçalho ou rodapé do site
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="header-code" className="text-gray-700 dark:text-gray-300">
                  Código no Cabeçalho (head)
                </Label>
                <Textarea
                  id="header-code"
                  value={headerCode}
                  onChange={(e) => setHeaderCode(e.target.value)}
                  className="font-mono text-sm border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  rows={4}
                  placeholder="<!-- Insira códigos para o cabeçalho aqui (meta tags, scripts) -->"
                />
                <p className="text-xs text-gray-500">
                  Este código será inserido dentro da tag &lt;head&gt; do site. Use para adicionar meta tags ou scripts personalizados.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footer-code" className="text-gray-700 dark:text-gray-300">
                  Código no Rodapé (antes do fechamento body)
                </Label>
                <Textarea
                  id="footer-code"
                  value={footerCode}
                  onChange={(e) => setFooterCode(e.target.value)}
                  className="font-mono text-sm border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  rows={4}
                  placeholder="<!-- Insira códigos para o rodapé aqui (scripts, widgets) -->"
                />
                <p className="text-xs text-gray-500">
                  Este código será inserido antes do fechamento da tag &lt;/body&gt;. Use para adicionar scripts de rastreamento ou widgets.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Ferramentas de Análise</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure ferramentas de rastreamento e análise para seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-analytics" className="text-gray-700 dark:text-gray-300">
                  Google Analytics ID (GA4)
                </Label>
                <Input
                  id="google-analytics"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-gray-500">
                  Insira seu ID do Google Analytics 4 (formato G-XXXXXXXXXX).
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="google-tag-manager" className="text-gray-700 dark:text-gray-300">
                  Google Tag Manager
                </Label>
                <Input
                  id="google-tag-manager"
                  value={googleTagManager}
                  onChange={(e) => setGoogleTagManager(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  placeholder="GTM-XXXXXXX"
                />
                <p className="text-xs text-gray-500">
                  Insira seu ID do Google Tag Manager (formato GTM-XXXXXXX).
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebook-pixel" className="text-gray-700 dark:text-gray-300">
                  Facebook Pixel
                </Label>
                <Input
                  id="facebook-pixel"
                  value={facebookPixel}
                  onChange={(e) => setFacebookPixel(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  placeholder="XXXXXXXXXXXXXXXXXX"
                />
                <p className="text-xs text-gray-500">
                  Insira seu ID do Facebook Pixel para rastrear conversões.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Share2 className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Compartilhamento Social</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure como seu site aparece quando compartilhado nas redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="og-title" className="text-gray-700 dark:text-gray-300">
                  Título para Compartilhamento (og:title)
                </Label>
                <Input
                  id="og-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                />
                <p className="text-xs text-gray-500">
                  Este título será usado quando seu site for compartilhado nas redes sociais.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="og-description" className="text-gray-700 dark:text-gray-300">
                  Descrição para Compartilhamento (og:description)
                </Label>
                <Textarea
                  id="og-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Esta descrição será usada quando seu site for compartilhado nas redes sociais.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="og-image" className="text-gray-700 dark:text-gray-300">
                  Imagem para Compartilhamento (og:image)
                </Label>
                <div className="border border-gray-300 dark:border-gray-700 rounded-[10px] p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-center">
                    {imgSocial ? (
                      <div className="relative">
                        <img 
                          src={imgSocial} 
                          alt="Imagem para compartilhamento" 
                          className="max-h-36 rounded-[10px]"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => setImgSocial('')}
                        >
                          <span className="sr-only">Remover</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Label 
                          htmlFor="image-upload" 
                          className="cursor-pointer inline-block bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-[10px] text-sm"
                        >
                          Escolher Imagem
                        </Label>
                        <input 
                          id="image-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setImgSocial(e.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Tamanho recomendado: 1200x630 pixels
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Esta imagem será exibida quando seu conteúdo for compartilhado em redes sociais. Para melhores resultados, use uma imagem com proporção 1.91:1.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[10px] p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visualização Prévia (Facebook)
                </h3>
                <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-[10px] overflow-hidden shadow-sm">
                  <div className="p-2 bg-gray-100 dark:bg-gray-900">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full mr-2"></div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Mais criança</p>
                        <p className="text-xs text-gray-500">há 2 horas</p>
                      </div>
                    </div>
                  </div>
                  {imgSocial ? (
                    <div className="h-44 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img 
                        src={imgSocial} 
                        alt="Imagem para compartilhamento" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Imagem para compartilhamento</p>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                      {metaTitle || 'Título para compartilhamento'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {metaDescription || 'Descrição para compartilhamento nas redes sociais...'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {urlCanonica || 'maiscrianca.com.br'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-[10px] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Configurações SEO
        </Button>
      </div>
    </form>
  );
}
