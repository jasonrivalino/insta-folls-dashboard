import { getInstagramUsers } from "../../services/dataVisualization/instaUserList.services";
import type { InstaRelationalData, RelationalDetail } from "../../models/table.models";
import { useEffect, useState } from "react";
import type React from "react";

import { ListFilter } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { getRelationalDetails } from "../../services/settings/changeInstaInfo.services";

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
  const [isPrivate, setIsPrivate] = useState<boolean | undefined>(undefined);
  const [isMutual, setIsMutual] = useState<boolean | undefined>(undefined);
  const [sort, setSort] = useState<SortState>({
    key: null,
    order: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

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

      setUsers(data);
    };

    fetchUsers();
  }, [isPrivate, isMutual, selectedRelationalId, sort.key, sort.order, searchQuery]);

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

  return (
    <div className="flex flex-col gap-5">
      {/* Header + Search & Filters */}
      <div className="flex flex-row mx-auto justify-between w-full items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">Instagram Users Data</h1>
          <p className="text-sm text-gray-800">List of collected Instagram account information</p>
        </div>
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
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto max-h-[75.9vh]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className={thClass}>No.</th>
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
                  const user = userData.instagram_detail;

                  return (
                    <tr
                      key={user.id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <td className={tdClass}>{index + 1}</td>
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
      {/* Total Users: {users.length} */}
      <div className="text-sm text-gray-600 justify-end px-2 py-1 bg-white rounded-md shadow-sm w-fit items-end ml-auto -mt-2">
        Total Data Shown: <b>{users.length}</b>
      </div>
    </div>
  );
}