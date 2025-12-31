import { useEffect, useState } from "react"
import { getInstagramUsers, type InstagramUserQuery } from "../../services/dataVisualization/instaUserList.services"
import type { InstaRelationalData, GeneralStatistics, RelationalDetail } from "../../models/table.models"
import { getRelationalDetails } from "../../services/settings/changeInstaInfo.services"

export default function MainDashboard() {
  const [stats, setStats] = useState<GeneralStatistics | null>(null)

  // KPI states (backend-driven)
  const [topFollowers, setTopFollowers] = useState<InstaRelationalData[]>([])
  const [topFollowing, setTopFollowing] = useState<InstaRelationalData[]>([])
  const [oldestAccount, setOldestAccount] = useState<InstaRelationalData | null>(null)
  const [newestAccount, setNewestAccount] = useState<InstaRelationalData | null>(null)

  // Filter states
  const [isMutual, setIsMutual] = useState<boolean | undefined>(undefined);
  const [relationalList, setRelationalList] = useState<RelationalDetail[]>([]);
  const [selectedRelationalId, setSelectedRelationalId] = useState<number | null>(null);

  // Handle data fetching
  useEffect(() => {
      const loadRelationalData = async () => {
        try {
          const res = await getRelationalDetails();
          setRelationalList(res.data);
        } catch (error) {
          console.error("Failed to load relational data:", error);
        }
      };
  
      loadRelationalData();
  }, []);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
        const filterParams: InstagramUserQuery = {}

        if (isMutual !== undefined) {
            filterParams.is_mutual = isMutual
        }

        if (selectedRelationalId !== null) {
            filterParams.relational_id = selectedRelationalId
        }

        // MAIN STATS
        const mainRes = await getInstagramUsers(filterParams)
        if (mainRes) {
            setStats(mainRes.general_statistics)
        }

        // TOP 3 FOLLOWERS
        const followersRes = await getInstagramUsers({
        ...filterParams,
            sortBy: "followers",
            order: "desc",
            limit: 3,
        })
        if (followersRes) setTopFollowers(followersRes.data)

        // TOP 3 FOLLOWING
        const followingRes = await getInstagramUsers({
            ...filterParams,
            sortBy: "following",
            order: "desc",
            limit: 3,
        })
        if (followingRes) setTopFollowing(followingRes.data)

        // OLDEST ACCOUNT
        const oldestRes = await getInstagramUsers({
            ...filterParams,
            sortBy: "pk_def_insta",
            order: "asc",
            limit: 1,
        })
        if (oldestRes?.data.length) {
            setOldestAccount(oldestRes.data[0])
        }

        // NEWEST ACCOUNT
        const newestRes = await getInstagramUsers({
            ...filterParams,
            sortBy: "pk_def_insta",
            order: "desc",
            limit: 1,
        })
        if (newestRes?.data.length) {
            setNewestAccount(newestRes.data[0])
        }
    }
    fetchDashboardData()
  }, [isMutual, selectedRelationalId])

  const handleMutualChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    if (value === "all") {
        setIsMutual(undefined)
    } else {
        setIsMutual(value === "true")
    }
  }

  if (!stats) return null

return (
    <div className="space-y-4">
        <div className="flex flex-col w-full gap-4 pt-6 pb-10 bg-white rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-center">Main Instagram Preview Information</h2>
            <div className="flex flex-row gap-6 justify-center">
                <div className="rounded-xl border bg-gray-100 shadow-sm flex flex-row">
                    {/* COL 1 — TOTAL DATA */}
                    <div className="flex flex-col justify-center items-center px-6 py-4 gap-1">
                        <p className="text-xs font-semibold uppercase text-gray-500">
                            Total Data
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                            {stats.total_data}
                        </p>
                    </div>

                    {/* Border Separator */}
                    <div className="border-l border-black self-stretch"></div>

                    {/* COL 2 — AVERAGES */}
                    <div className="flex flex-col justify-center items-center px-6 py-4 gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Average Followers
                            </p>
                            <p className="text-2xl font-bold">
                                {stats.average_followers}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Average Following
                            </p>
                            <p className="text-2xl font-bold">
                                {stats.average_following}
                            </p>
                        </div>
                    </div>

                    {/* Border Separator */}
                    <div className="border-l border-black self-stretch"></div>

                    <div className="flex flex-row justify-center items-center px-6 py-4 gap-10">
                        {/* COL 3 — TOP FOLLOWERS */}
                        <div className="items-center">
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                                Top 3 Followers
                            </p>
                            <ul className="space-y-1 text-sm font-semibold">
                                {topFollowers.map((u) => (
                                    <li key={u.instagram_detail.id}>
                                        <a
                                            href={`https://www.instagram.com/${u.instagram_detail.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline">
                                            @{u.instagram_detail.username}
                                        </a> —{" "}{u.instagram_detail.followers}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COL 4 — TOP FOLLOWING */}
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                                Top 3 Following
                            </p>
                            <ul className="space-y-1 text-sm font-semibold">
                                {topFollowing.map((u) => (
                                    <li key={u.instagram_detail.id}>
                                        <a
                                            href={`https://www.instagram.com/${u.instagram_detail.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline">
                                            @{u.instagram_detail.username}
                                        </a> —{" "}{u.instagram_detail.following}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Border Separator */}
                    <div className="border-l border-black self-stretch"></div>

                    {/* COL 5 — OLDEST / NEWEST */}
                    <div className="flex flex-col justify-center px-6 py-4 gap-5">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Oldest Account
                            </p>
                            {oldestAccount && (
                                <>
                                    <p className="font-semibold">
                                        <a
                                            href={`https://www.instagram.com/${oldestAccount.instagram_detail.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline">
                                            @{oldestAccount.instagram_detail.username}
                                        </a>
                                    </p>
                                </>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Newest Account
                            </p>
                            {newestAccount && (
                                <>
                                    <p className="font-semibold">
                                        <a
                                            href={`https://www.instagram.com/${newestAccount.instagram_detail.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline">
                                            @{newestAccount.instagram_detail.username}
                                        </a>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Set Mutual Status */}
                <div className="shrink-0 bg-gray-100 p-4 rounded-xl border shadow-sm flex flex-col gap-3 align-middle justify-center">
                    <div className="flex flex-row gap-4 items-center">
                        <span className="text-sm font-medium text-gray-700 mr-1 w-1/2">Is Mutual: </span>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                    transition-all duration-150 shadow-sm bg-white"                        
                            value={isMutual === undefined ? "all" : String(isMutual)}
                            onChange={handleMutualChange}
                        >
                            <option value="all">All</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <span className="text-sm font-medium text-gray-700 w-1/2">Relational:</span>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                    transition-all duration-150 shadow-sm bg-white"
                            value={selectedRelationalId ?? "all"}
                            onChange={(e) =>
                            setSelectedRelationalId(
                                e.target.value === "all" ? null : Number(e.target.value)
                            )
                            }
                        >
                        <option value="all">All</option>
                        {relationalList.map((rel) => (
                            <option key={rel.id} value={rel.id}>
                            {rel.relational}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
        {/* Dashboard Graphic Visualization */}
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-center">Dashboard Visualizations</h2>
            {/* Placeholder for future charts/graphs */}
            <div className="h-64 flex items-center justify-center text-gray-400 italic">
                Charts and graphs will be displayed here.
            </div>
        </div>
    </div>
    )
}