/**
 * Serviço de integração com a API DeepSeek para geração de conteúdo usando IA
 */

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GenerateContentOptions {
  productName: string;
  category?: string;
  targetAudience?: string;
  keyFeatures?: string[];
  contentType: 'short' | 'long' | 'seo' | 'sku';
  tone?: 'formal' | 'casual' | 'professional' | 'enthusiastic' | 'elegant';
}

/**
 * Gera conteúdo para produtos usando a API DeepSeek
 */
export async function generateProductContent(
  options: GenerateContentOptions
): Promise<string> {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('A API key do DeepSeek não está configurada');
    }

    const { productName, category, targetAudience, keyFeatures = [], contentType, tone = 'professional' } = options;
    
    let prompt = '';
    let maxTokens = 500;
    
    // Configuração de prompts específicos para cada tipo de conteúdo
    switch (contentType) {
      case 'short':
        prompt = `Crie uma breve descrição de produto para "${productName}"${
          category ? ` na categoria ${category}` : ''
        }${targetAudience ? ` direcionado para ${targetAudience}` : ''}.
        ${keyFeatures.length > 0 ? `Características importantes: ${keyFeatures.join(', ')}.` : ''}
        Use tom ${tone}. Máximo 100 palavras, sem introduções ou conclusões. Texto direto e persuasivo.`;
        maxTokens = 200;
        break;
        
      case 'long':
        prompt = `Elabore uma descrição detalhada e completa para o produto "${productName}"${
          category ? ` na categoria ${category}` : ''
        }${targetAudience ? ` direcionado para ${targetAudience}` : ''}.
        ${keyFeatures.length > 0 ? `Características importantes: ${keyFeatures.join(', ')}.` : ''}
        Use tom ${tone}. Inclua parágrafos bem formatados com introdução, 
        características detalhadas, benefícios, e aplicações. 
        Escreva usando HTML com tags <p>, <ul>, <li> e <strong> quando relevante. 
        Seja persuasivo e informativo. Entre 200-400 palavras.`;
        maxTokens = 1000;
        break;
        
      case 'seo':
        prompt = `Crie uma lista de palavras-chave SEO para o produto "${productName}"${
          category ? ` na categoria ${category}` : ''
        }${targetAudience ? ` visando ${targetAudience}` : ''}.
        ${keyFeatures.length > 0 ? `Características importantes: ${keyFeatures.join(', ')}.` : ''}
        Inclua palavras-chave de cauda longa e de volume médio. 
        Formate como uma string CSV (valores separados por vírgula).
        Entre 10-15 palavras-chave ou frases relevantes.`;
        maxTokens = 150;
        break;
        
      case 'sku':
        prompt = `Gere um código SKU único e significativo para o produto "${productName}"${
          category ? ` na categoria ${category}` : ''
        }.
        O SKU deve ser alfanumérico, ter entre 6-10 caracteres, começar com letras que representam 
        a categoria e incluir números que possam representar variantes ou ordem.
        Formato: XX-999 ou XXX-9999`;
        maxTokens = 20;
        break;
    }

    // Chamada para a API DeepSeek
    const response = await fetch('https://api.deepseek.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: contentType === 'sku' ? 0.1 : 0.7,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API DeepSeek: ${response.status} - ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();
    return data.choices[0].text.trim();
    
  } catch (error: any) {
    console.error('Erro ao gerar conteúdo com DeepSeek:', error);
    throw new Error(`Falha ao gerar conteúdo: ${error.message}`);
  }
}

/**
 * Versão do cliente para geração de conteúdo
 * Esta função é utilizada no front-end e faz uma chamada à API interna
 */
export async function generateProductContentClient(options: GenerateContentOptions): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar conteúdo: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error: any) {
    console.error('Erro ao gerar conteúdo:', error);
    throw new Error(`Falha ao gerar conteúdo: ${error.message}`);
  }
}
