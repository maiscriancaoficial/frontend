const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function criarPedidoCompleto() {
  try {
    console.log('🚀 Iniciando criação de pedido completo...');

    // 1. Buscar um usuário existente ou usar o primeiro disponível
    const usuario = await prisma.usuario.findFirst({
      where: { ativo: true }
    });

    if (!usuario) {
      throw new Error('❌ Nenhum usuário encontrado. Execute o seed primeiro.');
    }
    console.log('✅ Usuário encontrado:', usuario.nome);

    // 2. Gerar número sequencial do pedido
    const ultimoPedido = await prisma.pedido.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { numero: true }
    });

    const proximoNumero = ultimoPedido 
      ? `PED-${String(parseInt(ultimoPedido.numero.split('-')[1]) + 1).padStart(6, '0')}`
      : 'PED-000001';

    console.log('📋 Número do pedido:', proximoNumero);

    // 3. Valores do pedido
    const subtotal = 89.90;
    const valorDesconto = 8.99; // 10% de desconto
    const valorTotal = subtotal - valorDesconto;

    // 4. Criar o pedido completo
    const pedido = await prisma.pedido.create({
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
        pixQrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
        pixCopiaCola: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
        dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000),
        codigoCupom: 'TESTE10',
        observacoes: 'Pedido de teste criado automaticamente',
        observacoesInternas: 'Pedido para testar o dashboard administrativo'
      }
    });

    console.log('✅ Pedido criado:', pedido.numero);

    // 5. Criar itens do pedido
    const item1 = await prisma.itemPedido.create({
      data: {
        pedidoId: pedido.id,
        nome: 'Livro Personalizado - As Aventuras Mágicas',
        descricao: 'Livro personalizado onde a criança é o protagonista das aventuras',
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

    const item2 = await prisma.itemPedido.create({
      data: {
        pedidoId: pedido.id,
        nome: 'Kit de Atividades Educativas Premium',
        descricao: 'Conjunto completo de atividades para desenvolvimento infantil',
        preco: 40.00,
        quantidade: 1,
        subtotal: 40.00,
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

    console.log('✅ Itens criados:', 2);

    // 6. Criar histórico do pedido
    await prisma.historicoPedido.create({
      data: {
        pedidoId: pedido.id,
        statusAnterior: null,
        statusNovo: 'AGUARDANDO_PAGAMENTO',
        observacao: 'Pedido criado automaticamente via script de teste',
        usuarioId: null
      }
    });

    // 7. Criar registro de pagamento
    await prisma.pagamentoPedido.create({
      data: {
        pedidoId: pedido.id,
        valor: valorTotal,
        metodoPagamento: 'PIX',
        status: 'PENDENTE',
        transacaoId: `asaas_payment_${Date.now()}`,
        gatewayResposta: JSON.stringify({
          status: 'PENDING',
          gateway: 'asaas',
          created_at: new Date().toISOString(),
          qr_code: 'generated_qr_code_data'
        }),
        pixQrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
        pixCopiaCola: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
        dataProcessamento: new Date(),
        dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    console.log('✅ Pagamento registrado');

    // 8. Buscar e exibir o pedido completo
    const pedidoCompleto = await prisma.pedido.findUnique({
      where: { id: pedido.id },
      include: {
        usuario: {
          select: { nome: true, email: true, telefone: true }
        },
        itens: {
          select: {
            nome: true,
            preco: true,
            quantidade: true,
            subtotal: true,
            nomePersonagem: true,
            arquivosDigitais: true
          }
        },
        pagamentos: {
          select: {
            valor: true,
            metodoPagamento: true,
            status: true,
            transacaoId: true
          }
        },
        historico: {
          select: {
            statusNovo: true,
            observacao: true,
            createdAt: true
          }
        }
      }
    });

    console.log('\n🎉 PEDIDO CRIADO COM SUCESSO!');
    console.log('=====================================');
    console.log(`📋 Número: ${pedidoCompleto.numero}`);
    console.log(`👤 Cliente: ${pedidoCompleto.usuario.nome}`);
    console.log(`📧 Email: ${pedidoCompleto.usuario.email}`);
    console.log(`📱 Telefone: ${pedidoCompleto.usuario.telefone || 'N/A'}`);
    console.log(`📊 Status: ${pedidoCompleto.status}`);
    console.log(`💰 Subtotal: R$ ${pedidoCompleto.subtotal.toFixed(2)}`);
    console.log(`🎟️ Desconto: R$ ${pedidoCompleto.valorDesconto.toFixed(2)}`);
    console.log(`💳 Total: R$ ${pedidoCompleto.valorTotal.toFixed(2)}`);
    console.log(`💸 Método: ${pedidoCompleto.metodoPagamento}`);
    console.log(`🔄 Status Pagamento: ${pedidoCompleto.statusPagamento}`);
    
    console.log('\n🛍️ ITENS DO PEDIDO:');
    pedidoCompleto.itens.forEach((item, index) => {
      console.log(`${index + 1}. ${item.nome}`);
      console.log(`   💰 R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${item.subtotal.toFixed(2)}`);
      if (item.nomePersonagem) {
        console.log(`   👦 Personagem: ${item.nomePersonagem}`);
      }
      console.log(`   📁 Arquivos: ${item.arquivosDigitais.length} arquivo(s)`);
    });

    console.log('\n💳 PAGAMENTOS:');
    pedidoCompleto.pagamentos.forEach((pagamento, index) => {
      console.log(`${index + 1}. ${pagamento.metodoPagamento} - R$ ${pagamento.valor.toFixed(2)}`);
      console.log(`   🔄 Status: ${pagamento.status}`);
      console.log(`   🏷️ ID: ${pagamento.transacaoId}`);
    });

    console.log('\n📈 HISTÓRICO:');
    pedidoCompleto.historico.forEach((hist, index) => {
      console.log(`${index + 1}. ${hist.statusNovo} - ${hist.observacao}`);
      console.log(`   📅 ${hist.createdAt.toLocaleString('pt-BR')}`);
    });

    console.log('\n✅ Pedido pronto para testes no dashboard!');
    console.log(`🔗 Acesse: /dashboard/admin/pedidos`);

    return pedido;

  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
criarPedidoCompleto()
  .then((pedido) => {
    console.log(`\n🎯 Script finalizado! Pedido ${pedido.numero} está disponível.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na execução:', error.message);
    process.exit(1);
  });
