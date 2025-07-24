'use client';

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipos (definidos localmente em vez de importados do Prisma)
type StatusPedido = 
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAGAMENTO_APROVADO'
  | 'EM_PREPARACAO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO'
  | 'ESTORNADO';

type MetodoPagamento = 
  | 'PIX'
  | 'CARTAO_CREDITO'
  | 'CARTAO_DEBITO'
  | 'BOLETO'
  | 'DINHEIRO'
  | 'TRANSFERENCIA';

// Interface para o pedido
interface PedidoItem {
  id: string;
  codigo: string;
  numero?: string;
  status: StatusPedido;
  statusPagamento?: string;
  valorTotal: number;
  subtotal?: number;
  valorDesconto?: number;
  metodoPagamento: MetodoPagamento | null;
  transacaoId?: string;
  pixQrCode?: string;
  pixCopiaCola?: string;
  codigoCupom?: string;
  observacoes?: string;
  observacoesInternas?: string;
  usuario: {
    nome: string;
    email: string;
    telefone?: string;
    cpfCnpj?: string;
  };
  itens?: Array<{
    id: string;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    subtotal: number;
    nomePersonagem?: string;
    arquivosDigitais?: string[];
  }>;
  createdAt: Date;
}

// Componente para exibir o status do pedido com a cor adequada
function StatusBadge({ status }: { status: StatusPedido }) {
  let bgColor = "";
  let textColor = "";

  switch (status) {
    case "PAGAMENTO_APROVADO":
      bgColor = "bg-green-100 dark:bg-green-900/30";
      textColor = "text-green-700 dark:text-green-400";
      break;
    case "AGUARDANDO_PAGAMENTO":
      bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
      textColor = "text-yellow-700 dark:text-yellow-400";
      break;
    case "EM_PREPARACAO":
      bgColor = "bg-blue-100 dark:bg-blue-900/30";
      textColor = "text-blue-700 dark:text-blue-400";
      break;
    case "ENVIADO":
      bgColor = "bg-purple-100 dark:bg-purple-900/30";
      textColor = "text-purple-700 dark:text-purple-400";
      break;
    case "ENTREGUE":
      bgColor = "bg-indigo-100 dark:bg-indigo-900/30";
      textColor = "text-indigo-700 dark:text-indigo-400";
      break;
    case "CANCELADO":
      bgColor = "bg-red-100 dark:bg-red-900/30";
      textColor = "text-red-700 dark:text-red-400";
      break;
    case "ESTORNADO":
      bgColor = "bg-orange-100 dark:bg-orange-900/30";
      textColor = "text-orange-700 dark:text-orange-400";
      break;
    default:
      bgColor = "bg-gray-100 dark:bg-gray-900/30";
      textColor = "text-gray-700 dark:text-gray-400";
  }

  const getStatusLabel = (status: StatusPedido): string => {
    const labels: Record<StatusPedido, string> = {
      AGUARDANDO_PAGAMENTO: "Aguardando Pagamento",
      PAGAMENTO_APROVADO: "Pagamento Aprovado",
      EM_PREPARACAO: "Em Preparação",
      ENVIADO: "Enviado",
      ENTREGUE: "Entregue",
      CANCELADO: "Cancelado",
      ESTORNADO: "Estornado"
    };
    return labels[status] || status;
  };

  return (
    <Badge className={`${bgColor} ${textColor} rounded-full`}>
      {getStatusLabel(status)}
    </Badge>
  );
}

// Componente para o modal de visualização detalhada do pedido
function ModalVisualizarPedido({ pedido }: { pedido: PedidoItem }) {
  // Formatação de moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Formatar data
  const formatarData = (data: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data));
  };

  // Método de pagamento formatado
  const getMetodoPagamento = (metodo: MetodoPagamento | null): string => {
    if (!metodo) return "Não especificado";
    
    const metodos: Record<MetodoPagamento, string> = {
      PIX: "PIX",
      CARTAO_CREDITO: "Cartão de Crédito",
      CARTAO_DEBITO: "Cartão de Débito",
      BOLETO: "Boleto",
      DINHEIRO: "Dinheiro",
      TRANSFERENCIA: "Transferência"
    };
    
    return metodos[metodo];
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Número do Pedido</h3>
          <p className="text-lg font-semibold">{pedido.numero || pedido.codigo}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
          <StatusBadge status={pedido.status} />
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Data do Pedido</h3>
          <p className="font-medium">{formatarData(pedido.createdAt)}</p>
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">👤 Informações do Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="font-medium">{pedido.usuario?.nome || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{pedido.usuario?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="font-medium">{pedido.usuario?.telefone || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CPF</p>
            <p className="font-medium">{pedido.usuario?.cpfCnpj || 'Não informado'}</p>
          </div>
        </div>
      </div>

      {/* Informações de Pagamento */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">💳 Informações de Pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Método</p>
            <p className="font-medium">{getMetodoPagamento(pedido.metodoPagamento)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status do Pagamento</p>
            <Badge variant={pedido.statusPagamento === 'PAGO' ? 'default' : 'secondary'}>
              {pedido.statusPagamento || 'PENDENTE'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">ID da Transação</p>
            <p className="font-medium text-xs">{pedido.transacaoId || 'N/A'}</p>
          </div>
        </div>
        
        {pedido.pixQrCode && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">PIX - Código Copia e Cola:</p>
            <p className="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded border break-all">
              {pedido.pixCopiaCola || pedido.pixQrCode}
            </p>
          </div>
        )}
      </div>

      {/* Valores do Pedido */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">💰 Resumo Financeiro</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatarMoeda(pedido.subtotal || pedido.valorTotal)}</span>
          </div>
          {(pedido.valorDesconto || 0) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto:</span>
              <span className="font-medium">-{formatarMoeda(pedido.valorDesconto || 0)}</span>
            </div>
          )}
          {pedido.codigoCupom && (
            <div className="flex justify-between text-blue-600">
              <span>Cupom:</span>
              <span className="font-medium">{pedido.codigoCupom}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-green-600">{formatarMoeda(pedido.valorTotal)}</span>
          </div>
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">🛍️ Itens do Pedido</h3>
        <div className="space-y-3">
          {pedido.itens && pedido.itens.length > 0 ? (
            pedido.itens.map((item: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.nome}</h4>
                    {item.descricao && (
                      <p className="text-sm text-gray-600 mt-1">{item.descricao}</p>
                    )}
                    {item.nomePersonagem && (
                      <p className="text-sm text-blue-600 mt-1">👦 Personagem: {item.nomePersonagem}</p>
                    )}
                    {item.arquivosDigitais && item.arquivosDigitais.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">📁 Arquivos digitais:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.arquivosDigitais.map((arquivo: string, i: number) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {arquivo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">{formatarMoeda(item.preco)}</p>
                    <p className="text-sm text-gray-500">Qtd: {item.quantidade}</p>
                    <p className="text-sm font-semibold">{formatarMoeda(item.subtotal)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum item encontrado</p>
          )}
        </div>
      </div>

      {/* Observações */}
      {(pedido.observacoes || pedido.observacoesInternas) && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">📝 Observações</h3>
          {pedido.observacoes && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">Observações do cliente:</p>
              <p className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">{pedido.observacoes}</p>
            </div>
          )}
          {pedido.observacoesInternas && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Observações internas:</p>
              <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">{pedido.observacoesInternas}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente para o modal de edição de pedido
function ModalEditarPedido({ pedido, onSalvar }: { pedido: PedidoItem, onSalvar?: (dados: any) => void }) {
  const [status, setStatus] = useState(pedido.status);
  const [observacoesInternas, setObservacoesInternas] = useState(pedido.observacoesInternas || '');
  const [arquivoUpload, setArquivoUpload] = useState<File | null>(null);

  const handleSalvar = () => {
    const dadosAtualizados = {
      status,
      observacoesInternas,
      // Aqui você pode adicionar lógica para upload de arquivo se necessário
    };
    
    if (onSalvar) {
      onSalvar(dadosAtualizados);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status do Pedido */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status do Pedido
        </label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value as StatusPedido)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
          <option value="PAGAMENTO_APROVADO">Pagamento Aprovado</option>
          <option value="EM_PREPARACAO">Em Preparação</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ENTREGUE">Entregue</option>
          <option value="CANCELADO">Cancelado</option>
          <option value="ESTORNADO">Estornado</option>
        </select>
      </div>

      {/* Observações Internas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Observações Internas
        </label>
        <textarea
          value={observacoesInternas}
          onChange={(e) => setObservacoesInternas(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
          placeholder="Adicione observações internas sobre o pedido..."
        />
      </div>

      {/* Upload de Arquivo (para reenvio de produtos digitais) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reenviar Arquivo Digital (se necessário)
        </label>
        <input
          type="file"
          onChange={(e) => setArquivoUpload(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
          accept=".pdf,.zip,.jpg,.png"
        />
        <p className="text-xs text-gray-500 mt-1">
          Formatos aceitos: PDF, ZIP, JPG, PNG
        </p>
      </div>

      {/* Informações do Pedido (apenas visualização) */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Informações do Pedido</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Número:</span>
            <span className="ml-2 font-medium">{pedido.numero || pedido.codigo}</span>
          </div>
          <div>
            <span className="text-gray-500">Cliente:</span>
            <span className="ml-2 font-medium">{pedido.usuario.nome}</span>
          </div>
          <div>
            <span className="text-gray-500">Valor:</span>
            <span className="ml-2 font-medium">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valorTotal)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Pagamento:</span>
            <span className="ml-2 font-medium">{pedido.statusPagamento || 'PENDENTE'}</span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <DialogClose asChild>
          <Button variant="outline">
            Cancelar
          </Button>
        </DialogClose>
        <Button 
          onClick={handleSalvar}
          className="bg-gradient-to-r from-[#27b99a] to-[#ff0080] hover:from-[#22a085] hover:to-[#e6006b] text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}

// Componente para o modal de exclusão de pedido
function ModalExcluirPedido({ pedido, onConfirm }: { pedido: PedidoItem, onConfirm: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-center">
        Tem certeza que deseja excluir o pedido <strong>{pedido.codigo}</strong>?
      </p>
      <p className="text-center text-gray-500 dark:text-gray-400">
        Esta ação não poderá ser desfeita.
      </p>
      <div className="flex justify-center gap-4 mt-6">
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button 
          variant="destructive" 
          onClick={onConfirm}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}

interface TabelaPedidosProps {
  pedidos: any[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onAtualizarPedido: (pedidoId: string, dados: any) => Promise<void>;
  onExcluirPedido: (pedidoId: string) => Promise<void>;
  onMudarPagina: (novaPagina: number) => void;
}

// Componente principal da tabela
export function TabelaPedidos({ 
  pedidos, 
  loading, 
  pagination, 
  onAtualizarPedido, 
  onExcluirPedido, 
  onMudarPagina 
}: TabelaPedidosProps) {
  // Estado para controlar os modais
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoItem | null>(null);
  
  // Estado para controlar os modais
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  // Formatação de moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Formatar data
  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(data));
  };

  // Método de pagamento formatado
  const getMetodoPagamento = (metodo: MetodoPagamento | null): string => {
    if (!metodo) return "Não especificado";
    
    const metodos: Record<MetodoPagamento, string> = {
      PIX: "PIX",
      CARTAO_CREDITO: "Cartão de Crédito",
      CARTAO_DEBITO: "Cartão de Débito",
      BOLETO: "Boleto",
      DINHEIRO: "Dinheiro",
      TRANSFERENCIA: "Transferência"
    };
    
    return metodos[metodo];
  };

  // Função para excluir um pedido
  const handleExcluirPedido = async () => {
    if (pedidoSelecionado) {
      await onExcluirPedido(pedidoSelecionado.id);
      setModalExcluir(false);
      setPedidoSelecionado(null);
    }
  };

  // Função para abrir modal de visualização
  const abrirModalVisualizar = (pedido: PedidoItem) => {
    setPedidoSelecionado(pedido);
    setModalVisualizar(true);
  };

  // Função para abrir modal de edição
  const abrirModalEditar = (pedido: PedidoItem) => {
    setPedidoSelecionado(pedido);
    setModalEditar(true);
  };

  // Função para salvar alterações do pedido
  const handleSalvarEdicao = async (dados: any) => {
    if (pedidoSelecionado) {
      await onAtualizarPedido(pedidoSelecionado.id, dados);
      setModalEditar(false);
      setPedidoSelecionado(null);
    }
  };

  // Função para abrir modal de exclusão
  const abrirModalExcluir = (pedido: PedidoItem) => {
    setPedidoSelecionado(pedido);
    setModalExcluir(true);
  };

  return (
    <Card className="rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle>Todos os Pedidos</CardTitle>
        <CardDescription>
          Gerencie os pedidos da sua loja. Visualize, edite ou exclua conforme necessário.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-6 w-1/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-6 w-1/6 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-6 w-1/6 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-6 w-1/6 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-6 w-1/6 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.numero || pedido.codigo}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pedido.usuario?.nome || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{pedido.usuario?.email || ''}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatarData(pedido.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={pedido.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={pedido.statusPagamento === 'PAGO' ? 'default' : 'secondary'}>
                        {pedido.statusPagamento || 'PENDENTE'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getMetodoPagamento(pedido.metodoPagamento)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-medium">{pedido.itens?.length || 0}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatarMoeda(pedido.valorTotal)}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => abrirModalVisualizar(pedido)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => abrirModalEditar(pedido)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => abrirModalExcluir(pedido)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Paginação */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Exibindo <span className="font-medium">{pedidos.length}</span> de{" "}
                <span className="font-medium">{pagination.total}</span> pedidos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => onMudarPagina(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  {pagination.page} de {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => onMudarPagina(pagination.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Modais */}
      <Dialog open={modalVisualizar} onOpenChange={setModalVisualizar}>
        <DialogContent className="max-w-3xl rounded-3xl bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>
              Informações completas sobre o pedido selecionado.
            </DialogDescription>
          </DialogHeader>
          {pedidoSelecionado && <ModalVisualizarPedido pedido={pedidoSelecionado} />}
        </DialogContent>
      </Dialog>
      
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="max-w-2xl rounded-3xl bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
            <DialogDescription>
              Edite as informações do pedido selecionado.
            </DialogDescription>
          </DialogHeader>
          {pedidoSelecionado && <ModalEditarPedido pedido={pedidoSelecionado} onSalvar={handleSalvarEdicao} />}
        </DialogContent>
      </Dialog>
      
      <Dialog open={modalExcluir} onOpenChange={setModalExcluir}>
        <DialogContent className="max-w-md rounded-3xl bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Excluir Pedido</DialogTitle>
            <DialogDescription>
              Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {pedidoSelecionado && (
            <ModalExcluirPedido 
              pedido={pedidoSelecionado} 
              onConfirm={handleExcluirPedido}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
