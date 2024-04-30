'use client'

import { CircleStackIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

export default function StartupCostsPage() {
  const [loading, setLoading] = useState(false)
  const [costs, setCosts] = useState<{
    monthly_costs: {
      [key: string]: {
        average_cost: string
        description: string
      }
    }
    one_time_costs: {
      [key: string]: {
        average_cost: string
        description: string
      }
    }
    total_estimate: string
  }>({ monthly_costs: {}, one_time_costs: {}, total_estimate: '' })

  const handleCalculate = async () => {
    try {
      const startupIdea = document.getElementById(
        'startup-idea',
      ) as HTMLInputElement

      if (!startupIdea.value) {
        return
      }

      setLoading(true)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FLOWCRAFT_API}/tools/startup-costs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            startupIdea: startupIdea.value,
          }),
        },
      )

      const data = await res.json()
      console.log('Response: ', data)
      setLoading(false)

      if (data.response) {
        if (typeof data.response.total_estimate === 'object') {
          data.response.total_estimate =
            data.response.total_estimate.average_cost
        }
        setCosts(data.response)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csv = [
      'For,Amount,Explanation',
      ...Object.entries(costs.monthly_costs).map(
        ([key, value]) => `${key},${value.average_cost},${value.description}`,
      ),
      ...Object.entries(costs.one_time_costs).map(
        ([key, value]) => `${key},${value.average_cost},${value.description}`,
      ),
      `Total Estimate,${costs.total_estimate},`,
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'startup_costs.csv'
    a.click()
  }

  return (
    <div>
      <div className="bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-green-900 sm:text-6xl">
            Startup Costs Calculator
          </h2>
          <p className="mt-6 text-lg leading-8 text-green-500">
            Calculate the costs of starting a new business with FlowCraft.
          </p>
          <p className="mt-2 text-lg leading-8 text-green-500">
            Simply enter your startup idea and we'll estimate the costs for you.
          </p>
        </div>
      </div>

      {/** Input Field */}
      <div className="bg-gray-100 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          {loading && (
            <div className="flex h-24 items-center justify-center">
              <CircleStackIcon className="h-24 w-24 animate-spin text-green-500" />
            </div>
          )}
          <div className="flex flex-col items-center justify-center">
            {!loading && (
              <input
                type="text"
                placeholder="Enter your startup idea"
                className="mt-4 w-full rounded-md border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:outline-none focus:ring focus:ring-green-500"
                id="startup-idea"
              />
            )}
            <button
              className="mt-6 rounded-md bg-green-500 px-6 py-3 text-lg font-semibold text-white hover:bg-green-600"
              disabled={loading}
              onClick={handleCalculate}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </div>
      </div>

      {/** Results Table */}
      <div className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto px-6 lg:px-8">
          {costs.total_estimate && (
            <div>
              <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="my-2 ml-4">
                  <h3 className="text-base font-semibold leading-6 text-green-900">
                    Estimated Costs
                  </h3>
                </div>
                <div className="my-2 ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    onClick={exportToCSV}
                  >
                    Export to CSV
                  </button>
                </div>
              </div>

              <div className="inline-block min-w-full rounded-md border border-gray-700 p-4 py-2 align-middle text-lg shadow-lg focus:border-green-500  focus:outline-none focus:ring focus:ring-green-500 sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-green-900 sm:pl-0"
                      >
                        For
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-semibold text-green-900"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-semibold text-green-900"
                      >
                        Explanation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {Object.entries(costs.monthly_costs).map(([key, value]) => (
                      <tr key={key}>
                        <td className="text-md whitespace-nowrap py-4 pl-4 pr-3 font-medium text-green-700 sm:pl-0">
                          {key
                            .replace(/_/g, ' ')
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </td>
                        <td className="whitespace-wrap text-md px-3 py-4 text-green-600">
                          {value.average_cost}
                        </td>
                        <td className="whitespace-wrap text-md px-3 py-4 text-green-600">
                          {value.description}
                        </td>
                      </tr>
                    ))}
                    {Object.entries(costs.one_time_costs).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td className="text-md whitespace-nowrap py-4 pl-4 pr-3 font-medium text-green-700 sm:pl-0">
                            {key
                              .replace(/_/g, ' ')
                              .replace(/^\w/, (c) => c.toUpperCase())}
                          </td>
                          <td className="whitespace-wrap text-md px-3 py-4 text-green-600">
                            {value.average_cost}
                          </td>
                          <td className="whitespace-wrap text-md px-3 py-4 text-green-600">
                            {value.description}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                  <tfoot className="bg-gray-200">
                    <tr>
                      <td className="text-md py-4 pl-4 pr-3 font-medium text-green-700 sm:pl-0">
                        Total Estimate
                      </td>
                      <td className="text-md px-3 py-4 font-medium text-green-600">
                        {costs.total_estimate}
                      </td>
                      <td className="text-md px-3 py-4 text-green-600"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
