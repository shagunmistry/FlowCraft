export const chartJsBasicPrimitveCode = JSON.stringify({
  datasets: [
    {
      data: [20, 10],
    },
  ],
  labels: ['a', 'b'],
})

export const chartJsObjectCodeForLineType = JSON.stringify({
  datasets: [
    {
      data: [
        { x: 10, y: 20 },
        { x: 15, y: null },
        { x: 20, y: 10 },
      ],
    },
  ],
})

export const chartJsObjectCodeForLineType2 = JSON.stringify({
  datasets: [
    {
      data: [
        { x: '2016-12-25', y: 20 },
        { x: '2016-12-26', y: 10 },
      ],
    },
  ],
})

export const chartJsObjectCodeForLineType3 = JSON.stringify({
  datasets: [
    {
      data: {
        January: 10,
        February: 20,
      },
    },
  ],
})

export const chartJsObjectCodeForBarType = JSON.stringify({
  datasets: [
    {
      data: [
        { x: 'Sales', y: 20 },
        { x: 'Revenue', y: 10 },
      ],
    },
  ],
})

export const chartJsObjectCodeForBarType2 = JSON.stringify({
  labels: ['Jan', 'Feb'],
  datasets: [
    {
      label: 'Net sales',
      data: [
        { x: 'Jan', net: 100, cogs: 50, gm: 50 },
        { x: 'Feb', net: 120, cogs: 55, gm: 75 },
      ],
      parsing: {
        yAxisKey: 'net',
      },
    },
    {
      label: 'Cost of goods sold',
      data: [
        { x: 'Jan', net: 100, cogs: 50, gm: 50 },
        { x: 'Feb', net: 120, cogs: 55, gm: 75 },
      ],
      parsing: {
        yAxisKey: 'cogs',
      },
    },
    {
      label: 'Gross margin',
      data: [
        { x: 'Jan', net: 100, cogs: 50, gm: 50 },
        { x: 'Feb', net: 120, cogs: 55, gm: 75 },
      ],
      parsing: {
        yAxisKey: 'gm',
      },
    },
  ],
})

export const chartJsAllCombinedBasicCode = `
Example One:
\`\`\`JSON
${chartJsBasicPrimitveCode}
\`\`\`

Example Two:
\`\`\`JSON
${chartJsObjectCodeForLineType}
\`\`\`

Example Three:
\`\`\`JSON
${chartJsObjectCodeForLineType2}
\`\`\

Example Four:
\`\`\`JSON
${chartJsObjectCodeForLineType3}
\`\`\

Example Five:
\`\`\`JSON
${chartJsObjectCodeForBarType}
\`\`\

Example Six:
\`\`\`JSON
${chartJsObjectCodeForBarType2}
\`\`\

`
