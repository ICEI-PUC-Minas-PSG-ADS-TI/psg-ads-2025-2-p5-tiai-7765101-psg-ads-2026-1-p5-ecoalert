import { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import { Icon } from "@/components/Icon/Icon";
import { IconName } from "lucide-react/dynamic";

import { StyledButton } from "./style";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { Text } from "@/components/Text/Text";

type Variant = "outline" | "filled" | "text";
type Color = "primary" | "error" | "success" | "info";
type Shape = "rounded" | "square";
type Size = "large" | "medium" | "small";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: Variant;
  color?: Color;
  shape?: Shape;
  size?: Size;
  fullWidth?: boolean;
  icon?: IconName;
  loading?: boolean;
  alignLeft?: boolean;
}

const sizeMap: Record<Size, CSSProperties> = {
  small: {
    padding: "6px 12px",
    fontSize: "14px",
  },
  medium: {
    padding: "10px 16px",
    fontSize: "16px",
  },
  large: {
    padding: "14px 22px",
    fontSize: "18px",
  },
};

export function Button({
  variant = "filled",
  color = "primary",
  shape = "rounded",
  size = "medium",
  fullWidth = false,
  style,
  children,
  icon,
  loading = false,
  type = "button",
  alignLeft = false,
  ...rest
}: ButtonProps) {
  const theme: Theme = useTheme();

  const paletteColor = theme.palette[color];

  const baseStyle: CSSProperties = {
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
    borderRadius: shape === "rounded" ? "999px" : "6px",
    width: fullWidth ? "100%" : "auto",
    border: "none",
    fontFamily: theme.typography.fontFamily,
    ...sizeMap[size],
  };

  const variantStyle: CSSProperties = {
    filled: {
      backgroundColor: paletteColor.main,
      color: paletteColor.contrastText,
      border: `1px solid ${paletteColor.main}`,
    },
    outline: {
      backgroundColor: "transparent",
      color: paletteColor.main,
      border: `1px solid ${paletteColor.main}`,
    },
    text: {
      backgroundColor: "transparent",
      color: paletteColor.main,
      border: "1px solid transparent",
    },
  }[variant];

  return (
    <StyledButton
      style={{
        ...baseStyle,
        ...variantStyle,
        ...style,
      }}
      disabled={loading}
      type={type}
      alignLeft={alignLeft}
      {...rest}
    >
      {!loading ? (
        <Content icon={icon}>{children}</Content>
      ) : (
        <LoadingSpinner color={"inherit"} size={20} />
      )}
    </StyledButton>
  );
}

function Content({ children, icon }: { children: ReactNode; icon?: IconName }) {
  return (
    <>
      <Text variant="body2" weight="medium" color="inherit">{children}</Text>
      {icon && (
        <Icon name={icon} size={18} style={{ marginLeft: children ? 10 : 0 }} />
      )}
    </>
  );
}
