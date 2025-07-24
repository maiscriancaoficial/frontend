import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET - Buscar configurações globais
export async function GET(request: NextRequest) {
  try {
    // Buscar a primeira configuração (deve haver apenas uma)
    const configuracao = await prisma.configuracaoAfiliado.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!configuracao) {
      // Retornar configurações padrão se não existir nenhuma
      const configPadrao = {
        id: null,
        tipoComissaoPadrao: 'porcentagem',
        valorComissaoPadrao: 10,
        tipoEventoComissaoPadrao: 'checkout',
        metodoSaquePadrao: 'pix',
        valorMinimoSaquePadrao: 50,
        diasProcessamentoSaque: 7,
        asaasApiKey: '',
        asaasEnvironment: 'sandbox',
        asaasWebhookUrl: '',
        dominioAfiliado: 'maiscrianca.com',
        prefixoLink: 'ref',
        aprovacaoAutomatica: false,
        limiteVendasAprovacao: 5,
        cookieExpiracao: 30,
        ativo: true
      };

      return NextResponse.json({
        success: true,
        configuracao: configPadrao
      });
    }

    const configFormatada = {
      id: configuracao.id,
      tipoComissaoPadrao: configuracao.tipoComissaoPadrao,
      valorComissaoPadrao: configuracao.valorComissaoPadrao,
      tipoEventoComissaoPadrao: configuracao.tipoEventoComissaoPadrao,
      metodoSaquePadrao: configuracao.metodoSaquePadrao,
      valorMinimoSaquePadrao: configuracao.valorMinimoSaquePadrao,
      diasProcessamentoSaque: configuracao.diasProcessamentoSaque,
      asaasApiKey: configuracao.asaasApiKey,
      asaasEnvironment: configuracao.asaasEnvironment,
      asaasWebhookUrl: configuracao.asaasWebhookUrl,
      dominioAfiliado: configuracao.dominioAfiliado,
      prefixoLink: configuracao.prefixoLink,
      aprovacaoAutomatica: configuracao.aprovacaoAutomatica,
      limiteVendasAprovacao: configuracao.limiteVendasAprovacao,
      cookieExpiracao: configuracao.cookieExpiracao,
      ativo: configuracao.ativo,
      createdAt: configuracao.createdAt,
      updatedAt: configuracao.updatedAt
    };

    return NextResponse.json({
      success: true,
      configuracao: configFormatada
    });

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar configurações globais
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tipoComissaoPadrao,
      valorComissaoPadrao,
      tipoEventoComissaoPadrao,
      metodoSaquePadrao,
      valorMinimoSaquePadrao,
      diasProcessamentoSaque,
      asaasApiKey,
      asaasEnvironment,
      asaasWebhookUrl,
      dominioAfiliado,
      prefixoLink,
      aprovacaoAutomatica,
      limiteVendasAprovacao,
      cookieExpiracao,
      ativo
    } = body;

    // Verificar se já existe uma configuração
    const configExistente = await prisma.configuracaoAfiliado.findFirst();
    
    if (configExistente) {
      return NextResponse.json(
        { success: false, error: 'Já existe uma configuração global. Use PUT para atualizar.' },
        { status: 400 }
      );
    }

    // Validações
    if (valorComissaoPadrao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor da comissão deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (valorMinimoSaquePadrao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor mínimo de saque deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (diasProcessamentoSaque <= 0) {
      return NextResponse.json(
        { success: false, error: 'Dias de processamento deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (cookieExpiracao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Expiração do cookie deve ser maior que zero' },
        { status: 400 }
      );
    }

    const novaConfiguracao = await prisma.configuracaoAfiliado.create({
      data: {
        tipoComissaoPadrao: tipoComissaoPadrao || 'porcentagem',
        valorComissaoPadrao: valorComissaoPadrao || 10,
        tipoEventoComissaoPadrao: tipoEventoComissaoPadrao || 'checkout',
        metodoSaquePadrao: metodoSaquePadrao || 'pix',
        valorMinimoSaquePadrao: valorMinimoSaquePadrao || 50,
        diasProcessamentoSaque: diasProcessamentoSaque || 7,
        asaasApiKey: asaasApiKey || '',
        asaasEnvironment: asaasEnvironment || 'sandbox',
        asaasWebhookUrl: asaasWebhookUrl || '',
        dominioAfiliado: dominioAfiliado || 'maiscrianca.com',
        prefixoLink: prefixoLink || 'ref',
        aprovacaoAutomatica: aprovacaoAutomatica || false,
        limiteVendasAprovacao: limiteVendasAprovacao || 5,
        cookieExpiracao: cookieExpiracao || 30,
        ativo: ativo !== undefined ? ativo : true
      }
    });

    const configFormatada = {
      id: novaConfiguracao.id,
      tipoComissaoPadrao: novaConfiguracao.tipoComissaoPadrao,
      valorComissaoPadrao: novaConfiguracao.valorComissaoPadrao,
      tipoEventoComissaoPadrao: novaConfiguracao.tipoEventoComissaoPadrao,
      metodoSaquePadrao: novaConfiguracao.metodoSaquePadrao,
      valorMinimoSaquePadrao: novaConfiguracao.valorMinimoSaquePadrao,
      diasProcessamentoSaque: novaConfiguracao.diasProcessamentoSaque,
      asaasApiKey: novaConfiguracao.asaasApiKey,
      asaasEnvironment: novaConfiguracao.asaasEnvironment,
      asaasWebhookUrl: novaConfiguracao.asaasWebhookUrl,
      dominioAfiliado: novaConfiguracao.dominioAfiliado,
      prefixoLink: novaConfiguracao.prefixoLink,
      aprovacaoAutomatica: novaConfiguracao.aprovacaoAutomatica,
      limiteVendasAprovacao: novaConfiguracao.limiteVendasAprovacao,
      cookieExpiracao: novaConfiguracao.cookieExpiracao,
      ativo: novaConfiguracao.ativo,
      createdAt: novaConfiguracao.createdAt,
      updatedAt: novaConfiguracao.updatedAt
    };

    return NextResponse.json({
      success: true,
      configuracao: configFormatada
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
