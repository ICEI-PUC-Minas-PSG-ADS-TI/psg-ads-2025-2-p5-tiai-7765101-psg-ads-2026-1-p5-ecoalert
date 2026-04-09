'use client';

import Typography, { TypographyProps } from "@mui/material/Typography";

type FontWeight =
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | "light"
  | "regular"
  | "medium"
  | "bold";

interface TextProps extends Omit<TypographyProps, "color"> {
  weight?: FontWeight;
  color?: TypographyProps["color"] | string;
  truncate?: boolean;
  lines?: number;
}

export function Text({
  weight,
  color = "text.primary",
  truncate = false,
  lines,
  sx,
  children,
  ...rest
}: TextProps) {
  return (
    <Typography
      color={color}
      sx={{
        fontWeight: weight,
        ...(truncate && {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }),
        ...(lines && {
          display: "-webkit-box",
          WebkitLineClamp: lines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
}