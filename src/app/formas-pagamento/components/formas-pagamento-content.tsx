'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Receipt, 
  Shield,
  Zap,
  Clock,
  CheckCircle,
  Star,
  Gift,
  Percent,
  DollarSign,
  Lock,
  Award,
  ArrowRight,
  Info,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    rotate: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function FormasPagamentoContent() {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

  const paymentMethods = [
    {
      icon: Smartphone,
      title: 'PIX',
      description: 'Pagamento instantâneo e seguro',
      features: [
        'Aprovação imediata',
        'Disponível 24h',
        'Sem taxas extras',
        'Desconto de 5%'
      ],
      discount: '5% OFF',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10',
      borderColor: 'border-[#27b99a]/20',
      popular: true,
      processing: 'Imediato'
    },
    {
      icon: CreditCard,
      title: 'Cartão de Crédito',
      description: 'Parcele em até 12x sem juros',
      features: [
        'Até 12x sem juros',
        'Todas as bandeiras',
        'Aprovação rápida',
        'Segurança total'
      ],
      discount: 'Sem juros',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10',
      borderColor: 'border-[#ff0080]/20',
      popular: false,
      processing: '1-2 dias úteis'
    },
    {
      icon: Receipt,
      title: 'Boleto Bancário',
      description: 'Pague em qualquer banco ou app',
      features: [
        'Vencimento em 3 dias',
        'Pague em qualquer banco',
        'Sem necessidade de conta',
        'Comprovante garantido'
      ],
      discount: '3% OFF',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: false,
      processing: '1-3 dias úteis'
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Segurança SSL',
      description: 'Criptografia de ponta a ponta'
    },
    {
      icon: Lock,
      title: 'Dados Protegidos',
      description: 'Informações 100% seguras'
    },
    {
      icon: Award,
      title: 'Certificação PCI',
      description: 'Padrão internacional de segurança'
    },
    {
      icon: CheckCircle,
      title: 'Compra Garantida',
      description: 'Proteção total do consumidor'
    }
  ];

  const installmentOptions = [
    { installments: 1, value: 'R$ 100,00', discount: '5% OFF no PIX' },
    { installments: 2, value: 'R$ 50,00', discount: 'Sem juros' },
    { installments: 3, value: 'R$ 33,33', discount: 'Sem juros' },
    { installments: 6, value: 'R$ 16,67', discount: 'Sem juros' },
    { installments: 12, value: 'R$ 8,33', discount: 'Sem juros' }
  ];

  const acceptedCards = [
    { name: 'Visa', color: 'bg-blue-600' },
    { name: 'Mastercard', color: 'bg-red-500' },
    { name: 'American Express', color: 'bg-green-600' },
    { name: 'Elo', color: 'bg-yellow-500' },
    { name: 'Hipercard', color: 'bg-red-600' },
    { name: 'Diners', color: 'bg-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-blue-50/30">
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
            className="absolute top-20 left-10 w-20 h-20 bg-[#27b99a]/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute top-40 right-20 w-32 h-32 bg-[#ff0080]/10 rounded-full blur-xl"
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
              <CreditCard className="w-4 h-4 text-[#27b99a]" />
              <span className="text-sm font-medium text-gray-700">Pagamento Seguro</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Formas de{' '}
              <span className="bg-gradient-to-r from-[#27b99a] to-[#ff0080] bg-clip-text text-transparent">
                Pagamento
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Escolha a forma de pagamento que mais combina com você. 
              Segurança e praticidade em primeiro lugar! 💳
            </p>
          </motion.div>

          {/* Payment Methods */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-16"
            variants={itemVariants}
          >
            {paymentMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setSelectedMethod(selectedMethod === index ? null : index)}
                  className="cursor-pointer"
                >
                  <Card className={`h-full border-2 ${method.borderColor} hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm relative overflow-hidden`}>
                    {method.popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-[#27b99a] to-[#22a085] text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Mais Usado
                        </Badge>
                      </div>
                    )}
                    
                    {method.discount && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                          <Percent className="w-3 h-3 mr-1" />
                          {method.discount}
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-6 pt-12">
                      <motion.div 
                        className={`w-16 h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className={`w-8 h-8 ${method.color}`} />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                        {method.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 text-center">
                        {method.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {method.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#27b99a]" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{method.processing}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className={`w-full bg-gradient-to-r ${
                          method.color.includes('27b99a') 
                            ? 'from-[#27b99a] to-[#22a085]' 
                            : method.color.includes('ff0080')
                            ? 'from-[#ff0080] to-[#e6007a]'
                            : 'from-blue-500 to-blue-600'
                        } hover:shadow-lg transition-all duration-300 rounded-2xl`}
                      >
                        Escolher Método
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

      {/* Installment Options */}
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
              Opções de Parcelamento
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Parcele suas compras em até 12x sem juros no cartão de crédito
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {installmentOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ff0080]/10 to-[#27b99a]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {option.installments}x
                      </span>
                    </div>
                    
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {option.value}
                    </div>
                    
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {option.discount}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Alert className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                <strong>Exemplo:</strong> Produto de R$ 100,00 - Valores podem variar conforme o total da compra
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </section>

      {/* Accepted Cards */}
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
              Cartões Aceitos
            </h2>
            <p className="text-lg text-gray-600">
              Aceitamos as principais bandeiras do mercado
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {acceptedCards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`w-20 h-12 ${card.color} rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg`}
              >
                {card.name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
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
              Segurança Garantida
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seus dados e pagamentos estão protegidos pelos melhores sistemas de segurança
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
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
                        className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="w-8 h-8 text-green-600" />
                      </motion.div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Informações Importantes
            </h2>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>PIX:</strong> O desconto de 5% é aplicado automaticamente no checkout. 
                Pagamento deve ser realizado em até 30 minutos.
              </AlertDescription>
            </Alert>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Cartão de Crédito:</strong> Parcelamento sem juros disponível para compras acima de R$ 50,00. 
                Sujeito à aprovação da operadora.
              </AlertDescription>
            </Alert>

            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Boleto:</strong> Prazo de vencimento de 3 dias úteis. 
                Após o pagamento, a confirmação pode levar até 3 dias úteis.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-r from-gray-50 via-white to-gray-50"
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
            <DollarSign className="w-12 h-12 text-[#27b99a] mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pronto para Finalizar sua Compra?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Escolha a forma de pagamento que preferir e finalize sua compra com total segurança! 🛒
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#27b99a] to-[#22a085] hover:from-[#22a085] hover:to-[#1e8a73] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <Smartphone className="w-5 h-5 mr-2" />
              Pagar com PIX
            </Button>
            
            <Button variant="outline" className="border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 px-8 py-3 rounded-2xl font-medium">
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar com Cartão
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
