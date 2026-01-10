import { useEffect, useState } from "react"
import type { RelationalDetail } from "../../models/table.models"
import { getRelationalDetails } from "../../services/settings/changeInstaInfo.services"
import RelationalComparisonBlock from "../../components/graph/multipleBar/multipleBarBlock"

export default function RelationalComparisonPage() {
  const [relationalList, setRelationalList] = useState<RelationalDetail[]>([])
  const [isMutual, setIsMutual] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRelationalDetails()
      setRelationalList(res.data)
    }
    fetchData()
  }, [])

  const handleMutualChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    if (value === "all") {
      setIsMutual(undefined)
      console.log("selected:", undefined)
    } else {
      const parsed = value === "true"
      setIsMutual(parsed)
      console.log("selected:", parsed)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-semibold">Relational Comparison</h2>
          <p className="text-sm text-gray-600">
            Compare statistics across multiple relational categories <b>(Select Max 3).</b>
          </p>
        </div>

        <div className="flex flex-col gap-1.5 max-w-xs">
          <span className="text-sm font-medium text-gray-700">Is Mutual:</span>
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-150 shadow-sm"
            value={isMutual === undefined ? "all" : String(isMutual)}
            onChange={handleMutualChange}
          >
            <option value="all">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map(index => (
          <RelationalComparisonBlock
            key={index}
            index={index}
            relationalList={relationalList}
            isMutual={isMutual}
          />
        ))}
      </div>
    </div>
  )
}