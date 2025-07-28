'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import logoImage from '../../../public/logo-azul-rosa.png';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Truck,
  Heart,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Componente de Newsletter com validação
const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateEmail(email)) {
      setIsSubmitting(true);
      // Simular envio
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setShowSuccessModal(true);
        setEmail('');
        
        // Reset após 3 segundos
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      }, 1000);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#27b99a] via-[#1c9f87] to-[#12756a] p-12 rounded-[30px] shadow-lg border border-white/20 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[10%] left-[15%] w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-[20%] right-[15%] w-60 h-60 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute top-[40%] right-[25%] w-20 h-20 rounded-full bg-white/20"></div>
        <div className="absolute bottom-[35%] left-[20%] w-16 h-16 rounded-full bg-white/20"></div>
      </div>
      
      {/* Padrão geométrico moderno */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Formas geométricas abstratas */}
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        
        {/* Linhas curvas */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,30 Q50,0 100,30 V100 H0 Z" fill="rgba(255,255,255,0.03)" />
          <path d="M0,50 Q50,20 100,50 V100 H0 Z" fill="rgba(255,255,255,0.04)" />
          <path d="M0,70 Q50,40 100,70 V100 H0 Z" fill="rgba(255,255,255,0.05)" />
        </svg>
        
        {/* Pontos decorativos */}
        <div className="absolute top-[25%] left-[10%] w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="absolute top-[30%] left-[15%] w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="absolute top-[28%] left-[20%] w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="absolute top-[75%] right-[10%] w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="absolute top-[80%] right-[15%] w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="absolute top-[78%] right-[20%] w-1 h-1 bg-white/60 rounded-full"></div>
      </div>
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
            Histórias mágicas e personalizadas para seu filho
          </h3>
          <p className="text-white/80 mb-6">
            Assine nossa newsletter e ganhe 10% de desconto no primeiro livro, além de receber novidades, promoções e dicas de leitura infantil exclusivas.
          </p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
          <div className="relative flex-grow">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsValid(true);
              }}
              className={`pr-12 h-14 rounded-full px-6 border-[#27b99a]/30 focus-visible:ring-[#27b99a] focus-visible:border-[#27b99a] placeholder:text-white/70 text-white ${!isValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {isSubmitted && (
              <span className="absolute inset-y-0 right-3 flex items-center text-green-600 dark:text-green-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
            )}
          </div>
          <Button 
            type="submit" 
            className="h-14 px-8 bg-[#27b99a] hover:bg-[#27b99a]/90 text-white rounded-full shadow-md hover:shadow-lg transition-all"
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting ? (
              'Enviando...'
            ) : isSubmitted ? (
              'Enviado com sucesso!'
            ) : (
              'Assinar'
            )}
            {!isSubmitting && !isSubmitted && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
        {!isValid && (
          <p className="text-red-500 text-sm mt-2">Por favor, insira um e-mail válido.</p>
        )}
      </div>
      
      {/* Modal de Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#27b99a] to-[#1c9f87]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 
                }}
              >
                <ShieldCheck className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Inscrição Realizada!
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
              Obrigado por se inscrever! Você receberá em breve um e-mail com seu cupom de 10% de desconto e as melhores novidades sobre nossos livros personalizados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  10% de desconto no primeiro livro
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Cupom chegará em seu e-mail em alguns minutos
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gradient-to-r from-[#27b99a] to-[#1c9f87] hover:from-[#1c9f87] hover:to-[#12756a] text-white rounded-full h-12 font-medium transition-all duration-300 transform hover:scale-105"
            >
              Continuar Navegando
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente para os benefícios da loja
const StoreBenefits = () => {
  const benefits = [
    {
      icon: (
        <div className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/70 p-3 rounded-full shadow-md">
          <Truck className="h-8 w-8 text-white" />
        </div>
      ),
      title: 'Entrega Rápida',
      description: 'Envio para todo Brasil em até 7 dias úteis'
    },
    {
      icon: (
        <div className="bg-gradient-to-br from-[#27b99a] to-[#27b99a]/70 p-3 rounded-full shadow-md">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
      ),
      title: 'Segurança Garantida',
      description: 'Compra 100% segura e confiável'
    },
    {
      icon: (
        <div className="bg-gradient-to-br from-[#ff0080] to-[#ff0080]/70 p-3 rounded-full shadow-md">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
      ),
      title: 'Pagamento Facilitado',
      description: 'Diversas opções de pagamento'
    },
    {
      icon: (
        <div className="bg-gradient-to-br from-[#27b99a] to-[#27b99a]/70 p-3 rounded-full shadow-md">
          <Heart className="h-8 w-8 text-white" />
        </div>
      ),
      title: 'Personalização',
      description: 'Histórias únicas criadas para seu filho'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-3">
            {benefit.icon}
          </div>
          <h4 className="font-semibold text-lg mb-1">{benefit.title}</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Links para o footer
const footerLinks = {
  institucional: [
    { label: 'Quem Somos', href: '/quem-somos' },
    { label: 'Nossa História', href: '/nossa-historia' },
    { label: 'Blog', href: '/blog' },
    { label: 'Central de Atendimento', href: '/central-atendimento' },
    { label: 'Dúvidas Frequentes', href: '/duvidas-frequentes' },
   
  ],
  ajuda: [
    { label: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
    { label: 'Formas de Pagamento', href: '/formas-pagamento' },
    { label: 'Como Personalizar', href: '/como-personalizar' },
    { label: 'Personalização', href: '/personalizacao' },
  ],
  produtos: [
    { label: 'Aventuras Mágicas', href: '/categoria-livro/aventura' },
    { label: 'Contos de Fadas', href: '/categoria-livro/contos-de-fadas' },
    { label: 'Mundo dos Animais', href: '/categoria-livro/animais' },
    { label: 'Livros Educativos', href: '/categoria-livro/educativos' },
    { label: 'Livros Personalizados', href: '/categoria-livro/personalizados' },
  ],
  politicas: [
    { label: 'Termos e Condições', href: '/termos-condicoes' },
    { label: 'Política de Privacidade', href: '/politica-privacidade' },
    { label: 'Política de Cookies', href: '/politica-cookies' },
    { label: 'Política de Reembolso', href: '/politica-reembolso' },
    { label: 'Segurança e Privacidade', href: '/seguranca-privacidade' },
  ]
};

// Componente principal do Footer
export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 mt-16 lg:block hidden">
      {/* Seção CTA */}
      <div className="container mx-auto px-4 mb-16">
        <NewsletterSignup />
      </div>
      
      {/* Benefícios */}
      <div className="container mx-auto px-4 border-y border-gray-200 dark:border-gray-800">
        <StoreBenefits />
      </div>
      
      {/* Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1: Logo e sobre */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image 
                src={logoImage} 
                alt="Mais criança" 
                width={150} 
                height={50}
                priority
                className="h-12 w-auto"
              />
            </Link>
            
            <div className="flex items-center mb-4">
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                <Building2 className="w-3 h-3 mr-1" />
                CNPJ: 00.000.000/0001-00
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
            Criamos livros infantis digitais e personalizados, onde a criança vira personagem e vive aventuras incríveis dentro da história. Tudo é feito com carinho para tornar cada momento de leitura único e especial. Com mais de 10 anos de experiência, entregamos diversão e imaginação para crianças de todo o Brasil.            </p>
            
            {/* Redes sociais */}
            <div className="flex space-x-3 mt-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-9 w-9 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-9 w-9 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-9 w-9 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-9 w-9 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </motion.a>
            </div>
          </div>
          
          {/* Coluna 2: Contato */}
          <div>
            <h4 className="font-bold text-lg mb-5">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-[#ff0080] dark:text-[#ff0080] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Atendimento</p>
                  <p className="text-gray-600 dark:text-gray-400">(11) 9999-9999</p>
                  <p className="text-gray-600 dark:text-gray-400">atendimento@maiscrianca.com.br</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-[#27b99a] dark:text-[#27b99a] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">E-mail</p>
                  <p className="text-gray-600 dark:text-gray-400">contato@maiscrianca.com.br</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#ff0080] dark:text-[#ff0080] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Endereço</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Rua das Flores, 123 - Jardim Primavera<br />
                    São Paulo - SP, 01234-567
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-[#27b99a] dark:text-[#27b99a] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Horário</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Segunda a sexta: 9h às 19h<br />
                    Sábado: 10h às 16h
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coluna 3: Links */}
          <div className="grid grid-cols-2 gap-8">
            {/* Links de ajuda */}
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-6">Suporte</h4>
              <ul className="space-y-2">
                {footerLinks.ajuda.map((link: { label: string; href: string }, i: number) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <h4 className="text-black dark:text-white font-semibold mb-6 mt-8">Institucional</h4>
              <ul className="space-y-2">
                {footerLinks.institucional.map((link: { label: string; href: string }, i: number) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Links de produtos */}
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-6">Livros</h4>
              <ul className="space-y-2">
                {footerLinks.produtos.map((link: { label: string; href: string }, i: number) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <h4 className="font-bold text-lg mb-4 mt-8">Políticas</h4>
              <ul className="space-y-2">
                {footerLinks.politicas.slice(0, 3).map((link: { label: string; href: string }, i: number) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Coluna 4: Mapa ou newsletter ou certificações */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-lg mb-4">Pagamentos</h4>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-gray-100 dark:bg-gray-800 rounded-md h-10 w-12 flex items-center justify-center"
                  >
                    <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            
           
          </div>
        </div>
      </div>
      
      {/* Redes sociais e formas de pagamento */}
      <div className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h5 className="font-semibold mb-3 text-center md:text-left">Siga-nos nas redes sociais</h5>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#27b99a] dark:text-gray-400 dark:hover:text-[#27b99a] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
          
         
        </div>
      </div>
      
      {/* Copyright e info adicional */}
      <div className="bg-gray-100 dark:bg-gray-900 py-6">
        <div className="container mx-auto px-1">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {currentYear} Mais Criança. Todos os direitos reservados.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                CNPJ: 00.000.000/0001-00 | Av. das kids, 46 - Jardim Paulista, São Paulo - SP
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.politicas.slice(0, 4).map((link: { label: string; href: string }, i: number) => (
                <Link 
                  key={i}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 text-sm hover:text-[#27b99a] dark:hover:text-[#27b99a]/80 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          
        </div>
      </div>
    </footer>
  );
}
