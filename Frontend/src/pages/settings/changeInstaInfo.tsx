import type { InstaRelationalData, RelationalDetail } from "../../models/table.models";

import { getInstagramUsers } from "../../services/dataVisualization/instaUserList.services";
import { getRelationalDetails, addInstagramUser, updateInstagramUser, deleteInstagramUser } from "../../services/settings/changeInstaInfo.services";

import DeleteConfirmationPopup from "../../components/deleteConfirmationPopup";
import ActionResultPopup from "../../components/actionResultPopup";

import { useEffect, useState } from "react";
import { ListFilter } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import axios from "axios";

type InstagramSortKey =
  | "username"

type SortOrder = "asc" | "desc" | null;

type SortState = {
  key: InstagramSortKey | null;
  order: SortOrder;
};

type FormMode = "idle" | "add" | "edit";

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

export default function ChangeInstaInfo() {
  // Query & Sorting states
  const [users, setUsers] = useState<InstaRelationalData[]>([]);
  const [sort, setSort] = useState<SortState>({
    key: null,
    order: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Form mode state
  const [formMode, setFormMode] = useState<FormMode>("idle");
  // Add / Edit form state
  const [formData, setFormData] = useState({
    pk_def_insta: "0",
    username: "",
    fullname: "",
    is_private: false,
    media_post_total: 0,
    followers: 0,
    following: 0,
    biography: "",
    is_mutual: false,
  });
  // Relational data
  const [relationalList, setRelationalList] = useState<RelationalDetail[]>([]);
  const [selectedRelationIds, setSelectedRelationIds] = useState<number[]>([]);

  // Delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const selectedUser = users.find(
    u => u.instagram_detail.id === selectedUserId
  )?.instagram_detail;
  const [resultPopupOpen, setResultPopupOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<boolean | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");

  // Fetch users on component mount and when isPrivate changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getInstagramUsers({
          sortBy: sort.key ?? undefined,
          order: sort.order ?? undefined,
          search: searchQuery || undefined,
        });

        if (data) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch Instagram users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [sort.key, sort.order, searchQuery]);

  // Handle sorting logic
  const handleSortClick = (key: InstagramSortKey) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, order: "asc" };
      if (prev.order === "asc") return { key, order: "desc" };
      if (prev.order === "desc") return { key: null, order: null };
      return { key, order: "asc" };
    });
  };
  
  // Get all relational details on component mount
  const loadRelationalData = async () => {
    try {
      const res = await getRelationalDetails();
      setRelationalList(res.data);
    } catch (error) {
      console.error("Failed to load relational data:", error);
    }
  };

  // Get selected user based on Id
  const fetchSelectedUserById = async (id: number) => {
    const data = await getInstagramUsers({
      insta_user_id: id,
    });

    return data ? data.data[0] : null;
  };

  // Handle add / edit click
  const handleAddEditClick = async (
    mode: FormMode,
    userId?: number,
    relations: RelationalDetail[] = []
  ) => {
    setFormMode(mode);

    // Always load relational master
    await loadRelationalData();

    // Add Mode
    if (mode === "add") {
      setSelectedUserId(null);
      setFormData({
        pk_def_insta: "0",
        username: "",
        fullname: "",
        is_private: false,
        media_post_total: 0,
        followers: 0,
        following: 0,
        biography: "",
        is_mutual: false,
      });
      setSelectedRelationIds([]);
      return;
    }

    // Edit Mode
    if (!userId) return;

    setSelectedUserId(userId);

    const result = await fetchSelectedUserById(userId);
    if (!result) return;

    const user = result.instagram_detail;

    setFormData({
      pk_def_insta: user.pk_def_insta,
      username: user.username,
      fullname: user.fullname ?? "",
      is_private: user.is_private,
      media_post_total: user.media_post_total ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      biography: user.biography ?? "",
      is_mutual: user.is_mutual,
    });

    // Set selected relations
    setSelectedRelationIds(relations.map((r) => r.id));
  };

  // Handle add / edit Instagram user
  const handleAddEditInstagramUser = async () => {
    if (formMode === "idle") return;

    try {
      if (formMode === "add") {
        // Add
        await addInstagramUser(formData, selectedRelationIds);

        setResultMessage("Instagram user added successfully.");
      } else if (formMode === "edit" && selectedUserId) {
        // Edit
        await updateInstagramUser(
          selectedUserId,
          formData,
          selectedRelationIds
        );

        setResultMessage("Instagram user updated successfully.");
      }

      // Refresh table
      const data = await getInstagramUsers({
        sortBy: sort.key ?? undefined,
        order: sort.order ?? undefined,
        search: searchQuery || undefined,
      });
      if (data) {
        setUsers(data.data);
      }

      // Success feedback
      setActionSuccess(true);

      // Reset form
      setFormMode("idle");
      setSelectedUserId(null);
      setFormData({
        pk_def_insta: "0",
        username: "",
        fullname: "",
        is_private: false,
        media_post_total: 0,
        followers: 0,
        following: 0,
        biography: "",
        is_mutual: false,
      });
      setSelectedRelationIds([]);

    } catch (error: unknown) {
      console.error("SAVE ERROR:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? "Unknown";
        const details =
          error.response?.data?.message ??
          error.response?.statusText ??
          "No additional details.";

        setResultMessage(
          `Failed to ${formMode === "add" ? "add" : "update"} Instagram user.\n${status}: ${details}`
        );
      } else if (error instanceof Error) {
        setResultMessage(error.message);
      } else {
        setResultMessage("Unexpected error occurred.");
      }

      setActionSuccess(false);
    } finally {
      setResultPopupOpen(true);
    }
  };

  // Handle delete Instagram user
  const handleDeleteInstagram = async () => {
    if (!selectedUserId) return;

    try {
      await deleteInstagramUser(selectedUserId);

      // Refresh user list after deletion
      const data = await getInstagramUsers({
        sortBy: sort.key ?? undefined,
        order: sort.order ?? undefined,
        search: searchQuery || undefined,
      });
      if (data) {
        setUsers(data.data);
      }

      // Success result
      setActionSuccess(true);
      setResultMessage("Instagram user deleted successfully.");

    } catch (error: unknown) {
      // Error result
      console.error("DELETE ERROR:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? "Unknown";
        const details =
          error.response?.data?.message ??
          error.response?.statusText ??
          "No additional details.";

        setResultMessage(
          `Failed to delete Instagram user.\n${status}: ${details}`
        );
      } else if (error instanceof Error) {
        setResultMessage(error.message);
      } else {
        setResultMessage("Unexpected error occurred.");
      }

      setActionSuccess(false);
    } finally {
      // Close delete popup & open result popup
      setShowDeletePopup(false);
      setResultPopupOpen(true);
    }
  };

  // Handle header and badges styles
  const thClass =
    "px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center whitespace-nowrap";
  const tdClass =
    "px-4 py-2 text-sm text-gray-700 text-center whitespace-nowrap";

  return (
    <div className="flex flex-col gap-5">
      {/* Header + Search & Add */}
      <div className="flex flex-row mx-auto justify-between w-full items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">Settings - Change Insta Info</h1>
          <p className="text-sm text-gray-800">Manage and update Instagram user information here.</p>
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
            <span className="text-sm font-medium text-gray-700">Add New User</span>
            <div onClick={() => handleAddEditClick("add")}
              className="px-2.5 py-[0.2325rem] bg-blue-500 text-white rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span>+</span>
              <span>Add User</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Data Show */}
      <div className="flex flex-row gap-5">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white w-[45%]">
          <div className="overflow-x-auto max-h-[81.5vh]">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className={thClass}>No.</th>
                  <SortableTh label="Username" column="username" sort={sort} onSort={handleSortClick} thClass={thClass} />
                  <th className={thClass}>Last Updated</th>
                  <th className={thClass}>Settings</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      Loading Instagram User data...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-base text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                    users.map((userData, index) => {
                      const user = userData.instagram_detail;
                      const relations = userData.relational_detail;

                    return (
                      <tr
                        key={user.id}
                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                          <td className={tdClass}>{index + 1}</td>
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
                          <td className={tdClass}>
                            {new Date(user.last_update).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                              .replace(/\b([a-z]{3})\b/, (m) => m[0].toUpperCase() + m.slice(1))}
                          </td>
                          <td className={tdClass}>
                              <div className="flex flex-row justify-center items-center gap-1.5">
                                  {/* Edit Button */}
                                  <button
                                    className="p-1 rounded border-2 border-gray-300 bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-700 font-semibold shadow-sm cursor-pointer"
                                    title="Edit"
                                    onClick={() => handleAddEditClick("edit", user.id, relations)}
                                  >
                                    <FiEdit2 size={18} />
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                      className="p-1 rounded border-2 border-gray-300 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 font-semibold shadow-sm cursor-pointer"
                                      title="Delete"
                                      onClick={() => {
                                        setSelectedUserId(user.id);
                                        setShowDeletePopup(true);
                                      }}
                                  >
                                      <FiTrash2 size={18} />
                                  </button>
                              </div>
                          </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Section */}
        <div className="flex-1 relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
          {formMode === "idle" && (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-xl font-medium text-gray-500 italic">Choose Between Add or Edit Instagram User Data</h2>
            </div>
          )}

          {formMode !== "idle" && (
            <div className="flex flex-col gap-4 p-4 max-h-[81.5vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                {formMode === "add" ? "Add New Instagram User" : "Edit Instagram User - " + formData.username}
              </h2>

              <div className="bg-[#EEEEEE] p-3 rounded-lg flex flex-col gap-3">
                {/* PKDefInsta, Username, Fullname, and Is Private & Mutual */}
                <div className="flex flex-row gap-3">
                  {/* PKDefInsta */}
                  <div className="flex flex-col gap-1 w-1/4">
                    <h4 className="text-base font-medium text-gray-700">
                      PK Def Insta:
                    </h4>
                    <input
                      required={formMode === "add"}
                      placeholder="PK Def Insta"
                      type="number"
                      value={formData.pk_def_insta.toString()}
                      onChange={(e) =>
                        setFormData({ ...formData, pk_def_insta: e.target.value })
                      }
                      disabled={formMode === "edit"}
                      className={`border rounded-lg px-2 py-1.5 text-sm shadow-sm
                        ${
                          formMode === "edit"
                            ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white border-gray-700/50"
                        }
                      `}
                    />
                  </div>
                  
                  {/* Username */}
                  <div className="flex flex-col gap-1 w-1/4">
                    <h4 className="text-base font-medium text-gray-700">
                      Username:
                      {formMode === "add" && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h4>

                    <input
                      required={formMode === "add"}
                      placeholder="Insta Username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      disabled={formMode === "edit"}
                      className={`border rounded-lg px-2 py-1.5 text-sm shadow-sm
                        ${
                          formMode === "edit"
                            ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white border-gray-700/50"
                        }
                      `}
                    />
                  </div>

                  {/* Fullname */}
                  <div className="flex flex-col gap-1 w-1/4">
                    <h4 className="text-base font-medium text-gray-700">Fullname:</h4>
                    <input
                      placeholder="Insta Fullname"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="border border-gray-700/50 rounded-lg px-2 py-1.5 text-sm bg-white shadow-sm"
                  />
                  </div>

                  {/* Boolean Checkbox */}
                  <div className="flex flex-col gap-1 justify-end bg-white px-2.5 py-2 rounded-lg shadow-sm w-2/5 border border-gray-700/50">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.is_private}
                        onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                      />
                      Is Private
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.is_mutual}
                        onChange={(e) => setFormData({ ...formData, is_mutual: e.target.checked })}
                      />
                      Is Mutual
                    </label>
                  </div>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1 w-full">
                    <h4 className="text-base font-medium text-gray-700">Followers:</h4>
                    <input type="number" placeholder="Followers"
                      min={0}
                      value={formData.followers}
                      onChange={(e) => setFormData({ ...formData, followers: +e.target.value })}
                      className="border border-gray-700/50 rounded-lg px-2 py-1.5 text-sm bg-white shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h4 className="text-base font-medium text-gray-700">Following:</h4>
                    <input type="number" placeholder="Following"
                      min={0}
                      value={formData.following}
                      onChange={(e) => setFormData({ ...formData, following: +e.target.value })}
                      className="border border-gray-700/50 rounded-lg px-2 py-1.5 text-sm bg-white shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h4 className="text-base font-medium text-gray-700">Media Posts:</h4>
                    <input type="number" placeholder="Media Total"
                      min={0}
                      value={formData.media_post_total}
                      onChange={(e) => setFormData({ ...formData, media_post_total: +e.target.value })}
                      className="border border-gray-700/50 rounded-lg px-2 py-1.5 text-sm bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Biography */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-medium text-gray-700">Biography:</h4>
                  <textarea
                    rows={3}
                    placeholder="Biography"
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    className="border border-gray-700/50 rounded-lg px-2 py-1.5 text-sm bg-white shadow-sm"
                  />
                </div>

                {/* Relational Checkboxes */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-medium text-gray-700">Relational List:</h4>
                  <div className="flex flex-wrap gap-2 bg-white px-2.5 py-2 rounded-lg shadow-sm border border-gray-700/50 h-34 overflow-y-auto">
                    {relationalList.map((rel) => (
                      <label
                        key={rel.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer text-xs font-medium h-fit"
                        style={{ backgroundColor: rel.bg_color, color: rel.text_color }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRelationIds.includes(rel.id)}
                          onChange={() =>
                            setSelectedRelationIds((prev) =>
                              prev.includes(rel.id)
                                ? prev.filter((id) => id !== rel.id)
                                : [...prev, rel.id]
                            )
                          }
                        />
                        {rel.relational}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setFormMode("idle")}
                    className="px-3 py-1 rounded-lg border cursor-pointer bg-white text-gray-700 font-semibold hover:bg-gray-100 transition shadow-sm"
                  >
                    Cancel
                  </button>

                  <button
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition shadow-sm"
                    onClick={() => {
                      handleAddEditInstagramUser();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation */}
      {showDeletePopup && selectedUserId && (
        <DeleteConfirmationPopup
          attribute="Instagram User"
          data={selectedUser?.username || ""}
          onDelete={() => handleDeleteInstagram()}
          onClose={() => setShowDeletePopup(false)}
        />
      )}
      
      {/* Action Result Popup */}
      {resultPopupOpen && actionSuccess !== null && (
        <ActionResultPopup
          isOpen={resultPopupOpen}
          success={actionSuccess}
          message={resultMessage}
          onClose={() => setResultPopupOpen(false)}
        />
      )}
    </div>
  );
}