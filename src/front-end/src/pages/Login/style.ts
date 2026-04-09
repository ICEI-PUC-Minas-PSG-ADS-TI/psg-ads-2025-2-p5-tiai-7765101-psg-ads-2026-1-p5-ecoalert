import { Box, styled } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
    minHeight: "70vh",
    padding: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })
);