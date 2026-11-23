import { useAuth } from '@features/auth'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'
import { AviatBrand } from '@shared/ui/AviatBrand'

type MainNavigationProps = {
  onNavigate?: () => void
}

const adminRoles = new Set(['SUPER_ADMIN', 'ADMIN_1', 'ADMIN_2', 'ADMIN_3'])

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardRoundedIcon fontSize="small" />,
    adminOnly: false,
  },
  {
    label: 'SPMS List',
    path: '/spms',
    icon: <AssignmentRoundedIcon fontSize="small" />,
    adminOnly: false,
  },
  {
    label: 'Delivery Order',
    path: '/delivery-order',
    icon: <LocalShippingRoundedIcon fontSize="small" />,
    adminOnly: false,
  },
  {
    label: 'Stock MS',
    path: '/stock',
    icon: <Inventory2RoundedIcon fontSize="small" />,
    adminOnly: false,
  },
  {
    label: 'Master Data',
    path: '/master-data',
    icon: <StorageRoundedIcon fontSize="small" />,
    adminOnly: true,
  },
  {
    label: 'User Management',
    path: '/users',
    icon: <GroupRoundedIcon fontSize="small" />,
    adminOnly: true,
  },
]

export function MainNavigation({ onNavigate }: MainNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useAuth()
  const isAdmin = Boolean(session?.role && adminRoles.has(session.role))
  const visibleItems = navigationItems.filter(
    (item) => !item.adminOnly || isAdmin,
  )

  return (
    <Box
      sx={{
        bgcolor: '#18202c',
        color: '#eef1f4',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          borderBottom: '1px solid #2b3646',
          display: 'flex',
          height: 56,
          px: 2,
        }}
      >
        <AviatBrand />
      </Box>
      <List sx={{ flexGrow: 1, px: 1.25, py: 1.5 }}>
        {visibleItems.map((item) => {
          const selected = location.pathname.startsWith(item.path)

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path)
                onNavigate?.()
              }}
              sx={{
                borderLeft: selected
                  ? '3px solid #9e1c4d'
                  : '3px solid transparent',
                borderRadius: '2px',
                color: selected ? '#ffffff' : '#b7c2d0',
                mb: 0.5,
                minHeight: 40,
                px: 1.25,
                py: 0.75,
                '&:hover': {
                  bgcolor: '#232e3e',
                  color: '#ffffff',
                },
                '&.Mui-selected': {
                  bgcolor: '#232e3e',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: '#2b3749',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selected ? '#f08db3' : 'inherit',
                  minWidth: 34,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: '0.84rem',
                      fontWeight: selected ? 600 : 500,
                      lineHeight: 1.25,
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          )
        })}
      </List>
      <Box sx={{ borderTop: '1px solid #2b3646', px: 2, py: 1.5 }}>
        <Typography
          variant="caption"
          sx={{ color: '#9aa7b8', display: 'block', fontWeight: 500 }}
        >
          Aviat SPMS Operations
        </Typography>
      </Box>
    </Box>
  )
}
