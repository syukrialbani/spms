import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import type { SpmsStatusFilter } from '../model/useSpmsList'

type SpmsTableToolbarProps = {
  search: string
  status: SpmsStatusFilter
  statusCounts: Record<SpmsStatusFilter, number>
  statusOptions: SpmsStatusFilter[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: SpmsStatusFilter) => void
  onExport?: () => void
}

export function SpmsTableToolbar({
  search,
  status,
  statusCounts,
  statusOptions,
  onSearchChange,
  onStatusChange,
  onExport,
}: SpmsTableToolbarProps) {
  const visibleStatuses = statusOptions.filter(
    (option) =>
      option === 'All' || option === status || (statusCounts[option] ?? 0) > 0,
  )

  return (
    <LiquidPanel sx={{ mb: 1.5, p: { xs: 1.25, sm: 1.5 } }}>
      <Stack spacing={1.25}>
        <Box
          sx={{
            borderBottom: '1px solid #e8eeea',
            display: 'flex',
            gap: 0.75,
            overflowX: 'auto',
            pb: 1,
          }}
        >
          {visibleStatuses.map((option) => {
            const selected = status === option
            const count = statusCounts[option] ?? 0

            return (
              <Button
                key={option}
                onClick={() => onStatusChange(option)}
                size="small"
                variant={selected ? 'contained' : 'outlined'}
                color={selected ? 'primary' : 'secondary'}
                sx={{
                  borderColor: selected ? 'primary.main' : '#d5dfd9',
                  borderRadius: '7px',
                  flexShrink: 0,
                  minHeight: 28,
                  px: 1.25,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{option}</span>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                    fontSize: '0.74rem',
                    fontVariantNumeric: 'tabular-nums',
                    ml: 0.75,
                    opacity: selected ? 0.92 : 0.72,
                  }}
                >
                  {count.toLocaleString('id-ID')}
                </Typography>
              </Button>
            )
          })}
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: 'stretch' }}
        >
          <TextField
            fullWidth
            placeholder="Cari Order Number, Customer, Ticket, Area, DOP, Site, Part Number..."
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
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear search"
                      edge="end"
                      onClick={() => onSearchChange('')}
                      size="small"
                    >
                      <ClearRoundedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
          {onExport ? (
            <Button
              variant="outlined"
              startIcon={<FileDownloadRoundedIcon />}
              onClick={onExport}
              sx={{
                flexShrink: 0,
                minWidth: 120,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Export CSV
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </LiquidPanel>
  )
}
