import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useAuth } from '../model/useAuth'

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Tooltip title="Logout">
      <IconButton color="inherit" aria-label="Logout" onClick={logout}>
        <LogoutRoundedIcon />
      </IconButton>
    </Tooltip>
  )
}
