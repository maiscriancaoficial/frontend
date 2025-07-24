import * as argon2 from 'argon2';
import { PrismaClient } from '../../generated/prisma';
import { ResultadoAutenticacao, SessaoUsuario } from './types';
import { gerarToken } from './jwt';

const prisma = new PrismaClient();

/**
 * Realiza a autenticação do usuário com email e senha
 */
export async function autenticarUsuario(
  email: string, 
  senha: string
): Promise<ResultadoAutenticacao> {
  try {
    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    // Verifica se o usuário existe
    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'Email ou senha incorretos'
      };
    }

    // Verifica se a senha está correta
    const senhaCorreta = await argon2.verify(usuario.senha, senha);
    if (!senhaCorreta) {
      return {
        sucesso: false,
        mensagem: 'Email ou senha incorretos'
      };
    }

    // Cria objeto com dados da sessão do usuário
    const dadosUsuario: SessaoUsuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    };

    // Gera token JWT - aguardar a Promise ser resolvida
    const token = await gerarToken(dadosUsuario);

    // Registra a sessão no banco de dados
    await registrarSessao(dadosUsuario.id, token);

    return {
      sucesso: true,
      token,
      usuario: dadosUsuario
    };
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return {
      sucesso: false,
      mensagem: 'Ocorreu um erro durante a autenticação'
    };
  }
}

/**
 * Registra a sessão no banco de dados
 */
export async function registrarSessao(
  usuarioId: string, 
  token: string,
  userAgent?: string,
  ip?: string
): Promise<void> {
  // Calcula a data de expiração (30 dias)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  try {
    // Garantir que o token seja uma string
    const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
    
    // Salva a sessão no banco de dados
    await prisma.sessao.create({
      data: {
        token: tokenString,
        usuarioId,
        userAgent,
        ip,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Erro ao registrar sessão:', error);
  }
}

/**
 * Invalida todas as sessões de um usuário
 */
export async function invalidarSessoes(usuarioId: string): Promise<void> {
  try {
    await prisma.sessao.deleteMany({
      where: { usuarioId }
    });
  } catch (error) {
    console.error('Erro ao invalidar sessões:', error);
  }
}

/**
 * Invalida uma sessão específica
 */
export async function invalidarSessao(token: string): Promise<void> {
  try {
    await prisma.sessao.delete({
      where: { token }
    });
  } catch (error) {
    console.error('Erro ao invalidar sessão específica:', error);
  }
}

/**
 * Verifica se uma sessão existe e é válida
 */
export async function verificarSessao(token: string): Promise<boolean> {
  try {
    const sessao = await prisma.sessao.findUnique({
      where: { token }
    });

    if (!sessao) return false;

    // Verifica se a sessão expirou
    const agora = new Date();
    if (sessao.expiresAt < agora) {
      // Remove sessão expirada
      await prisma.sessao.delete({ where: { token } });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return false;
  }
}
