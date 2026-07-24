#!/bin/bash

echo "🚀 Iniciando deploy..."

echo "🔍 Verificando build..."
npm run build || { echo "❌ Erro no build! Deploy cancelado."; exit 1; }

if [[ -z $(git status -s) ]]; then
  echo "⚠️ Nenhuma alteração encontrada para commit."
  exit 0
fi

echo "📦 Adicionando arquivos..."
git add .

DATA=$(date "+%Y-%m-%d %H:%M:%S")

echo "📝 Criando commit..."
git commit -m "deploy automático $DATA"

echo "⬆️ Enviando para GitHub..."
git push origin main

echo "✅ Deploy concluído com sucesso!"
