#!/usr/bin/env bash
set -e

PROJECT=${1:-web}
SUITE=${2:-all}
ENVIRONMENT=${3:-qa}
BROWSER=${4:-chromium}

echo "--------------------------------------"
echo "Iniciando orquestación QA"
echo "Proyecto: $PROJECT"
echo "Suite: $SUITE"
echo "Entorno: $ENVIRONMENT"
echo "Navegador: $BROWSER"
echo "--------------------------------------"

# Validar browser permitido
if [[ "$BROWSER" != "chromium" && "$BROWSER" != "firefox" ]]; then
  echo "Navegador no soportado: ${BROWSER}"
  echo "Navegadores permitidos: chromium y firefox"
  exit 1
fi

# Validar proyecto permitido
if [[ "$PROJECT" != "web" && "$PROJECT" != "salesforce" ]]; then
  echo "Proyecto no soportado: ${PROJECT}"
  echo "Proyectos permitidos: web y salesforce"
  exit 1
fi

if [ "$PROJECT" = "web" ]; then
  echo "Runner seleccionado: Playwright"

  if [ "$SUITE" = "all" ]; then
    echo "Ejecutando todas las pruebas web..."
    npx playwright test --project="${BROWSER}"
  else
    echo "Ejecutando suite web: $SUITE"
    npx playwright test "web/$SUITE" --project="${BROWSER}"
  fi

elif [ "$PROJECT" = "salesforce" ]; then
    echo "Runner Salesforce aún no implementado"
    exit 1
fi