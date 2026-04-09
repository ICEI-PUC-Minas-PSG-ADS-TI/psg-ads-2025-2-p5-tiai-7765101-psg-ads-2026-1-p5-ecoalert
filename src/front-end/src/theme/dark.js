import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      md2: 1024,
      lg: 1200,
      xl: 1536,
    },
  },

  palette: {
    mode: "dark",

    background: {
      default: "#0F1419",
      paper: "#181E25",
    },

    text: {
      primary: "#F2F2F2",
      secondary: "#9CA3AF",
    },

    primary: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#0891B2",
      light: "#22D3EE",
      dark: "#0E7490",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#22C55E",
      light: "#4ADE80",
      dark: "#16A34A",
      contrastText: "#FFFFFF",
    },

    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#EAB308",
      light: "#FACC15",
      dark: "#CA8A04",
      contrastText: "#0F1419",
    },

    divider: "#252D38",
  },

  typography: {
    fontFamily: "'Montserrat', system-ui, sans-serif",

    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },

    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },

    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },

    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
          border: "1px solid #252D38",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default darkTheme;