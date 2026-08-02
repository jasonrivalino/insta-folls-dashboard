import { useMemo } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions, type ChartData } from "chart.js"
import { Pie } from "react-chartjs-2"
import type { RelationalDetail, InstaRelationalData, SubRelationalDetail } from "../../../models/table.models"

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  relational?: RelationalDetail | null;
  subrelational?: SubRelationalDetail | null;
  data: InstaRelationalData[],
  showSubrelationalText?: boolean;
};

type PieSlice = {
  label: string
  value: number
}

const RED = "#EF4444"
const BLUE = "#3B82F6"

export default function MultiplePieChart({relational, subrelational, data, showSubrelationalText}: Props) {
  const privateDistribution = useMemo(() => {
    const mapPieData = (
      field: "is_private" | "is_mutual"
    ): PieSlice[] => {
      let trueCount = 0
      let falseCount = 0

      data.forEach((item) => {
        const value = item.instagram_detail[field]
        if (value === true) trueCount++
        else falseCount++
      })

      const labelMap = {
        is_private: ["Private", "Public"],
        is_mutual: ["Mutual", "Non-Mutual"],
      }

      const [trueLabel, falseLabel] = labelMap[field]

      return [
        { label: trueLabel, value: trueCount },
        { label: falseLabel, value: falseCount },
      ]
    }
    return mapPieData("is_private")
  }, [data])

  const mutualDistribution = useMemo(() => {
    const mapPieData = (
      field: "is_private" | "is_mutual"
    ): PieSlice[] => {
      let trueCount = 0
      let falseCount = 0

      data.forEach((item) => {
        const value = item.instagram_detail[field]
        if (value === true) trueCount++
        else falseCount++
      })

      const labelMap = {
        is_private: ["Private", "Public"],
        is_mutual: ["Mutual", "Non-Mutual"],
      }

      const [trueLabel, falseLabel] = labelMap[field]

      return [
        { label: trueLabel, value: trueCount },
        { label: falseLabel, value: falseCount },
      ]
    }
    return mapPieData("is_mutual")
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center">
        No data available
      </div>
    )
  }

  const buildChartData = (
    distribution: PieSlice[],
    colorMode: "default" | "reverse"
  ): ChartData<"pie"> => {
    const colors =
      colorMode === "reverse"
        ? [BLUE, RED]
        : [RED, BLUE]

    return {
      labels: distribution.map((d) => d.label),
      datasets: [
        {
          data: distribution.map((d) => d.value),
          backgroundColor: colors,
        },
      ],
    }
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
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

  const relationalLabel = relational?.relational ?? "No Relational";
  const subrelationalLabel = subrelational?.subrelational ?? "No Subrelational";
  const labelText = showSubrelationalText ? `${relationalLabel} - ${subrelationalLabel}` : `${relationalLabel} - All`;

  return (
    <div className="grid grid-rows-2 gap-6 w-full">
      {/* Private */}
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium text-center mb-3">
          {labelText} (Private vs Public)
        </h3>
        <div className="w-68 h-68">
            <Pie
            data={buildChartData(privateDistribution, "default")}
            options={options}
            />
        </div>
      </div>

      {/* Mutual */}
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium text-center mb-3">
          {labelText} (Mutual vs Non-Mutual)
        </h3>
        <div className="w-68 h-68">
            <Pie
            data={buildChartData(mutualDistribution, "reverse")}
            options={options}
            />
        </div>
      </div>
    </div>
  )
}