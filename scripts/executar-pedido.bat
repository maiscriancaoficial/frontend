@echo off
echo 🔧 Gerando Prisma Client...
pnpm prisma generate

echo.
echo 🚀 Executando script de criação de pedido...
node scripts/criar-pedido.js

echo.
echo ✅ Processo finalizado!
pause
