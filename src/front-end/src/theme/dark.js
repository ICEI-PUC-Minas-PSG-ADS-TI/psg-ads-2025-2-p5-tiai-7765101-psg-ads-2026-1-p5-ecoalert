import { createTheme } from "@mui/material/styles";

// old success: 22C55E

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
      default: "#0A0A0A",  
      paper: "#1A1A1A",     
    },

    text: {
      primary: "#FFFFFF", 
      secondary: "#A3A3A3",
    },

    primary: {
      main: "#FFFFFF",  
      contrastText: "#0A0A0A",
    },

    success: {
      main: "#16A34A",   
      contrastText: "#FFFFFF"
    },

    error: {
      main: "#EF4444", 
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#3B82F6",   
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#F57C01",   
      contrastText: "#FFFFFF",
    }
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
});

export default darkTheme;