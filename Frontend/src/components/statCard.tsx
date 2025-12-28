export default function StatCard({
  label,
  value,
  icon,
  rank,
  totalUsers,
}: {
  label: string
  value: number
  icon: React.ReactNode
  rank?: number
  totalUsers?: number
}) {
  const isGap = label === "Gap"
  const hasRank = rank !== undefined && totalUsers !== undefined

  const containerClass = `
    rounded-xl
    ${hasRank ? "p-4" : "px-4 py-[1.625rem]"}
    flex items-center gap-4
    border shadow-sm transition
    ${
      isGap && value > 0
        ? "bg-green-50 border-green-400 shadow-green-200"
        : isGap && value < 0
        ? "bg-red-50 border-red-400 shadow-red-200"
        : "bg-white border-blue-400 shadow-blue-200"
    }
  `

  const iconClass = `
    text-xl
    ${
      isGap && value > 0
        ? "text-green-600"
        : isGap && value < 0
        ? "text-red-600"
        : "text-blue-600"
    }
  `

  const valueClass = `
    text-xl font-bold
    ${
      isGap && value > 0
        ? "text-green-700"
        : isGap && value < 0
        ? "text-red-700"
        : "text-gray-900"
    }
  `

  return (
    <div className={containerClass}>
      {icon && <div className={iconClass}>{icon}</div>}
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={valueClass}>{value}</p>

        {hasRank && (
          <p className="text-xs text-gray-600 mt-1">
            Rank <span className="font-semibold">{rank}</span> of{" "}
            <span className="font-semibold">{totalUsers}</span> Instagram Users
          </p>
        )}
      </div>
    </div>
  )
}