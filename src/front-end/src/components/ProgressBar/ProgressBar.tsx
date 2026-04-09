import { LinearProgress, LinearProgressProps } from "@mui/material";

interface ProgressBarProps extends LinearProgressProps {
  progress: number;
}

export function ProgressBar({ progress, variant = "determinate", color = "inherit" }: ProgressBarProps) {
  return (
   <LinearProgress value={progress} variant={variant} color={color} style={{marginTop: 24, marginBottom: 24}}/>
  );
}