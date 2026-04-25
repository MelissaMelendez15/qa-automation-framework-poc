# Diseño de resultados estructurados

## Objetivo
Transformar el JSON de Playwright en un formato simplificado y útil para el framework.

## Campos principales

- project
- suite
- environment
- browser
- executionStatus
- duration

## Summary
- total
- passed
- failed
- skipped

## Tests
Cada test debe incluir:
- name
- file
- status
- duration
- browser
- errors
- attachments

## Attachments
Solo se incluirán:
- screenshot
- video
- trace

## Notas
El JSON original de Playwright es muy detallado, pero el framework utilizará una versión simplificada.