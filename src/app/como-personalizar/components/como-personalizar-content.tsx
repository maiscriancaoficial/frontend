'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Upload, 
  Edit3,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Image,
  Type,
  Sparkles,
  Heart,
  Star,
  Gift,
  Clock,
  Shield,
  Zap,
  Users,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Target,
  Award,
  Camera,
  Layers,
  Brush,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-3, 3, -3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function ComoPersonalizarContent() {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      number: 1,
      title: 'Escolha seu Produto',
      description: 'Selecione o produto que deseja personalizar em nosso catálogo',
      icon: Gift,
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10',
      details: [
        'Navegue por nossa coleção de produtos personalizáveis',
        'Escolha o tamanho e modelo ideal',
        'Visualize as opções de personalização disponíveis',
        'Adicione o produto ao carrinho'
      ]
    },
    {
      number: 2,
      title: 'Envie sua Arte',
      description: 'Faça upload da imagem, texto ou design que deseja aplicar',
      icon: Upload,
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10',
      details: [
        'Formatos aceitos: PNG, JPG, PDF, AI, PSD',
        'Resolução mínima: 300 DPI',
        'Tamanho máximo: 50MB por arquivo',
        'Ou use nosso editor online integrado'
      ]
    },
    {
      number: 3,
      title: 'Personalize o Design',
      description: 'Use nosso editor para ajustar cores, textos e posicionamento',
      icon: Edit3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      details: [
        'Editor visual intuitivo e fácil de usar',
        'Ajuste tamanho, posição e rotação',
        'Escolha entre centenas de fontes',
        'Preview em tempo real do resultado'
      ]
    },
    {
      number: 4,
      title: 'Aprovação Final',
      description: 'Revise o design final e aprove para produção',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      details: [
        'Visualização 3D do produto final',
        'Confirmação de todas as especificações',
        'Aprovação digital do cliente',
        'Início imediato da produção'
      ]
    }
  ];

  const tools = [
    {
      icon: Type,
      title: 'Editor de Texto',
      description: 'Adicione textos personalizados com centenas de fontes',
      features: ['200+ fontes', 'Cores ilimitadas', 'Efeitos especiais']
    },
    {
      icon: Image,
      title: 'Upload de Imagens',
      description: 'Envie suas próprias fotos e ilustrações',
      features: ['Alta resolução', 'Múltiplos formatos', 'Edição integrada']
    },
    {
      icon: Palette,
      title: 'Paleta de Cores',
      description: 'Escolha entre milhões de cores e gradientes',
      features: ['Cores personalizadas', 'Paletas prontas', 'Combinações harmônicas']
    },
    {
      icon: Layers,
      title: 'Sistema de Camadas',
      description: 'Organize elementos em camadas para maior controle',
      features: ['Múltiplas camadas', 'Transparência', 'Efeitos de sobreposição']
    }
  ];

  const tips = [
    {
      icon: Lightbulb,
      title: 'Dica de Qualidade',
      content: 'Use imagens com pelo menos 300 DPI para garantir a melhor qualidade de impressão.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Target,
      title: 'Posicionamento',
      content: 'Centralize elementos importantes e deixe margens de segurança nas bordas.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Direitos Autorais',
      content: 'Use apenas imagens próprias ou com licença para evitar problemas legais.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Award,
      title: 'Resultado Profissional',
      content: 'Nossa equipe revisa cada design para garantir o melhor resultado final.',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10'
    }
  ];

  const examples = [
    {
      title: 'Camiseta Personalizada',
      description: 'Nome da criança com desenho fofo',
      image: '/examples/camiseta.jpg',
      category: 'Roupas'
    },
    {
      title: 'Caneca Mágica',
      description: 'Foto que aparece com líquido quente',
      image: '/examples/caneca.jpg',
      category: 'Casa'
    },
    {
      title: 'Livro Personalizado',
      description: 'Criança como protagonista da história',
      image: '/examples/livro.jpg',
      category: 'Livros'
    },
    {
      title: 'Quebra-Cabeça',
      description: 'Foto da família em puzzle',
      image: '/examples/puzzle.jpg',
      category: 'Brinquedos'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-20 h-20 bg-[#ff0080]/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute top-40 right-20 w-32 h-32 bg-[#27b99a]/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/3 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Palette className="w-4 h-4 text-[#27b99a]" />
              <span className="text-sm font-medium text-gray-700">Tutorial Completo</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Como{' '}
              <span className="text-[#ff0080]">
                Personalizar
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Aprenda passo a passo como criar produtos únicos e especiais. 
              É mais fácil do que você imagina! ✨
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#ff0080] hover:bg-[#e6007a] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Ver Tutorial
              </Button>
              
              <Button variant="outline" className="border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 px-8 py-3 rounded-2xl font-medium">
                <BookOpen className="w-5 h-5 mr-2" />
                Guia Completo
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Steps Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              4 Passos Simples
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Siga nosso processo otimizado para criar produtos personalizados perfeitos
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Steps Navigation */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = activeStep === step.number;
                
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => setActiveStep(step.number)}
                    className="cursor-pointer"
                  >
                    <Card className={`border-2 transition-all duration-300 hover:shadow-lg ${
                      isActive 
                        ? 'border-[#27b99a] bg-[#27b99a]/5' 
                        : 'border-gray-100 hover:border-[#27b99a]/30'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${step.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className={`w-6 h-6 ${step.color}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-gray-100 text-gray-700">
                                Passo {step.number}
                              </Badge>
                              {isActive && (
                                <Badge className="bg-[#27b99a] text-white">
                                  Ativo
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {step.title}
                            </h3>
                            <p className="text-gray-600">
                              {step.description}
                            </p>
                          </div>
                          
                          <ArrowRight className={`w-5 h-5 transition-colors ${
                            isActive ? 'text-[#27b99a]' : 'text-gray-400'
                          }`} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Step Details */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-gray-100 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-16 h-16 ${steps[activeStep - 1].bgColor} rounded-2xl flex items-center justify-center`}>
                      {React.createElement(steps[activeStep - 1].icon, {
                        className: `w-8 h-8 ${steps[activeStep - 1].color}`
                      })}
                    </div>
                    <div>
                      <Badge className="bg-[#27b99a] text-white mb-2">
                        Passo {activeStep} de 4
                      </Badge>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {steps[activeStep - 1].title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-6 text-lg">
                    {steps[activeStep - 1].description}
                  </p>
                  
                  <div className="space-y-3">
                    {steps[activeStep - 1].details.map((detail, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    {activeStep > 1 && (
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveStep(activeStep - 1)}
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Anterior
                      </Button>
                    )}
                    
                    {activeStep < 4 && (
                      <Button 
                        onClick={() => setActiveStep(activeStep + 1)}
                        className="bg-[#27b99a] hover:bg-[#22a085] text-white"
                      >
                        Próximo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#27b99a]/5 via-white to-[#ff0080]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ferramentas Disponíveis
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nosso editor possui todas as ferramentas que você precisa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <motion.div 
                        className="w-16 h-16 bg-[#27b99a]/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="w-8 h-8 text-[#27b99a]" />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {tool.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {tool.description}
                      </p>
                      
                      <div className="space-y-2">
                        {tool.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#27b99a]" />
                            <span className="text-sm text-gray-600">{feature}</span>
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

      {/* Tips Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Dicas Importantes
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Siga essas dicas para obter os melhores resultados
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${tip.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-6 h-6 ${tip.color}`} />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {tip.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {tip.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Exemplos de Personalização
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Veja alguns exemplos do que você pode criar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="overflow-hidden border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-[#ff0080]/10 to-[#27b99a]/10 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <CardContent className="p-4">
                    <Badge className="bg-[#27b99a]/10 text-[#27b99a] mb-2">
                      {example.category}
                    </Badge>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {example.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      {example.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-r from-[#ff0080]/5 via-white to-[#27b99a]/5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="w-12 h-12 text-[#ff0080] mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pronto para Começar?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie produtos únicos e especiais agora mesmo. 
            É mais fácil do que você imagina! 🎨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#ff0080] hover:bg-[#e6007a] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <Palette className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
            
            <Button variant="outline" className="border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 px-8 py-3 rounded-2xl font-medium">
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com Especialista
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
