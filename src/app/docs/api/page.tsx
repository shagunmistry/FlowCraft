import { Metadata } from 'next'
import Link from 'next/link'
import {
  CodeBracketIcon,
  KeyIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'FlowCraft API Documentation - Developer Guide',
  description:
    'Complete API documentation for FlowCraft. Learn how to authenticate, generate diagrams, and integrate FlowCraft into your applications.',
  keywords: [
    'FlowCraft API docs',
    'API documentation',
    'diagram API guide',
    'authentication',
    'API reference',
  ],
}

export default function ApiDocumentation() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link href="/" className="mb-4 inline-block text-sm text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-zinc-900">API Documentation</h1>
          <p className="text-lg text-zinc-600">
            Complete guide to integrating FlowCraft into your applications
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-8 space-y-1">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                On This Page
              </h3>
              {[
                { id: 'authentication', label: 'Authentication' },
                { id: 'endpoints', label: 'API Endpoints' },
                { id: 'generate-diagram', label: 'Generate Diagram' },
                { id: 'get-diagrams', label: 'Get Diagrams' },
                { id: 'error-handling', label: 'Error Handling' },
                { id: 'rate-limits', label: 'Rate Limits' },
                { id: 'best-practices', label: 'Best Practices' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="prose prose-zinc max-w-none">
              {/* Getting Started */}
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Getting Started</h2>
                <p className="mb-4 text-zinc-600">
                  The FlowCraft API allows you to programmatically generate diagrams and manage your
                  diagram library. All API requests require authentication using API keys.
                </p>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <KeyIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">Need an API Key?</p>
                      <p className="mt-1 text-sm text-blue-700">
                        Create your first API key in{' '}
                        <Link href="/dashboard/settings" className="underline">
                          Dashboard Settings
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Authentication</h2>
                <p className="mb-4 text-zinc-600">
                  All API requests must include your API key in the Authorization header using the
                  Bearer token scheme.
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="border-b border-zinc-200 bg-white px-4 py-2">
                    <span className="text-xs font-semibold text-zinc-600">Authorization Header</span>
                  </div>
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-zinc-800">
                      {`Authorization: Bearer fc_live_your_api_key_here`}
                    </code>
                  </pre>
                </div>
              </section>

              {/* Base URL */}
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Base URL</h2>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-zinc-800">
                      {`https://flowcraft.app/api`}
                    </code>
                  </pre>
                </div>
              </section>

              {/* API Endpoints */}
              <section id="endpoints" className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">API Endpoints</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-zinc-200 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                        POST
                      </span>
                      <code className="text-sm font-semibold text-zinc-900">
                        /api/generate-diagram
                      </code>
                    </div>
                    <p className="text-sm text-zinc-600">Generate a new diagram using AI</p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                        GET
                      </span>
                      <code className="text-sm font-semibold text-zinc-900">
                        /api/get-diagrams
                      </code>
                    </div>
                    <p className="text-sm text-zinc-600">Retrieve all your diagrams</p>
                  </div>
                </div>
              </section>

              {/* Generate Diagram */}
              <section id="generate-diagram" className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Generate Diagram</h2>
                <p className="mb-4 text-zinc-600">
                  Create a new diagram by providing a title, description, and diagram type.
                </p>

                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Request</h3>
                <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="border-b border-zinc-200 bg-white px-4 py-2">
                    <span className="text-xs font-semibold text-zinc-600">POST /api/generate-diagram</span>
                  </div>
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-zinc-800">
{`{
  "title": "User Authentication Flow",
  "description": "A flowchart showing the login and signup process with error handling",
  "type": "Flow Diagram"
}`}
                    </code>
                  </pre>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Parameters</h3>
                <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-900">Parameter</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-900">Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      <tr>
                        <td className="px-4 py-3">
                          <code className="text-zinc-900">title</code>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">string</td>
                        <td className="px-4 py-3 text-zinc-600">The title of your diagram</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <code className="text-zinc-900">description</code>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">string</td>
                        <td className="px-4 py-3 text-zinc-600">
                          Detailed description of what the diagram should show
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <code className="text-zinc-900">type</code>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">string</td>
                        <td className="px-4 py-3 text-zinc-600">
                          Diagram type: "Flow Diagram", "Chart", "Sequence Diagram", etc.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Response</h3>
                <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="border-b border-zinc-200 bg-white px-4 py-2">
                    <span className="text-xs font-semibold text-zinc-600">200 OK</span>
                  </div>
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-zinc-800">
{`{
  "result": "{ /* diagram data */ }",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}`}
                    </code>
                  </pre>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Example</h3>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900">
                  <div className="border-b border-zinc-700 px-4 py-2">
                    <span className="text-xs font-semibold text-zinc-400">JavaScript / Node.js</span>
                  </div>
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-green-400">
{`const response = await fetch('https://flowcraft.app/api/generate-diagram', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fc_live_your_api_key_here'
  },
  body: JSON.stringify({
    title: 'User Authentication Flow',
    description: 'Login and signup process with OAuth',
    type: 'Flow Diagram'
  })
});

const data = await response.json();
console.log('Diagram ID:', data.id);
console.log('Diagram Data:', data.result);`}
                    </code>
                  </pre>
                </div>
              </section>

              {/* Get Diagrams */}
              <section id="get-diagrams" className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Get Diagrams</h2>
                <p className="mb-4 text-zinc-600">
                  Retrieve all diagrams associated with your account.
                </p>

                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Request</h3>
                <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="border-b border-zinc-200 bg-white px-4 py-2">
                    <span className="text-xs font-semibold text-zinc-600">GET /api/get-diagrams</span>
                  </div>
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-zinc-800">
                      {`No request body required`}
                    </code>
                  </pre>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Response</h3>
                <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="border-b border-zinc-200 bg-white px-4 py-2">
                    <span className="text-xs font-semibold text-zinc-600">200 OK</span>
                  </div>
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-zinc-800">
{`{
  "diagrams": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "User Authentication Flow",
      "description": "Login and signup process",
      "type": "Flow Diagram",
      "data": "{ /* diagram data */ }",
      "created_at": "2024-01-15T10:30:00Z",
      "private": true
    }
  ]
}`}
                    </code>
                  </pre>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Example</h3>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900">
                  <div className="border-b border-zinc-700 px-4 py-2">
                    <span className="text-xs font-semibold text-zinc-400">cURL</span>
                  </div>
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-green-400">
{`curl -X GET https://flowcraft.app/api/get-diagrams \\
  -H "Authorization: Bearer fc_live_your_api_key_here" \\
  -H "Content-Type: application/json"`}
                    </code>
                  </pre>
                </div>
              </section>

              {/* Error Handling */}
              <section id="error-handling" className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Error Handling</h2>
                <p className="mb-4 text-zinc-600">
                  The API uses standard HTTP response codes to indicate success or failure.
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-900">Code</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      <tr>
                        <td className="px-4 py-3">
                          <code className="text-green-700">200</code>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">Success</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <code className="text-red-700">400</code>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">Bad Request - Invalid parameters</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <code className="text-red-700">401</code>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">Unauthorized - Invalid API key</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <code className="text-red-700">500</code>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">Internal Server Error</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits" className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Rate Limits</h2>
                <p className="mb-4 text-zinc-600">
                  API requests are subject to the same usage limits as your FlowCraft account. Free
                  users can create up to 3 diagrams, while Pro users have unlimited access.
                </p>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-900">Rate Limit Information</p>
                      <p className="mt-1 text-sm text-amber-700">
                        If you exceed your rate limit, the API will return a 401 error with details
                        about your usage.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Best Practices */}
              <section id="best-practices" className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Best Practices</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-zinc-200 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-zinc-900">Secure Your API Keys</h3>
                    </div>
                    <p className="text-sm text-zinc-600">
                      Never expose API keys in client-side code, public repositories, or logs. Store
                      them securely in environment variables.
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <CodeBracketIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-zinc-900">Use Environment Variables</h3>
                    </div>
                    <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                      <pre className="overflow-x-auto p-3">
                        <code className="text-xs text-zinc-800">
{`# .env
FLOWCRAFT_API_KEY=fc_live_your_api_key_here

# Usage in code
const apiKey = process.env.FLOWCRAFT_API_KEY;`}
                        </code>
                      </pre>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <KeyIcon className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-zinc-900">Rotate Keys Regularly</h3>
                    </div>
                    <p className="text-sm text-zinc-600">
                      For enhanced security, rotate your API keys periodically. You can create new keys
                      and revoke old ones from your dashboard.
                    </p>
                  </div>
                </div>
              </section>

              {/* Support */}
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">Need Help?</h2>
                <p className="mb-4 text-zinc-600">
                  If you have questions or need assistance with the API, we're here to help.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/features/api-keys"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-900 transition-all hover:bg-zinc-50"
                  >
                    Learn More
                  </Link>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
