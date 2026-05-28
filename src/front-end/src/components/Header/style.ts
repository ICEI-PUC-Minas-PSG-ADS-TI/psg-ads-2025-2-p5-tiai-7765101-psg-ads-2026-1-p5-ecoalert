import { Avatar, IconButton, styled, Typography } from "@mui/material";

export const Container = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 64,
  padding: "0 24px",
  backgroundColor: theme.palette.mode === "dark" ? "#050607" : theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
}));

export const ButtonsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "0.5rem",
})

export const BrandContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  color: theme.palette.text.primary,
  minWidth: 0,
}));

export const BrandName = styled(Typography)(({ theme }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1,
  whiteSpace: "nowrap",
}));

export const LogoMark = styled("div")(({ theme }) => ({
  width: 28,
  height: 28,
  display: "grid",
  placeItems: "center",
  color: theme.palette.secondary.light,
  flexShrink: 0,
}));

export const HeaderIconButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  padding: 0,
  color: theme.palette.text.secondary,

  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const MenuButton = styled(HeaderIconButton)(({ theme }) => ({
  marginLeft: -8,

  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  fontSize: "0.75rem",
  fontWeight: 700,
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.secondary.dark,
}));
