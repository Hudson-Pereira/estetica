#!/bin/bash
# Script para publicar v3.1.0 no GitHub

echo "🚀 Publicando Espaço Lisa Ribeiro v3.1.0 no GitHub..."
echo ""

# Verificar status
echo "📋 Verificando status..."
git status

echo ""
echo "📤 Enviando commits para origin/development..."
git push origin development

echo ""
echo "🏷️  Enviando tag v3.1.0..."
git push origin v3.1.0

echo ""
echo "✅ Publicação concluída!"
echo ""
echo "📍 Próximas etapas:"
echo "  1. Verifique o GitHub: https://github.com/Hudson-Pereira/estetica"
echo "  2. Crie uma Release oficial (opcional, pode ser automática)"
echo "  3. Atualize a documentação no README se necessário"
echo ""
echo "📚 Documentação disponível:"
echo "  - SECURITY.md - Guia de segurança"
echo "  - CHANGELOG.md - Histórico de mudanças"
echo "  - SUMMARY_v3.1.0.md - Resumo executivo"
echo "  - RELEASE_NOTES_v3.1.0.md - Notas de lançamento"
echo "  - NEXT_STEPS.md - Próximos passos"
