// Tipos para configuração do avatar baseados no modelo Prisma
export interface AvatarConfig {
  nome: string;
  tipo: string; // menino ou menina
  pele: string; // cor da pele (corAvatar no modelo)
  olhos?: string;
  cabelo?: string;
  corCabelo?: string;
  roupa?: string;
  corRoupa?: string;
  shorts?: string;
  oculos?: string;
  chapeu?: string;
  bone?: string;
  aderecos?: string[];
}

// Opções disponíveis para cada categoria
interface AvatarItemOption {
  id: string;
  imageUrl: string;
}

interface AvatarColorOption {
  id: string;
  colorValue: string;
  label: string;
}

export interface AvatarOptions {
  tipos: string[];
  peles: AvatarItemOption[];
  olhos: AvatarItemOption[];
  cabelos: AvatarItemOption[];
  coresCabelo: AvatarColorOption[];
  roupas: AvatarItemOption[];
  coresRoupa: AvatarColorOption[];
  shorts: AvatarItemOption[];
  oculos: AvatarItemOption[];
  chapeus: AvatarItemOption[];
  bones: AvatarItemOption[];
  aderecos: AvatarItemOption[];
}
