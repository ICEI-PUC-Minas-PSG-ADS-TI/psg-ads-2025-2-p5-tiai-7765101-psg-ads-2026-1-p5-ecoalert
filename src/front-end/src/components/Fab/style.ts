import { styled } from "@mui/material/styles";
import { ButtonBase } from "@mui/material";

interface ContainerProps {
  size: number;
}

export const Container = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "size",
})<ContainerProps>(({ theme, size }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.shadows[3],
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",

  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
  },

  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
}));