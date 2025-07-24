'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle, AlertTriangle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

// Componente principal da página
function RedefiniçãoSenhaPage() {
  return (
    <div className="container max-w-lg mx-auto py-8 px-4">
      <Suspense fallback={<Loading />}>
        <RedefiniçãoSenha />
      </Suspense>
    </div>
  );
}

// Export default para a página
export default RedefiniçãoSenhaPage;

// Componente de carregamento enquanto aguarda o Suspense
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

// Componente interno que usa useSearchParams
function RedefiniçãoSenha() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [senhasNaoConferem, setSenhasNaoConferem] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  useEffect(() => {
    // Verifica se o token é válido
    const verificarToken = async () => {
      if (!token) {
        setTokenValido(false);
        setVerificando(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/auth/verificar-token?token=${token}`);
        const dados = await res.json();
        
        setTokenValido(dados.valido);
        if (!dados.valido) {
          setErro(dados.mensagem || 'Token inválido ou expirado');
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        setErro('Erro ao validar o token de recuperação');
        setTokenValido(false);
      } finally {
        setVerificando(false);
      }
    };
    
    verificarToken();
  }, [token]);
  
  const verificarSenhas = () => {
    if (senha !== confirmarSenha) {
      setSenhasNaoConferem(true);
      return false;
    }
    
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    setSenhasNaoConferem(false);
    setErro(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificarSenhas()) return;
    
    setCarregando(true);
    setErro(null);
    
    try {
      const res = await fetch('/api/auth/redefinir-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          novaSenha: senha
        })
      });
      
      const dados = await res.json();
      
      if (dados.sucesso) {
        setConcluido(true);
      } else {
        setErro(dados.mensagem || 'Erro ao redefinir senha');
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setErro('Ocorreu um erro ao processar sua solicitação');
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
              {tokenValido ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.88 3.549L7.12 20.451" />
                  <path d="M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z" />
                </svg>
              )}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-black">
            {tokenValido 
              ? 'Redefinir Senha' 
              : 'Token Inválido'
            }
          </CardTitle>
          <CardDescription className="text-base text-gray-500">
            {tokenValido 
              ? 'Crie uma nova senha segura' 
              : 'O link para redefinir a senha é inválido'
            }
          </CardDescription>
          <div className="w-12 h-1 bg-[#ff0080] mx-auto mt-1"></div>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-6 px-0">
          {verificando && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Verificando token...</p>
            </div>
          )}
          
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 flex items-center p-4 rounded-full text-sm">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              {erro}
            </div>
          )}
          
          {!tokenValido ? (
            <div className="text-center py-4 space-y-6">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
              </div>
              <p className="text-base text-gray-600 mb-6 max-w-xs mx-auto">
                O link que você está usando é inválido ou já foi utilizado.
              </p>
              <Button 
                asChild 
                className="w-full bg-[#27b99a] hover:bg-[#27b99a]/90 text-white py-6 rounded-full shadow-lg shadow-[#27b99a]/20 transition-all font-medium text-base border-0"
              >
                <Link href="/recuperar-senha">Solicitar novo link</Link>
              </Button>
            </div>
          ) : concluido ? (
            <div className="text-center py-4 space-y-6">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <p className="text-base text-gray-600 mb-6 max-w-xs mx-auto">
                Sua senha foi redefinida com sucesso! Agora você pode fazer login com sua nova senha.
              </p>
              <Button 
                asChild 
                className="w-full bg-[#27b99a] hover:bg-[#27b99a]/90 text-white py-6 rounded-full shadow-lg shadow-[#27b99a]/20 transition-all font-medium text-base border-0"
              >
                <Link href="/login">Ir para o login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Label htmlFor="senha" className="text-sm font-medium text-gray-700 mb-1 block">Nova Senha</Label>
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
                <Label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700 mb-1 block">Confirmar Nova Senha</Label>
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

              {senhasNaoConferem && (
                <div className="text-sm text-red-500 flex items-center bg-red-50 p-2 rounded-full">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  As senhas não conferem
                </div>
              )}

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
                      Processando...
                    </div>
                  ) : 'Redefinir Senha'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        
        <div className="text-center pt-4 border-t border-gray-100 mt-6">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="text-[#27b99a] hover:text-[#27b99a]/90 font-medium hover:underline flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              Voltar para o login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
