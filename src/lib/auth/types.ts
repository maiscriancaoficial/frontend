import { Role } from "../../generated/prisma";
import { JWTPayload } from 'jose';

export interface TokenPayload extends JWTPayload {
  sub: string;
  role: Role;
  nome: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface SessaoUsuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

export interface ResultadoAutenticacao {
  sucesso: boolean;
  mensagem?: string;
  token?: string;
  usuario?: SessaoUsuario;
}

export interface VerificacaoToken {
  valido: boolean;
  expirado: boolean;
  usuario?: SessaoUsuario;
}
