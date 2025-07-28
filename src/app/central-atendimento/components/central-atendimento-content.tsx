'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Heart,
  Send,
  User,
  MessageSquare,
  Star,
  ArrowRight,
  CheckCircle,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function CentralAtendimentoContent() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset após 3 segundos
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Chat Online',
      description: 'Converse conosco em tempo real',
      info: 'Disponível 24/7',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10',
      borderColor: 'border-[#27b99a]/20',
      action: 'Iniciar Chat'
    },
    {
      icon: Phone,
      title: 'Telefone',
      description: 'Ligue para nossa central',
      info: '(11) 9999-9999',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: 'Ligar Agora'
    },
    {
      icon: Mail,
      title: 'E-mail',
      description: 'Envie sua mensagem',
      info: 'contato@maiscrianca.com.br',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10',
      borderColor: 'border-[#ff0080]/20',
      action: 'Enviar E-mail'
    }
  ];

  const workingHours = [
    { day: 'Segunda à Sexta', hours: '08:00 às 18:00' },
    { day: 'Sábados', hours: '09:00 às 14:00' },
    { day: 'Domingos e Feriados', hours: 'Chat Online 24h' }
  ];

  const faqs = [
    {
      question: 'Como posso acompanhar meu pedido?',
      answer: 'Você pode acompanhar seu pedido através da área do cliente ou pelo link enviado por e-mail.'
    },
    {
      question: 'Qual o prazo de entrega?',
      answer: 'Nossos prazos variam de 1 a 5 dias úteis, dependendo da sua localização e produto escolhido.'
    },
    {
      question: 'Posso trocar ou devolver um produto?',
      answer: 'Sim! Você tem até 7 dias para trocas e devoluções, conforme nossa política.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-blue-50/30">
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
              <Headphones className="w-4 h-4 text-[#27b99a]" />
              <span className="text-sm font-medium text-gray-700">Atendimento Especializado</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Central de{' '}
              <span className="bg-gradient-to-r from-[#ff0080] to-[#27b99a] bg-clip-text text-transparent">
                Atendimento
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nossa equipe está pronta para ajudar você com carinho e dedicação. 
              Porque cada criança merece o melhor atendimento! 💝
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-16"
            variants={itemVariants}
          >
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card className={`h-full border-2 ${method.borderColor} hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm`}>
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className={`w-16 h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className={`w-8 h-8 ${method.color}`} />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {method.description}
                      </p>
                      
                      <Badge variant="secondary" className="mb-4 bg-gray-100 text-gray-700">
                        {method.info}
                      </Badge>
                      
                      <Button 
                        className={`w-full bg-gradient-to-r ${
                          method.color.includes('27b99a') 
                            ? 'from-[#27b99a] to-[#22a085]' 
                            : method.color.includes('ff0080')
                            ? 'from-[#ff0080] to-[#e6007a]'
                            : 'from-blue-500 to-blue-600'
                        } hover:shadow-lg transition-all duration-300 rounded-2xl`}
                      >
                        {method.action}
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

      {/* Contact Form & Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-gray-100 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
                  <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-[#27b99a]" />
                    Envie sua Mensagem
                  </CardTitle>
                  <p className="text-gray-600">
                    Preencha o formulário e entraremos em contato em breve
                  </p>
                </CardHeader>
                
                <CardContent className="p-6">
                  {submitted ? (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <CheckCircle className="w-16 h-16 text-[#27b99a] mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Mensagem Enviada!
                      </h3>
                      <p className="text-gray-600">
                        Obrigado pelo contato. Responderemos em breve! 💝
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Nome Completo
                          </label>
                          <Input
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            placeholder="Seu nome"
                            className="rounded-2xl border-gray-200 focus:border-[#27b99a] focus:ring-[#27b99a]/20"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            E-mail
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            className="rounded-2xl border-gray-200 focus:border-[#27b99a] focus:ring-[#27b99a]/20"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Assunto
                        </label>
                        <Input
                          name="assunto"
                          value={formData.assunto}
                          onChange={handleInputChange}
                          placeholder="Como podemos ajudar?"
                          className="rounded-2xl border-gray-200 focus:border-[#27b99a] focus:ring-[#27b99a]/20"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Mensagem
                        </label>
                        <Textarea
                          name="mensagem"
                          value={formData.mensagem}
                          onChange={handleInputChange}
                          placeholder="Conte-nos mais detalhes..."
                          rows={5}
                          className="rounded-2xl border-gray-200 focus:border-[#27b99a] focus:ring-[#27b99a]/20 resize-none"
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#27b99a] to-[#22a085] hover:from-[#22a085] hover:to-[#1e8a73] text-white rounded-2xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Working Hours */}
              <Card className="border-2 border-gray-100 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-gray-100">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Horários de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {workingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                        <span className="font-medium text-gray-700">{schedule.day}</span>
                        <Badge variant="outline" className="bg-white border-gray-200">
                          {schedule.hours}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-2 border-gray-100 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-[#ff0080]/5 via-white to-[#ff0080]/5 border-b border-gray-100">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#ff0080]" />
                    Nossa Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-gray-700 font-medium">
                      Rua das Flores, 123 - Centro
                    </p>
                    <p className="text-gray-600">
                      São Paulo - SP, CEP: 01234-567
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 rounded-2xl"
                    >
                      Ver no Mapa
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick FAQ */}
              <Card className="border-2 border-gray-100 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-[#27b99a]/5 via-white to-[#27b99a]/5 border-b border-gray-100">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#27b99a]" />
                    Perguntas Frequentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {faqs.slice(0, 2).map((faq, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-2xl">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full text-[#27b99a] hover:bg-[#27b99a]/10 rounded-2xl"
                    >
                      Ver Todas as Perguntas
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-r from-[#27b99a]/5 via-white to-[#ff0080]/5"
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
            <Heart className="w-12 h-12 text-[#ff0080] mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Estamos Aqui Para Você!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nossa missão é proporcionar a melhor experiência para você e sua família. 
            Entre em contato e descubra como podemos ajudar! 🌟
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#27b99a] to-[#22a085] hover:from-[#22a085] hover:to-[#1e8a73] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <MessageCircle className="w-5 h-5 mr-2" />
              Iniciar Conversa
            </Button>
            
            <Button variant="outline" className="border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 px-8 py-3 rounded-2xl font-medium">
              <Phone className="w-5 h-5 mr-2" />
              Ligar Agora
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
