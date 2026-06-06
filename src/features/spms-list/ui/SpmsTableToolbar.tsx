import { getSpmsStatusColor } from '@entities/spms'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import type { SpmsStatusFilter } from '../model/useSpmsList'

type SpmsTableToolbarProps = {
  search: string
  status: SpmsStatusFilter
  statusCounts: Record<SpmsStatusFilter, number>
  statusOptions: SpmsStatusFilter[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: SpmsStatusFilter) => void
}

export function SpmsTableToolbar({
  search,
  status,
  statusCounts,
  statusOptions,
  onSearchChange,
  onStatusChange,
}: SpmsTableToolbarProps) {
  return (
    <LiquidPanel
      sx={{
        mb: 2,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          {statusOptions.map((option) => {
            const selected = status === option
            const color =
              option === 'All' ? 'default' : getSpmsStatusColor(option)

            return (
              <Chip
                key={option}
                color={color}
                label={`${option} (${statusCounts[option]})`}
                onClick={() => onStatusChange(option)}
                size="small"
                variant={selected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: selected ? 900 : 750,
                  minWidth: 126,
                }}
              />
            )
          })}
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ alignItems: 'stretch' }}
        >
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
        <Button
          variant="contained"
          startIcon={<FilterListRoundedIcon />}
          sx={{
            minWidth: 118,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          Filter
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownloadRoundedIcon />}
          sx={{ minWidth: 118, width: { xs: '100%', md: 'auto' } }}
        >
          Export
        </Button>
        </Stack>
      </Stack>
    </LiquidPanel>
  )
}
