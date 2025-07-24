import { NextRequest, NextResponse } from 'next/server';
import { generateProductContent, GenerateContentOptions } from '@/lib/deepseek-ai';

export async function POST(req: NextRequest) {
  try {
    // Validar autorização (usuário precisa estar autenticado)
    // Em produção, você precisa verificar se o usuário está autenticado e tem permissões
    // ...

    const options: GenerateContentOptions = await req.json();
    
    // Validação básica
    if (!options.productName) {
      return NextResponse.json(
        { error: 'Nome do produto é obrigatório' },
        { status: 400 }
      );
    }
    
    if (!options.contentType) {
      return NextResponse.json(
        { error: 'Tipo de conteúdo é obrigatório' },
        { status: 400 }
      );
    }
    
    // Chama o serviço para gerar o conteúdo usando DeepSeek AI
    const content = await generateProductContent(options);
    
    return NextResponse.json({ content });
    
  } catch (error: any) {
    console.error('Erro ao gerar conteúdo com DeepSeek:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar conteúdo' },
      { status: 500 }
    );
  }
}
