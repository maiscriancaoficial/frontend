INSERT INTO "pedidos" (
    id,
    numero,
    "usuarioId",
    status,
    subtotal,
    "valorDesconto",
    "valorTotal",
    "metodoPagamento",
    "statusPagamento",
    "transacaoId",
    "pixQrCode",
    "pixCopiaCola",
    "dataVencimento",
    "codigoCupom",
    observacoes,
    "observacoesInternas",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'PED-' || LPAD(CAST(EXTRACT(EPOCH FROM NOW()) AS TEXT), 10, '0'),
    (SELECT id FROM "usuarios" LIMIT 1),
    'AGUARDANDO_PAGAMENTO',
    89.90,
    8.99,
    80.91,
    'PIX',
    'PENDENTE',
    'asaas_' || gen_random_uuid(),
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    NOW() + INTERVAL '24 hours',
    'TESTE10',
    'Pedido de teste criado via SQL',
    'Pedido para testar o dashboard administrativo',
    NOW(),
    NOW()
);

INSERT INTO "itens_pedido" (
    id,
    "pedidoId",
    nome,
    descricao,
    preco,
    quantidade,
    subtotal,
    "nomePersonagem",
    "avatarPersonalizado",
    "arquivosDigitais",
    "linkDownload",
    "dataLiberacao",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1),
    'Livro Personalizado - As Aventuras Mágicas',
    'Livro personalizado onde a criança é o protagonista das aventuras',
    49.90,
    1,
    49.90,
    'João da Silva Jr.',
    '{"tipo": "menino", "cabelo": "castanho", "olhos": "azuis", "pele": "clara", "roupa": "camiseta_azul"}',
    ARRAY['livro_joao_aventuras.pdf', 'certificado_personalizacao.pdf'],
    'https://download.maiscrianca.com/pedidos/item1',
    NOW(),
    NOW(),
    NOW()
);

INSERT INTO "itens_pedido" (
    id,
    "pedidoId",
    nome,
    descricao,
    preco,
    quantidade,
    subtotal,
    "arquivosDigitais",
    "linkDownload",
    "dataLiberacao",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1),
    'Kit de Atividades Educativas Premium',
    'Conjunto completo de atividades para desenvolvimento infantil',
    40.00,
    1,
    40.00,
    ARRAY['atividades_matematica.pdf', 'atividades_portugues.pdf', 'jogos_educativos.zip', 'guia_pais.pdf'],
    'https://download.maiscrianca.com/pedidos/item2',
    NOW(),
    NOW(),
    NOW()
);

INSERT INTO "historico_pedidos" (
    id,
    "pedidoId",
    "statusAnterior",
    "statusNovo",
    observacao,
    "createdAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1),
    NULL,
    'AGUARDANDO_PAGAMENTO',
    'Pedido criado automaticamente via script SQL',
    NOW()
);

INSERT INTO "pagamentos_pedido" (
    id,
    "pedidoId",
    valor,
    "metodoPagamento",
    status,
    "transacaoId",
    "gatewayResposta",
    "pixQrCode",
    "pixCopiaCola",
    "dataProcessamento",
    "dataVencimento",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1),
    80.91,
    'PIX',
    'PENDENTE',
    'asaas_payment_' || gen_random_uuid(),
    '{"status": "PENDING", "gateway": "asaas", "created_at": "' || NOW() || '"}',
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540580.915802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    NOW(),
    NOW() + INTERVAL '24 hours',
    NOW(),
    NOW()
);

SELECT 
    p.id,
    p.numero,
    p.status,
    p."valorTotal",
    p."metodoPagamento",
    u.nome as cliente_nome,
    COUNT(ip.id) as total_itens
FROM "pedidos" p
LEFT JOIN "usuarios" u ON p."usuarioId" = u.id
LEFT JOIN "itens_pedido" ip ON p.id = ip."pedidoId"
WHERE p.id = (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1)
GROUP BY p.id, p.numero, p.status, p."valorTotal", p."metodoPagamento", u.nome;
