@echo off
setlocal
cd /d %~dp0

echo --------------------------------------------------
echo   Wi-Fi Web Transfer 起動プログラム
echo --------------------------------------------------
echo.

:: Node.js が入っているか確認
node -v >node_version.txt 2>&1
if %errorlevel% neq 0 (
    echo [エラー] Node.js がインストールされていないようです。
    echo 公式サイト (https://nodejs.org/) から LST版をインストールしてください。
    echo.
    pause
    exit /b
)
del node_version.txt

:: 最初の1回だけ、必要な部品を自動でインストール
if not exist "node_modules" (
    echo 初回起動の準備をしています... (数分かかる場合があります)
    call npm install
    echo 準備が完了しました！
    echo.
)

:: サーバーを起動
echo アプリを起動しています...
echo.
echo ==================================================
echo   起動に成功しました！
echo   スマホやiPadで、以下のURLをブラウザに入れてください。
echo.
:: IPアドレスを表示して起動
<ctrl42> "" http://localhost:8080
call node server.js

pause
