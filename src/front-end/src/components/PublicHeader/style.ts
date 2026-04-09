import { styled } from "@mui/material";

export const Container = styled("header")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
})

export const ButtonsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "0.5rem",
})

export const AvatarContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
}));