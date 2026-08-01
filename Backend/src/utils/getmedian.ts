export function getMedian(values: number[]): number {
    if (values.length === 0) return 0

    const sorted = [...values].sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      const left = sorted[middle - 1]
      const right = sorted[middle]

      if (left === undefined || right === undefined) {
        return 0
      }

      return Math.round((left + right) / 2)
    }

    const medianValue = sorted[middle]
    return medianValue ?? 0
  }