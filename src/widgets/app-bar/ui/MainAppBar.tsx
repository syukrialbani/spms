import { LogoutButton, useAuth } from '@features/auth'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'

type MainAppBarProps = {
  drawerWidth: number
  onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/spms': 'SPMS List',
  '/spms/add': 'Add SPMS',
  '/delivery-order': 'Delivery Order',
  '/delivery-order/create': 'Create Delivery Order',
  '/stock': 'Stock MS Inventory',
  '/master-data': 'Master Data',
  '/users': 'User Management',
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_1: 'Admin 1',
  ADMIN_2: 'Admin 2',
  ADMIN_3: 'Admin 3',
  DRIVER: 'Driver / PIC Kancab',
  REQUESTOR: 'Requestor',
}

const getInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}` || 'SP'

const getPageTitle = (pathname: string) => {
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  if (pathname.startsWith('/delivery-order/generate-pickup/')) {
    return 'Generate DO Pickup'
  }

  if (pathname.startsWith('/delivery-order/')) {
    return pathname.endsWith('/edit')
      ? 'Edit Delivery Order'
      : 'Delivery Order Detail'
  }

  if (pathname.startsWith('/spms/')) {
    return pathname.endsWith('/edit') ? 'Edit SPMS' : 'SPMS Detail'
  }

  return 'SPMS'
}

export function MainAppBar({ drawerWidth, onMenuClick }: MainAppBarProps) {
  const location = useLocation()
  const { session } = useAuth()
  const title = getPageTitle(location.pathname)
  const displayName = session
    ? `${session.firstName} ${session.lastName}`.trim()
    : 'SPMS User'
  const activeRoleLabel = session?.role
    ? (roleLabels[session.role] ?? session.role)
    : 'User'

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8e5',
        left: { xs: 0, md: `${drawerWidth}px` },
        top: 0,
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar
        sx={{
          gap: { xs: 1, sm: 1.5 },
          minHeight: '56px !important',
          px: { xs: 1.5, sm: 2.25, md: 3 },
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
        <Typography
          variant="h6"
          noWrap
          sx={{
            color: 'text.primary',
            fontSize: { xs: 15.5, sm: 16.5 },
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            minWidth: 0,
          }}
        >
          <Avatar
            src={session?.image ?? undefined}
            alt={displayName}
            sx={{
              bgcolor: '#eaf6ee',
              border: '1px solid #c3e6ce',
              borderRadius: '8px',
              color: '#1f8a3b',
              fontSize: 12,
              fontWeight: 700,
              height: 32,
              width: 32,
            }}
          >
            {getInitials(session?.firstName, session?.lastName)}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.2 }}
            >
              {displayName}
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
              noWrap
              sx={{ display: 'block', lineHeight: 1.2 }}
            >
              {activeRoleLabel}
            </Typography>
          </Box>
        </Box>
        <LogoutButton />
      </Toolbar>
    </AppBar>
  )
}
