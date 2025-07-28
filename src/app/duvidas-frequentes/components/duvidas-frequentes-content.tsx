'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  Heart,
  Gift,
  Users,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  popular: boolean;
  tags: string[];
}

export function DuvidasFrequentesContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'Todas', icon: BookOpen, count: 24 },
    { id: 'pedidos', name: 'Pedidos', icon: Package, count: 8 },
    { id: 'pagamento', name: 'Pagamento', icon: CreditCard, count: 6 },
    { id: 'entrega', name: 'Entrega', icon: Truck, count: 5 },
    { id: 'produtos', name: 'Produtos', icon: Gift, count: 3 },
    { id: 'conta', name: 'Minha Conta', icon: Users, count: 2 }
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'Como posso acompanhar meu pedido?',
      answer: 'Você pode acompanhar seu pedido de várias formas: através da área do cliente no nosso site, pelo link enviado por e-mail após a compra, ou pelo WhatsApp. Enviamos atualizações em tempo real sobre o status do seu pedido.',
      category: 'pedidos',
      popular: true,
      tags: ['rastreamento', 'status', 'acompanhar']
    },
    {
      id: 2,
      question: 'Qual o prazo de entrega?',
      answer: 'Nossos prazos de entrega variam de acordo com sua localização: Capital e região metropolitana: 1-2 dias úteis. Interior do estado: 2-3 dias úteis. Outras regiões: 3-5 dias úteis. Para produtos personalizados, adicione 2 dias úteis ao prazo.',
      category: 'entrega',
      popular: true,
      tags: ['prazo', 'entrega', 'tempo']
    },
    {
      id: 3,
      question: 'Posso trocar ou devolver um produto?',
      answer: 'Sim! Você tem até 7 dias para trocas e devoluções conforme o Código de Defesa do Consumidor. O produto deve estar em perfeitas condições, na embalagem original. Entre em contato conosco e enviaremos as instruções.',
      category: 'pedidos',
      popular: true,
      tags: ['troca', 'devolução', 'garantia']
    },
    {
      id: 4,
      question: 'Quais formas de pagamento vocês aceitam?',
      answer: 'Aceitamos PIX (com 5% de desconto), cartões de crédito (Visa, Mastercard, Elo, American Express) em até 12x sem juros, e boleto bancário (com 3% de desconto). Todos os pagamentos são processados com segurança.',
      category: 'pagamento',
      popular: true,
      tags: ['pagamento', 'cartão', 'pix', 'boleto']
    },
    {
      id: 5,
      question: 'Como funciona a personalização de produtos?',
      answer: 'Nossa personalização é super fácil! Escolha o produto, envie sua arte ou texto, aprovamos o design e produzimos especialmente para você. O prazo adicional é de apenas 2 dias úteis.',
      category: 'produtos',
      popular: false,
      tags: ['personalização', 'customização', 'design']
    },
    {
      id: 6,
      question: 'Vocês entregam em todo o Brasil?',
      answer: 'Sim! Entregamos em todo território nacional através dos Correios e transportadoras parceiras. O frete é calculado automaticamente no checkout baseado no seu CEP.',
      category: 'entrega',
      popular: false,
      tags: ['entrega', 'brasil', 'frete']
    },
    {
      id: 7,
      question: 'Como criar uma conta no site?',
      answer: 'É muito simples! Clique em "Entrar" no canto superior direito, depois em "Criar conta". Preencha seus dados básicos e pronto! Você terá acesso à área do cliente com histórico de pedidos e favoritos.',
      category: 'conta',
      popular: false,
      tags: ['conta', 'cadastro', 'registro']
    },
    {
      id: 8,
      question: 'Os produtos são seguros para crianças?',
      answer: 'Absolutamente! Todos nossos produtos seguem rigorosos padrões de segurança infantil. Usamos materiais atóxicos, tintas seguras e testamos tudo antes de vender. A segurança das crianças é nossa prioridade.',
      category: 'produtos',
      popular: true,
      tags: ['segurança', 'infantil', 'qualidade']
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter(faq => faq.popular).slice(0, 4);

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Chat Online',
      description: 'Resposta imediata',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10'
    },
    {
      icon: Phone,
      title: 'Telefone',
      description: '(11) 9999-9999',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Mail,
      title: 'E-mail',
      description: 'contato@maiscrianca.com.br',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10'
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
              <HelpCircle className="w-4 h-4 text-[#27b99a]" />
              <span className="text-sm font-medium text-gray-700">Central de Ajuda</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Dúvidas{' '}
              <span className="bg-gradient-to-r from-[#ff0080] to-[#27b99a] bg-clip-text text-transparent">
                Frequentes
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Encontre respostas rápidas para as principais dúvidas. 
              Estamos aqui para ajudar você! 🤗
            </p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto relative"
              variants={itemVariants}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Digite sua dúvida aqui..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-[#27b99a] focus:ring-[#27b99a]/20 bg-white/90 backdrop-blur-sm"
              />
            </motion.div>
          </motion.div>

          {/* Popular Questions */}
          <motion.div 
            className="mb-16"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Perguntas Mais Populares
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {popularFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => toggleFAQ(faq.id)}
                  className="cursor-pointer"
                >
                  <Card className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-[#ff0080]/10 text-[#ff0080] border-[#ff0080]/20">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {faq.answer}
                          </p>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories & FAQs */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          {/* Categories */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Categorias
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#27b99a] border-[#27b99a] text-white shadow-lg' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#27b99a]/30 hover:bg-[#27b99a]/5'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{category.name}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ List */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <p className="text-gray-600">
                {filteredFAQs.length} pergunta{filteredFAQs.length !== 1 ? 's' : ''} encontrada{filteredFAQs.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredFAQs.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente buscar com outras palavras ou entre em contato conosco
                </p>
                <Button className="bg-gradient-to-r from-[#27b99a] to-[#22a085] text-white rounded-2xl">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar com Suporte
                </Button>
              </motion.div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {faq.popular && (
                              <Badge className="bg-[#ff0080]/10 text-[#ff0080] border-[#ff0080]/20">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {categories.find(cat => cat.id === faq.category)?.name}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900 text-left">
                            {faq.question}
                          </CardTitle>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0 pb-6">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-700 leading-relaxed mb-4">
                                {faq.answer}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Tags:</span>
                                {faq.tags.map((tag, tagIndex) => (
                                  <Badge 
                                    key={tagIndex} 
                                    variant="secondary" 
                                    className="text-xs bg-gray-100 text-gray-600"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#27b99a]/5 via-white to-[#ff0080]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Não Encontrou sua Resposta?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa equipe está pronta para ajudar você com qualquer dúvida
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm text-center">
                    <CardContent className="p-6">
                      <motion.div 
                        className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className={`w-8 h-8 ${option.color}`} />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {option.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {option.description}
                      </p>
                      
                      <Button 
                        className={`w-full bg-gradient-to-r ${
                          option.color.includes('27b99a') 
                            ? 'from-[#27b99a] to-[#22a085]' 
                            : option.color.includes('ff0080')
                            ? 'from-[#ff0080] to-[#e6007a]'
                            : 'from-blue-500 to-blue-600'
                        } hover:shadow-lg transition-all duration-300 rounded-2xl`}
                      >
                        Entrar em Contato
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
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
            <Heart className="w-12 h-12 text-[#ff0080] mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ainda Tem Dúvidas?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe de atendimento está sempre pronta para ajudar você 
            com carinho e dedicação! 💝
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#27b99a] to-[#22a085] hover:from-[#22a085] hover:to-[#1e8a73] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat Online
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
