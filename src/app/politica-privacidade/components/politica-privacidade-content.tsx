'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  Trash2,
  Download,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function PoliticaPrivacidadeContent() {
  const dataTypes = [
    {
      icon: UserCheck,
      title: 'Dados Pessoais',
      description: 'Nome, CPF, RG, data de nascimento',
      color: 'text-[#ff0080]'
    },
    {
      icon: Mail,
      title: 'Dados de Contato',
      description: 'E-mail, telefone, endereço',
      color: 'text-[#27b99a]'
    },
    {
      icon: Database,
      title: 'Dados de Navegação',
      description: 'IP, cookies, histórico de compras',
      color: 'text-blue-500'
    },
    {
      icon: Settings,
      title: 'Dados de Preferências',
      description: 'Configurações, favoritos, personalização',
      color: 'text-orange-500'
    }
  ];

  const rights = [
    {
      icon: Eye,
      title: 'Acesso aos Dados',
      description: 'Você pode solicitar acesso a todos os seus dados pessoais que possuímos.'
    },
    {
      icon: FileText,
      title: 'Correção de Dados',
      description: 'Solicite a correção de dados incompletos, inexatos ou desatualizados.'
    },
    {
      icon: Trash2,
      title: 'Exclusão de Dados',
      description: 'Solicite a exclusão de dados pessoais, exceto quando necessários por lei.'
    },
    {
      icon: Download,
      title: 'Portabilidade',
      description: 'Solicite a portabilidade dos seus dados para outro fornecedor.'
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
              <span className="text-sm font-medium text-gray-700">LGPD Compliant</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Política de{' '}
              <span className="text-[#27b99a]">
                Privacidade
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Sua privacidade é nossa prioridade. Conheça como protegemos 
              e utilizamos seus dados pessoais! 🔒
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Atualizada: Janeiro 2024</span>
              </div>
              <Badge className="bg-[#27b99a] text-white">
                LGPD Compliant
              </Badge>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Data Types */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Dados que Coletamos
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card key={index} className="text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className={`w-6 h-6 ${type.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-2 border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Lock className="w-6 h-6 text-[#ff0080]" />
                Como Protegemos seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Criptografia SSL em todas as transmissões de dados</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Servidores seguros com backup diário</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Acesso restrito apenas a funcionários autorizados</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Monitoramento 24/7 contra tentativas de invasão</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Database className="w-6 h-6 text-[#27b99a]" />
                Como Utilizamos seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Processar pedidos e entregas</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Personalizar sua experiência de compra</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Enviar comunicações sobre pedidos e promoções</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#27b99a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Melhorar nossos produtos e serviços</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rights Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#27b99a]/5 via-white to-[#ff0080]/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Seus Direitos
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {rights.map((right, index) => {
              const IconComponent = right.icon;
              return (
                <Card key={index} className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#27b99a]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-[#27b99a]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {right.title}
                        </h3>
                        <p className="text-gray-600">
                          {right.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-12 h-12 text-[#27b99a] mx-auto mb-4" />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dúvidas sobre Privacidade?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Entre em contato com nosso Encarregado de Proteção de Dados
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#27b99a] hover:bg-[#22a085] text-white px-8 py-3 rounded-2xl">
              <Mail className="w-5 h-5 mr-2" />
              privacidade@maiscrianca.com.br
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
