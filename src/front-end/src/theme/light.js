import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
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
    mode: "light",

    background: {
      default: "#FFFFFF", 
      paper: "#F5F5F5",  
    },

    text: {
      primary: "#000000",  
      secondary: "#525252", 
    },

    primary: {
      main: "#000000",     
      contrastText: "#FFFFFF",
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

export default lightTheme;