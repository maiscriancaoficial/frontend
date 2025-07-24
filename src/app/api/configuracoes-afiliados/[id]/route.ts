import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// PUT - Atualizar configurações globais
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Verificar se a configuração existe
    const configExistente = await prisma.configuracaoAfiliado.findUnique({
      where: { id }
    });

    if (!configExistente) {
      return NextResponse.json(
        { success: false, error: 'Configuração não encontrada' },
        { status: 404 }
      );
    }

    // Validações
    if (valorComissaoPadrao !== undefined && valorComissaoPadrao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor da comissão deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (valorMinimoSaquePadrao !== undefined && valorMinimoSaquePadrao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor mínimo de saque deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (diasProcessamentoSaque !== undefined && diasProcessamentoSaque <= 0) {
      return NextResponse.json(
        { success: false, error: 'Dias de processamento deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (cookieExpiracao !== undefined && cookieExpiracao <= 0) {
      return NextResponse.json(
        { success: false, error: 'Expiração do cookie deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (limiteVendasAprovacao !== undefined && limiteVendasAprovacao < 0) {
      return NextResponse.json(
        { success: false, error: 'Limite de vendas não pode ser negativo' },
        { status: 400 }
      );
    }

    const configAtualizada = await prisma.configuracaoAfiliado.update({
      where: { id },
      data: {
        ...(tipoComissaoPadrao && { tipoComissaoPadrao }),
        ...(valorComissaoPadrao !== undefined && { valorComissaoPadrao }),
        ...(tipoEventoComissaoPadrao && { tipoEventoComissaoPadrao }),
        ...(metodoSaquePadrao && { metodoSaquePadrao }),
        ...(valorMinimoSaquePadrao !== undefined && { valorMinimoSaquePadrao }),
        ...(diasProcessamentoSaque !== undefined && { diasProcessamentoSaque }),
        ...(asaasApiKey !== undefined && { asaasApiKey }),
        ...(asaasEnvironment && { asaasEnvironment }),
        ...(asaasWebhookUrl !== undefined && { asaasWebhookUrl }),
        ...(dominioAfiliado && { dominioAfiliado }),
        ...(prefixoLink && { prefixoLink }),
        ...(aprovacaoAutomatica !== undefined && { aprovacaoAutomatica }),
        ...(limiteVendasAprovacao !== undefined && { limiteVendasAprovacao }),
        ...(cookieExpiracao !== undefined && { cookieExpiracao }),
        ...(ativo !== undefined && { ativo })
      }
    });

    const configFormatada = {
      id: configAtualizada.id,
      tipoComissaoPadrao: configAtualizada.tipoComissaoPadrao,
      valorComissaoPadrao: configAtualizada.valorComissaoPadrao,
      tipoEventoComissaoPadrao: configAtualizada.tipoEventoComissaoPadrao,
      metodoSaquePadrao: configAtualizada.metodoSaquePadrao,
      valorMinimoSaquePadrao: configAtualizada.valorMinimoSaquePadrao,
      diasProcessamentoSaque: configAtualizada.diasProcessamentoSaque,
      asaasApiKey: configAtualizada.asaasApiKey,
      asaasEnvironment: configAtualizada.asaasEnvironment,
      asaasWebhookUrl: configAtualizada.asaasWebhookUrl,
      dominioAfiliado: configAtualizada.dominioAfiliado,
      prefixoLink: configAtualizada.prefixoLink,
      aprovacaoAutomatica: configAtualizada.aprovacaoAutomatica,
      limiteVendasAprovacao: configAtualizada.limiteVendasAprovacao,
      cookieExpiracao: configAtualizada.cookieExpiracao,
      ativo: configAtualizada.ativo,
      createdAt: configAtualizada.createdAt,
      updatedAt: configAtualizada.updatedAt
    };

    return NextResponse.json({
      success: true,
      configuracao: configFormatada
    });

  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir configurações (resetar para padrão)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar se a configuração existe
    const configExistente = await prisma.configuracaoAfiliado.findUnique({
      where: { id }
    });

    if (!configExistente) {
      return NextResponse.json(
        { success: false, error: 'Configuração não encontrada' },
        { status: 404 }
      );
    }

    await prisma.configuracaoAfiliado.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Configurações resetadas para padrão'
    });

  } catch (error) {
    console.error('Erro ao excluir configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
