import type { InstagramUser, InstaRelationalData } from "./table.models"

// Bar Chart Distribution Data
export interface DistributionResult {
  label: string
  count: number
  color?: string
}
export type NumericBarField = "followers" | "following" | "gap"
export interface DistributionChartProps {
  data: InstaRelationalData[]
  field: NumericBarField
  title: string
  bins?: number
  maxRange?: number
  height?: number
  width?: number
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
  data: InstaRelationalData[]
  title: string
  height?: number
  width?: number
}

// Pie Chart Data
export type NumericPieField = keyof Pick<
  InstagramUser,
  "is_private" | "is_mutual"
>
export type PieColorMode = "default" | "reverse"
export type PieSlice = {
  label: string
  value: number
}
export type PieChartProps = {
  data: InstaRelationalData[]
  field: NumericPieField
  title: string
  height?: number
  width?: number
  colorMode: PieColorMode
}