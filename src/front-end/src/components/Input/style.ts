import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  width: "100%",

  "& .MuiInputLabel-root": {
    color: theme.palette.text.primary,
    marginBottom: 6,
    position: "relative",
    transform: "none",
    fontSize: 14,
    fontWeight: 500,
  },

  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,

    "& fieldset": {
      borderColor: theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.12)"
        : "rgba(0,0,0,0.12)",
    },

    "&:hover fieldset": {
      borderColor: theme.palette.text.primary,
    },

    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 1,
    },

    "&.Mui-error fieldset": {
      borderColor: theme.palette.error.main,
    },
    
  },

  "& .MuiInputBase-input": {
    padding: "14px 16px",
    paddingRight: 8,
    fontSize: 14,
    color: theme.palette.text.primary,

    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },

  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    marginTop: 6,
    fontSize: 12,
    color: theme.palette.error.main,
  },
}));