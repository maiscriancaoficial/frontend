'use client';

import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Package,
  Truck,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  Info,
  DollarSign,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function PoliticaReembolsoContent() {
  const refundTypes = [
    {
      icon: Package,
      title: 'Produtos com Defeito',
      description: 'Reembolso integral em até 24h após análise',
      timeframe: 'Imediato',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: RefreshCw,
      title: 'Arrependimento (CDC)',
      description: 'Devolução em até 7 dias corridos',
      timeframe: '7 dias',
      color: 'text-[#27b99a]',
      bgColor: 'bg-[#27b99a]/10'
    },
    {
      icon: Truck,
      title: 'Produto Não Entregue',
      description: 'Reembolso após prazo de entrega vencido',
      timeframe: '15 dias',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: CreditCard,
      title: 'Erro no Pagamento',
      description: 'Estorno automático em caso de cobrança indevida',
      timeframe: '5 dias úteis',
      color: 'text-[#ff0080]',
      bgColor: 'bg-[#ff0080]/10'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Solicite o Reembolso',
      description: 'Entre em contato através dos nossos canais oficiais',
      icon: Mail,
      details: ['E-mail: reembolso@maiscrianca.com.br', 'WhatsApp: (11) 9999-9999', 'Chat online no site']
    },
    {
      number: 2,
      title: 'Análise do Pedido',
      description: 'Nossa equipe analisará sua solicitação em até 24h',
      icon: FileText,
      details: ['Verificação do motivo', 'Análise da elegibilidade', 'Confirmação dos dados']
    },
    {
      number: 3,
      title: 'Aprovação',
      description: 'Você receberá a confirmação por e-mail',
      icon: CheckCircle,
      details: ['E-mail de confirmação', 'Instruções para devolução', 'Código de rastreamento']
    },
    {
      number: 4,
      title: 'Processamento',
      description: 'Reembolso processado conforme forma de pagamento',
      icon: DollarSign,
      details: ['PIX: até 1 dia útil', 'Cartão: até 2 faturas', 'Boleto: até 5 dias úteis']
    }
  ];

  const conditions = [
    {
      icon: CheckCircle,
      title: 'Produto em Perfeitas Condições',
      description: 'Sem sinais de uso, na embalagem original',
      type: 'required'
    },
    {
      icon: Clock,
      title: 'Dentro do Prazo',
      description: '7 dias para arrependimento, 30 dias para defeito',
      type: 'required'
    },
    {
      icon: Package,
      title: 'Embalagem Original',
      description: 'Produto deve estar na embalagem original',
      type: 'required'
    },
    {
      icon: AlertTriangle,
      title: 'Produtos Personalizados',
      description: 'Apenas em caso de defeito de fabricação',
      type: 'exception'
    }
  ];

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
              <Shield className="w-4 h-4 text-[#27b99a]" />
              <span className="text-sm font-medium text-gray-700">Garantia de Satisfação</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Política de{' '}
              <span className="text-[#27b99a]">
                Reembolso
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Sua satisfação é nossa prioridade. Conheça nossos processos 
              de reembolso, trocas e devoluções! 💰
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Atualizada: Janeiro 2024</span>
              </div>
              <Badge className="bg-[#27b99a] text-white">
                CDC Compliant
              </Badge>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Refund Types */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tipos de Reembolso
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refundTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 ${type.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`w-8 h-8 ${type.color}`} />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {type.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {type.description}
                      </p>
                      
                      <Badge className={`${type.bgColor} ${type.color} border-0`}>
                        {type.timeframe}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Como Solicitar Reembolso
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#ff0080] text-white rounded-2xl flex items-center justify-center font-bold">
                          {step.number}
                        </div>
                        <div className="w-12 h-12 bg-[#ff0080]/10 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-[#ff0080]" />
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      
                      <div className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#27b99a] rounded-full"></div>
                            <span className="text-sm text-gray-600">{detail}</span>
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

      {/* Conditions */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#27b99a]/5 via-white to-[#ff0080]/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Condições para Reembolso
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {conditions.map((condition, index) => {
              const IconComponent = condition.icon;
              const isException = condition.type === 'exception';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${
                    isException ? 'border-orange-200 bg-orange-50/50' : 'border-gray-100'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isException ? 'bg-orange-100' : 'bg-[#27b99a]/10'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            isException ? 'text-orange-500' : 'text-[#27b99a]'
                          }`} />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {condition.title}
                          </h3>
                          <p className="text-gray-600">
                            {condition.description}
                          </p>
                          
                          {isException && (
                            <Badge className="bg-orange-100 text-orange-700 mt-2">
                              Exceção
                            </Badge>
                          )}
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

      {/* Important Info */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-[#ff0080]/20 bg-[#ff0080]/5">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ff0080]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-[#ff0080]" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Informações Importantes
                  </h3>
                  
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Frete de Devolução:</strong> Por conta do cliente, exceto em caso de defeito ou erro nosso.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Prazo de Análise:</strong> Até 24 horas para análise da solicitação.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Reembolso Parcial:</strong> Pode ocorrer em caso de produto com avarias causadas pelo cliente.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Acompanhamento:</strong> Você receberá atualizações por e-mail sobre o status do reembolso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <RefreshCw className="w-12 h-12 text-[#27b99a] mx-auto mb-4" />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Precisa de Ajuda com Reembolso?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Nossa equipe está pronta para ajudar você com seu reembolso
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#27b99a] hover:bg-[#22a085] text-white px-8 py-3 rounded-2xl">
              <Mail className="w-5 h-5 mr-2" />
              reembolso@maiscrianca.com.br
            </Button>
            
            <Button variant="outline" className="border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 px-8 py-3 rounded-2xl">
              <Phone className="w-5 h-5 mr-2" />
              (11) 9999-9999
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
