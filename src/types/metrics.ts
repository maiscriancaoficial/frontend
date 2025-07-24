export interface Metrics {
  id: string;
  tipo: 'click' | 'view' | 'access' | 'purchase';
  recursoId: string;
  recursoTipo: 'produto' | 'categoria' | 'banner' | 'blog';
  usuarioId?: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
}