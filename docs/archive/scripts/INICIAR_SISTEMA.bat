@echo off
chcp 65001 >nul
echo ===================================================================
echo          INICIANDO SISTEMA GLEYDSON TATTOO
         ===================================================================
echo.
echo.

:: Verificar se Node.js esta instalado
echo [1/5] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Node.js nao esta instalado!
    echo    Instale o Node.js de: https://nodejs.org/
    pause
    exit /b 1
)
node --version

:: Verificar npm
echo.
echo [2/5] Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo ❌ ERRO: npm nao esta funcionando!
    pause
    exit /b 1
)

echo.
echo [3/5] Instalando dependencias do Backend...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao instalar dependencias do Backend!
    echo    Tente: cd backend && npm install
    pause
    exit /b 1
)
echo ✅ Backend dependencias instaladas!

echo.
echo [4/5] Instalando dependencias do Frontend...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao instalar dependencias do Frontend!
    echo    Tente: cd frontend && npm install
    pause
    exit /b 1
)
echo ✅ Frontend dependencias instaladas!

echo.
echo ===================================================================
echo          DEPENDENCIAS INSTALADAS COM SUCESSO!
         ===================================================================
echo.
echo      AGORA INICIE OS SERVIDORES:
echo.
echo      Terminal 1 - Backend (API):
echo      cd backend && npm run dev
echo.
echo      Terminal 2 - Frontend (Site):
echo      cd frontend && npm run dev
echo.
echo      Depois acesse: http://localhost:3000
echo.
echo ===================================================================

pause
