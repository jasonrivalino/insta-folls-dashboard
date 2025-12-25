import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import type { ActionResultPopupProps } from "../models/popup.models";

export default function ActionResultPopup({ isOpen, success, message, onClose }: ActionResultPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl flex flex-col gap-4 animate-scale-in">

        {/* ICON + TEXT ROW */}
        <div className="flex flex-row items-center gap-3.5">
          <div
            className={`flex items-center justify-center rounded-full shrink-0
              w-14 h-14 min-w-14 min-h-14
              ${success ? "bg-green-100" : "bg-red-100"}`}
          >
            {success ? (
              <FiCheckCircle className="h-7 w-7 text-green-600" />
            ) : (
              <FiXCircle className="h-7 w-7 text-red-500" />
            )}
          </div>

          <div className="flex flex-col">
            <h2
              className={`text-lg font-semibold ${
                success ? "text-green-600" : "text-red-500"
              }`}
            >
              {success ? "Success!" : "Failed!"}
            </h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">{message}</p>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white text-sm transition cursor-pointer font-medium"
        >
          Back
        </button>
      </div>
    </div>
  );
};