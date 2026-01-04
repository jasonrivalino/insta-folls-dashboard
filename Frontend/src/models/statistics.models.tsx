import type { InstaRelationalData } from "./table.models"

export interface DistributionResult {
  label: string
  count: number
  color?: string
}

export type NumericField = "followers" | "following" | "gap"
export type ShowDataMode = "accounts" | "total"

export interface DistributionChartProps {
  data: InstaRelationalData[]
  field: NumericField
  title: string
  bins?: number
  maxRange?: number
  color?: string
  height?: number
  width?: number
  showData: ShowDataMode
}

// Scatter Chart Data Point
export type ScatterPoint = {
  x: number
  y: number
  username: string
  gap: number
  is_outlier: boolean
}
export type ScatterChartProps = {
  data: ScatterPoint[]
  title: string
  height?: number
  width?: number
}