import { LogoutButton, useAuth } from '@features/auth'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useColorMode } from '@shared/lib/color-mode'
import { devRoleLabels, devRoleOptions, useDevRole } from '@shared/lib/dev-role'
import { useState, type MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'

type MainAppBarProps = {
  drawerWidth: number
  onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/spms': 'SPMS List',
  '/spms/add': 'Add SPMS',
}

const getInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}` || 'SP'

const getPageTitle = (pathname: string) => {
  if (pathname.endsWith('/edit')) {
    return 'Edit SPMS'
  }

  if (pathname.startsWith('/spms/') && pathname !== '/spms/add') {
    return 'SPMS Detail'
  }

  return pageTitles[pathname] ?? 'SPMS'
}

export function MainAppBar({ drawerWidth, onMenuClick }: MainAppBarProps) {
  const location = useLocation()
  const { session } = useAuth()
  const { mode, toggleMode } = useColorMode()
  const { clearRole, role: devRole, setRole } = useDevRole()
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const title = getPageTitle(location.pathname)
  const displayName = session
    ? `${session.firstName} ${session.lastName}`
    : 'SPMS User'
  const activeRoleLabel = devRole ? devRoleLabels[devRole] : 'Backend role'
  const profileMenuOpen = Boolean(profileAnchor)

  const openProfileMenu = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget)
  }

  const closeProfileMenu = () => {
    setProfileAnchor(null)
  }

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(7, 19, 35, 0.9)'
            : 'rgba(255,255,255,0.88)',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(128, 205, 255, 0.18)'
            : 'rgba(255,255,255,0.54)',
        borderRadius: 1,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 12px 30px rgba(0, 8, 20, 0.24)'
            : '0 10px 26px rgba(12, 67, 122, 0.1)',
        left: { xs: 12, md: 'auto' },
        ml: { md: `${drawerWidth}px` },
        right: { xs: 12, md: 24 },
        top: { xs: 8, md: 16 },
        width: { xs: 'auto', md: `calc(100% - ${drawerWidth + 48}px)` },
      }}
    >
      <Toolbar
        sx={{
          gap: { xs: 0.75, sm: 1.25, md: 2 },
          minHeight: { xs: 60, md: 64 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Open navigation"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, flexShrink: 0 }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontSize: { xs: 17, sm: 19, md: 20 },
              lineHeight: 1.2,
              maxWidth: { xs: '44vw', sm: 'none' },
            }}
          >
            {title}
          </Typography>
          <Typography
            color="text.secondary"
            variant="caption"
            noWrap
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Centralized performance management
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Notifications">
          <IconButton
            color="inherit"
            aria-label="Notifications"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            <NotificationsNoneRoundedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <IconButton
            color="inherit"
            aria-label="Toggle color mode"
            onClick={toggleMode}
            sx={{ flexShrink: 0 }}
          >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
          </IconButton>
        </Tooltip>
        <ButtonBase
          aria-controls={profileMenuOpen ? 'profile-role-menu' : undefined}
          aria-expanded={profileMenuOpen ? 'true' : undefined}
          aria-haspopup="menu"
          onClick={openProfileMenu}
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            display: 'flex',
            gap: 1,
            maxWidth: { xs: 46, sm: 220 },
            minWidth: 0,
            p: { xs: 0.25, sm: 0.75 },
            textAlign: 'left',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(128, 205, 255, 0.08)'
                  : 'rgba(29, 112, 183, 0.07)',
            },
          }}
        >
          <Avatar src={session?.image} alt={displayName} sx={{ height: 36, width: 36 }}>
            {getInitials(session?.firstName, session?.lastName)}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
              {displayName}
            </Typography>
            <Typography color="text.secondary" variant="caption" noWrap>
              {activeRoleLabel}
            </Typography>
          </Box>
          <ExpandMoreRoundedIcon
            fontSize="small"
            sx={{ display: { xs: 'none', sm: 'block' }, flexShrink: 0 }}
          />
        </ButtonBase>
        <Menu
          id="profile-role-menu"
          anchorEl={profileAnchor}
          open={profileMenuOpen}
          onClose={closeProfileMenu}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          slotProps={{
            paper: {
              sx: {
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(128, 205, 255, 0.18)'
                    : 'rgba(18, 73, 126, 0.12)',
                borderRadius: 1,
                minWidth: 260,
                mt: 1,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography sx={{ fontWeight: 900 }} variant="body2">
              Role Testing
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Sementara sampai role dari backend tersedia.
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            selected={!devRole}
            onClick={() => {
              clearRole()
              closeProfileMenu()
            }}
          >
            <ListItemIcon>
              {!devRole ? <CheckRoundedIcon fontSize="small" /> : null}
            </ListItemIcon>
            <ListItemText primary="Backend role" secondary="Ikuti role session" />
          </MenuItem>
          {devRoleOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={devRole === option.value}
              onClick={() => {
                setRole(option.value)
                closeProfileMenu()
              }}
            >
              <ListItemIcon>
                {devRole === option.value ? (
                  <CheckRoundedIcon fontSize="small" />
                ) : (
                  <AdminPanelSettingsRoundedIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={option.label}
                secondary={option.description}
              />
            </MenuItem>
          ))}
        </Menu>
        <LogoutButton />
      </Toolbar>
    </AppBar>
  )
}
