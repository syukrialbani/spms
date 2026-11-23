import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { type TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

export type DataTableHeaderContext<Row> = {
  rows: Row[]
  visibleRows: Row[]
}

export type DataTableColumn<Row> = {
  key: string
  header: ReactNode | ((context: DataTableHeaderContext<Row>) => ReactNode)
  align?: TableCellProps['align']
  cellSx?: SxProps<Theme>
  headSx?: SxProps<Theme>
  minWidth?: number | string
  nowrap?: boolean
  sticky?: 'left' | 'right'
  stickyOffset?: number
  width?: number | string
  render: (row: Row) => ReactNode
}

type DataTableProps<Row> = {
  rows: Row[]
  columns: DataTableColumn<Row>[]
  emptyLabel?: string
  getRowId: (row: Row) => string | number
  initialRowsPerPage?: number
  minWidth?: number
  onRowClick?: (row: Row) => void
  pagination?: boolean
  rowsPerPageOptions?: number[]
  totalCountLabel?: string
}

const getStickySx = <Row,>(
  column: DataTableColumn<Row>,
  isHead = false,
): SxProps<Theme> => {
  if (!column.sticky) {
    return {}
  }

  const offset = column.stickyOffset ?? 0

  return {
    '@media (min-width:900px)': {
      backgroundColor: isHead ? '#dfe5ec' : 'inherit',
      borderLeft: column.sticky === 'right' ? '1px solid #c5cdd6' : undefined,
      borderRight: column.sticky === 'left' ? '1px solid #c5cdd6' : undefined,
      left: column.sticky === 'left' ? offset : undefined,
      position: 'sticky',
      right: column.sticky === 'right' ? offset : undefined,
      zIndex: isHead ? 4 : 2,
    },
  }
}

type MemoRowProps<Row> = {
  columns: DataTableColumn<Row>[]
  dense: boolean
  isOdd: boolean
  onRowClick?: (row: Row) => void
  row: Row
}

function RawDataTableRow<Row>({
  columns,
  dense,
  isOdd,
  onRowClick,
  row,
}: MemoRowProps<Row>) {
  return (
    <TableRow
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      sx={{
        backgroundColor: isOdd ? '#f5f7f9' : '#ffffff',
        cursor: onRowClick ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: '#e6ecf2',
        },
        '&:last-child td': {
          borderBottom: 0,
        },
      }}
    >
      {columns.map((column) => (
        <TableCell
          key={column.key}
          align={column.align}
          sx={[
            {
              backgroundColor: 'inherit',
              fontSize: dense ? '0.76rem' : '0.8125rem',
              maxWidth: column.width,
              minWidth: column.minWidth,
              overflow: 'hidden',
              px: dense ? 1 : 1.35,
              py: dense ? 0.55 : 0.95,
              textOverflow: 'ellipsis',
              whiteSpace: column.nowrap === false ? 'normal' : 'nowrap',
              width: column.width,
            },
            getStickySx(column),
            ...(Array.isArray(column.cellSx) ? column.cellSx : [column.cellSx]),
          ]}
        >
          {column.render(row)}
        </TableCell>
      ))}
    </TableRow>
  )
}

const MemoDataTableRow = memo(RawDataTableRow) as typeof RawDataTableRow

export function DataTable<Row>({
  rows,
  columns,
  emptyLabel = 'Data tidak ditemukan',
  getRowId,
  initialRowsPerPage = 25,
  minWidth = 920,
  onRowClick,
  pagination = false,
  rowsPerPageOptions = [10, 25, 50, 100],
  totalCountLabel,
}: DataTableProps<Row>) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)
  const [dense, setDense] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const maxPage = pagination
    ? Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1)
    : 0
  const safePage = pagination ? Math.min(page, maxPage) : 0

  const visibleRows = useMemo(() => {
    if (!pagination) {
      return rows
    }

    const start = safePage * rowsPerPage
    return rows.slice(start, start + rowsPerPage)
  }, [pagination, rows, rowsPerPage, safePage])

  const headerContext = useMemo<DataTableHeaderContext<Row>>(
    () => ({ rows, visibleRows }),
    [rows, visibleRows],
  )

  const handlePan = useCallback((delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }, [])

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #adb6c2',
        borderTop: '2px solid #18202c',
        borderRadius: 0,
        display: 'block',
        maxWidth: '100%',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          bgcolor: '#eef1f4',
          borderBottom: '1px solid #c5cdd6',
          justifyContent: 'space-between',
          px: 1.5,
          py: 0.75,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500,
          }}
        >
          {totalCountLabel ?? `${rows.length.toLocaleString('id-ID')} rows`}
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Button
            onClick={() => setDense((current) => !current)}
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#adb6c2',
              fontSize: '0.72rem',
              minHeight: 26,
              px: 1,
              py: 0,
            }}
          >
            {dense ? 'Normal view' : 'Compact view'}
          </Button>
          <Tooltip title="Scroll table left">
            <IconButton
              aria-label="Scroll table left"
              onClick={() => handlePan(-320)}
              size="small"
              sx={{
                border: '1px solid #adb6c2',
                borderRadius: '2px',
                height: 26,
                width: 26,
              }}
            >
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Scroll table right">
            <IconButton
              aria-label="Scroll table right"
              onClick={() => handlePan(320)}
              size="small"
              sx={{
                border: '1px solid #adb6c2',
                borderRadius: '2px',
                height: 26,
                width: 26,
              }}
            >
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <TableContainer
        ref={scrollRef}
        sx={{
          maxHeight: {
            xs: pagination ? 'calc(100svh - 330px)' : 'calc(100svh - 275px)',
            md: pagination ? 'calc(100svh - 310px)' : 'calc(100svh - 255px)',
          },
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={[
                    {
                      backgroundColor: '#dfe5ec',
                      borderBottom: '2px solid #3c4654',
                      color: '#18202c',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      minWidth: column.minWidth,
                      px: dense ? 1 : 1.35,
                      py: 1,
                      whiteSpace: 'nowrap',
                      width: column.width,
                    },
                    getStickySx(column, true),
                    ...(Array.isArray(column.headSx)
                      ? column.headSx
                      : [column.headSx]),
                  ]}
                >
                  {typeof column.header === 'function'
                    ? column.header(headerContext)
                    : column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row, index) => (
                <MemoDataTableRow
                  key={getRowId(row)}
                  columns={columns}
                  dense={dense}
                  isOdd={index % 2 === 1}
                  onRowClick={onRowClick}
                  row={row}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ color: 'text.secondary', py: 6 }}
                >
                  <Box>{emptyLabel}</Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination ? (
        <TablePagination
          component="div"
          count={rows.length}
          page={safePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          sx={{
            bgcolor: '#eef1f4',
            borderTop: '1px solid #c5cdd6',
            overflow: 'hidden',
            px: { xs: 0.5, sm: 1.25 },
            '& .MuiTablePagination-toolbar': {
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 0.5, sm: 1 },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              minHeight: 46,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
              {
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: '0.75rem',
                fontVariantNumeric: 'tabular-nums',
                m: 0,
              },
          }}
        />
      ) : null}
    </Paper>
  )
}
