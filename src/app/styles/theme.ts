import { createTheme } from '@mui/material/styles'

// Single-mode Almanac operational theme — zero runtime dark/light branching,
// zero liquid glass, zero gradients, zero heavy drop shadows.
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9e1c4d', // Almanac chart magenta (oklch 45% 0.18 350)
      dark: '#7c143c',
      light: '#f7e4ec',
      contrastText: '#f7f8fa',
    },
    secondary: {
      main: '#18202c', // Almanac blue-black ink (oklch 16% 0.02 245)
      dark: '#0f151e',
      light: '#dce2e8',
      contrastText: '#f7f8fa',
    },
    success: {
      main: '#1e6b3b',
      light: '#e2f2e7',
    },
    warning: {
      main: '#9a5b0c',
      light: '#fdf0d9',
    },
    error: {
      main: '#b42318',
      light: '#fce4e2',
    },
    info: {
      main: '#1d568c',
      light: '#e2eef8',
    },
    background: {
      default: '#cdd4dc', // Almanac slate stock (--color-paper)
      paper: '#eef1f4', // Almanac printed sheet (--color-sheet)
    },
    text: {
      primary: '#18202c', // --color-ink
      secondary: '#475261', // --color-muted
    },
    divider: '#adb6c2', // --color-rule
  },
  shape: {
    borderRadius: 2,
  },
  typography: {
    fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontSize: 13,
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.35,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: '1.375rem',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '0.975rem',
    },
    button: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Lighter rendering & crisp operational feel
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 2,
          minHeight: 30,
          paddingLeft: 12,
          paddingRight: 12,
          fontSize: '0.76rem',
          boxShadow: 'none',
          transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease',
          '&:focus-visible': {
            outline: '2px solid #9e1c4d',
            outlineOffset: 2,
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#475261',
          color: '#18202c',
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: '#18202c',
            backgroundColor: '#dce2e8',
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
          borderRadius: 0,
          border: '1px solid #adb6c2',
          borderTop: '2px solid #3c4654',
          backgroundColor: '#eef1f4',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
          border: '1px solid #3c4654',
          backgroundColor: '#f5f7f9',
          boxShadow: '0 8px 24px rgba(24, 32, 44, 0.14)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
          border: '1px solid #adb6c2',
          backgroundColor: '#ffffff',
          boxShadow: '0 6px 18px rgba(24, 32, 44, 0.12)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 2,
          minHeight: 30,
          '& fieldset': {
            borderColor: '#8d99a8',
          },
          '&:hover fieldset': {
            borderColor: '#18202c',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#9e1c4d',
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
          borderRadius: 2,
          fontSize: '0.68rem',
          fontWeight: 600,
          height: 20,
        },
        sizeSmall: {
          height: 18,
          '& .MuiChip-label': {
            paddingLeft: 6,
            paddingRight: 6,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 40,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #c5cdd6',
          fontSize: '0.8125rem',
          paddingBottom: 9,
          paddingTop: 9,
        },
        head: {
          backgroundColor: '#dfe5ec',
          borderBottom: '2px solid #3c4654',
          color: '#18202c',
          fontSize: '0.78rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: 0,
        },
      },
    },
  },
})

export const getAppTheme = () => appTheme
