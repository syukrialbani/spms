import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useLocation } from 'react-router-dom'
import { LogoutButton, useAuth } from '@features/auth'
import { useColorMode } from '@shared/lib/color-mode'

type MainAppBarProps = {
  drawerWidth: number
  onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/spms': 'SPMS List',
}

const getInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}` || 'SP'

export function MainAppBar({ drawerWidth, onMenuClick }: MainAppBarProps) {
  const location = useLocation()
  const { session } = useAuth()
  const { mode, toggleMode } = useColorMode()
  const title = location.pathname.startsWith('/spms/')
    ? 'SPMS Detail'
    : pageTitles[location.pathname] ?? 'SPMS'
  const displayName = session
    ? `${session.firstName} ${session.lastName}`
    : 'SPMS User'

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(7, 19, 35, 0.58)'
            : 'rgba(255,255,255,0.46)',
        backdropFilter: 'blur(26px) saturate(1.55)',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(128, 205, 255, 0.18)'
            : 'rgba(255,255,255,0.54)',
        borderRadius: 1,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 18px 48px rgba(0, 8, 20, 0.32)'
            : '0 18px 48px rgba(12, 67, 122, 0.12)',
        left: { xs: 12, md: 'auto' },
        ml: { md: `${drawerWidth}px` },
        right: { xs: 12, md: 24 },
        top: { xs: 8, md: 16 },
        width: { xs: 'auto', md: `calc(100% - ${drawerWidth + 48}px)` },
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 60, md: 64 } }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Open navigation"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <Typography color="text.secondary" variant="caption" noWrap>
            Centralized performance management
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <TextField
          placeholder="Search"
          size="small"
          sx={{
            display: { xs: 'none', lg: 'block' },
            maxWidth: 340,
            width: '24vw',
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Tooltip title="Notifications">
          <IconButton color="inherit" aria-label="Notifications">
            <NotificationsNoneRoundedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton
            color="inherit"
            aria-label="Toggle color mode"
            onClick={toggleMode}
          >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
          </IconButton>
        </Tooltip>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', minWidth: 0 }}
        >
          <Avatar src={session?.image} alt={displayName} sx={{ height: 36, width: 36 }}>
            {getInitials(session?.firstName, session?.lastName)}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
              {displayName}
            </Typography>
            <Typography color="text.secondary" variant="caption" noWrap>
              Operator
            </Typography>
          </Box>
        </Stack>
        <LogoutButton />
      </Toolbar>
    </AppBar>
  )
}
