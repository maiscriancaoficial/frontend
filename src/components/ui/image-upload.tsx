"use client";

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  disabled = false,
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.url);
        toast.success('Imagem enviada com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao enviar imagem');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative">
          <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-gray-200">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {onRemove && (
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#27b99a] transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#27b99a]" />
                <p className="text-sm text-gray-600">Enviando imagem...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Clique para selecionar uma imagem
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP até 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
