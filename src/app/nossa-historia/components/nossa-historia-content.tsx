'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  Baby, 
  Gift, 
  Users, 
  Award,
  Calendar,
  Lightbulb,
  Sparkles,
  Crown,
  Rocket,
  Globe,
  Shield,
  BookOpen,
  Camera,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export function NossaHistoriaContent() {
  const milestones = [
    {
      year: '2019',
      title: 'O Sonho Nasce',
      description: 'Ana Silva, mãe de dois filhos, teve a ideia de criar produtos únicos após não encontrar nada especial para o aniversário de sua filha.',
      icon: Lightbulb,
      color: 'bg-yellow-500'
    },
    {
      year: '2020',
      title: 'Expansão Digital',
      description: 'Lançamento do primeiro site e sistema de personalização online, facilitando o processo para os clientes.',
      icon: Globe,
      color: 'bg-blue-500'
    },
    {
      year: '2021',
      title: 'Reconhecimento Nacional',
      description: 'Fomos destaque em revistas especializadas e ganhamos nosso primeiro prêmio de inovação em produtos infantis.',
      icon: Award,
      color: 'bg-orange-500'
    },
    {
      year: '2022',
      title: 'Expansão Nacional',
      description: 'Começamos a entregar em todo o Brasil e abrimos nosso centro de distribuição próprio.',
      icon: Rocket,
      color: 'bg-purple-500'
    },
    {
      year: '2023',
      title: 'Tecnologia Avançada',
      description: 'Implementamos IA para sugestões de personalização e realidade aumentada para preview dos produtos.',
      icon: Zap,
      color: 'bg-indigo-500'
    },
    {
      year: '2024',
      title: 'Futuro Brilhante',
      description: 'Hoje somos referência em personalização infantil, com planos de expansão internacional.',
      icon: Crown,
      color: 'bg-[#ff0080]'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Amor em Cada Detalhe',
      description: 'Cada produto é criado com o mesmo carinho que dedicaríamos aos nossos próprios filhos.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Star,
      title: 'Qualidade Excepcional',
      description: 'Nunca comprometemos a qualidade. Cada produto passa por rigorosos testes.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Users,
      title: 'Família em Primeiro Lugar',
      description: 'Acreditamos que momentos em família são os mais preciosos.',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10'
    },
    {
      icon: Sparkles,
      title: 'Inovação Constante',
      description: 'Sempre buscamos novas formas de encantar e surpreender.',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10'
    }
  ];

  const achievements = [
    { icon: Users, number: '50.000+', label: 'Famílias Atendidas' },
    { icon: Gift, number: '200.000+', label: 'Produtos Entregues' },
    { icon: Star, number: '4.9/5', label: 'Avaliação dos Clientes' },
    { icon: Award, number: '15+', label: 'Prêmios Recebidos' }
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
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="w-4 h-4 text-[#27b99a]" />
              <span className="text-sm font-medium text-gray-700">Nossa Jornada</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Nossa{' '}
              <span className="text-[#ff0080]">
                História
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Uma jornada de 5 anos criando momentos especiais para famílias brasileiras. 
              Conheça como tudo começou! 📖
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#ff0080] hover:bg-[#e6007a] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline Completa
              </Button>
              
              <Button variant="outline" className="border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 px-8 py-3 rounded-2xl font-medium">
                <Heart className="w-5 h-5 mr-2" />
                Nossa Missão
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <IconComponent className="w-8 h-8 text-[#ff0080] mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{achievement.number}</h3>
                    <p className="text-sm text-gray-600">{achievement.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Section */}
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
              Timeline da Jornada
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada marco representa nosso crescimento e dedicação às famílias brasileiras
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#ff0080] via-[#27b99a] to-[#ff0080] rounded-full opacity-20"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`w-full max-w-lg ${isEven ? 'pr-8' : 'pl-8'}`}>
                      <Card className="border-2 border-gray-100 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 ${milestone.color} rounded-2xl flex items-center justify-center`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <Badge className="bg-gray-100 text-gray-700 mb-2">
                                {milestone.year}
                              </Badge>
                              <CardTitle className="text-2xl font-bold text-gray-900">
                                {milestone.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 ${milestone.color} rounded-full border-4 border-white shadow-lg z-10`}></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
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
              Nossa Fundadora
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça a pessoa por trás de tudo isso
            </p>
          </motion.div>

          <Card className="max-w-4xl mx-auto border-2 border-gray-100 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <motion.div 
                    className="w-64 h-64 mx-auto bg-gradient-to-br from-[#ff0080] to-[#27b99a] rounded-3xl flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Camera className="w-16 h-16 text-white" />
                  </motion.div>
                  
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#27b99a] rounded-2xl flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div>
                  <Badge className="bg-[#ff0080]/10 text-[#ff0080] mb-4">
                    Fundadora & CEO
                  </Badge>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    Ana Silva
                  </h3>
                  
                  <p className="text-[#27b99a] font-medium mb-4">
                    Fundadora & CEO
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Mãe de dois filhos lindos, pedagoga por formação e empreendedora por paixão. Ana sempre acreditou que cada criança merece se sentir especial e única.
                  </p>
                  
                  <blockquote className="border-l-4 border-[#ff0080] pl-4 mb-6">
                    <p className="text-lg italic text-gray-700">
                      "Acredito que cada criança tem uma luz única, e nosso papel é ajudar essa luz a brilhar ainda mais forte."
                    </p>
                  </blockquote>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-[#27b99a]" />
                      <span className="text-gray-700">Pedagoga formada pela USP</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-[#27b99a]" />
                      <span className="text-gray-700">Prêmio Empreendedora do Ano 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
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
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Os princípios que nos guiam desde o primeiro dia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
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
                        className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className={`w-8 h-8 ${value.color}`} />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
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
        className="py-16 px-4 bg-gradient-to-r from-[#ff0080]/5 via-white to-[#27b99a]/5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <Crown className="w-12 h-12 text-[#ff0080] mx-auto mb-4" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quer Fazer Parte da Nossa História?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já escolheram a Mais Criança 
            para criar momentos especiais! 🌟
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#ff0080] hover:bg-[#e6007a] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <Gift className="w-5 h-5 mr-2" />
              Ver Produtos
            </Button>
            
            <Button variant="outline" className="border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 px-8 py-3 rounded-2xl font-medium">
              <Heart className="w-5 h-5 mr-2" />
              Entre em Contato
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
