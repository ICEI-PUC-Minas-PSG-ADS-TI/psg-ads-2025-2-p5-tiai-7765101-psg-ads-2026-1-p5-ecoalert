import { CircularProgress } from "@mui/material";

interface LoadingSpinnerProps {
  size?: number | string;
  color?: "primary" | "secondary" | "inherit";
}

export function LoadingSpinner({
  size = 24,
  color = "primary",
}: LoadingSpinnerProps) {
  return <CircularProgress size={size} color={color} />;
}
