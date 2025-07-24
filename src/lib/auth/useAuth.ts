import { create } from 'zustand';
import { SessaoUsuario } from './types';

interface EstadoAuth {
  usuario: SessaoUsuario | null;
  carregando: boolean;
  erro: string | null;
  autenticado: boolean;
  
  // Ações
  login: (email: string, senha: string) => Promise<boolean>;
  registro: (nome: string, email: string, senha: string, confirmarSenha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verificarAutenticacao: () => Promise<void>;
}

export const useAuth = create<EstadoAuth>((set, get) => ({
  usuario: null,
  carregando: false,
  erro: null,
  autenticado: false,
  
  login: async (email: string, senha: string) => {
    set({ carregando: true, erro: null });
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      
      const dados = await res.json();
      
      if (!dados.sucesso) {
        set({ erro: dados.mensagem, carregando: false, autenticado: false });
        return false;
      }
      
      set({ 
        usuario: dados.usuario, 
        autenticado: true,
        carregando: false,
        erro: null
      });
      
      // SOLUÇÃO TEMPORÁRIA: Redireciona diretamente baseado no role
      const role = dados.usuario.role as string;
      const redirecionamentos: Record<string, string> = {
        'ADMIN': '/dashboard/admin',
        'FUNCIONARIO': '/dashboard/funcionario',
        'CLIENTE': '/conta',
        'ASSINANTE': '/conta',
        'AFILIADO': '/dashboard/afiliado',
      };
      
      const destino = redirecionamentos[role] || '/';
      console.log('Redirecionando para:', destino);
      console.log('Role do usuário:', role);
      
      // Redirecionamento forçado - adicionando timeout para garantir que o estado seja atualizado primeiro
      setTimeout(() => {
        window.location.href = destino;
      }, 100);
      
      return true;
    } catch (error) {
      set({ 
        erro: 'Erro ao fazer login. Tente novamente mais tarde.', 
        carregando: false,
        autenticado: false
      });
      return false;
    }
  },
  
  registro: async (nome: string, email: string, senha: string, confirmarSenha: string) => {
    set({ carregando: true, erro: null });
    
    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, confirmarSenha })
      });
      
      const dados = await res.json();
      
      if (!dados.sucesso) {
        set({ erro: dados.mensagem, carregando: false });
        return false;
      }
      
      set({ 
        usuario: dados.usuario,
        autenticado: true, 
        carregando: false,
        erro: null
      });
      
      return true;
    } catch (error) {
      set({ 
        erro: 'Erro ao registrar conta. Tente novamente mais tarde.', 
        carregando: false
      });
      return false;
    }
  },
  
  logout: async () => {
    set({ carregando: true });
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      set({ 
        usuario: null, 
        autenticado: false,
        carregando: false,
        erro: null
      });
      
      window.location.href = '/';
    } catch (error) {
      set({ 
        erro: 'Erro ao fazer logout. Tente novamente.', 
        carregando: false
      });
    }
  },
  
  verificarAutenticacao: async () => {
    if (get().carregando) return;
    set({ carregando: true });
    
    try {
      console.log('Iniciando verificação de autenticação');
      const res = await fetch('/api/auth/session');
      const dados = await res.json();
      
      console.log('Resposta da API de sessão:', dados);
      
      if (dados.autenticado) {
        console.log('Usuário autenticado:', dados.usuario);
        set({
          usuario: dados.usuario,
          autenticado: true,
          carregando: false,
          erro: null
        });
      } else {
        console.log('Usuário não autenticado');
        set({
          usuario: null,
          autenticado: false,
          carregando: false,
          erro: null
        });
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      set({
        usuario: null,
        autenticado: false,
        carregando: false,
        erro: 'Erro ao verificar autenticação'
      });
    }
  }
}));
