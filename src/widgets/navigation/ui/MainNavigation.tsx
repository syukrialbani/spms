import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
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

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardRoundedIcon />,
  },
  {
    label: 'SPMS List',
    path: '/spms',
    icon: <AssignmentRoundedIcon />,
  },
]

export function MainNavigation({ onNavigate }: MainNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(10, 42, 94, 0.88), rgba(7, 19, 35, 0.94) 62%, rgba(3, 11, 26, 0.96))'
            : 'linear-gradient(180deg, rgba(82, 197, 242, 0.82), rgba(29, 112, 183, 0.86) 52%, rgba(20, 58, 120, 0.92))',
        backdropFilter: 'blur(28px) saturate(1.45)',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(128, 205, 255, 0.18)'
            : 'rgba(255,255,255,0.34)',
        borderRadius: 1,
        boxShadow: '0 26px 72px rgba(12, 67, 122, 0.26)',
        color: 'common.white',
        display: 'flex',
        flexDirection: 'column',
        height: { xs: '100%', md: 'calc(100% - 32px)' },
        m: { xs: 0, md: 2 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.22)',
          display: 'flex',
          height: 84,
          px: 2.5,
        }}
      >
        <AviatBrand />
      </Box>
      <List sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        {navigationItems.map((item) => {
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
                borderRadius: 1,
                color: 'rgba(255,255,255,0.78)',
                mb: 0.5,
                minHeight: 50,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.22)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                  color: 'common.white',
                },
                '&.Mui-selected .MuiListItemIcon-root': {
                  color: 'common.white',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: selected ? 700 : 500 }}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          )
        })}
      </List>
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.22)', p: 2 }}>
        <Chip
          label="SPMS Operations"
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.18)',
            color: 'common.white',
            fontWeight: 700,
          }}
        />
      </Box>
    </Box>
  )
}
