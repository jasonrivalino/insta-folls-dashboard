// services/dataVisualization/mainDashboard.services.ts
import type { InstaRelationalData } from "../../models/table.models"
import type { DistributionResult, NumericBarField, NumericPieField, PieSlice, ScatterPoint } from "../../models/statistics.models"

// Function to distribute data by a numeric field into bins
export function distributeByField(
  data: InstaRelationalData[],
  field: NumericBarField,
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

// Distribute by gap customize color
export function distributeGap(
  data: InstaRelationalData[],
  bins: number,
  maxGap: number
): DistributionResult[] {

  const results: DistributionResult[] = []

  const totalRange = maxGap * 2
  const step = Math.floor(totalRange / bins)
  const isOdd = bins % 2 === 1
  const midIndex = Math.floor(bins / 2)

  // Below range
  results.push({
    label: `<-${maxGap}`,
    count: 0,
    color: "#EF4444" // red
  })

  // Negative bins
  for (let i = 0; i < bins; i++) {
    const from = -maxGap + i * step
    const to = from + step

    let color = "#22C55E" // green
    if (i < midIndex) color = "#EF4444" // red
    if (isOdd && i === midIndex) color = "#3B82F6" // blue (neutral)

    results.push({
      label: `${from} – ${to}`,
      count: 0,
      color
    })
  }

  // Above range
  results.push({
    label: `>${maxGap}`,
    count: 0,
    color: "#22C55E"
  })

  // Distribute data
  data.forEach(item => {
    const value = item.instagram_detail.gap

    if (value < -maxGap) {
      results[0].count++
      return
    }

    if (value > maxGap) {
      results[results.length - 1].count++
      return
    }

    const index = Math.min(
      Math.floor((value + maxGap) / step),
      bins - 1
    )

    results[index + 1].count++
  })

  return results
}


// Map Scatter Plot Data
export const mapScatterFollowersFollowing = (
  data: InstaRelationalData[]
): ScatterPoint[] => {

  const validData = data
    .map(item => {
      const d = item.instagram_detail
      if (
        d.followers == null ||
        d.following == null ||
        d.username == null
      ) return null

      return {
        x: d.following,
        y: d.followers,
        username: d.username,
        gap: d.gap,
      }
    })
    .filter((p): p is ScatterPoint => p !== null)

  // Collect axis values
  const followersValues = validData.map(d => d.y)
  const followingValues = validData.map(d => d.x)

  // Compute bounds
  const followersBounds = getIQRBounds(followersValues)
  const followingBounds = getIQRBounds(followingValues)

  // Mark outliers
  return validData.map(point => {
    const isFollowersOutlier =
      point.y < followersBounds.lower ||
      point.y > followersBounds.upper

    const isFollowingOutlier =
      point.x < followingBounds.lower ||
      point.x > followingBounds.upper

    return {
      ...point,
      is_outlier: isFollowersOutlier || isFollowingOutlier,
    }
  })
}

const getQuantile = (arr: number[], q: number) => {
  const sorted = [...arr].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base

  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
  return sorted[base]
}
const getIQRBounds = (values: number[]) => {
  const q1 = getQuantile(values, 0.25)
  const q3 = getQuantile(values, 0.75)
  const iqr = q3 - q1

  return {
    lower: q1 - 1.5 * iqr,
    upper: q3 + 1.5 * iqr,
  }
}

// Map Pie Chart Data
export const mapPieData = (
  data: InstaRelationalData[],
  field: NumericPieField
): PieSlice[] => {
  let trueCount = 0
  let falseCount = 0

  data.forEach((item) => {
    const value = item.instagram_detail[field]

    if (value === true) trueCount++
    else falseCount++
  })

  const labelMap: Record<NumericPieField, [string, string]> = {
    is_private: ["Private", "Public"],
    is_mutual: ["Mutual", "Non-Mutual"],
  }

  const [trueLabel, falseLabel] = labelMap[field]

  return [
    { label: trueLabel, value: trueCount },
    { label: falseLabel, value: falseCount },
  ]
}