'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Upload,
  FileImage,
  FileText,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ArquivosFormProps {
  form: UseFormReturn<any>;
}

export function ArquivosForm({ form }: ArquivosFormProps) {
  // Usar diretamente os valores do formulário
  const imagemCapa = form.watch('imagemCapa');
  const arquivoDownload = form.watch('arquivoDownload');
  
  const [nomeArquivo, setNomeArquivo] = useState<string>('');

  const handleCapaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        form.setValue('imagemCapa', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArquivoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNomeArquivo(file.name);
        form.setValue('arquivoDownload', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerCapa = () => {
    form.setValue('imagemCapa', '');
  };

  const removerArquivo = () => {
    setNomeArquivo('');
    form.setValue('arquivoDownload', '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Upload className="h-6 w-6 text-[#27b99a]" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Arquivos do Livro
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Faça upload da capa e arquivo do livro
        </p>
      </div>

      {/* Upload da Capa */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileImage className="h-5 w-5 text-[#27b99a]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Imagem da Capa *
          </h3>
        </div>

        {!imagemCapa ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-[#27b99a] transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#27b99a]/10 rounded-2xl flex items-center justify-center">
                <FileImage className="h-8 w-8 text-[#27b99a]" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Selecione a imagem da capa
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  PNG, JPG ou JPEG até 5MB
                </p>
                <Label htmlFor="capa-upload">
                  <Button
                    type="button"
                    className="bg-[#27b99a] hover:bg-[#239a82] text-white rounded-2xl px-6"
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher Arquivo
                    </span>
                  </Button>
                </Label>
                <Input
                  id="capa-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCapaUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-32 h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={imagemCapa}
                  alt="Preview da capa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Capa carregada com sucesso
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  A imagem da capa foi carregada e está pronta para uso.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('capa-upload')?.click()}
                    className="rounded-2xl border-gray-200 dark:border-gray-700 hover:border-[#27b99a] hover:text-[#27b99a]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removerCapa}
                    className="rounded-2xl border-red-200 dark:border-red-700 hover:border-red-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
                <Input
                  id="capa-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCapaUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Dica:</strong> Use uma imagem de alta qualidade (pelo menos 800x1000px) para melhor visualização.
          </p>
        </div>
      </div>

      {/* Upload do Arquivo para Download */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[#ff0080]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Arquivo para Download
          </h3>
        </div>

        {!arquivoDownload ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-[#ff0080] transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#ff0080]/10 rounded-2xl flex items-center justify-center">
                <FileText className="h-8 w-8 text-[#ff0080]" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Selecione o arquivo do livro
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  PDF, EPUB, MOBI até 50MB
                </p>
                <Label htmlFor="arquivo-upload">
                  <Button
                    type="button"
                    className="bg-[#ff0080] hover:bg-[#e6006b] text-white rounded-2xl px-6"
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher Arquivo
                    </span>
                  </Button>
                </Label>
                <Input
                  id="arquivo-upload"
                  type="file"
                  accept=".pdf,.epub,.mobi"
                  onChange={handleArquivoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#ff0080]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="h-8 w-8 text-[#ff0080]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Arquivo carregado com sucesso
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <strong>Arquivo:</strong> {nomeArquivo || 'Arquivo carregado'}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  O arquivo está pronto para download pelos usuários.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('arquivo-upload')?.click()}
                    className="rounded-2xl border-gray-200 dark:border-gray-700 hover:border-[#ff0080] hover:text-[#ff0080]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removerArquivo}
                    className="rounded-2xl border-red-200 dark:border-red-700 hover:border-red-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
                <Input
                  id="arquivo-upload"
                  type="file"
                  accept=".pdf,.epub,.mobi"
                  onChange={handleArquivoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Opcional:</strong> Se não enviar um arquivo, o livro será apenas para visualização das páginas.
          </p>
        </div>
      </div>

      {/* Resumo dos Arquivos */}
      <div className="bg-gradient-to-r from-[#27b99a]/5 to-[#ff0080]/5 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#27b99a] to-[#ff0080] rounded-2xl flex items-center justify-center flex-shrink-0">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Status dos Arquivos:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                {imagemCapa ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Capa do Livro
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {imagemCapa ? 'Carregada' : 'Obrigatória'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {arquivoDownload ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Arquivo para Download
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {arquivoDownload ? 'Carregado' : 'Opcional'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
