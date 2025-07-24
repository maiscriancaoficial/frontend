'use client';

import { motion } from 'framer-motion';
import { Eye, Edit, MoreHorizontal, Trash2, ToggleLeft, ToggleRight, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PostagemDados, CategoriaDados } from '../page';

interface ListaPostagensProps {
  postagens: PostagemDados[];
  categorias: CategoriaDados[];
  onEditar: (postagem: PostagemDados) => void;
  onAlterarStatus: (id: string) => void;
  onExcluir: (id: string) => void;
}

function formatarData(data: string | Date): string {
  const date = typeof data === 'string' ? new Date(data) : data;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function ListaPostagens({ 
  postagens, 
  categorias, 
  onEditar, 
  onAlterarStatus, 
  onExcluir 
}: ListaPostagensProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#27b99a]/5 to-[#ff0080]/5 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Postagens do Blog</h3>
        <p className="text-sm text-gray-600 mt-1">{postagens.length} postagens encontradas</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="text-left py-4 px-6 font-medium text-gray-700">Título</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Categoria</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Autor</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Data</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Visualizações</th>
              <th className="text-right py-4 px-6 font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {postagens.map((postagem, index) => (
              <motion.tr
                key={postagem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    {postagem.fotoCapa && (
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={postagem.fotoCapa} 
                          alt={postagem.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">{postagem.titulo}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{postagem.resumo}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="secondary" 
                    className="bg-[#27b99a]/10 text-[#27b99a] border-[#27b99a]/20 rounded-full"
                  >
                    {postagem.categoriaNome || 'Sem categoria'}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-700">{postagem.autor || 'Anônimo'}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{formatarData(postagem.createdAt)}</span>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant={postagem.ativo ? 'default' : 'secondary'}
                    className={postagem.ativo 
                      ? 'bg-green-100 text-green-700 border-green-200 rounded-full' 
                      : 'bg-gray-100 text-gray-600 border-gray-200 rounded-full'
                    }
                  >
                    {postagem.ativo ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{postagem.visualizacoes || 0}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl border-gray-200 shadow-lg">
                        <DropdownMenuItem 
                          onClick={() => onEditar(postagem)}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer"
                        >
                          <Edit className="h-4 w-4 text-[#27b99a]" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onAlterarStatus(postagem.id)}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer"
                        >
                          {postagem.ativo ? (
                            <>
                              <ToggleLeft className="h-4 w-4 text-orange-500" />
                              <span>Despublicar</span>
                            </>
                          ) : (
                            <>
                              <ToggleRight className="h-4 w-4 text-green-500" />
                              <span>Publicar</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onExcluir(postagem.id)}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-red-50 rounded-xl cursor-pointer text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {postagens.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-gray-400 mb-2">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma postagem encontrada</h3>
          <p className="text-gray-500">Ajuste os filtros ou crie uma nova postagem.</p>
        </div>
      )}
    </div>
  );
}