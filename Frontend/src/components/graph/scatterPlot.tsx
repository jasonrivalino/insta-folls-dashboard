import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, type ChartData, type ChartOptions, type TooltipItem, type ChartTypeRegistry } from "chart.js"
import { Chart } from "react-chartjs-2"
import zoomPlugin from "chartjs-plugin-zoom"
import type { ScatterChartProps, ScatterPoint } from "../../models/statistics.models"
import { useMemo, useRef } from "react"

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

  // Hitung max untuk garis x = y
  const maxValue = useMemo(
    () =>
      Math.max(
        ...data.map(d => Math.max(d.x, d.y)),
        0
      ),
    [data]
  )

  // Chart Data
  const chartData: ChartData<keyof ChartTypeRegistry> = {
    datasets: [
        {
            type: "scatter",
            label: "Instagram Users",
            data,
            pointRadius: 4,
            pointHoverRadius: 6,
            backgroundColor: data.map(d =>
                d.gap != null
                ? d.gap > 0
                    ? "#22c55e"
                    : d.gap < 0
                    ? "#ef4444"
                    : "#3b82f6"
                : "#3b82f6"
            ),
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
        pan: {
            enabled: true,
            mode: "xy", // geser chart
        },
        zoom: {
            wheel: {
            enabled: true, // zoom pakai scroll mouse
            },
            pinch: {
            enabled: true, // zoom pakai touchpad / mobile
            },
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
                `Following: ${raw.x}`,
                `Followers: ${raw.y}`,
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
    <div className="bg-gray-50 rounded-xl pl-3 pr-5 pt-4 pb-12 shadow-md flex flex-col space-y-2" style={{ height, width }}>
        <div className="relative flex items-center">
            <h3 className="mx-auto text-lg font-semibold text-center">{title}</h3>

            <button
                className="absolute right-0 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => chartRef.current?.resetZoom()}
            >
                Reset Zoom
            </button>
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
