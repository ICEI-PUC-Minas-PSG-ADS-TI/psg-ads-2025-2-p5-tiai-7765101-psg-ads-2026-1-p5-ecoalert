import { Alert, Box, styled } from "@mui/material";

export const StyledAlert = styled(Alert)({
  minWidth: "300px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 4,
});

export const Content = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
});