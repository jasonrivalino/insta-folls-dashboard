import { useEffect, useRef, useState } from "react";
import type { RelationalDetail, GeneralStatistics, InstaRelationalData, SubRelationalDetail} from "../../../models/table.models";
import { getSubrelationalList } from "../../../services/settings/subrelationalList.services";
import { getInstagramUsers } from "../../../services/dataVisualization/instaUserList.services";
import MultipleGraphDropdown from "./multipleGraphDropdown";
import MultipleChartBar from "./multipleChartBar";
import MultiplePieChart from "./multipleChartPie";

type Props = {
  relationalList: RelationalDetail[];
  index: number;
  isMutual?: boolean;
};

export default function MultipleGraphBlock({
  relationalList,
  index,
  isMutual,
}: Props) {
  const [selectedRelationalId, setSelectedRelationalId] = useState<number | null>(null);
  const [subrelationalList, setSubrelationalList] = useState<SubRelationalDetail[]>([]);
  const [selectedSubrelationalId, setSelectedSubrelationalId] = useState<number | null>(null);

  const [statistics, setStatistics] = useState<GeneralStatistics | null>(null);
  const [rawData, setRawData] = useState<InstaRelationalData[]>([]);

  const prevIsMutualRef = useRef<boolean | undefined>(isMutual);

  // Get relational object from selected id
  const selectedRelational = relationalList.find((r) => r.id === selectedRelationalId) ?? null;
  const selectedSubrelational = subrelationalList.find((s) => s.id === selectedSubrelationalId) ?? null;

  // Fetch statistics
  const fetchStatistics = async (
    relationalId: number,
    mutual?: boolean,
    subrelationalId?: number | null
  ) => {
    const response = await getInstagramUsers({
      relational_id: relationalId,
      subrelational_id: subrelationalId ?? undefined,
      ...(mutual !== undefined && { is_mutual: mutual }),
    });
    if (!response) return;
    console.log("Fetched statistics:", response.general_statistics);

    setStatistics(response.general_statistics);
    setRawData(response.data);
  };

  // Load subrelationals
  const loadSubrelationals = async (relationsId: number) => {
    try {
      const response = await getSubrelationalList(relationsId);
      setSubrelationalList(response.data);
      setSelectedSubrelationalId(null);
    } catch (err) {
      console.error(err);

      setSubrelationalList([]);
      setSelectedSubrelationalId(null);
    }
  };

  // Handle relational selection
  const handleRelationalSelect = async (id: number | null) => {
    console.log("Relational selected:", id);
    setSelectedRelationalId(id);
    setSelectedSubrelationalId(null);
    setSubrelationalList([]);

    if (id === null) {
      setStatistics(null);
      setRawData([]);
      return;
    }

    // No Relational
    if (id === 0) {
      await fetchStatistics(0, isMutual, null);
      return;
    }

    await loadSubrelationals(id);
    await fetchStatistics(id, isMutual, null);
  };

  // Handle subrelational selection
  const handleSubrelationalSelect = async (id: number | null) => {
    setSelectedSubrelationalId(id);
    if (selectedRelationalId == null) return;
    console.log("Subrelational selected:", id);
    await fetchStatistics(selectedRelationalId, isMutual, Number.isNaN(id) ? null : id);
  };

  // Refetch when mutual changes
  useEffect(() => {
    if (selectedRelationalId == null) return;
    if (prevIsMutualRef.current === isMutual) return;
    prevIsMutualRef.current = isMutual;
    const loadStatistics = async () => {
        await fetchStatistics(selectedRelationalId, isMutual, selectedSubrelationalId)
    }
    loadStatistics()
  }, [isMutual, selectedRelationalId, selectedSubrelationalId])

  return (
    <div className="rounded-lg p-3 shadow-sm bg-white min-h-88 flex flex-col gap-2.5">
      <MultipleGraphDropdown
        items={relationalList}
        placeholder={`Relational Option ${index + 1}`}
        noText="No Relational"
        getLabel={(r) => r.relational}
        onSelect={handleRelationalSelect}
      />

      <MultipleGraphDropdown
        items={subrelationalList}
        placeholder="Select Subrelational"
        noText="No Subrelational"
        getLabel={(s) => s.subrelational}
        onSelect={handleSubrelationalSelect}
        disabled={selectedRelationalId === null || selectedRelationalId === 0 || subrelationalList.length === 0}
      />

      <div>
        <h3 className="text-base text-center font-medium mt-0.5">
          Total Data:{" "}
          <span className="text-blue-600">
            {statistics ? statistics.total_data : "-"}
          </span>
        </h3>
      </div>

      <div className="flex-1 flex items-center justify-center border border-dashed rounded-md">
        {statistics ? (
          <div className="p-3.5 w-full h-full flex flex-col gap-6">
            <div className="flex-1">
              <MultipleChartBar
                relational={selectedRelational}
                subrelational={selectedSubrelational}
                statistics={statistics}
                showSubrelationalText={selectedSubrelationalId !== null}
              />
            </div>
            <div className="flex-2">
              <MultiplePieChart
                relational={selectedRelational}
                subrelational={selectedSubrelational}
                data={rawData}
                showSubrelationalText={selectedSubrelationalId !== null}
              />
            </div>
          </div>
        ) : (
          <EmptyPlaceholder />
        )}
      </div>
    </div>
  );
}

function EmptyPlaceholder() {
  return (
    <div className="text-center text-gray-400 text-sm">
      <div>Select a relational to display chart</div>
    </div>
  );
}