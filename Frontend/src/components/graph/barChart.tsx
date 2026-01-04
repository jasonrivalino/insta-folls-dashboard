import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, type TooltipItem } from "chart.js"
import { Bar } from "react-chartjs-2"
import type { DistributionChartProps } from "../../models/statistics.models"
import { distributeByField, distributeGap } from "../../services/dataVisualization/mainDashboard.services"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

export default function BarChart({
  data,
  field,
  title,
  bins = 4,
  maxRange = 4000,
  height = 250,
  width = 380,
}: DistributionChartProps) {

  // Get the distribution data
  const distribution = (() => {
    return field === "gap"
      ? distributeGap(data, bins, maxRange)
      : distributeByField(data, field, bins, maxRange)
  })()

  // Prepare chart data
  const chartData = {
    labels: distribution.map(d => d.label),
    datasets: [
      {
        label: title,
        data: distribution.map(d => d.count),
        backgroundColor: distribution.map(d => d.color ?? "#3B82F6"),
        borderRadius: 8,
        borderWidth: 1
      }
    ]
  }

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        display: false,
        labels: {
            color: "#000"
        }
        },
        tooltip: {
            titleColor: "#000",
            bodyColor: "#000",
            backgroundColor: "#fff",
            borderColor: "#000",
            borderWidth: 1,
            callbacks: {
                label: (ctx: TooltipItem<"bar">) =>
                `${ctx.raw} accounts`
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                precision: 0,
                color: "#000"
            },
            title: {
                display: true,
                text: "Number of Accounts",
                color: "#000"
            },
            grid: {
                color: "#e5e7eb"
            }
        },
        x: {
            ticks: {
                color: "#000",
                maxRotation: 0,
                autoSkip: true
            },
            title: {
                display: true,
                text: field.charAt(0).toUpperCase() + field.slice(1) + " Range",
                color: "#000"
            },
            grid: {
                display: false
            }
        }
    }
  }

  return (
    <div className="bg-gray-50 rounded-xl pl-3 pr-5 pt-3 pb-12 shadow-md flex flex-col gap-2" style={{ height, width }}>
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <Bar data={chartData} options={options} />
    </div>
  )
}