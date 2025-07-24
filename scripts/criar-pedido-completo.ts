import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function criarPedidoCompleto() {
  try {
    console.log('🚀 Iniciando criação de pedido completo...');

    // 1. Buscar ou criar um usuário de teste
    let usuario = await prisma.usuario.findFirst({
      where: {
        email: 'teste@maiscrianca.com'
      }
    });

    if (!usuario) {
      console.log('👤 Criando usuário de teste...');
      usuario = await prisma.usuario.create({
        data: {
          nome: 'João da Silva',
          email: 'teste@maiscrianca.com',
          senha: '$2b$10$hash_exemplo', // Hash de senha de exemplo
          telefone: '(11) 99999-9999',
          cpf: '123.456.789-00',
          dataNascimento: new Date('1985-06-15'),
          genero: 'MASCULINO',
          ativo: true,
          emailVerificado: true,
          enderecos: {
            create: {
              tipo: 'RESIDENCIAL',
              nome: 'Casa',
              cep: '01234-567',
              rua: 'Rua das Flores, 123',
              numero: '123',
              bairro: 'Centro',
              cidade: 'São Paulo',
              estado: 'SP',
              pais: 'Brasil',
              principal: true
            }
          }
        }
      });
      console.log('✅ Usuário criado:', usuario.nome);
    } else {
      console.log('✅ Usuário encontrado:', usuario.nome);
    }

    // 2. Buscar ou criar um afiliado
    let afiliado = await prisma.afiliado.findFirst({
      where: {
        codigo: 'AFILIADO_TESTE'
      }
    });

    if (!afiliado) {
      console.log('🤝 Criando afiliado de teste...');
      afiliado = await prisma.afiliado.create({
        data: {
          usuarioId: usuario.id,
          codigo: 'AFILIADO_TESTE',
          nome: 'Afiliado Teste',
          email: 'afiliado@teste.com',
          telefone: '(11) 88888-8888',
          status: 'ATIVO',
          comissaoPadrao: 10.0,
          totalCliques: 0,
          totalAcessos: 0,
          totalVendas: 0,
          totalComissoes: 0
        }
      });
      console.log('✅ Afiliado criado:', afiliado.nome);
    } else {
      console.log('✅ Afiliado encontrado:', afiliado.nome);
    }

    // 3. Buscar ou criar um cupom
    let cupom = await prisma.cupom.findFirst({
      where: {
        codigo: 'TESTE10'
      }
    });

    if (!cupom) {
      console.log('🎟️ Criando cupom de teste...');
      cupom = await prisma.cupom.create({
        data: {
          codigo: 'TESTE10',
          titulo: 'Cupom de Teste - 10% OFF',
          descricao: 'Cupom de desconto para testes do sistema',
          tipo: 'PERCENTUAL',
          valor: 10.0,
          valorMinimo: 50.0,
          usoMaximo: 100,
          usoAtual: 0,
          dataInicio: new Date(),
          dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          ativo: true
        }
      });
      console.log('✅ Cupom criado:', cupom.codigo);
    } else {
      console.log('✅ Cupom encontrado:', cupom.codigo);
    }

    // 4. Buscar ou criar produtos/livros
    let livro = await prisma.livro.findFirst({
      where: {
        titulo: { contains: 'Aventuras' }
      }
    });

    if (!livro) {
      console.log('📚 Criando livro de teste...');
      livro = await prisma.livro.create({
        data: {
          titulo: 'As Aventuras Mágicas',
          descricao: 'Um livro personalizado cheio de aventuras incríveis!',
          preco: 49.90,
          precoPromocional: 39.90,
          ativo: true,
          digital: true,
          personalizavel: true,
          faixaEtariaMin: 4,
          faixaEtariaMax: 10,
          numeroPaginas: 24,
          idioma: 'pt-BR',
          formato: 'PDF',
          tamanho: '21x21cm',
          isbn: '978-85-123456-78-9',
          arquivoPdf: 'livros/aventuras-magicas.pdf',
          imagemCapa: 'capas/aventuras-magicas.jpg'
        }
      });
      console.log('✅ Livro criado:', livro.titulo);
    } else {
      console.log('✅ Livro encontrado:', livro.titulo);
    }

    // 5. Gerar número sequencial do pedido
    const ultimoPedido = await prisma.pedido.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { numero: true }
    });

    const proximoNumero = ultimoPedido 
      ? `PED-${String(parseInt(ultimoPedido.numero.split('-')[1]) + 1).padStart(6, '0')}`
      : 'PED-000001';

    console.log('📋 Número do pedido:', proximoNumero);

    // 6. Calcular valores
    const subtotal = 89.80; // 49.90 (livro) + 39.90 (kit atividades)
    const valorDesconto = subtotal * (cupom.valor / 100); // 10% de desconto
    const valorTotal = subtotal - valorDesconto;

    // 7. Criar o pedido completo com transação
    const pedidoCompleto = await prisma.$transaction(async (tx) => {
      // Criar o pedido
      const pedido = await tx.pedido.create({
        data: {
          numero: proximoNumero,
          usuarioId: usuario.id,
          status: 'AGUARDANDO_PAGAMENTO',
          subtotal: subtotal,
          valorDesconto: valorDesconto,
          valorTotal: valorTotal,
          metodoPagamento: 'PIX',
          statusPagamento: 'PENDENTE',
          transacaoId: `asaas_${Date.now()}`,
          pixQrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
          pixCopiaCola: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
          dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
          cupomId: cupom.id,
          codigoCupom: cupom.codigo,
          afiliadoId: afiliado.id,
          codigoAfiliado: afiliado.codigo,
          observacoes: 'Pedido de teste criado automaticamente',
          observacoesInternas: 'Pedido para testar o dashboard administrativo'
        }
      });

      // Criar itens do pedido
      const item1 = await tx.itemPedido.create({
        data: {
          pedidoId: pedido.id,
          livroId: livro.id,
          nome: 'Livro Personalizado - As Aventuras Mágicas',
          descricao: 'Livro personalizado onde a criança é o protagonista',
          preco: 49.90,
          quantidade: 1,
          subtotal: 49.90,
          nomePersonagem: 'João da Silva Jr.',
          avatarPersonalizado: {
            tipo: 'menino',
            cabelo: 'castanho',
            olhos: 'azuis',
            pele: 'clara',
            roupa: 'camiseta_azul'
          },
          arquivosDigitais: ['livro_joao_aventuras.pdf', 'certificado_personalizacao.pdf'],
          linkDownload: `https://download.maiscrianca.com/pedidos/${pedido.id}/item1`,
          dataLiberacao: new Date()
        }
      });

      const item2 = await tx.itemPedido.create({
        data: {
          pedidoId: pedido.id,
          nome: 'Kit de Atividades Educativas',
          descricao: 'Conjunto completo de atividades para desenvolvimento infantil',
          preco: 39.90,
          quantidade: 1,
          subtotal: 39.90,
          arquivosDigitais: [
            'atividades_matematica.pdf',
            'atividades_portugues.pdf',
            'jogos_educativos.zip',
            'guia_pais.pdf'
          ],
          linkDownload: `https://download.maiscrianca.com/pedidos/${pedido.id}/item2`,
          dataLiberacao: new Date()
        }
      });

      // Criar histórico do pedido
      await tx.historicoPedido.create({
        data: {
          pedidoId: pedido.id,
          statusAnterior: null,
          statusNovo: 'AGUARDANDO_PAGAMENTO',
          observacao: 'Pedido criado automaticamente via script',
          usuarioId: null
        }
      });

      // Criar registro de pagamento
      await tx.pagamentoPedido.create({
        data: {
          pedidoId: pedido.id,
          valor: valorTotal,
          metodoPagamento: 'PIX',
          status: 'PENDENTE',
          transacaoId: `asaas_payment_${Date.now()}`,
          gatewayResposta: JSON.stringify({
            status: 'PENDING',
            gateway: 'asaas',
            created_at: new Date().toISOString()
          }),
          pixQrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
          pixCopiaCola: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
          dataProcessamento: new Date(),
          dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });

      // Registrar uso do cupom
      await tx.cupomUtilizado.create({
        data: {
          cupomId: cupom.id,
          usuarioId: usuario.id,
          pedidoId: pedido.id,
          dataUso: new Date()
        }
      });

      // Atualizar uso do cupom
      await tx.cupom.update({
        where: { id: cupom.id },
        data: { usoAtual: { increment: 1 } }
      });

      // Registrar venda do afiliado
      await tx.vendaAfiliado.create({
        data: {
          afiliadoId: afiliado.id,
          pedidoId: pedido.id,
          usuarioId: usuario.id,
          valorVenda: valorTotal,
          comissaoPercentual: afiliado.comissaoPadrao,
          valorComissao: valorTotal * (afiliado.comissaoPadrao / 100),
          status: 'PENDENTE',
          tipoEvento: 'CHECKOUT_FINALIZADO'
        }
      });

      return { pedido, itens: [item1, item2] };
    });

    console.log('🎉 Pedido criado com sucesso!');
    console.log('📋 Número:', pedidoCompleto.pedido.numero);
    console.log('💰 Valor Total:', `R$ ${pedidoCompleto.pedido.valorTotal.toFixed(2)}`);
    console.log('🛍️ Itens:', pedidoCompleto.itens.length);
    console.log('🎟️ Cupom aplicado:', cupom.codigo);
    console.log('🤝 Afiliado:', afiliado.codigo);

    // Buscar e exibir o pedido completo
    const pedidoDetalhado = await prisma.pedido.findUnique({
      where: { id: pedidoCompleto.pedido.id },
      include: {
        usuario: {
          select: { nome: true, email: true }
        },
        itens: true,
        cupom: {
          select: { codigo: true, titulo: true }
        },
        afiliado: {
          select: { codigo: true, nome: true }
        },
        pagamentos: true,
        historico: true,
        cupomUtilizado: true,
        vendasAfiliados: true
      }
    });

    console.log('\n📊 Resumo do Pedido:');
    console.log('=====================================');
    console.log(`ID: ${pedidoDetalhado?.id}`);
    console.log(`Número: ${pedidoDetalhado?.numero}`);
    console.log(`Cliente: ${pedidoDetalhado?.usuario.nome} (${pedidoDetalhado?.usuario.email})`);
    console.log(`Status: ${pedidoDetalhado?.status}`);
    console.log(`Subtotal: R$ ${pedidoDetalhado?.subtotal.toFixed(2)}`);
    console.log(`Desconto: R$ ${pedidoDetalhado?.valorDesconto.toFixed(2)}`);
    console.log(`Total: R$ ${pedidoDetalhado?.valorTotal.toFixed(2)}`);
    console.log(`Método: ${pedidoDetalhado?.metodoPagamento}`);
    console.log(`Cupom: ${pedidoDetalhado?.cupom?.codigo}`);
    console.log(`Afiliado: ${pedidoDetalhado?.afiliado?.codigo}`);
    console.log(`Itens: ${pedidoDetalhado?.itens.length}`);
    console.log(`Pagamentos: ${pedidoDetalhado?.pagamentos.length}`);
    console.log(`Histórico: ${pedidoDetalhado?.historico.length}`);

    return pedidoCompleto.pedido;

  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
if (require.main === module) {
  criarPedidoCompleto()
    .then((pedido) => {
      console.log(`\n✅ Script executado com sucesso! Pedido ${pedido.numero} criado.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na execução:', error);
      process.exit(1);
    });
}

export { criarPedidoCompleto };
