@echo off
REM Inicializar repositório Git para Gleydsontattoo

cd "%~dp0"

echo 🚀 Inicializando repositório Git...
git init

echo ⚙️ Configurando usuário Git...
git config user.email "seu-email@gleydsontattoo.com"
git config user.name "Seu Nome"

echo 📦 Adicionando arquivos...
git add .

echo 💾 Fazendo commit inicial...
git commit -m "🎨 Initial commit: Gleydsontattoo full-stack system

- Next.js 14 frontend com design luxury
- Express.js backend com arquitetura MVC
- PostgreSQL com Prisma ORM
- JWT authentication + RBAC
- Agendamento online com 7 passos
- CRM de clientes
- Portfólio com imagens otimizadas
- WhatsApp integration
- Dashboard administrativo
- Testes com Vitest
- Docker setup
- TypeScript com Tailwind CSS
- Correções de segurança e boas práticas"

echo ✅ Git configurado!
echo.
echo 📝 Próximos passos:
echo 1. Criar repositório no GitHub (https://github.com/new)
echo 2. Copiar a URL do repositório
echo 3. Executar: git remote add origin URL_DO_REPOSITORIO
echo 4. Executar: git branch -M main
echo 5. Executar: git push -u origin main

pause
