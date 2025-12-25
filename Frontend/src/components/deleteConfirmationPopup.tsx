import { FiX } from "react-icons/fi";
import type { DeletePopupProps } from "../models/table.models";

export default function DeleteConfirmationPopup({ attribute, data, onDelete, onClose }: DeletePopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative">

        {/* Close (X) */}
        <button onClick={onClose} className="absolute top-3 right-3 text-red-400 hover:text-red-600 cursor-pointer">
          <FiX size={20} />
        </button>

        {/* Content */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Confirm Deletion
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to remove{" "}
          <span className="font-semibold">{data}</span> from{" "}
          <span className="font-semibold">{attribute}</span> list?
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 text-sm font-semibold">
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            No
          </button>

          <button
            onClick={onDelete}
            className="px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};