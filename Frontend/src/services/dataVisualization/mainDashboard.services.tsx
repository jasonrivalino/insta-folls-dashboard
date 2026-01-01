// services/dataVisualization/mainDashboard.services.ts
import type { InstaRelationalData } from "../../models/table.models"
import type { DistributionResult, NumericField } from "../../models/statistics.models"

// Function to distribute data by a numeric field into bins
export function distributeByField(
  data: InstaRelationalData[],
  field: NumericField,
  bins: number = 4,
  maxRange: number = 4000
): DistributionResult[] {
  const step = Math.floor(maxRange / bins)

  const distribution: DistributionResult[] = Array.from(
    { length: bins },
    (_, i) => ({
      label:
        i === bins - 1
          ? `${i * step} - ${maxRange}`
          : `${i * step} - ${(i + 1) * step}`,
      count: 0
    })
  )

  distribution.push({
    label: `> ${maxRange}`,
    count: 0
  })

  data.forEach(item => {
    const value = item.instagram_detail[field]

    if (value > maxRange) {
      distribution[distribution.length - 1].count++
    } else {
      const index = Math.min(
        Math.floor(value / step),
        bins - 1
      )
      distribution[index].count++
    }
  })

  return distribution
}