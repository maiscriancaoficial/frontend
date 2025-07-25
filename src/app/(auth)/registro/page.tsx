'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/lib/auth/useAuth";
import { AlertCircle } from "lucide-react";

export default function RegistroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { registro, autenticado, usuario } = useAuth();
  const router = useRouter();

  // Redireciona usuário já autenticado
  useEffect(() => {
    if (autenticado && usuario) {
      const destino = getRedirecionamentoPorRole(usuario.role);
      router.push(destino);
    }
  }, [autenticado, usuario, router]);
  
  // Função para determinar redirecionamento com base no role
  const getRedirecionamentoPorRole = (role: string) => {
    const redirecionamentos: Record<string, string> = {
      'ADMIN': '/dashboard/admin',
      'FUNCIONARIO': '/dashboard/funcionario',
      'CLIENTE': '/conta',
      'ASSINANTE': '/conta',
      'AFILIADO': '/dashboard/afiliado',
    };
    return redirecionamentos[role] || '/';
  };

  // Função para verificar se as senhas conferem
  const verificarSenhas = () => {
    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem. Por favor, verifique.");
      return false;
    }
    setErro(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificarSenhas()) return;
    
    setCarregando(true);
    setErro(null);
    
    try {
      const resultado = await registro(nome, email, senha, confirmarSenha);
      
      if (!resultado) {
        // Se o registro falhou, pode ser email duplicado ou outro erro
        setErro('Este email já está em uso. Tente fazer login ou use outro email.');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setErro('Erro interno. Tente novamente em alguns instantes.');
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-black">Cadastro</CardTitle>
          <CardDescription className="text-base text-gray-500">
            Crie sua conta para continuar
          </CardDescription>
          <div className="w-12 h-1 bg-[#ff0080] mx-auto mt-1"></div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6 px-0">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 flex items-center p-4 rounded-full text-sm">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              {erro}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-1 block">Nome</Label>
                <div className="relative">
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={carregando}
                    className="pl-10 py-6 border-gray-200 focus:border-[#ff0080] focus:ring focus:ring-[#ff0080]/20 transition-all rounded-full bg-gray-50"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
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
            
            <div className="relative">
              <Label htmlFor="senha" className="text-sm font-medium text-gray-700 mb-1 block">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={carregando}
                  className="pl-10 py-6 border-gray-200 focus:border-[#ff0080] focus:ring focus:ring-[#ff0080]/20 transition-all rounded-full bg-gray-50"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Label htmlFor="confirmacaoSenha" className="text-sm font-medium text-gray-700 mb-1 block">Confirmação de Senha</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  disabled={carregando}
                  className="pl-10 py-6 border-gray-200 focus:border-[#ff0080] focus:ring focus:ring-[#ff0080]/20 transition-all rounded-full bg-gray-50"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pt-4">
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
                    Cadastrando...
                  </div>
                ) : 'Criar minha conta'}
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 pt-3">
              <input type="checkbox" id="termos" className="rounded border-gray-300 text-[#27b99a] focus:border-[#ff0080] focus:ring focus:ring-[#ff0080]/20" required />
              <label htmlFor="termos" className="text-xs text-gray-500">
                Concordo com os <a href="#" className="text-[#27b99a] hover:underline">Termos de Serviço</a> e <a href="#" className="text-[#27b99a] hover:underline">Políticas de Privacidade</a>
              </label>
            </div>
          </form>
        </CardContent>
        
        <div className="text-center pt-4 border-t border-gray-100 mt-6">
          <p className="text-sm text-gray-600">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-[#27b99a] hover:text-[#27b99a]/90 font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}