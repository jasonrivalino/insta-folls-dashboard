import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, type ChartData, type ChartOptions } from "chart.js"
import { Bar } from "react-chartjs-2"
import type { RelationalDetail, GeneralStatistics } from "../../../models/table.models"

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

type Props = {
  relational: RelationalDetail
  statistics: GeneralStatistics
}

export default function MultipleBarChart({
  relational,
  statistics
}: Props) {
  const values = [
    statistics.average_followers,
    statistics.average_following,
    statistics.average_gap
  ]

  const backgroundColors = values.map((value, index) => {
    // Avg Followers & Avg Following
    if (index === 0 || index === 1) {
      return "#3B82F6"
    }

    // Avg Gap rules
    if (value > 0) return "#22C55E" // green
    if (value < 0) return "#EF4444" // red
    return "#3B82F6" // neutral (blue)
  })

  const data: ChartData<"bar"> = {
    labels: ["Avg Followers", "Avg Following", "Avg Gap"],
    datasets: [
      {
        label: relational.relational,
        data: values,
        backgroundColor: backgroundColors,
        borderRadius: 6
      }
    ]
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 600 } }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return <Bar data={data} options={options} height={200}/>
}