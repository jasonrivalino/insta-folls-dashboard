import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, type ChartData, type ChartOptions, type TooltipItem, type ChartTypeRegistry } from "chart.js"
import { Chart } from "react-chartjs-2"
import zoomPlugin from "chartjs-plugin-zoom"
import type { ScatterChartProps, ScatterPoint } from "../../models/statistics.models"
import { useMainAccount } from "../../context/useMainAccount"
import { useMemo, useRef, useState } from "react"

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
)

export default function ScatterChart({
  data,
  title,
  height = 500,
  width = 1000,
}: ScatterChartProps) {

  const chartRef = useRef<ChartJS | null>(null)
  const { account } = useMainAccount()

  const [showOutlier, setShowOutlier] = useState(false)
  const [removeOutlier, setRemoveOutlier] = useState(false)

  // Filtered Data
  const filteredData = useMemo(() => {
    if (!removeOutlier) return data
    return data.filter(d => !d.is_outlier)
  }, [data, removeOutlier])

  // Compute Max Value for Axis Scaling
  const roundUpNice = (value: number) => {
    if (value <= 0) return 0

    const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
    const rounded = Math.ceil(value / magnitude) * magnitude

    return rounded
  }
  const maxValue = useMemo(() => {
    if (filteredData.length === 0) return 0

    const rawMax = Math.max(
      ...filteredData.map(d => Math.max(d.x, d.y))
    )

    return roundUpNice(rawMax)
  }, [filteredData])

  // Chart Data
  const chartData: ChartData<keyof ChartTypeRegistry> = {
    datasets: [
        {
            type: "scatter",
            label: "Instagram Users",
            data: filteredData,
            pointRadius: (ctx) => {
              const raw = ctx.raw as ScatterPoint
              return raw.username === account?.username ? 6 : 4
            },
            pointHoverRadius: 6,
            backgroundColor: (ctx) => {
              const raw = ctx.raw as ScatterPoint

              // Outlier coloring
              if (raw.is_outlier && showOutlier && !removeOutlier) {
                return "#a855f7"
              }

              // Normal gap coloring
              if (raw.gap != null) {
                if (raw.gap > 0) return "#22c55e"
                if (raw.gap < 0) return "#ef4444"
                return "#3b82f6"
              }

              return "#3b82f6"
            },
            pointBorderColor: (ctx) => {
              const raw = ctx.raw as ScatterPoint
              return raw.username === account?.username ? "#000000" : "transparent"
            },
            pointBorderWidth: (ctx) => {
              const raw = ctx.raw as ScatterPoint
              return raw.username === account?.username ? 1 : 0
            },
        },
        {
            type: "line",
            label: "x = y",
            data: [
                { x: 0, y: 0 },
                { x: maxValue, y: maxValue },
            ],
            borderColor: "#9ca3af",
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0,
            fill: false,
        },
    ],
  }

  // Chart Options
  const options: ChartOptions<keyof ChartTypeRegistry> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      zoom: {
        limits: {
          x: { min: 0 },
          y: { min: 0 },
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
      tooltip: {
        filter: (ctx) => ctx.dataset.label !== "x = y",
        callbacks: {
            label: (ctx: TooltipItem<"scatter" | "line">) => {
            const raw = ctx.raw as ScatterPoint
            return [
                `@${raw.username ?? "-"}`,
                `Followers: ${raw.y}`,
                `Following: ${raw.x}`,
                `Gap: ${raw.gap}`,
            ]
          },
        },
      },
    },

    scales: {
        x: {
          title: { display: true, text: "Following" },
          beginAtZero: true,
        },
        y: {
          title: { display: true, text: "Followers" },
          beginAtZero: true,
        },
      },
    }


  return (
    <div className="bg-gray-50 rounded-xl pl-4 pr-5 pt-4 pb-12 shadow-md flex flex-col space-y-2" style={{ height, width }}>
        <div className="grid grid-cols-3 items-end">
          {/* Left spacer (keeps title centered) */}
          <div />

          {/* Center title */}
          <h3 className="text-lg font-semibold text-center">
            {title}
          </h3>

          {/* Right actions */}
          <div className="flex justify-end items-center gap-3">
            <button
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
              onClick={() => chartRef.current?.resetZoom()}
            >
              Reset Zoom
            </button>

            <div className="flex flex-row bg-gray-300 rounded shadow-sm px-3 py-1 gap-4">
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOutlier}
                  onChange={(e) => setShowOutlier(e.target.checked)}
                  className="accent-purple-500"
                />
                Show Outlier
              </label>

              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeOutlier}
                  onChange={(e) => setRemoveOutlier(e.target.checked)}
                  className="accent-red-500"
                />
                Remove Outlier
              </label>
            </div>
          </div>
        </div>

        <Chart
            ref={chartRef}
            key={title}
            data={chartData}
            options={options} 
            type={"scatter"}      
        />
    </div>
  )
}
