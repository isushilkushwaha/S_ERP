export interface ImageUploadProps {
  value?: string;
  onChange: (value?: string) => void;

  uploadUrl: string;

  label?: string;
  description?: string;

  accept?: string;

  disabled?: boolean;
}