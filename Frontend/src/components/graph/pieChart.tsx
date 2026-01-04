import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions, type ChartData } from "chart.js"
import { Pie } from "react-chartjs-2"
import { useMemo } from "react"
import type { PieChartProps, PieSlice } from "../../models/statistics.models"
import { mapPieData } from "../../services/dataVisualization/mainDashboard.services"

ChartJS.register(ArcElement, Tooltip, Legend)

const RED = "#EF4444"
const BLUE = "#3B82F6"

export default function PieChart({
  title,
  data,
  field,
  height = 350,
  width = 584,
  colorMode = "default",
}: PieChartProps) {
  const distribution = useMemo<PieSlice[]>(() => {
    return mapPieData(data, field)
  }, [data, field])

  const colors =
    colorMode === "reverse"
      ? [BLUE, RED]
      : [RED, BLUE]

  const chartData: ChartData<"pie"> = {
    labels: distribution.map((d) => d.label),
    datasets: [
      {
        data: distribution.map((d) => d.value),
        backgroundColor: colors,
      },
    ],
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 14,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const dataset = ctx.dataset.data as number[]
            const total = dataset.reduce((a, b) => a + b, 0)
            const value = ctx.raw as number
            const percent = total
              ? ((value / total) * 100).toFixed(1)
              : "0"

            return `${ctx.label}: ${value} (${percent}%)`
          },
        },
      },
    },
  }

  return (
    <div
      className="bg-white rounded-xl shadow-md pt-3.5 pb-11 flex flex-col gap-2 items-center w-full"
      style={{ height, width }}
    >
      <h3 className="text-lg font-semibold text-center">
        {title}
      </h3>
      <Pie data={chartData} options={options} />
    </div>
  )
}