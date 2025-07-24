'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEnviado(true);
      } else {
        setErro(data.message || 'Ocorreu um erro ao processar sua solicitação.');
      }
    } catch (error) {
      setErro('Ocorreu um erro ao conectar com o servidor.');
      console.error('Erro ao solicitar recuperação de senha:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full border-0 bg-transparent shadow-none">
        <CardHeader className="text-center space-y-2 px-0">
          <div className="mx-auto bg-[#ff0080]/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <div className="bg-[#ff0080] w-12 h-12 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                <line x1="2" x2="22" y1="20" y2="20" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-black">Recuperar Senha</CardTitle>
          <CardDescription className="text-base text-gray-500">
            Informe seu email para redefinir sua senha
          </CardDescription>
          <div className="w-12 h-1 bg-[#ff0080] mx-auto mt-1"></div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6 px-0">
          {enviado ? (
            <div className="bg-green-50 border border-green-200 rounded-full p-6 text-green-800 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-green-900">Instruções enviadas!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Enviamos um email com instruções para redefinir sua senha.
                      Por favor, verifique sua caixa de entrada e siga as instruções.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link 
                      href="/login" 
                      className="text-sm font-medium text-[#27b99a] hover:text-[#27b99a]/90 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="m12 19-7-7 7-7"/>
                        <path d="M19 12H5"/>
                      </svg>
                      Voltar para o login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-600 flex items-center p-4 rounded-full text-sm">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  {erro}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={carregando}
                      className="pl-10 py-6 border-gray-200 focus:border-[#ff0080] focus:ring focus:ring-[#ff0080]/20 transition-all rounded-full bg-gray-50"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#27b99a] hover:bg-[#27b99a]/90 text-white py-6 rounded-full shadow-lg shadow-[#27b99a]/20 transition-all font-medium text-base border-0" 
                    disabled={carregando}
                  >
                    {carregando ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </div>
                    ) : 'Enviar instruções de recuperação'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
        {!enviado && (
          <div className="text-center pt-4 border-t border-gray-100 mt-6">
            <p className="text-sm text-gray-600">
              Lembrou sua senha?{" "}
              <Link href="/login" className="text-[#27b99a] hover:text-[#27b99a]/90 font-medium hover:underline flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m12 19-7-7 7-7"/>
                  <path d="M19 12H5"/>
                </svg>
                Voltar para o login
              </Link>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
