-- Script SQL para criar um pedido completo no Neon DB
-- Execute este script diretamente no console SQL do Neon

-- 1. Primeiro, vamos verificar se temos usuários disponíveis
-- SELECT id, nome, email FROM "Usuario" LIMIT 5;

-- 2. Inserir um pedido completo
-- Substitua o usuarioId por um ID válido do seu banco
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
    "dataPagamento",
    "dataVencimento",
    "cupomId",
    "codigoCupom",
    "afiliadoId",
    "codigoAfiliado",
    observacoes,
    "observacoesInternas",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'PED-' || LPAD(CAST(EXTRACT(EPOCH FROM NOW()) AS TEXT), 10, '0'),
    '00000000-0000-0000-0000-000000000000', -- SUBSTITUA por um usuarioId válido
    'AGUARDANDO_PAGAMENTO',
    89.90,
    0.00,
    89.90,
    'PIX',
    'PENDENTE',
    'asaas_' || gen_random_uuid(),
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    NULL,
    NOW() + INTERVAL '24 hours',
    NULL,
    NULL,
    NULL,
    NULL,
    'Pedido de teste criado via SQL',
    'Pedido para testar o dashboard administrativo',
    NOW(),
    NOW()
);

-- 3. Obter o ID do pedido recém-criado
-- Vamos usar uma variável temporária ou fazer uma subconsulta

-- 4. Inserir itens do pedido
-- Item 1: Livro personalizado
INSERT INTO "itens_pedido" (
    id,
    "pedidoId",
    "produtoId",
    "livroId",
    "livroPersonalizadoId",
    "avatarPersonalizado",
    "nomePersonagem",
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
    (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1), -- Pega o último pedido criado
    NULL,
    '00000000-0000-0000-0000-000000000000', -- SUBSTITUA por um livroId válido se existir
    NULL,
    '{"tipo": "menino", "cabelo": "castanho", "olhos": "azuis", "roupa": "camiseta_azul"}',
    'João da Silva',
    'Livro Personalizado - As Aventuras de João',
    'Um livro mágico onde João é o protagonista de suas próprias aventuras!',
    49.90,
    1,
    49.90,
    ARRAY['livro_joao_aventuras.pdf', 'certificado_personalizacao.pdf'],
    'https://download.maiscrianca.com/livros/joao-aventuras-123456',
    NOW(),
    NOW(),
    NOW()
);

-- Item 2: Produto digital adicional
INSERT INTO "itens_pedido" (
    id,
    "pedidoId",
    "produtoId",
    "livroId",
    "livroPersonalizadoId",
    "avatarPersonalizado",
    "nomePersonagem",
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
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Kit de Atividades Digitais',
    'Conjunto de atividades educativas para crianças de 4 a 8 anos',
    40.00,
    1,
    40.00,
    ARRAY['atividades_matematica.pdf', 'atividades_portugues.pdf', 'jogos_educativos.zip'],
    'https://download.maiscrianca.com/kits/atividades-educativas-789',
    NOW(),
    NOW(),
    NOW()
);

-- 5. Inserir registro no histórico do pedido
INSERT INTO "historico_pedidos" (
    id,
    "pedidoId",
    "statusAnterior",
    "statusNovo",
    observacao,
    "usuarioId",
    "createdAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1),
    NULL,
    'AGUARDANDO_PAGAMENTO',
    'Pedido criado automaticamente via script SQL',
    NULL,
    NOW()
);

-- 6. Inserir dados de pagamento
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
    "dataConfirmacao",
    "dataVencimento",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1),
    89.90,
    'PIX',
    'PENDENTE',
    'asaas_payment_' || gen_random_uuid(),
    '{"status": "PENDING", "gateway": "asaas", "created_at": "' || NOW() || '"}',
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540589.905802BR5925MAIS CRIANCA LTDA6009SAO PAULO62070503***6304ABCD',
    NOW(),
    NULL,
    NOW() + INTERVAL '24 hours',
    NOW(),
    NOW()
);

-- 7. Verificar o pedido criado
SELECT 
    p.id,
    p.numero,
    p.status,
    p."valorTotal",
    p."metodoPagamento",
    p."statusPagamento",
    u.nome as cliente_nome,
    u.email as cliente_email,
    COUNT(ip.id) as total_itens
FROM "pedidos" p
LEFT JOIN "Usuario" u ON p."usuarioId" = u.id
LEFT JOIN "itens_pedido" ip ON p.id = ip."pedidoId"
WHERE p.id = (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1)
GROUP BY p.id, p.numero, p.status, p."valorTotal", p."metodoPagamento", p."statusPagamento", u.nome, u.email;

-- 8. Verificar itens do pedido
SELECT 
    ip.nome,
    ip.descricao,
    ip.preco,
    ip.quantidade,
    ip.subtotal,
    ip."nomePersonagem",
    ip."arquivosDigitais"
FROM "itens_pedido" ip
WHERE ip."pedidoId" = (SELECT id FROM "pedidos" ORDER BY "createdAt" DESC LIMIT 1);

-- INSTRUÇÕES PARA USO:
-- 1. Antes de executar, substitua '00000000-0000-0000-0000-000000000000' por um usuarioId válido
-- 2. Se tiver livros cadastrados, substitua o livroId também
-- 3. Execute o script completo no console SQL do Neon
-- 4. Verifique os resultados com as consultas SELECT no final
