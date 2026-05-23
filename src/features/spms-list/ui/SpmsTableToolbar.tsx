import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import type { SpmsStatusFilter } from '../model/useSpmsList'

type SpmsTableToolbarProps = {
  search: string
  status: SpmsStatusFilter
  statusOptions: SpmsStatusFilter[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: SpmsStatusFilter) => void
}

export function SpmsTableToolbar({
  search,
  status,
  statusOptions,
  onSearchChange,
  onStatusChange,
}: SpmsTableToolbarProps) {
  return (
    <LiquidPanel
      sx={{
        mb: 2,
        p: 2,
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
        <TextField
          fullWidth
          placeholder="Search order, customer, area, site..."
          size="small"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
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
        <TextField
          aria-label="Status"
          select
          size="small"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as SpmsStatusFilter)
          }
          slotProps={{
            input: {
              sx: {
                backdropFilter: 'none',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#071323' : '#ffffff',
              },
            },
            select: {
              MenuProps: {
                slotProps: {
                  paper: {
                    sx: {
                      backdropFilter: 'none',
                      backgroundImage: 'none',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '#071323' : '#ffffff',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(82, 197, 242, 0.42)'
                          : 'rgba(29, 112, 183, 0.18)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 18px 42px rgba(0, 8, 20, 0.48)'
                          : '0 18px 42px rgba(12, 67, 122, 0.18)',
                      '& .MuiMenu-list': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark' ? '#071323' : '#ffffff',
                      },
                      '& .MuiMenuItem-root': {
                        bgcolor: 'transparent',
                        '&.Mui-selected': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? '#12395f'
                              : '#e7f7ff',
                        },
                        '&.Mui-selected:hover, &:hover': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? '#164a78'
                              : '#dff5ff',
                        },
                      },
                    },
                  },
                },
              },
            },
          }}
          sx={{ minWidth: { xs: '100%', md: 190 } }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<FilterListRoundedIcon />}
          sx={{
            // bgcolor: 'rgba(255,255,255,0.34)',
            // borderColor: 'rgba(29,112,183,0.18)',
            // color: 'primary.dark',
            minWidth: 118,
          }}
        >
          Filter
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownloadRoundedIcon />}
          sx={{ minWidth: 118 }}
        >
          Export
        </Button>
      </Stack>
    </LiquidPanel>
  )
}
