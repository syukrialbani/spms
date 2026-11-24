import { createTheme } from '@mui/material/styles'

// Modern Aviat Brand Theme — derived from Aviat Networks logo (Emerald #1F8A3B, Lime #8DC63F, Charcoal #0F1915).
// Single-mode light operational UI, zero liquid glass, zero dark/light branching, minimal fast rendering.
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1b7d34', // Aviat Emerald (WCAG AA > 5.1:1 on white)
      dark: '#146328',
      light: '#eaf6ee',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f1915', // Aviat Deep Charcoal
      dark: '#080e0c',
      light: '#edf2ef',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16803c',
      light: '#eaf6ee',
    },
    warning: {
      main: '#b45309',
      light: '#fef3c7',
    },
    error: {
      main: '#dc2626',
      light: '#fee2e2',
    },
    info: {
      main: '#0284c7',
      light: '#e0f2fe',
    },
    background: {
      default: '#f5f7f6', // Clean modern alabaster-sage
      paper: '#ffffff', // Crisp white card surface
    },
    text: {
      primary: '#0f1915',
      secondary: '#5a6c64',
    },
    divider: '#e2e8e5',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontSize: 13,
    body1: {
      fontSize: '0.84rem',
      lineHeight: 1.45,
    },
    body2: {
      fontSize: '0.78rem',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.72rem',
      lineHeight: 1.35,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '1.35rem',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
      fontSize: '0.95rem',
    },
    button: {
      fontSize: '0.76rem',
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 7,
          minHeight: 30,
          paddingLeft: 12,
          paddingRight: 12,
          fontSize: '0.76rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition:
            'background-color 120ms ease, border-color 120ms ease, color 120ms ease',
          '&:focus-visible': {
            outline: '2px solid #1f8a3b',
            outlineOffset: 2,
          },
        },
        contained: {
          boxShadow: '0 1px 2px rgba(15, 25, 21, 0.08)',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(31, 138, 59, 0.18)',
          },
        },
        outlined: {
          borderColor: '#d0dbd5',
          color: '#0f1915',
          backgroundColor: '#ffffff',
          '&:hover': {
            borderColor: '#1f8a3b',
            backgroundColor: '#f5f9f6',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid #e2e8e5',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 2px rgba(15, 25, 21, 0.04)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: '1px solid #e2e8e5',
          backgroundColor: '#ffffff',
          boxShadow: '0 16px 40px rgba(15, 25, 21, 0.14)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          border: '1px solid #e2e8e5',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 28px rgba(15, 25, 21, 0.1)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 7,
          minHeight: 30,
          '& fieldset': {
            borderColor: '#d0dbd5',
          },
          '&:hover fieldset': {
            borderColor: '#9db2a7',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#1f8a3b',
            borderWidth: 1.5,
          },
        },
        input: {
          fontSize: '0.75rem',
          fontWeight: 500,
          paddingBottom: 4.5,
          paddingTop: 4.5,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.68rem',
          fontWeight: 600,
          height: 20,
        },
        sizeSmall: {
          height: 19,
          '& .MuiChip-label': {
            paddingLeft: 7,
            paddingRight: 7,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 36,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #edf2ef',
          fontSize: '0.72rem',
          paddingBottom: 5,
          paddingTop: 5,
        },
        head: {
          backgroundColor: '#f8faf9',
          borderBottom: '1px solid #dce5e0',
          color: '#3f524a',
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: 0,
        },
      },
    },
  },
})

export const getAppTheme = () => appTheme
