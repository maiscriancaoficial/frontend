'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  Scale, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  Clock,
  Users,
  CreditCard,
  Truck,
  RefreshCw,
  BookOpen,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

export function TermosCondicoesContent() {
  const sections = [
    {
      id: 'definicoes',
      title: '1. Definições',
      icon: BookOpen,
      content: [
        'Site: Plataforma online da Mais Criança acessível através do endereço www.maiscrianca.com.br',
        'Usuário: Qualquer pessoa física ou jurídica que acesse e utilize nossos serviços',
        'Produtos: Todos os itens disponíveis para venda em nossa plataforma',
        'Serviços: Personalização, entrega, atendimento ao cliente e demais facilidades oferecidas'
      ]
    },
    {
      id: 'aceitacao',
      title: '2. Aceitação dos Termos',
      icon: CheckCircle,
      content: [
        'Ao acessar e usar nosso site, você concorda automaticamente com estes termos',
        'Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços',
        'Estes termos podem ser atualizados periodicamente, e o uso continuado implica aceitação',
        'Recomendamos a leitura regular destes termos para se manter informado sobre mudanças'
      ]
    },
    {
      id: 'produtos',
      title: '3. Produtos e Serviços',
      icon: Shield,
      content: [
        'Todos os produtos são descritos com a máxima precisão possível',
        'Cores podem variar ligeiramente devido a configurações de monitor',
        'Produtos personalizados não podem ser devolvidos, exceto em caso de defeito',
        'Reservamo-nos o direito de alterar preços e disponibilidade sem aviso prévio'
      ]
    },
    {
      id: 'pedidos',
      title: '4. Pedidos e Pagamentos',
      icon: CreditCard,
      content: [
        'Todos os pedidos estão sujeitos à confirmação de pagamento',
        'Aceitamos cartões de crédito, PIX, boleto bancário e outras formas indicadas no site',
        'Preços incluem impostos, mas podem não incluir frete dependendo da promoção',
        'Pedidos podem ser cancelados até o início da produção'
      ]
    },
    {
      id: 'entrega',
      title: '5. Entrega e Prazos',
      icon: Truck,
      content: [
        'Prazos de entrega são estimativas e podem variar conforme localização',
        'Produtos personalizados têm prazo adicional de 2-5 dias úteis',
        'Não nos responsabilizamos por atrasos causados pelos Correios ou transportadoras',
        'Cliente será notificado sobre qualquer alteração significativa no prazo'
      ]
    },
    {
      id: 'devolucoes',
      title: '6. Trocas e Devoluções',
      icon: RefreshCw,
      content: [
        'Produtos podem ser devolvidos em até 7 dias conforme CDC',
        'Produtos personalizados só podem ser devolvidos em caso de defeito',
        'Produto deve estar em perfeitas condições e embalagem original',
        'Frete de devolução por conta do cliente, exceto em caso de defeito'
      ]
    },
    {
      id: 'propriedade',
      title: '7. Propriedade Intelectual',
      icon: Scale,
      content: [
        'Todo conteúdo do site é propriedade da Mais Criança ou licenciado',
        'É proibida a reprodução sem autorização expressa',
        'Usuário garante ter direitos sobre imagens enviadas para personalização',
        'Mais Criança não se responsabiliza por violação de direitos autorais pelo usuário'
      ]
    },
    {
      id: 'responsabilidades',
      title: '8. Limitação de Responsabilidade',
      icon: AlertTriangle,
      content: [
        'Nossa responsabilidade limita-se ao valor do produto adquirido',
        'Não nos responsabilizamos por danos indiretos ou consequenciais',
        'Usuário é responsável por manter suas informações de acesso seguras',
        'Site pode ficar indisponível temporariamente para manutenção'
      ]
    }
  ];

  const highlights = [
    {
      icon: Clock,
      title: 'Vigência',
      description: 'Estes termos entram em vigor na data de aceitação e permanecem válidos indefinidamente.'
    },
    {
      icon: Users,
      title: 'Idade Mínima',
      description: 'Nossos serviços são destinados a maiores de 18 anos ou menores com supervisão.'
    },
    {
      icon: Mail,
      title: 'Contato',
      description: 'Dúvidas sobre estes termos podem ser esclarecidas através do nosso atendimento.'
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
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <FileText className="w-4 h-4 text-[#27b99a]" />
              <span className="text-sm font-medium text-gray-700">Documentos Legais</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Termos e{' '}
              <span className="text-[#ff0080]">
                Condições
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Transparência e clareza em todos os nossos serviços. 
              Leia nossos termos com atenção! 📋
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Última atualização: Janeiro 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Leitura: ~10 minutos</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {highlights.map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-[#27b99a]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-[#27b99a]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#ff0080]/10 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-[#ff0080]" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          {section.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700 leading-relaxed">
                              {item}
                            </p>
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

      {/* Important Notice */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#ff0080]/5 via-white to-[#27b99a]/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
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
                      <p>
                        <strong>Lei Aplicável:</strong> Estes termos são regidos pela legislação brasileira, 
                        especialmente pelo Código de Defesa do Consumidor.
                      </p>
                      
                      <p>
                        <strong>Foro:</strong> Fica eleito o foro da comarca de São Paulo/SP para dirimir 
                        quaisquer controvérsias oriundas destes termos.
                      </p>
                      
                      <p>
                        <strong>Alterações:</strong> A Mais Criança reserva-se o direito de alterar estes 
                        termos a qualquer momento, sendo as alterações comunicadas através do site.
                      </p>
                      
                      <p>
                        <strong>Contato:</strong> Para esclarecimentos sobre estes termos, entre em contato 
                        através do e-mail juridico@maiscrianca.com.br ou telefone (11) 9999-9999.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
          <Scale className="w-12 h-12 text-[#27b99a] mx-auto mb-4" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dúvidas sobre os Termos?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe jurídica está disponível para esclarecer 
            qualquer questão sobre nossos termos e condições.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#27b99a] hover:bg-[#22a085] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              <Mail className="w-5 h-5 mr-2" />
              Contato Jurídico
            </Button>
            
            <Button variant="outline" className="border-[#ff0080]/20 text-[#ff0080] hover:bg-[#ff0080]/10 px-8 py-3 rounded-2xl font-medium">
              <Phone className="w-5 h-5 mr-2" />
              Falar por Telefone
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
