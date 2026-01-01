import type { InstaRelationalData } from "./table.models"

export interface DistributionResult {
  label: string
  count: number
}

export type NumericField = "followers" | "following"
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