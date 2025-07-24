'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AvatarOptionSelector } from './avatar-option-selector';
import { AvatarCorSelector } from './avatar-cor-selector';
import { AvatarTipoSelector } from './avatar-tipo-selector';
import { ItemFallback } from './avatar-fallbacks';
import { AvatarConfig } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onChange: (newConfig: Partial<AvatarConfig>) => void;
  avatarOptions: {
    peles: Array<{id: string, imageUrl: string}>;
    olhos: Array<{id: string, imageUrl: string}>;
    cabelos: Array<{id: string, imageUrl: string}>;
    roupas: Array<{id: string, imageUrl: string}>;
    shorts: Array<{id: string, imageUrl: string}>;
    oculos: Array<{id: string, imageUrl: string}>;
    chapeus: Array<{id: string, imageUrl: string}>;
    bones: Array<{id: string, imageUrl: string}>;
    coresCabelo: Array<{id: string, colorValue: string, label: string}>;
    coresRoupa: Array<{id: string, colorValue: string, label: string}>;
  };
}

export function AvatarCustomizer({ config, onChange, avatarOptions }: AvatarCustomizerProps) {
  // Verificação para garantir que avatarOptions existe
  const isLoading = !avatarOptions;
  
  return (
    <div className="h-full overflow-y-auto px-4 py-6 bg-white rounded-2xl shadow-sm">
      <div className="mb-6">
        <Label htmlFor="avatar-nome" className="text-base font-semibold text-gray-700 mb-2 block">
          Nome do Personagem
        </Label>
        <Input
          id="avatar-nome"
          value={config.nome}
          onChange={(e) => onChange({ nome: e.target.value })}
          placeholder="Digite o nome do seu personagem"
          className="rounded-full focus-visible:ring-[#27b99a] border-gray-200"
        />
      </div>

      <AvatarTipoSelector 
        selectedTipo={config.tipo} 
        onSelect={(tipo) => onChange({ tipo })} 
      />

      <Tabs defaultValue="aparencia" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger 
            value="aparencia"
            className="data-[state=active]:bg-[#27b99a] data-[state=active]:text-white"
          >
            Aparência
          </TabsTrigger>
          <TabsTrigger 
            value="roupas"
            className="data-[state=active]:bg-[#27b99a] data-[state=active]:text-white"
          >
            Roupas
          </TabsTrigger>
          <TabsTrigger 
            value="acessorios"
            className="data-[state=active]:bg-[#27b99a] data-[state=active]:text-white"
          >
            Acessórios
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="aparencia" className="space-y-6">
          {isLoading ? (
            // Fallbacks para quando os dados estão carregando
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Pele</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <ItemFallback key={`pele-${i}`} itemType="pele" width={50} height={50} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Olhos</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <ItemFallback key={`olhos-${i}`} itemType="olhos" width={50} height={50} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Cabelo</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <ItemFallback key={`cabelo-${i}`} itemType="cabelo" width={50} height={50} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <AvatarOptionSelector
                title="Pele"
                options={avatarOptions.peles}
                selectedOption={config.pele}
                onSelect={(pele) => onChange({ pele })}
              />

              <AvatarOptionSelector
                title="Olhos"
                options={avatarOptions.olhos}
                selectedOption={config.olhos}
                onSelect={(olhos) => onChange({ olhos })}
              />

              <AvatarOptionSelector
                title="Cabelo"
                options={avatarOptions.cabelos}
                selectedOption={config.cabelo}
                onSelect={(cabelo) => onChange({ cabelo })}
              />

              {config.cabelo && (
                <AvatarCorSelector
                  title="Cor do Cabelo"
                  colors={avatarOptions.coresCabelo}
                  selectedColor={config.corCabelo}
                  onSelect={(corCabelo) => onChange({ corCabelo })}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="roupas" className="space-y-6">
          {isLoading ? (
            // Fallbacks para quando os dados estão carregando
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Roupa</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <ItemFallback key={`roupa-${i}`} itemType="roupa" width={50} height={50} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Shorts/Calças</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <ItemFallback key={`shorts-${i}`} itemType="roupa" width={50} height={50} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <AvatarOptionSelector
                title="Roupa"
                options={avatarOptions.roupas}
                selectedOption={config.roupa}
                onSelect={(roupa) => onChange({ roupa })}
              />

              {config.roupa && (
                <AvatarCorSelector
                  title="Cor da Roupa"
                  colors={avatarOptions.coresRoupa}
                  selectedColor={config.corRoupa}
                  onSelect={(corRoupa) => onChange({ corRoupa })}
                />
              )}

              <AvatarOptionSelector
                title="Shorts/Calças"
                options={avatarOptions.shorts}
                selectedOption={config.shorts}
                onSelect={(shorts) => onChange({ shorts })}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="acessorios" className="space-y-6">
          {isLoading ? (
            // Fallbacks para quando os dados estão carregando
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Óculos</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(3).fill(0).map((_, i) => (
                    <ItemFallback key={`oculos-${i}`} itemType="acessorio" width={50} height={50} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Chapéu</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(3).fill(0).map((_, i) => (
                    <ItemFallback key={`chapeu-${i}`} itemType="acessorio" width={50} height={50} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Boné</h3>
                <div className="flex flex-wrap gap-2">
                  {Array(3).fill(0).map((_, i) => (
                    <ItemFallback key={`bone-${i}`} itemType="acessorio" width={50} height={50} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <AvatarOptionSelector
                title="Óculos"
                options={avatarOptions.oculos}
                selectedOption={config.oculos}
                onSelect={(oculos) => onChange({ oculos })}
              />

              <AvatarOptionSelector
                title="Chapéu"
                options={avatarOptions.chapeus}
                selectedOption={config.chapeu}
                onSelect={(chapeu) => onChange({ chapeu })}
              />

              <AvatarOptionSelector
                title="Boné"
                options={avatarOptions.bones}
                selectedOption={config.bone}
                onSelect={(bone) => onChange({ bone })}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
