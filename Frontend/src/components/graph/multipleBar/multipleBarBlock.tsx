import { useEffect, useRef, useState } from "react"
import type { RelationalDetail, GeneralStatistics } from "../../../models/table.models"
import { getInstagramUsers } from "../../../services/dataVisualization/instaUserList.services"
import MultipleBarDropdown from "./multipleBarDropdown"
import MultipleBarChart from "./multipleBarChart"

type Props = {
  relationalList: RelationalDetail[]
  index: number
  isMutual?: boolean
}

export default function MultipleBarBlock({
  relationalList,
  index,
  isMutual
}: Props) {
  const [selectedRelational, setSelectedRelational] = useState<RelationalDetail | null>(null)
  const [statistics, setStatistics] = useState<GeneralStatistics | null>(null)
  const prevIsMutualRef = useRef<boolean | undefined>(isMutual)

  // Fetch statistics based on selected relational and mutual filter
  const fetchStatistics = async (
    relational: RelationalDetail,
    mutual?: boolean
    ) => {
    const response = await getInstagramUsers({
        relational_id: relational.id,
        ...(mutual !== undefined && { is_mutual: mutual })
    })
    if (!response) return
    setStatistics(response.general_statistics)
  }

  // Handle relational selection
  const handleSelect = async (relational: RelationalDetail | null) => {
    if (!relational) {
        setSelectedRelational(null)
        setStatistics(null)
        return
    }
    setSelectedRelational(relational)
    await fetchStatistics(relational, isMutual)
  }

  useEffect(() => {
    if (!selectedRelational) return
    if (prevIsMutualRef.current === isMutual) return
    prevIsMutualRef.current = isMutual

    const loadStatistics = async () => {
        await fetchStatistics(selectedRelational, isMutual)
    }
    loadStatistics()
  }, [isMutual, selectedRelational])

  return (
    <div className="rounded-lg p-3 shadow-sm bg-white min-h-88 flex flex-col gap-2.5">
      <MultipleBarDropdown
        index={index}
        relationalList={relationalList}
        onSelect={handleSelect}
      />

      <div>
        <h3 className="text-base text-center font-medium mt-0.5">
            Total Data:{"  "}
            <span className="text-blue-600">
              {statistics ? statistics.total_data : "-"}
            </span>
        </h3>
      </div>

      <div className="flex-1 flex items-center justify-center border border-dashed rounded-md">
        {selectedRelational && statistics ? (
          <div className="pt-3.5 pl-3 pr-4 w-full h-full">
            <MultipleBarChart
                relational={selectedRelational}
                statistics={statistics}
            />
          </div>
        ) : (
          <EmptyPlaceholder />
        )}
      </div>
    </div>
  )
}

function EmptyPlaceholder() {
  return (
    <div className="text-center text-gray-400 text-sm">
      <div>Select a relational to display chart</div>
    </div>
  )
}