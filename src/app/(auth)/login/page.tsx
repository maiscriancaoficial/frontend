'use client';

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/lib/auth/useAuth";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

// Componente de carregamento enquanto aguarda o Suspense
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff0080]" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

// Componente que usa useSearchParams
// Componente principal da página
function LoginPage() {
  return (
    <div className="container max-w-lg mx-auto py-8 px-4">
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

// Export default para a página
export default LoginPage;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login, erro, carregando, autenticado, usuario } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirecionarPara = searchParams.get('redirecionarPara');
  
  // Redireciona usuário já autenticado
  useEffect(() => {
    if (autenticado && usuario) {
      const destino = redirecionarPara ? decodeURI(redirecionarPara) : getRedirecionamentoPorRole(usuario.role);
      router.push(destino);
    }
  }, [autenticado, usuario, router, redirecionarPara]);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, senha);
  };

  return (
    <div className="w-full">
      <Card className="w-full border-0 bg-transparent shadow-none">
        <CardHeader className="text-center space-y-2 px-0">
          <div className="mx-auto bg-[#ff0080]/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <div className="bg-[#ff0080] w-12 h-12 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-black">Login</CardTitle>
          <CardDescription className="text-base text-gray-500">Acesse sua conta para continuar</CardDescription>
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
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="senha" className="text-sm font-medium text-gray-700">Senha</Label>
                <Link href="/recuperar-senha" className="text-xs text-[#ff9898] hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
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
                    Entrando...
                  </div>
                ) : 'Entrar'}
              </Button>
            </div>
          </form>
          
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full absolute"></div>
            <span className="bg-white px-4 text-xs text-gray-500 relative z-10">ou continue com</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full p-3 hover:bg-gray-50 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full p-3 hover:bg-gray-50 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" fill="#1877F2"/></svg>
              Facebook
            </button>
          </div>
        </CardContent>
        
        <div className="text-center pt-4 border-t border-gray-100 mt-6">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/registro" className="text-[#27b99a] hover:text-[#27b99a]/90 font-medium hover:underline">
              Registre-se agora
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
