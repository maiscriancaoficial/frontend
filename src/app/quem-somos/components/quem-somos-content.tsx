'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  Users, 
  Target, 
  Award, 
  Sparkles,
  Baby,
  Gift,
  Shield,
  Smile,
  Globe,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Crown,
  Lightbulb
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

export function QuemSomosContent() {
  const values = [
    {
      icon: Heart,
      title: 'Amor pelas Crianças',
      description: 'Cada produto é criado com carinho pensando na felicidade e desenvolvimento das crianças.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Shield,
      title: 'Segurança em Primeiro Lugar',
      description: 'Todos os nossos produtos passam por rigorosos testes de qualidade e segurança infantil.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Sparkles,
      title: 'Inovação Constante',
      description: 'Sempre buscamos novas formas de encantar e surpreender nossas famílias.',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10'
    },
    {
      icon: Users,
      title: 'Família em Primeiro Lugar',
      description: 'Acreditamos que momentos em família são os mais preciosos e trabalhamos para fortalecê-los.',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10'
    }
  ];

  const stats = [
    {
      icon: Smile,
      number: '50.000+',
      label: 'Crianças Felizes',
      color: 'text-yellow-500'
    },
    {
      icon: Gift,
      number: '15.000+',
      label: 'Produtos Entregues',
      color: 'text-[#ff0080]'
    },
    {
      icon: Star,
      number: '4.9/5',
      label: 'Avaliação dos Clientes',
      color: 'text-orange-500'
    },
    {
      icon: Calendar,
      number: '5 Anos',
      label: 'de Experiência',
      color: 'text-[#27b99a]'
    }
  ];

  const team = [
    {
      name: 'Ana Silva',
      role: 'Fundadora & CEO',
      description: 'Mãe de 2 filhos, pedagoga e apaixonada por criar experiências únicas para crianças.',
      image: '/team/ana.jpg',
      badge: 'Fundadora'
    },
    {
      name: 'Carlos Santos',
      role: 'Diretor de Produtos',
      description: 'Designer com 10 anos de experiência em produtos infantis e pai dedicado.',
      image: '/team/carlos.jpg',
      badge: 'Design'
    },
    {
      name: 'Maria Oliveira',
      role: 'Gerente de Qualidade',
      description: 'Especialista em segurança infantil, garante que cada produto seja 100% seguro.',
      image: '/team/maria.jpg',
      badge: 'Qualidade'
    }
  ];

  const timeline = [
    {
      year: '2019',
      title: 'Fundação da Mais Criança',
      description: 'Nascemos com o sonho de criar produtos únicos para crianças.',
      icon: Baby,
      color: 'bg-[#ff0080]'
    },
    {
      year: '2020',
      title: 'Primeiro Produto Personalizado',
      description: 'Lançamos nossa primeira linha de produtos personalizados.',
      icon: Gift,
      color: 'bg-blue-500'
    },
    {
      year: '2021',
      title: 'Expansão Nacional',
      description: 'Começamos a entregar em todo o Brasil.',
      icon: Globe,
      color: 'bg-[#27b99a]'
    },
    {
      year: '2022',
      title: '10.000 Clientes Felizes',
      description: 'Alcançamos a marca de 10 mil famílias atendidas.',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      year: '2023',
      title: 'Certificação de Qualidade',
      description: 'Recebemos certificações internacionais de segurança.',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      year: '2024',
      title: 'Novo Site e Experiências',
      description: 'Lançamos nossa nova plataforma digital moderna.',
      icon: Zap,
      color: 'bg-green-500'
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
              <Heart className="w-4 h-4 text-[#ff0080]" />
              <span className="text-sm font-medium text-gray-700">Nossa História</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Quem{' '}
              <span className="bg-gradient-to-r from-[#ff0080] to-[#27b99a] bg-clip-text text-transparent">
                Somos
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Somos uma empresa apaixonada por criar momentos especiais para crianças e suas famílias. 
              Cada produto é feito com amor e dedicação! 💝
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-[#ff0080] to-[#e6007a] hover:from-[#e6007a] hover:to-[#cc0066] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Nossa Missão
              </Button>
              
              <Button variant="outline" className="border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 px-8 py-3 rounded-2xl font-medium">
                <Users className="w-5 h-5 mr-2" />
                Conheça a Equipe
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card className="text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
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
              Nossa Missão & Visão
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trabalhamos todos os dias para criar experiências únicas e memoráveis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#ff0080] to-[#e6007a] rounded-2xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Nossa Missão
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Criar produtos únicos e personalizados que fortaleçam os laços familiares 
                    e proporcionem momentos de alegria e aprendizado para as crianças, sempre 
                    priorizando a segurança, qualidade e sustentabilidade.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#27b99a] to-[#22a085] rounded-2xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Nossa Visão
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Ser a marca mais querida pelas famílias brasileiras, reconhecida pela 
                    excelência em produtos infantis personalizados e por contribuir para 
                    o desenvolvimento feliz e saudável das crianças.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Nossos Valores
            </h3>
            
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
                        
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">
                          {value.title}
                        </h4>
                        
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
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
              Nossa Jornada
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada marco em nossa história representa nosso compromisso com a excelência
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#ff0080] via-[#27b99a] to-[#ff0080] rounded-full opacity-20"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => {
                const IconComponent = item.icon;
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
                    <div className={`w-full max-w-md ${isEven ? 'pr-8' : 'pl-8'}`}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Card className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <Badge className="bg-gray-100 text-gray-700 mb-2">
                                  {item.year}
                                </Badge>
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {item.title}
                                </h3>
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#27b99a] rounded-full z-10"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
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
              Nossa Equipe
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça as pessoas apaixonadas que tornam tudo isso possível
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6">
                    {/* Avatar Placeholder */}
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-[#ff0080] to-[#27b99a] rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </motion.div>
                    
                    <Badge className="bg-[#27b99a]/10 text-[#27b99a] border-[#27b99a]/20 mb-3">
                      {member.badge}
                    </Badge>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    
                    <p className="text-[#ff0080] font-medium mb-3">
                      {member.role}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {member.description}
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
            <Crown className="w-12 h-12 text-[#ff0080] mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quer Fazer Parte da Nossa História?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já escolheram a Mais Criança 
            para criar momentos especiais! 🌟
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#ff0080] to-[#e6007a] hover:from-[#e6007a] hover:to-[#cc0066] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <Gift className="w-5 h-5 mr-2" />
              Ver Produtos
            </Button>
            
            <Button variant="outline" className="border-[#27b99a]/20 text-[#27b99a] hover:bg-[#27b99a]/10 px-8 py-3 rounded-2xl font-medium">
              <Mail className="w-5 h-5 mr-2" />
              Entre em Contato
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
