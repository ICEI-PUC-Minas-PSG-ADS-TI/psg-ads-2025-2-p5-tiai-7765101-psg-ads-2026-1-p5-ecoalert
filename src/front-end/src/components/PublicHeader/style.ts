import { alpha, styled } from "@mui/material";

export const Container = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 72,
  gap: "1rem",
  padding: "0 24px",
  position: "sticky",
  top: 0,
  zIndex: 20,
  backgroundColor: theme.palette.mode === "dark" ? alpha("#050607", 0.96) : alpha("#FFFFFF", 0.96),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backdropFilter: "blur(12px)",

  [theme.breakpoints.up("md")]: {
    padding: "0 48px",
  },
}));

export const BrandContainer = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  minWidth: 0,
  padding: 0,
  border: 0,
  background: "transparent",
  color: theme.palette.text.primary,
  cursor: "pointer",
  fontFamily: theme.typography.fontFamily,
}));

export const LogoMark = styled("span")(({ theme }) => ({
  width: 30,
  height: 30,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  color: theme.palette.secondary.light,
}));

export const NavLinks = styled("nav")(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "1.25rem",
  marginLeft: "auto",

  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

export const HeaderLink = styled("a")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  fontWeight: 600,
  textDecoration: "none",

  "&:hover": {
    color: theme.palette.text.primary,
  },
}));

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
