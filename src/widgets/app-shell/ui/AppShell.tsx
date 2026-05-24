import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import { Outlet } from 'react-router-dom'
import { MainAppBar } from '@widgets/app-bar'
import { MainNavigation } from '@widgets/navigation'

const drawerWidth = 284

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobileDrawer = () => setMobileOpen(false)

  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(7, 19, 35, 0.92), rgba(10, 42, 94, 0.74)), linear-gradient(25deg, rgba(242, 140, 40, 0.1), transparent 48%)'
            : 'linear-gradient(135deg, rgba(236, 248, 255, 0.82), rgba(207, 235, 255, 0.62)), linear-gradient(25deg, rgba(242, 140, 40, 0.16), transparent 48%)',
        display: 'flex',
        minHeight: '100svh',
        overflowX: 'hidden',
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
              bgcolor: 'transparent',
              boxSizing: 'border-box',
              maxWidth: '88vw',
              width: { xs: 288, sm: drawerWidth },
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
              bgcolor: 'transparent',
              border: 0,
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
          maxWidth: { xs: '100vw', md: `calc(100vw - ${drawerWidth}px)` },
          minHeight: '100svh',
          overflowX: 'hidden',
          pt: { xs: '80px', sm: '84px', md: '92px' },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '100%',
            px: { xs: 1.5, sm: 2, md: 3 },
            py: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
