'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Sparkles, 
  Heart, 
  Star,
  Brush,
  Scissors,
  Gift,
  Camera,
  Type,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Zap,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

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
    rotate: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function PersonalizacaoContent() {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const personalizationServices = [
    {
      icon: Type,
      title: 'Nome Personalizado',
      description: 'Adicione o nome da criança em produtos especiais',
      features: ['Bordado premium', 'Várias fontes', 'Cores vibrantes'],
      price: 'A partir de R$ 15',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10',
      borderColor: 'border-[#ff0080]/20',
      popular: false
    },
    {
      icon: ImageIcon,
      title: 'Foto Personalizada',
      description: 'Transforme fotos em estampas únicas e especiais',
      features: ['Alta qualidade', 'Impressão durável', 'Acabamento premium'],
      price: 'A partir de R$ 25',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10',
      borderColor: 'border-[#27b99a]/20',
      popular: true
    },
    {
      icon: Palette,
      title: 'Design Exclusivo',
      description: 'Criamos designs únicos baseados nas suas ideias',
      features: ['Design original', 'Aprovação prévia', 'Ilimitadas revisões'],
      price: 'A partir de R$ 35',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: false
    }
  ];

  const productCategories = [
    {
      title: 'Roupinhas',
      items: ['Camisetas', 'Vestidos', 'Macacões', 'Pijamas'],
      icon: '👕',
      color: 'from-pink-100 to-pink-200'
    },
    {
      title: 'Acessórios',
      items: ['Bonés', 'Mochilas', 'Necessaires', 'Babadores'],
      icon: '🎒',
      color: 'from-blue-100 to-blue-200'
    },
    {
      title: 'Decoração',
      items: ['Quadros', 'Almofadas', 'Adesivos', 'Luminárias'],
      icon: '🖼️',
      color: 'from-green-100 to-green-200'
    },
    {
      title: 'Brinquedos',
      items: ['Pelúcias', 'Quebra-cabeças', 'Jogos', 'Livros'],
      icon: '🧸',
      color: 'from-yellow-100 to-yellow-200'
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Escolha o Produto',
      description: 'Selecione o item que deseja personalizar',
      icon: Gift,
      color: 'text-[#ff0080]'
    },
    {
      step: 2,
      title: 'Envie sua Ideia',
      description: 'Compartilhe fotos, textos ou desenhos',
      icon: Camera,
      color: 'text-blue-500'
    },
    {
      step: 3,
      title: 'Aprovação',
      description: 'Revisamos e enviamos prévia para aprovação',
      icon: CheckCircle,
      color: 'text-[#27b99a]'
    },
    {
      step: 4,
      title: 'Produção',
      description: 'Criamos seu produto com todo carinho',
      icon: Sparkles,
      color: 'text-purple-500'
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Qualidade Premium',
      description: 'Materiais de alta qualidade e acabamento perfeito'
    },
    {
      icon: Zap,
      title: 'Entrega Rápida',
      description: 'Produção em até 5 dias úteis'
    },
    {
      icon: Heart,
      title: 'Feito com Amor',
      description: 'Cada peça é criada com carinho e dedicação'
    },
    {
      icon: Crown,
      title: 'Exclusividade',
      description: 'Produtos únicos que só sua criança terá'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30">
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
            className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"
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
              <Sparkles className="w-4 h-4 text-[#ff0080]" />
              <span className="text-sm font-medium text-gray-700">Produtos Únicos</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#ff0080] to-[#27b99a] bg-clip-text text-transparent">
                Personalização
              </span>{' '}
              Especial
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Criamos produtos únicos e especiais para sua criança. 
              Cada peça é feita com amor e carinho! ✨
            </p>
          </motion.div>

          {/* Services */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-16"
            variants={itemVariants}
          >
            {personalizationServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setSelectedService(selectedService === index ? null : index)}
                  className="cursor-pointer"
                >
                  <Card className={`h-full border-2 ${service.borderColor} hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm relative overflow-hidden`}>
                    {service.popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-[#ff0080] to-[#e6007a] text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <motion.div 
                        className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className={`w-8 h-8 ${service.color}`} />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                        {service.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 text-center">
                        {service.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#27b99a]" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          {service.price}
                        </span>
                      </div>
                      
                      <Button 
                        className={`w-full bg-gradient-to-r ${
                          service.color.includes('27b99a') 
                            ? 'from-[#27b99a] to-[#22a085]' 
                            : service.color.includes('ff0080')
                            ? 'from-[#ff0080] to-[#e6007a]'
                            : 'from-blue-500 to-blue-600'
                        } hover:shadow-lg transition-all duration-300 rounded-2xl`}
                      >
                        Escolher Serviço
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Product Categories */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produtos que Personalizamos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha entre centenas de produtos para criar algo único e especial
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl`}>
                      {category.icon}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {category.title}
                    </h3>
                    
                    <div className="space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm text-gray-600 py-1">
                          {item}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-gray-200 hover:bg-gray-50 rounded-2xl"
                    >
                      Ver Produtos
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Processo simples e transparente para criar produtos únicos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent transform translate-x-4" />
                  )}
                  
                  <motion.div 
                    className="w-24 h-24 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-full" />
                    <IconComponent className={`w-10 h-10 ${step.color} relative z-10`} />
                  </motion.div>
                  
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-[#ff0080] to-[#27b99a] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#27b99a]/5 via-white to-[#ff0080]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que Escolher Nossa Personalização?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm text-center">
                    <CardContent className="p-6">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="w-8 h-8 text-[#27b99a]" />
                      </motion.div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4"
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
            Pronto para Criar Algo Único?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Comece agora a personalizar produtos especiais para sua criança. 
            Cada peça é única como ela! 🌟
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#ff0080] to-[#e6007a] hover:from-[#e6007a] hover:to-[#cc006e] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <Palette className="w-5 h-5 mr-2" />
              Começar Personalização
            </Button>
            
            <Button variant="outline" className="border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 px-8 py-3 rounded-2xl font-medium">
              <Gift className="w-5 h-5 mr-2" />
              Ver Exemplos
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
