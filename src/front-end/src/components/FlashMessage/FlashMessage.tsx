import { Icon } from "@/components/Icon/Icon";
import { Text } from "@/components/Text/Text";
import {
  AlertProps,
  Snackbar,
  SnackbarProps
} from "@mui/material";
import { Content, StyledAlert } from "./style";
import { IconName } from "lucide-react/dynamic";

interface FlashMessageProps
  extends Omit<SnackbarProps, "children"> {
  alertProps?: AlertProps;
  message: string;
}

const severityIcons: Record<
  NonNullable<AlertProps["severity"]>,
  IconName
> = {
  success: "check",
  error: "x-circle",
  warning: "alert-triangle",
  info: "info"
};

const textColors: Record<NonNullable<AlertProps["severity"]>, string> = {
  success: "success.contrastText",
  error: "error.contrastText",
  warning: "warning.contrastText",
  info: "info.contrastText"
}

const backgroundColors: Record<NonNullable<AlertProps["severity"]>, string> = {
  success: "success.main",
  error: "error.main",
  warning: "warning.main",
  info: "info.main"
}

export function FlashMessage({
  message,
  open,
  onClose,
  alertProps,
  autoHideDuration,
  ...snackbarProps
}: FlashMessageProps) {
  const severity: NonNullable<AlertProps["severity"]> =
  alertProps?.severity ?? "info";

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration || 3000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      {...snackbarProps}
    >
      <StyledAlert
        severity={alertProps?.severity}
        icon={false}
          sx={{
            backgroundColor: backgroundColors[severity],
            color: textColors[severity]
          }}
          {...alertProps}
        >
        <Content>
          <Icon name={severityIcons[alertProps?.severity || "info"]} />
          <Text variant="body1" color={textColors[alertProps?.severity || "info"]} weight={500}>
            {message}
          </Text>
        </Content>
      </StyledAlert>
    </Snackbar>
  );
}