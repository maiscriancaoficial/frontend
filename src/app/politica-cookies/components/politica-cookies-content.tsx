'use client';

import { motion } from 'framer-motion';
import { 
  Cookie, 
  Settings, 
  BarChart3, 
  Target,
  Shield,
  CheckCircle,
  X,
  Calendar,
  Clock,
  Info,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function PoliticaCookiesContent() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    personalization: true
  });

  const cookieTypes = [
    {
      id: 'essential',
      icon: Shield,
      title: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      required: true,
      examples: ['Sessão de login', 'Carrinho de compras', 'Preferências de idioma']
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Cookies de Análise',
      description: 'Nos ajudam a entender como você usa nosso site',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      required: false,
      examples: ['Google Analytics', 'Tempo de permanência', 'Páginas visitadas']
    },
    {
      id: 'marketing',
      icon: Target,
      title: 'Cookies de Marketing',
      description: 'Utilizados para personalizar anúncios e ofertas',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10',
      required: false,
      examples: ['Facebook Pixel', 'Google Ads', 'Remarketing']
    },
    {
      id: 'personalization',
      icon: Settings,
      title: 'Cookies de Personalização',
      description: 'Lembram suas preferências e configurações',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10',
      required: false,
      examples: ['Tema escolhido', 'Produtos favoritos', 'Configurações de conta']
    }
  ];

  const toggleCookie = (id: string) => {
    if (id === 'essential') return; // Não pode desabilitar essenciais
    
    setCookieSettings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 mb-6">
              <Cookie className="w-4 h-4 text-[#ff0080]" />
              <span className="text-sm font-medium text-gray-700">Política de Cookies</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Política de{' '}
              <span className="text-[#ff0080]">
                Cookies
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Entenda como utilizamos cookies para melhorar sua experiência 
              de navegação em nosso site! 🍪
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Atualizada: Janeiro 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Leitura: ~5 minutos</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* What are Cookies */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Info className="w-6 h-6 text-[#27b99a]" />
                O que são Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo 
                quando você visita nosso site. Eles nos ajudam a lembrar de suas preferências, 
                melhorar sua experiência de navegação e fornecer funcionalidades personalizadas.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Seguros</h4>
                    <p className="text-sm text-gray-600">Não podem executar programas ou transmitir vírus</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Temporários</h4>
                    <p className="text-sm text-gray-600">Têm data de expiração e podem ser removidos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Úteis</h4>
                    <p className="text-sm text-gray-600">Melhoram significativamente sua experiência</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Controláveis</h4>
                    <p className="text-sm text-gray-600">Você pode gerenciar suas preferências</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tipos de Cookies que Utilizamos
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {cookieTypes.map((type, index) => {
              const IconComponent = type.icon;
              const isEnabled = cookieSettings[type.id as keyof typeof cookieSettings];
              
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${type.bgColor} rounded-2xl flex items-center justify-center`}>
                            <IconComponent className={`w-6 h-6 ${type.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                              {type.title}
                            </CardTitle>
                            {type.required && (
                              <Badge className="bg-green-100 text-green-700 mt-1">
                                Obrigatório
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {!type.required && (
                          <button
                            onClick={() => toggleCookie(type.id)}
                            className="flex items-center gap-2 text-sm"
                          >
                            {isEnabled ? (
                              <ToggleRight className="w-8 h-8 text-[#27b99a]" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-gray-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {type.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Exemplos:</h4>
                        {type.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span className="text-sm text-gray-600">{example}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#ff0080]/5 via-white to-[#27b99a]/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Como Gerenciar Cookies
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-[#27b99a]" />
                  No Navegador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#27b99a] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Acesse as configurações do seu navegador</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#27b99a] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Procure por "Cookies" ou "Privacidade"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#27b99a] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Escolha suas preferências de cookies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[#ff0080]" />
                  No Nosso Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#27b99a] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Use o banner de cookies que aparece</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#27b99a] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Acesse "Configurações de Cookies"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#27b99a] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Personalize suas preferências</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Card className="border-2 border-[#ff0080]/20 bg-[#ff0080]/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trash2 className="w-6 h-6 text-[#ff0080]" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Limpar Cookies Existentes
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Você pode remover todos os cookies já armazenados no seu dispositivo 
                  através das configurações do navegador.
                </p>
                <Button className="bg-[#ff0080] hover:bg-[#e6007a] text-white rounded-2xl">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Como Limpar Cookies
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Cookie className="w-12 h-12 text-[#ff0080] mx-auto mb-4" />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dúvidas sobre Cookies?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Nossa equipe está pronta para esclarecer qualquer questão sobre cookies
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#27b99a] hover:bg-[#22a085] text-white px-8 py-3 rounded-2xl">
              <Settings className="w-5 h-5 mr-2" />
              Configurar Cookies
            </Button>
            
            <Button variant="outline" className="border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 px-8 py-3 rounded-2xl">
              <Info className="w-5 h-5 mr-2" />
              Mais Informações
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
