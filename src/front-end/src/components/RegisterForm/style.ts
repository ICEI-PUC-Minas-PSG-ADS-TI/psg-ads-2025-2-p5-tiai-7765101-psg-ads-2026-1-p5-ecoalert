import { Box, styled } from "@mui/material";


export const ButtonContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 24,
  })
);

export const ButtonWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: 16,
  })
);