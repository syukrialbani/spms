import { useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { Outlet } from 'react-router-dom'
import { MainAppBar } from '@widgets/app-bar'
import { MainNavigation } from '@widgets/navigation'

const drawerWidth = 236

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobileDrawer = () => setMobileOpen(false)

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        display: 'flex',
        minHeight: '100svh',
        overflowX: 'clip',
      }}
    >
      <MainAppBar
        drawerWidth={drawerWidth}
        onMenuClick={() => setMobileOpen(true)}
      />
      <Box
        component="nav"
        sx={{ flexShrink: { md: 0 }, width: { md: drawerWidth } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              bgcolor: '#18202c',
              border: 0,
              boxSizing: 'border-box',
              maxWidth: '85vw',
              width: 260,
            },
          }}
        >
          <MainNavigation onNavigate={closeMobileDrawer} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              bgcolor: '#18202c',
              border: 0,
              borderRight: '1px solid #0f151e',
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <MainNavigation />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100svh',
          minWidth: 0,
          pt: '56px',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Box
          sx={{
            marginInline: 'auto',
            maxWidth: 1600,
            px: { xs: 1.5, sm: 2.25, md: 3 },
            py: { xs: 1.75, sm: 2.25, md: 2.5 },
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
