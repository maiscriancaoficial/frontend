'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type CookiesConsentProps = {
  className?: string;
};

export function CookiesConsent({ className }: CookiesConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      // Mostrar o banner depois de um breve delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiesAcceptedDate', new Date().toISOString());
    setIsVisible(false);
  };

  const handleReject = () => {
    // Armazenar apenas o consentimento mínimo necessário
    localStorage.setItem('cookiesRejected', 'true');
    localStorage.setItem('cookiesRejectedDate', new Date().toISOString());
    setIsVisible(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 inset-x-0 z-50 p-4"
        >
          <div className="container mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="p-4 sm:p-6">
                {!showDetails ? (
                  <>
                    {/* Vista simples */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="p-2 bg-[#27b99a]/10 dark:bg-[#27b99a]/20 rounded-full">
                          <Cookie className="h-6 w-6 text-[#27b99a] dark:text-[#27b99a]" />
                        </div>
                        <h3 className="text-lg font-semibold">Usamos cookies para melhorar sua experiência</h3>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm max-w-2xl">
                        Utilizamos cookies para personalizar conteúdo e anúncios, fornecer funcionalidades de redes sociais e analisar nosso tráfego.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleDetails}
                          className="text-xs h-9"
                        >
                          Personalizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReject}
                          className="text-xs h-9"
                        >
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAccept}
                          className="bg-[#27b99a] hover:bg-[#27b99a]/80 text-white text-xs h-9"
                        >
                          Aceitar todos
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Vista detalhada */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#27b99a]/10 dark:bg-[#27b99a]/20 rounded-full">
                          <ShieldCheck className="h-6 w-6 text-[#27b99a] dark:text-[#27b99a]" />
                        </div>
                        <h3 className="text-xl font-semibold">Configurações de Privacidade</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDetails}
                        className="text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Respeitamos sua privacidade. Selecione quais tipos de cookies você aceita. Seus dados pessoais serão processados e informações do seu dispositivo poderão ser armazenadas.
                      </p>
                      
                      <div className="space-y-4 mt-6">
                        {/* Cookies necessários */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium">Cookies necessários</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Essenciais para o funcionamento básico do site. Não podem ser desativados.
                            </p>
                          </div>
                          <div className="h-5 w-10 bg-[#27b99a] rounded-full relative">
                            <span className="absolute top-1/2 transform -translate-y-1/2 right-1 h-3 w-3 bg-white rounded-full"></span>
                          </div>
                        </div>
                        
                        {/* Cookies funcionais */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium">Cookies funcionais</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Permitem lembrar escolhas feitas e fornecer funcionalidades aprimoradas e personalizadas.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-[#27b99a]"></div>
                          </label>
                        </div>
                        
                        {/* Cookies de desempenho */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium">Cookies de desempenho</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Ajudam a entender como você interage com o site e melhorar a experiência.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-[#27b99a]"></div>
                          </label>
                        </div>
                        
                        {/* Cookies de marketing */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium">Cookies de marketing</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Utilizados para rastrear visitantes em websites com o objetivo de exibir anúncios relevantes.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-[#27b99a]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Para mais informações, leia nossa{' '}
                        <Link href="/politicas-de-privacidade" className="text-[#27b99a] dark:text-[#27b99a] hover:underline">
                          Política de Privacidade
                        </Link>
                        {' '}e{' '}
                        <Link href="/politicas-de-cookies" className="text-[#27b99a] dark:text-[#27b99a] hover:underline">
                          Política de Cookies
                        </Link>
                        .
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReject}
                          className="text-xs h-9"
                        >
                          Rejeitar todos
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAccept}
                          className="bg-[#27b99a] hover:bg-[#27b99a]/80 text-white text-xs h-9"
                        >
                          Aceitar selecionados
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
