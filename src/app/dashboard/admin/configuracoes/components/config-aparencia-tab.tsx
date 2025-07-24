'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Palette, 
  Image, 
  Save,
  Upload,
  Brush,
  Check,
  X
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

// Componente para seleção de cores
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-700 dark:text-gray-300">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
            id={`color-${label}`}
          />
          <label 
            htmlFor={`color-${label}`} 
            className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden cursor-pointer flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <Brush className="h-4 w-4 text-white opacity-50 hover:opacity-100" />
          </label>
        </div>
        <Input
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-28 border-gray-300 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-[10px]"
        />
      </div>
    </div>
  );
}

export function ConfigAparenciaTab() {
  // Estado para cores do tema
  const [corPrimaria, setCorPrimaria] = useState('#EC4899'); // Pink-600
  const [corSecundaria, setCorSecundaria] = useState('#F472B6'); // Pink-400
  const [corFundo, setCorFundo] = useState('#FFFFFF'); // White
  const [corTexto, setCorTexto] = useState('#111827'); // Gray-900
  
  // Estado para configurações de logo
  const [logoURL, setLogoURL] = useState('');
  const [faviconURL, setFaviconURL] = useState('');
  
  // Estado para modo do site
  const [temaMode, setTemaMode] = useState('auto');
  
  // Estado para configurações de bordas
  const [borderRadius, setBorderRadius] = useState([10]);
  
  // Visualização do tema
  const themePreview = {
    background: corFundo,
    text: corTexto,
    primary: corPrimaria,
    secondary: corSecundaria,
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configurações de aparência salvas');
    // Aqui implementaria a lógica para salvar no banco
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Palette className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Cores do Tema</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Personalize as cores principais do seu site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <ColorPicker
                color={corPrimaria}
                onChange={setCorPrimaria}
                label="Cor Primária"
              />
              
              <ColorPicker
                color={corSecundaria}
                onChange={setCorSecundaria}
                label="Cor Secundária"
              />
              
              <ColorPicker
                color={corFundo}
                onChange={setCorFundo}
                label="Cor de Fundo"
              />
              
              <ColorPicker
                color={corTexto}
                onChange={setCorTexto}
                label="Cor de Texto"
              />
              
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Arredondamento de Bordas</Label>
                <div className="py-4">
                  <Slider
                    defaultValue={[10]}
                    min={0}
                    max={20}
                    step={1}
                    value={borderRadius}
                    onValueChange={setBorderRadius}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Sem bordas</span>
                    <span className="text-xs text-gray-500">{borderRadius}px</span>
                    <span className="text-xs text-gray-500">Máximo</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Label className="text-gray-700 dark:text-gray-300">Visualização do Tema</Label>
              
              <div className="flex-1 border border-gray-200 dark:border-gray-800 rounded-[10px] overflow-hidden">
                {/* Cabeçalho */}
                <div 
                  style={{ backgroundColor: themePreview.primary }}
                  className="p-4 flex justify-between items-center"
                >
                  <div className="h-6 w-24 bg-white bg-opacity-30 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 bg-white bg-opacity-30 rounded-full"></div>
                    <div className="h-6 w-6 bg-white bg-opacity-30 rounded-full"></div>
                  </div>
                </div>
                
                {/* Conteúdo */}
                <div 
                  style={{ backgroundColor: themePreview.background, color: themePreview.text }}
                  className="p-4 h-48"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded" style={{ backgroundColor: themePreview.text + '20' }}></div>
                    <div className="h-4 w-1/2 rounded" style={{ backgroundColor: themePreview.text + '20' }}></div>
                    
                    <div className="flex space-x-2 mt-4">
                      <div 
                        className="px-4 py-2 rounded text-white flex items-center justify-center"
                        style={{ backgroundColor: themePreview.primary }}
                      >
                        <div className="h-3 w-12 bg-white bg-opacity-30 rounded"></div>
                      </div>
                      <div 
                        className="px-4 py-2 rounded flex items-center justify-center"
                        style={{ 
                          backgroundColor: 'transparent',
                          border: `1px solid ${themePreview.primary}`,
                          color: themePreview.primary
                        }}
                      >
                        <div className="h-3 w-12 rounded" style={{ backgroundColor: themePreview.primary + '50' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      {/* Cards de exemplo */}
                      <div className="p-3 border rounded shadow-sm" style={{ 
                        borderColor: themePreview.text + '20',
                        borderRadius: `${borderRadius}px`
                      }}>
                        <div className="h-3 w-1/3 rounded" style={{ backgroundColor: themePreview.secondary }}></div>
                        <div className="h-2 w-5/6 mt-2 rounded" style={{ backgroundColor: themePreview.text + '20' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Image className="mr-2 h-5 w-5 text-pink-500 dark:text-pink-400" />
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Logo e Favicon</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure a identidade visual do seu site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo */}
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-gray-300">Logo do Site</Label>
              <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[10px] bg-gray-50 dark:bg-gray-900">
                {logoURL ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={logoURL} 
                      alt="Logo" 
                      className="max-w-full max-h-full object-contain m-auto absolute inset-0" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => setLogoURL('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="mt-2">
                      <label 
                        htmlFor="logo-upload" 
                        className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-[10px] text-sm"
                      >
                        Escolher Logo
                      </label>
                      <input 
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setLogoURL(e.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">SVG, PNG, JPG (max. 2MB)</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Favicon */}
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-gray-300">Favicon</Label>
              <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[10px] bg-gray-50 dark:bg-gray-900">
                {faviconURL ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={faviconURL} 
                      alt="Favicon" 
                      className="max-w-16 max-h-16 object-contain" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => setFaviconURL('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="mt-2">
                      <label 
                        htmlFor="favicon-upload" 
                        className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-[10px] text-sm"
                      >
                        Escolher Favicon
                      </label>
                      <input 
                        id="favicon-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/png,image/x-icon,image/svg+xml" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setFaviconURL(e.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">ICO, PNG, SVG (max. 1MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Modo de Tema</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure o modo de tema padrão para seus visitantes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup 
            value={temaMode} 
            onValueChange={setTemaMode} 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className={`relative rounded-[10px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center ${temaMode === 'light' ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800' : 'bg-white dark:bg-gray-900'}`}>
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Label 
                htmlFor="light" 
                className="flex flex-col items-center gap-2 cursor-pointer w-full"
              >
                <div className="h-24 w-full bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-gray-900" />
                </div>
                <span className={`font-medium ${temaMode === 'light' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  Modo Claro
                </span>
                <span className="text-xs text-gray-500">
                  Sempre usar tema claro
                </span>
              </Label>
              {temaMode === 'light' && (
                <div className="absolute top-2 right-2 h-5 w-5 bg-pink-500 text-white rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            
            <div className={`relative rounded-[10px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center ${temaMode === 'dark' ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800' : 'bg-white dark:bg-gray-900'}`}>
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Label 
                htmlFor="dark" 
                className="flex flex-col items-center gap-2 cursor-pointer w-full"
              >
                <div className="h-24 w-full bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-gray-100" />
                </div>
                <span className={`font-medium ${temaMode === 'dark' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  Modo Escuro
                </span>
                <span className="text-xs text-gray-500">
                  Sempre usar tema escuro
                </span>
              </Label>
              {temaMode === 'dark' && (
                <div className="absolute top-2 right-2 h-5 w-5 bg-pink-500 text-white rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            
            <div className={`relative rounded-[10px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center ${temaMode === 'auto' ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800' : 'bg-white dark:bg-gray-900'}`}>
              <RadioGroupItem value="auto" id="auto" className="sr-only" />
              <Label 
                htmlFor="auto" 
                className="flex flex-col items-center gap-2 cursor-pointer w-full"
              >
                <div className="h-24 w-full bg-gradient-to-r from-white to-gray-900 rounded-lg border border-gray-200 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-gray-500" />
                </div>
                <span className={`font-medium ${temaMode === 'auto' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  Automático
                </span>
                <span className="text-xs text-gray-500">
                  Baseado nas preferências do usuário
                </span>
              </Label>
              {temaMode === 'auto' && (
                <div className="absolute top-2 right-2 h-5 w-5 bg-pink-500 text-white rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-[10px] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Aparência
        </Button>
      </div>
    </form>
  );
}
