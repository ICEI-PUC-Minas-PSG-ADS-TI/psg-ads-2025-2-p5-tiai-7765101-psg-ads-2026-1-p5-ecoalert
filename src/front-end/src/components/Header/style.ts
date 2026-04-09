import { styled } from "@mui/material";

export const Container = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.5rem",

  [theme.breakpoints.up("md")]: {
    justifyContent: "flex-end",
  },
}));

export const ButtonsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "2rem",
})

export const AvatarContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",

  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

export const TitleContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "block",
  },
}));