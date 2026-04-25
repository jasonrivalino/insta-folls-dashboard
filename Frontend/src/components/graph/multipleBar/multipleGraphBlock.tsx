import { useEffect, useRef, useState } from "react"
import type { RelationalDetail, GeneralStatistics, InstaRelationalData } from "../../../models/table.models"
import { getInstagramUsers } from "../../../services/dataVisualization/instaUserList.services"
import MultipleGraphDropdown from "./multipleGraphDropdown"
import MultipleChartBar from "./multipleChartBar"
import MultiplePieChart from "./multipleChartPie"

type Props = {
  relationalList: RelationalDetail[]
  index: number
  isMutual?: boolean
}

export default function MultipleGraphBlock({
  relationalList,
  index,
  isMutual
}: Props) {
  const [selectedRelational, setSelectedRelational] = useState<RelationalDetail | null>(null)
  const [statistics, setStatistics] = useState<GeneralStatistics | null>(null)
  const [rawData, setRawData] = useState<InstaRelationalData[]>([])
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
    setRawData(response.data)
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
      <MultipleGraphDropdown
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
          <div className="p-3.5 w-full h-full flex flex-col gap-6">
            {/* Set Multiple Bar Chart */}
            <div className="flex-1">
              <MultipleChartBar
                relational={selectedRelational}
                statistics={statistics}
              />
            </div>
            <div className="flex-2">
              <MultiplePieChart
                relational={selectedRelational}
                data={rawData}
              />
            </div>
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