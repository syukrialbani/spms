import { createTheme, type PaletteMode } from '@mui/material/styles'

export const getAppTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#52c5f2' : '#1d70b7',
        dark: isDark ? '#1d70b7' : '#143a78',
        light: isDark ? '#163e63' : '#dff5ff',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#f28c28',
        dark: '#b85d10',
        light: isDark ? '#4a2b13' : '#fff0dc',
        contrastText: '#ffffff',
      },
      success: {
        main: isDark ? '#4ade80' : '#15803d',
        light: isDark ? '#113f2a' : '#dcfce7',
      },
      warning: {
        main: isDark ? '#fbbf24' : '#b7791f',
        light: isDark ? '#4a3510' : '#fff7d6',
      },
      error: {
        main: isDark ? '#fb7185' : '#b91c1c',
        light: isDark ? '#4c1720' : '#fee2e2',
      },
      background: {
        default: isDark ? '#071323' : '#edf7ff',
        paper: isDark
          ? 'rgba(9, 27, 52, 0.66)'
          : 'rgba(255, 255, 255, 0.64)',
      },
      text: {
        primary: isDark ? '#edf7ff' : '#091b34',
        secondary: isDark ? '#a9bed6' : '#60708a',
      },
      divider: isDark
        ? 'rgba(128, 205, 255, 0.16)'
        : 'rgba(255, 255, 255, 0.46)',
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: 'Roboto, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      h5: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      h6: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      button: {
        fontWeight: 700,
        letterSpacing: 0,
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            background:
              'linear-gradient(135deg, #52c5f2 0%, #1d70b7 54%, #143a78 100%)',
            borderRadius: 8,
            boxShadow: isDark
              ? '0 10px 22px rgba(82, 197, 242, 0.18)'
              : '0 10px 22px rgba(29, 112, 183, 0.22)',
            minHeight: 40,
            '&:hover': {
              boxShadow: isDark
                ? '0 12px 26px rgba(82, 197, 242, 0.24)'
                : '0 12px 26px rgba(29, 112, 183, 0.28)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: isDark
              ? '1px solid rgba(128, 205, 255, 0.18)'
              : '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: isDark
              ? '0 18px 46px rgba(0, 8, 20, 0.32)'
              : '0 18px 46px rgba(15, 52, 96, 0.14)',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? 'rgba(7, 19, 35, 0.72)'
              : 'rgba(255, 255, 255, 0.82)',
            borderRadius: 8,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark
              ? '1px solid rgba(128, 205, 255, 0.12)'
              : '1px solid rgba(18, 73, 126, 0.1)',
          },
          head: {
            color: isDark ? '#a9dfff' : '#2e5d98',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
          },
        },
      },
    },
  })
}
