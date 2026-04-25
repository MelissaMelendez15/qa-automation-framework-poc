const fs = require('fs');
const path = require('path');

const rawReportPath = path.join('results', 'raw', 'playwright-report.json');
const outputPath = path.join('results', 'processed', 'summary.json');

if (!fs.existsSync(rawReportPath)) {
  console.error(`No se encontró el reporte raw: ${rawReportPath}`);
  process.exit(1);
}

const rawReport = JSON.parse(fs.readFileSync(rawReportPath, 'utf-8'));

const tests = [];

for (const suite of rawReport.suites || []) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      for (const result of test.results || []) {
        tests.push({
          name: spec.title,
          file: spec.file,
          status: result.status,
          durationMs: result.duration,
          browser: test.projectName,
          startTime: result.startTime,
          errors: result.errors || [],
          attachments: (result.attachments || []).map((attachment) => ({
            name: attachment.name,
            contentType: attachment.contentType,
            path: attachment.path
          }))
        });
      }
    }
  }
}

const summary = {
  tool: 'playwright',
  toolVersion: rawReport.config?.version || null,
  executionStatus: rawReport.stats?.unexpected > 0 ? 'failed' : 'passed',
  stats: {
    total: tests.length,
    passed: tests.filter((test) => test.status === 'passed').length,
    failed: tests.filter((test) => test.status === 'failed').length,
    skipped: tests.filter((test) => test.status === 'skipped').length
  },
  durationMs: rawReport.stats?.duration || 0,
  startTime: rawReport.stats?.startTime || null,
  tests
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

console.log(`Summary generado correctamente en ${outputPath}`);