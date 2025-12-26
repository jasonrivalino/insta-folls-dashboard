import type { ReactNode } from "react";

export interface DeletePopupProps {
  attribute: string;
  data: string;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export interface ActionResultPopupProps {
  isOpen: boolean;
  success: boolean;
  message?: string | ReactNode;
  onClose: () => void;
}