import { readSummary } from "@/lib/readSummary";
export const dynamic = "force-dynamic"; // Forzar renderizado dinámico para siempre mostrar datos actualizados

export default function Home() {
  const summary = readSummary();

  return (
      <main className="min-h-screen bg-slate-100 p-8">
        <section className="mx-auto max-w-6xl">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  QA Automation Dashboard
                </h1>
            
                <p className="mt-2 text-slate-600">
                  Última ejecución: {summary.executionId} 
                </p>
              </div>

              <a href="http://204.168.185.143:8080//job/qa-automation-framework-poc"
                 target="_blank"
                 rel="noopener noreferrer"
                  className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                Open Jenkins
              </a>
            </div>
            
            {/* Status */}
            <div className="mt-6">
              <span className={`px-4 py-2 rounded text-white font-semibold 
                     ${summary.executionStatus === "passed" 
                        ? "bg-green-600" 
                        : "bg-red-600"
                     }`}
              >
                {summary.executionStatus.toUpperCase()}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Total Tests</p>
                  <p className="text-xl font-bold">
                    {summary.stats.total}
                  </p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Passed Tests</p>
                  <p className="text-xl font-bold text-green-600">
                    {summary.stats.passed}
                  </p>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Failed Tests</p>
                  <p className="text-xl font-bold text-red-600">
                    {summary.stats.failed}
                  </p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-xl font-bold">
                    {Math.round(summary.durationMs)}ms
                  </p>
              </div>
            </div>
            
            {/* Test Results Table */}
            <div className="mt-8 bg-white rounded shadow overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-slate-900">
                  Test Results
                </h2>
              </div>
           <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-4">Test Name</th>
                  <th className="text-left p-4">File</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Browser</th>
                  <th className="text-left p-4">Duration</th>
                </tr>
              </thead>

              <tbody>
                {summary.tests.map((test: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 font-medium text-slate-900">{test.name}</td>
                    <td className="p-4 text-slate-600">{test.file}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-white font-semibold 
                             ${test.status === "passed" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                             }`}
                      >
                       {test.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{test.browser}</td>
                    <td className="p-4 text-slate-600">{test.durationMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          
          </section>
      </main>
    );
}
