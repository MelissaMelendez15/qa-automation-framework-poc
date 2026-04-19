# Diseño del Orquestador QA

## 🎯 Objetivo
Definir el comportamiento base de la capa de orquestación QA para la PoC del framework de automatización.

## 🧩 Propósito
El orquestador será responsable de:
- recibir los parámetros de ejecución
- seleccionar el runner adecuado
- lanzar la ejecución de pruebas
- recoger los resultados generados
- preparar una salida estándar para el futuro reporting

## 🔧 Alcance inicial
En esta primera versión, el orquestador soportará:

- proyecto: web
- runner: Playwright
- suites: smoke, regression
- entornos: qa, staging

## 📥 Parámetros de entrada
El orquestador recibirá inicialmente:

- `project`: tipo de proyecto (`web`, más adelante `salesforce`)
- `suite`: tipo de suite (`smoke`, `regression`)
- `environment`: entorno (`qa`, `staging`, `producción`)
- `browser`: navegador de ejecución (`chromium` por defecto)

## 🔄 Flujo esperado
1. Recibir parámetros de ejecución
2. Validar los inputs obligatorios
3. Seleccionar el runner según el proyecto
4. Lanzar la ejecución de pruebas
5. Guardar resultados raw
6. Preparar un resumen procesado para reporting

## 📤 Salidas esperadas
El orquestador debe generar u organizar:

- resultados de ejecución en bruto (raw)
- evidencias de pruebas si existen
- resumen de ejecución procesado

## 🗂️ Estructura de salida prevista
```bash
results/
├── raw/
├── processed/
└── evidence/