import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter,
} from 'react-chartjs-2'

type ChartJsComponentProps = {
  data: {
    type:
      | 'bar'
      | 'line'
      | 'pie'
      | 'doughnut'
      | 'radar'
      | 'polarArea'
      | 'bubble'
      | 'scatter'
    data: any
    options: any
  }
}

export default function ChartJsComponent({ data }: { data: any }) {
  switch (data.type) {
    case 'bar':
      return <Bar data={data.data} options={data.options} />
    case 'line':
      return <Line data={data.data} options={data.options} />
    case 'pie':
      return <Pie data={data.data} options={data.options} />
    case 'doughnut':
      return <Doughnut data={data.data} options={data.options} />
    case 'radar':
      return <Radar data={data.data} options={data.options} />
    case 'polarArea':
      return <PolarArea data={data.data} options={data.options} />
    case 'bubble':
      return <Bubble data={data.data} options={data.options} />
    case 'scatter':
      return <Scatter data={data.data} options={data.options} />
    default:
      return <Line data={data.data} options={data.options} />
  }
}
