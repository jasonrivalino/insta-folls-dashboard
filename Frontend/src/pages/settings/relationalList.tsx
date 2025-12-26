import { useEffect, useState } from "react";
import type { RelationalDetail } from "../../models/table.models";
import { createRelational, deleteRelational, getRelationalList, updateRelational } from "../../services/settings/relationalList.services";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DeleteConfirmationPopup from "../../components/deleteConfirmationPopup";
import ActionResultPopup from "../../components/actionResultPopup";
import axios from "axios";

type FormMode = "idle" | "add" | "edit";

export default function RelationalList() {
  const [relations, setRelations] = useState<RelationalDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Form mode state
  const [formMode, setFormMode] = useState<FormMode>("idle");

  // Add / Edit form state
  const [formData, setFormData] = useState({
    relational: "",
    bg_color: "#000000",
    text_color: "#FFFFFF",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [initialColors, setInitialColors] = useState<{bg_color: string; text_color: string} | null>(null);

  // Delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedRelationalId, setSelectedRelationalId] = useState<number | null>(null);
  const selectedRelational = relations.find(rel => rel.id === selectedRelationalId) || null;
  const [resultPopupOpen, setResultPopupOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<boolean | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const res = await getRelationalList();
        if (res.success) {
          setRelations(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch relational data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelations();
  }, []);

  // Handle add / edit click
  const handleAddEditClick = async (
    mode: FormMode,
    relationalId?: number
    ) => {
    setFormMode(mode);

    // Add mode
    if (mode === "add") {
        setEditingId(null);
        setFormData({
        relational: "",
        bg_color: "#000000",
        text_color: "#FFFFFF",
        });
        return;
    }

    // Edit mode
    if (!relationalId) return;

    const relation = relations.find((r) => r.id === relationalId);
    if (!relation) return;

    setEditingId(relationalId);
    setInitialColors({
        bg_color: relation.bg_color,
        text_color: relation.text_color,
    });
    setFormData({
        relational: relation.relational,
        bg_color: relation.bg_color,
        text_color: relation.text_color,
    });
  };

  // Handle submit (add / edit)
  const handleSubmitRelation = async () => {
    try {
        if (!formData.relational.trim()) {
        setActionSuccess(false);
        setResultMessage("Relational name is required.");
        setResultPopupOpen(true);
        return;
        }

        if (formMode === "add") {
        await createRelational(formData);
        setResultMessage("Relational created successfully.");
        }

        if (formMode === "edit" && editingId) {
        await updateRelational(editingId, formData);
        setResultMessage("Relational updated successfully.");
        }

        // Refresh table
        const res = await getRelationalList();
        if (res.success) setRelations(res.data);

        setActionSuccess(true);
        setFormMode("idle");
    } catch (error) {
        console.error(error);
        setActionSuccess(false);
        setResultMessage("Failed to save relational data.");
    } finally {
        setResultPopupOpen(true);
    }
  };

  // Handle delete Instagram user
  const handleDeleteRelational = async () => {
    if (!selectedRelationalId) return;

    try {
      await deleteRelational(selectedRelationalId);
      // Refresh user list after deletion
      const data = await getRelationalList();
      if (data.success) {
          setRelations(data.data);
      }

      // Success result
      setActionSuccess(true);
      setResultMessage("Relational deleted successfully.");
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

  const thClass =
    "px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center whitespace-nowrap";
  const tdClass =
    "px-4 py-2 text-sm text-gray-700 text-center whitespace-nowrap";

  return (
    <div className="flex flex-col gap-5">
      {/* Header + Add User */}
      <div className="flex flex-row mx-auto justify-between w-full items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">Settings - Relational Status List</h1>
          <p className="text-sm text-gray-800">Manage relational between your Instagram accounts and users.</p>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700 text-end">Add Relational</span>
            <div onClick={() => { handleAddEditClick("add"); setInitialColors(null); }}
              className="px-2.5 py-[0.2325rem] bg-blue-500 text-white rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span>+</span>
              <span>Relational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-row gap-5">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white w-[45%]">
            <div className="overflow-x-auto max-h-[81.5vh]">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                        <th className={thClass}>No.</th>
                        <th className={thClass}>Relational Name</th>
                        <th className={thClass}>Preview</th>
                        <th className={thClass}>Settings</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                        <td colSpan={4} className="p-6 text-center text-gray-500">
                            Loading relational data...
                        </td>
                        </tr>
                    ) : relations.length === 0 ? (
                        <tr>
                        <td colSpan={4} className="p-6 text-center text-gray-500">
                            No relational data available
                        </td>
                        </tr>
                    ) : (
                        relations.map((relation, index) => (
                        <tr
                            key={relation.id}
                            className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <td className={tdClass}>{index + 1}</td>
                            <td className={tdClass}>{relation.relational}</td>
                            <td className={tdClass}>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                backgroundColor: relation.bg_color,
                                color: relation.text_color,
                                }}
                            >
                                {relation.relational}
                            </span>
                            </td>
                            <td className={tdClass}>
                                <div className="flex flex-row justify-center items-center gap-1.5">
                                    {/* Edit Button */}
                                    <button
                                        className="p-1 rounded border-2 border-gray-300 bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-700 font-semibold shadow-sm cursor-pointer"
                                        title="Edit"
                                        onClick={() => handleAddEditClick("edit", relation.id)}
                                    >
                                        <FiEdit2 size={18} />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        className="p-1 rounded border-2 border-gray-300 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 font-semibold shadow-sm cursor-pointer"
                                        title="Delete"
                                        onClick={() => {
                                            setSelectedRelationalId(relation.id);
                                            setShowDeletePopup(true);
                                        }}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Add / Edit Section */}
        <div className="flex-1 relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
            {formMode === "idle" && (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-medium text-gray-500 italic">Choose Between Add or Edit Relational List</h2>
            </div>
            )}

            {formMode !== "idle" && (
            <div className="flex flex-col gap-3 p-6 max-h-[81.5vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                {formMode === "add"
                    ? "Add New Relational"
                    : `Edit Relational - ${formData.relational}`}
                </h2>

                <div className="flex flex-col gap-5">
                    {/* Relational Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Relational Name:
                            {formMode === "add" && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </label>
                        <input
                            type="text"
                            value={formData.relational}
                            onChange={(e) =>
                            setFormData({ ...formData, relational: e.target.value })
                            }
                            className="border border-gray-700/50 rounded-lg px-2 py-1.5 text-sm bg-white shadow-sm"
                            placeholder="Input relational name"
                        />
                    </div>

                    {/* Text Color */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Relational Badge Customize:
                        </label>
                        <div className="flex flex-row gap-3 bg-[#EEEEEE] px-2.5 py-2 rounded-lg shadow-sm border border-gray-700/50 items-center">
                            <div className="flex flex-row gap-3 items-center mb-1 w-1/4">
                                {/* BG Color */}
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-sm font-medium text-gray-700 text-center">
                                        BG Color
                                    </label>
                                    <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={formData.bg_color}
                                        onChange={(e) =>
                                        setFormData({ ...formData, bg_color: e.target.value })
                                        }
                                        className="w-full h-7 cursor-pointer"
                                    />
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.bg_color}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (!value.startsWith("#")) value = "#" + value;
                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                            setFormData({ ...formData, bg_color: value });
                                            }
                                        }}
                                        maxLength={7}
                                        placeholder="#FFFFFF"
                                        className="text-xs font-mono bg-white rounded-lg text-center text-gray-600 px-1 py-0.5 border shadow-sm w-full mt-1"
                                    />
                                </div>
                                    
                                {/* Text Color */}
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-sm font-medium text-gray-700 text-center">
                                        Text Color
                                    </label>
                                    <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={formData.text_color}
                                        onChange={(e) =>
                                        setFormData({ ...formData, text_color: e.target.value })
                                        }
                                        className="w-full h-7 cursor-pointer"
                                    />
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.text_color}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (!value.startsWith("#")) value = "#" + value;
                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                            setFormData({ ...formData, text_color: value });
                                            }
                                        }}
                                        maxLength={7}
                                        placeholder="#FFFFFF"
                                        className="text-xs font-mono bg-white rounded-lg text-center text-gray-600 px-1 py-0.5 border shadow-sm w-full mt-1"
                                    />
                                </div>
                            </div>

                            <div className="ml-auto flex flex-col items-center gap-2">
                                {/* Reset color button */}
                                <button onClick={() => {
                                        // Add mode
                                        if (formMode === "add") {
                                            setFormData({
                                                ...formData,
                                                bg_color: "#000000",
                                                text_color: "#FFFFFF",
                                            });
                                            return;
                                        }

                                        // Edit mode
                                        if (formMode === "edit" && initialColors) {
                                            setFormData({
                                                ...formData,
                                                bg_color: initialColors.bg_color,
                                                text_color: initialColors.text_color,
                                            });
                                        }
                                    }}
                                    className="rounded-lg border text-gray-600 bg-white hover:bg-gray-50 text-sm shadow-sm w-full py-1"
                                    >
                                    Reset Colors
                                </button>
                            
                                {/* Preview */}
                                <div className="border border-gray-400 bg-white px-4 py-2 flex items-center rounded-lg shadow-sm">
                                    <span
                                        className="px-3 py-1 rounded-full text-sm font-semibold"
                                        style={{
                                        backgroundColor: formData.bg_color,
                                        color: formData.text_color,
                                        }}
                                    >
                                        {formData.relational || "Preview"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={() => { setFormMode("idle"); setInitialColors(null); }}
                        className="px-3 py-1 rounded-lg border cursor-pointer bg-white text-gray-700 font-semibold hover:bg-gray-100 transition shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitRelation}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition shadow-sm"
                    >
                        {formMode === "add" ? "Create" : "Update"}
                    </button>
                </div>
            </div>
            )}
        </div>
      </div>
      
      {/* Delete Confirmation */}
      {showDeletePopup && selectedRelationalId && (
        <DeleteConfirmationPopup
          attribute="Relational"
          data={selectedRelational?.relational || ""}
          onDelete={() => handleDeleteRelational()}
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