import { getInstagramUsers } from "../../services/instaUserList.services";
import type { InstagramUser } from "../../models/models";
import { useEffect, useState } from "react";
import type React from "react";

export default function InstagramUserList() {
  const [users, setUsers] = useState<InstagramUser[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getInstagramUsers({
        is_private: isPrivate,
      });

      setUsers(data);
    };

    fetchUsers();
  }, [isPrivate]);

  // Handlers for filter changes
  const handlePrivateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    if (value === "all") {
      setIsPrivate(undefined);
    } else {
      setIsPrivate(value === "true");
    }
  };

  // UI Helpers
  const thClass =
    "px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center whitespace-nowrap";
  const tdClass =
    "px-4 py-2 text-sm text-gray-700 text-center whitespace-nowrap";
  const badge = (value: boolean | null) => {
    if (value == null) return <span className="text-gray-400">-</span>;
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          value
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row mx-auto justify-between w-full items-center">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">
            Instagram Users Data
          </h1>
          <p className="text-sm text-gray-800">
            List of collected Instagram account information
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-1.5">
          {/* Title / Label */}
          <span className="text-sm font-medium text-gray-700">Privacy Status</span>

          {/* Dropdown */}
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
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto max-h-[81.5vh]">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-gray-200 z-10">
              <tr>
                <th className={thClass}>No.</th>
                <th className={thClass}>PK Insta</th>
                <th className={thClass}>Username</th>
                <th className={thClass}>Full Name</th>
                <th className={thClass}>Private</th>
                <th className={thClass}>Followers</th>
                <th className={thClass}>Following</th>
                <th className={thClass}>Posts</th>
                <th className={thClass}>Biography</th>
                <th className={thClass}>Mutual</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className={tdClass}>{index + 1}</td>
                  <td className={tdClass}>{user.pk_def_insta ?? "-"}</td>

                  <td className="px-4 py-2 text-sm font-medium text-center">
                    {user.username ? (
                      <a
                        href={`https://www.instagram.com/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.username}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className={tdClass}>{user.fullname ?? "-"}</td>
                  <td className={tdClass}>{badge(user.is_private)}</td>
                  <td className={tdClass}>{user.followers ?? "-"}</td>
                  <td className={tdClass}>{user.following ?? "-"}</td>
                  <td className={tdClass}>{user.media_post_total ?? "-"}</td>

                  <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                    {user.biography || "-"}
                  </td>

                  <td className={tdClass}>{badge(user.is_mutual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}