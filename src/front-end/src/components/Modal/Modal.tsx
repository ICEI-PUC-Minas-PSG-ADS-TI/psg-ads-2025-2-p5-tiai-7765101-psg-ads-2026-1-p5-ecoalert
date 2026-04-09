import { ReactNode } from "react";
import {
  Modal as MuiModal,
  Box,
  useTheme,
} from "@mui/material";
import { Icon } from "@/components/Icon/Icon";
import { Text } from "@/components/Text/Text";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number | string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = 500,
}: ModalProps) {
  const theme = useTheme();

  return (
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          outline: "none",
          maxWidth: "80%",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        
        <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: title ? "space-between" : "flex-end",
            mb: 2,
        }}
        >
        {title && (
            <Text variant="h6" weight="medium">
            {title}
            </Text>
        )}

        <Icon
            name='x'
            size={22}
            color={theme.palette.text.secondary}
            onClick={onClose}
            style={{ cursor: "pointer" }}
        />
        </Box>

        {children}
      </Box>
    </MuiModal>
  );
}