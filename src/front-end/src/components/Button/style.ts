import { styled } from "@mui/material";

interface StyledButtonProps {
  alignLeft?: boolean;
}

export const StyledButton = styled("button")<StyledButtonProps>(({ theme, alignLeft }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: !alignLeft ? "center" : "flex-start"
}));