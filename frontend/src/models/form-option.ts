import { IconType } from "react-icons";

export interface FormOption {
  label: string;
  value: string | boolean;
  buttonStyling?: string;
  Icon?: IconType;
}
