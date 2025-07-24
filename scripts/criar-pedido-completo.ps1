# Script PowerShell para criar pedido completo
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Yellow
pnpm prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client gerado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Executando script de criação de pedido..." -ForegroundColor Yellow
    node scripts/criar-pedido.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Pedido criado com sucesso!" -ForegroundColor Green
        Write-Host "🔗 Acesse o dashboard em: http://localhost:3000/dashboard/admin/pedidos" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erro ao criar pedido!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Erro ao gerar Prisma Client!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
