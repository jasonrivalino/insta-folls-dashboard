export interface DeletePopupProps {
  attribute: string;
  data: string;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export interface ActionResultPopupProps {
  isOpen: boolean;
  success: boolean;
  message: string;
  onClose: () => void;
}