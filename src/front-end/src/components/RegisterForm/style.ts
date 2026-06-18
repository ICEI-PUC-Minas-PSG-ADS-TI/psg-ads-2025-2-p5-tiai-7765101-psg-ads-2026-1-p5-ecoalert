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

export const FieldRow = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "minmax(76px, 96px) 1fr",
    gap: 16,
    alignItems: "start",

    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
      gap: 0,
    },
  })
);
