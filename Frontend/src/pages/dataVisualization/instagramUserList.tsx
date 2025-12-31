import { getInstagramUsers } from "../../services/dataVisualization/instaUserList.services";
import type { GeneralStatistics, InstaRelationalData, RelationalDetail, TableData } from "../../models/table.models";
import { useEffect, useState, useRef } from "react";
import type React from "react";
import * as XLSX from "xlsx";

import { ArrowUpDown, ListFilter } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FiGrid, FiLock, FiUnlock, FiUserPlus, FiUsers } from "react-icons/fi";
import { getRelationalDetails } from "../../services/settings/changeInstaInfo.services";
import { useMainAccount } from "../../context/useMainAccount";
import StatCard from "../../components/statCard";

type InstagramSortKey =
  | "pk_def_insta"
  | "username"
  | "fullname"
  | "followers"
  | "following"
  | "gap"
  | "media_post_total";

type SortOrder = "asc" | "desc" | null;

type SortState = {
  key: InstagramSortKey | null;
  order: SortOrder;
};

// Icon component for sort indicator
const SortIcon = ({ activeKey, order, column } : { activeKey: InstagramSortKey | null; order: SortOrder; column: InstagramSortKey; }) => {
  if (activeKey !== column || order === null) {
      return <ListFilter size={14} strokeWidth={2} className="mb-0.5"/>;
    }
    return order === "asc" ? <FontAwesomeIcon icon={faCaretUp} size="lg" /> : <FontAwesomeIcon icon={faCaretDown} size="lg" className="mb-0.5"/>;
  };

// Sortable Table Header component
const SortableTh = ({ label, column, sort, onSort, thClass }: { label: string; column: InstagramSortKey; sort: SortState; onSort: (key: InstagramSortKey) => void; thClass: string; }) => (
  <th className={`${thClass} cursor-pointer select-none`} onClick={() => onSort(column)}>
    <div className="flex items-center justify-center gap-1.5">
      {label}
      <SortIcon
        column={column}
        activeKey={sort.key}
        order={sort.order}
      />
    </div>
  </th>
);

export default function InstagramUserList() {
  const [users, setUsers] = useState<InstaRelationalData[]>([]);
  const [stats, setStats] = useState<GeneralStatistics | null>(null)
  const [isPrivate, setIsPrivate] = useState<boolean | undefined>(undefined);
  const [isMutual, setIsMutual] = useState<boolean | undefined>(undefined);
  const [sort, setSort] = useState<SortState>({
    key: null,
    order: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { account } = useMainAccount()
  const username = (account?.username ?? "unknown")
    .replace(/[^a-zA-Z0-9]/g, "");

  // Download Data Handler State
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement | null>(null);

  // Selected User Detail State
  const [selectedUser, setSelectedUser] = useState<InstaRelationalData | null>(null);

  // Relational Filter State
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

  // Fetch users on component mount and when isPrivate changes
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getInstagramUsers({
        is_private: isPrivate,
        is_mutual: isMutual,
        relational_id: selectedRelationalId ?? undefined,
        sortBy: sort.key ?? undefined,
        order: sort.order ?? undefined,
        search: searchQuery || undefined,
      });

      if (data) {
        setUsers(data.data);
        setStats(data.general_statistics);
      }
    };

    fetchUsers();
  }, [isPrivate, isMutual, selectedRelationalId, sort.key, sort.order, searchQuery]);

  // Close download dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadRef.current &&
        !downloadRef.current.contains(event.target as Node)
      ) {
        setDownloadOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle filter changes
  const handlePrivateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsPrivate(value === "all" ? undefined : value === "true");
  };
  const handleMutualChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsMutual(value === "all" ? undefined : value === "true");
  }

  // Handle sorting logic
  const handleSortClickName = (key: InstagramSortKey) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, order: "asc" };
      if (prev.order === "asc") return { key, order: "desc" };
      if (prev.order === "desc") return { key: null, order: null };
      return { key, order: "asc" };
    });
  };
  const handleSortClickNumber = (key: InstagramSortKey) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, order: "desc" };
      if (prev.order === "desc") return { key, order: "asc" };
      if (prev.order === "asc") return { key: null, order: null };
      return { key, order: "desc" };
    });
  };

  // Handle header and badges styles
  const thClass =
    "px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center whitespace-nowrap";
  const tdClass =
    "px-4 py-2 text-sm text-gray-700 text-center whitespace-nowrap";

  // Badge components
  const privateBadge = (value: boolean | null) =>
    value == null ? <span className="text-gray-400">-</span> : (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${value ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
        {value ? "Private" : "Public"}
      </span>
    );
  const gapBadge = (value: number | null) =>
    value == null ? <span className="text-gray-400">-</span> : (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${value >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {value}
      </span>
    );
  const mutualBadge = (value: boolean | null) =>
    value == null ? <span className="text-gray-400">-</span> : (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {value ? "Yes" : "No"}
      </span>
    );

  // Gap statistics badge class
  const gapStatClass = (value?: number) => {
    if (typeof value !== "number") {
      return {
        container: "bg-white border-gray-300 shadow-gray-200",
        text: "text-gray-600",
      }
    }

    if (value > 0) {
      return {
        container: "bg-green-50 border-green-400 shadow-green-200",
        text: "text-green-700",
      }
    }

    if (value < 0) {
      return {
        container: "bg-red-50 border-red-400 shadow-red-200",
        text: "text-red-700",
      }
    }

    return {
      container: "bg-blue-50 border-blue-400 shadow-blue-200",
      text: "text-blue-700",
    }
  };
  const gapStyle = gapStatClass(stats?.average_gap)
  const totalUsers = stats?.total_data ?? 0

  // Map users for download
  const mapUsersForDownload = (users: InstaRelationalData[]): TableData[] => {
    return users.map((u, index) => {
      const user = u.instagram_detail;

      return {
        no: index + 1,
        id: user.id,
        pk_def_insta: user.pk_def_insta ?? "",
        username: user.username ?? "",
        fullname: user.fullname ?? "",
        is_private: user.is_private ?? false,
        media_post_total: user.media_post_total ?? 0,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        biography: user.biography ?? "",
        is_mutual: user.is_mutual ?? false,
        last_update: user.last_update ?? "",
        relations: u.relational_detail.map(r => r.relational),
      };
    });
  };

  // Timestampe for filenames
  const getTimestamp = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");

    return `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  };

  // Download JSON
  const downloadJSON = (data: TableData[]) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    triggerDownload(blob, `InstagramUserData_${username}_${getTimestamp()}.json`);
  };

  // Download CSV (semicolon separated)
  const downloadCSV = (data: TableData[]) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);

    const rows = data.map(row =>
      headers
        .map(key => {
          const value = row[key as keyof TableData];

          // Handle array values (relations)
          if (Array.isArray(value)) {
            return `"[${value.join("; ")}]"`;
          }

          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(";")
    );

    const csv = [headers.join(";"), ...rows].join("\n");
    const blob = new Blob([csv],
      { type: "text/csv;charset=utf-8;" }
    );
    triggerDownload(blob,`InstagramUserData_${username}_${getTimestamp()}.csv`);
  };

  // Download XLSX
  const downloadXLSX = (data: TableData[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(row => ({
        ...row,
        relations: `[${row.relations.join(", ")}]`,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook,worksheet,"Instagram Users");
    XLSX.writeFile(workbook,`InstagramUserData_${username}_${getTimestamp()}.xlsx`,{ compression: true });
  };

  // Trigger download helper
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header + Search & Filters */}
      <div className="flex flex-row mx-auto justify-between w-full items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">Instagram Users Data</h1>
          <p className="text-sm text-gray-800">List of collected Instagram account information</p>
        </div>
        {/* Searching Username */}
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-1.5 w-44">
            <span className="text-sm font-medium text-gray-700">Search Insta Username</span>
            <input
              type="text"
              placeholder="Input Username..."
              className="border border-gray-300 rounded-lg px-2.5 py-[0.2875rem] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm hover:shadow-md bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Set Privacy Status */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Privacy Status</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm hover:shadow-md bg-white"
              value={isPrivate === undefined ? "all" : String(isPrivate)}
              onChange={handlePrivateChange}
            >
              <option value="all">All</option>
              <option value="true">Private</option>
              <option value="false">Public</option>
            </select>
          </div>
          {/* Set Mutual Status */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Is Mutual</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm hover:shadow-md bg-white"
              value={isMutual === undefined ? "all" : String(isMutual)}
              onChange={handleMutualChange}
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          {/* Choose User Relational Type */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Relational</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm
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
          {/* Download Data */}
          <div ref={downloadRef} className="relative flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Download Data</span>

            <button
              onClick={() => setDownloadOpen(prev => !prev)}
              className="
                group inline-flex items-center justify-center gap-2
                px-4 py-[0.3375rem] text-sm font-semibold text-white
                rounded-lg
                bg-linear-to-r from-blue-600 to-indigo-600
                shadow-md shadow-blue-500/30
                hover:from-blue-700 hover:to-indigo-700
                hover:shadow-blue-500/40
                active:scale-95
                transition-all duration-200 cursor-pointer
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              Download
            </button>

            {downloadOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {["All", "CSV", "JSON", "XLSX"].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      const formatted = mapUsersForDownload(users);

                      if (type === "All") {
                        downloadCSV(formatted);
                        downloadJSON(formatted);
                        downloadXLSX(formatted);
                      }
                      if (type === "CSV") downloadCSV(formatted);
                      if (type === "JSON") downloadJSON(formatted);
                      if (type === "XLSX") downloadXLSX(formatted);

                      setDownloadOpen(false);
                    }}
                    className="
                      w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                    "
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto max-h-[75.9vh]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className={thClass}>No.</th>
                <th className={thClass}>Detail</th>
                <SortableTh label="Insta ID" column="pk_def_insta" sort={sort} onSort={handleSortClickNumber} thClass={thClass} />
                <SortableTh label="Username" column="username" sort={sort} onSort={handleSortClickName} thClass={thClass} />
                <SortableTh label="Full Name" column="fullname" sort={sort} onSort={handleSortClickName} thClass={thClass} />
                <th className={thClass}>Private</th>
                <SortableTh label="Followers" column="followers" sort={sort} onSort={handleSortClickNumber} thClass={thClass} />
                <SortableTh label="Following" column="following" sort={sort} onSort={handleSortClickNumber} thClass={thClass} />
                <SortableTh label="Gap" column="gap" sort={sort} onSort={handleSortClickNumber} thClass={thClass} />
                <SortableTh label="Posts" column="media_post_total" sort={sort} onSort={handleSortClickNumber} thClass={thClass} />
                <th className={thClass}>Biography</th>
                <th className={thClass}>Mutual</th>
                <th className={thClass}>Relations</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="p-4 text-center text-base text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                  users.map((userData, index) => {
                    const user = userData.instagram_detail

                    const isMainAccount =
                      account?.username &&
                      user.username &&
                      account.username.toLowerCase() === user.username.toLowerCase()

                    return (
                      <tr
                        key={user.id}
                        className={`
                          transition-colors hover:bg-gray-100
                          ${
                            isMainAccount
                              ? "bg-yellow-200 hover:bg-yellow-300"
                              : "odd:bg-white even:bg-gray-50"
                          }
                        `}
                      >
                      <td className={tdClass}>{index + 1}</td>
                      <td className={tdClass}>
                        <button
                          onClick={() => setSelectedUser(userData)}
                          className="
                            inline-flex items-center justify-center
                            px-2 py-1
                            bg-blue-600 text-white
                            rounded-md
                            text-xs font-medium
                            hover:bg-blue-700
                            transition-colors
                            cursor-pointer
                          "
                        >
                          Detail
                        </button>
                      </td>
                      <td className={tdClass}>{user.pk_def_insta ?? "-"}</td>

                      <td className="px-4 py-2 text-sm font-medium text-center whitespace-nowrap">
                        {user.username ? (
                          <a
                            href={`https://www.instagram.com/${user.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {user.username}
                          </a>
                        ) : "-"}
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-700 text-center whitespace-nowrap max-w-56 truncate">
                        {user.fullname ?? "-"}
                      </td>

                      <td className={tdClass}>{privateBadge(user.is_private)}</td>
                      <td className={tdClass}>{user.followers ?? "-"}</td>
                      <td className={tdClass}>{user.following ?? "-"}</td>
                      <td className={tdClass}>
                        {gapBadge(
                          user.followers != null && user.following != null
                            ? user.followers - user.following
                            : null
                        )}
                      </td>
                      <td className={tdClass}>{user.media_post_total ?? "-"}</td>

                      <td className="px-4 py-2 text-sm text-gray-700 text-center whitespace-nowrap max-w-xs truncate">
                        {user.biography || "-"}
                      </td>

                      <td className={tdClass}>{mutualBadge(user.is_mutual)}</td>

                      <td className={tdClass}>
                        {userData.relational_detail.length > 0
                          ? userData.relational_detail.map(r => (
                              <span
                                key={r.id}
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mr-1"
                                style={{
                                  backgroundColor: r.bg_color,
                                  color: r.text_color,
                                }}
                              >
                                {r.relational}
                              </span>
                            ))
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-row gap-3 ml-auto justify-end -mt-2">
        <div className="text-sm text-gray-600 px-3 py-1 bg-white rounded-md shadow-sm">
          Total Data: <b>{stats?.total_data ?? 0}</b>
        </div>

        <div className="text-sm text-gray-600 px-3 py-1 bg-white rounded-md shadow-sm">
          Avg Followers: <b>{stats?.average_followers ?? "-"}</b>
        </div>

        <div className="text-sm text-gray-600 px-3 py-1 bg-white rounded-md shadow-sm">
          Avg Following: <b>{stats?.average_following ?? "-"}</b>
        </div>
        
        <div className={`text-sm px-3 py-1 rounded-md border shadow-sm ${gapStyle.container}`}>
          <span className={gapStyle.text}>
            Avg Gap: <b>{stats?.average_gap ?? "-"}</b>
          </span>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-20">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-full p-6 relative animate-fadeIn">

            {/* CLOSE */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition-colors text-xl font-bold cursor-pointer"
              aria-label="Close"
            >
              ❌
            </button>

            {/* CONTENT */}
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-gray-800 text-center">
                Instagram User Detail
              </h2>

              <div className="flex flex-col bg-gray-100 p-3 rounded-xl shadow-sm border border-gray-200 gap-3">
                  <div className="flex justify-between items-start">
                      <div className="flex flex-col items-start">
                          <h4 className="text-sm text-gray-500">User PK: #{selectedUser.instagram_detail.pk_def_insta} ({selectedUser.data_statistics?.oldest_rank} of {totalUsers})</h4>

                          <a
                            href={`https://www.instagram.com/${selectedUser.instagram_detail.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-bold text-blue-600 hover:underline"
                          >
                            @{selectedUser.instagram_detail.username}
                          </a>

                          <p className="text-gray-500 font-semibold">{selectedUser.instagram_detail.fullname}</p>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {selectedUser.relational_detail.length > 0
                              ? selectedUser.relational_detail.map(r => (
                                  <span
                                    key={r.id}
                                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: r.bg_color,
                                      color: r.text_color,
                                    }}
                                  >
                                    {r.relational}
                                  </span>
                                ))
                              : "-"}
                          </div>
                      </div>
                      <div className="ml-auto flex flex-row items-end gap-2">
                        <div className="flex items-center gap-2 text-sm font-semibold rounded-lg bg-white px-2 py-1 border border-gray-300">
                            {selectedUser.instagram_detail.is_private ? (
                            <>
                                <FiLock className="text-red-500" />
                                Private Account
                            </>
                            ) : (
                            <>
                                <FiUnlock className="text-green-600" />
                                Public Account
                            </>
                            )}
                        </div>
                        <div
                          className={`
                            flex items-center gap-2 text-sm font-semibold rounded-lg px-2 py-1 border
                            ${
                              selectedUser.instagram_detail.is_mutual
                                ? "bg-green-50 text-green-700 border-green-300"
                                : "bg-red-50 text-red-700 border-red-300"
                            }
                          `}
                        >
                            {selectedUser.instagram_detail.is_mutual ? (
                            <>
                                Mutual
                            </>
                            ) : (
                            <>
                                Not Mutual
                            </>
                            )}
                        </div>
                      </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full">
                      <p className="text-gray-700 whitespace-pre-line text-sm">
                          {selectedUser.instagram_detail.biography || "-"}
                      </p>
                  </div>
              </div>

              {/* STATS */}
              <div className="flex flex-row justify-between gap-4 items-stretch">
                  <div className="w-1/4 h-full">
                      <StatCard label="Posts" value={selectedUser.instagram_detail.media_post_total} icon={<FiGrid />} />
                  </div>
                  <div className="flex justify-center">
                      <div className="h-full w-px bg-gray-300" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 flex-1 h-full">
                      <StatCard label="Followers" value={selectedUser.instagram_detail.followers} icon={<FiUsers />} rank={selectedUser.data_statistics?.followers_rank} totalUsers={totalUsers}/>
                      <StatCard label="Following" value={selectedUser.instagram_detail.following} icon={<FiUserPlus />} rank={selectedUser.data_statistics?.following_rank} totalUsers={totalUsers}/>
                      <StatCard label="Gap" value={selectedUser.instagram_detail.gap} icon={<ArrowUpDown />} rank={selectedUser.data_statistics?.gap_rank} totalUsers={totalUsers}/>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}