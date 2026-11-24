import {
  memo,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { type TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
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
  loading?: boolean
  minWidth?: number
  onRowClick?: (row: Row) => void
  pagination?: boolean
  rowsPerPageOptions?: number[]
  totalCountLabel?: string
}

type MemoRowProps<Row> = {
  columns: DataTableColumn<Row>[]
  comfortable: boolean
  isOdd: boolean
  onRowClick?: (row: Row) => void
  row: Row
}

function RawDataTableRow<Row>({
  columns,
  comfortable,
  isOdd,
  onRowClick,
  row,
}: MemoRowProps<Row>) {
  return (
    <TableRow
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      sx={{
        backgroundColor: isOdd ? '#fafdfb' : '#ffffff',
        cursor: onRowClick ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: '#f0f7f2',
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
              fontSize: comfortable ? '0.78rem' : '0.71rem',
              lineHeight: 1.25,
              maxWidth: column.width,
              minWidth: column.minWidth,
              overflow: 'hidden',
              px: comfortable ? 1.15 : 0.85,
              py: comfortable ? 0.78 : 0.45,
              textOverflow: 'ellipsis',
              whiteSpace: column.nowrap === false ? 'normal' : 'nowrap',
              width: column.width,
            },
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

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5, 6, 7]

export function DataTable<Row>({
  rows,
  columns,
  emptyLabel = 'Data tidak ditemukan',
  getRowId,
  initialRowsPerPage = 25,
  loading = false,
  minWidth,
  onRowClick,
  pagination = false,
  rowsPerPageOptions = [10, 25, 50, 100],
  totalCountLabel,
}: DataTableProps<Row>) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)
  const [comfortable, setComfortable] = useState(false)

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

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e2e8e5',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(15, 25, 21, 0.04)',
        display: 'block',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          bgcolor: '#f8faf9',
          borderBottom: '1px solid #e8eeea',
          justifyContent: 'space-between',
          minHeight: 34,
          px: 1.5,
          py: 0.45,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: '0.7rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
            }}
          >
            {totalCountLabel ?? `${rows.length.toLocaleString('id-ID')} rows`}
          </Typography>
          {loading ? (
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}
            >
              Loading...
            </Typography>
          ) : null}
        </Stack>

        <Button
          onClick={() => setComfortable((current) => !current)}
          size="small"
          variant="outlined"
          sx={{
            borderColor: '#d0dbd5',
            borderRadius: '6px',
            fontSize: '0.68rem',
            minHeight: 22,
            px: 1,
            py: 0,
          }}
        >
          {comfortable ? 'Compact' : 'Comfortable'}
        </Button>
      </Stack>

      <Box sx={{ height: 2, width: '100%', bgcolor: 'transparent' }}>
        {loading ? (
          <LinearProgress
            color="primary"
            sx={{ height: 2, bgcolor: '#e6f2ea' }}
          />
        ) : null}
      </Box>

      <TableContainer
        sx={{
          maxHeight: {
            xs: pagination ? 'calc(100svh - 300px)' : 'calc(100svh - 250px)',
            md: pagination ? 'calc(100svh - 275px)' : 'calc(100svh - 230px)',
          },
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            minWidth: minWidth ?? '100%',
            tableLayout: 'auto',
            width: '100%',
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={[
                    {
                      backgroundColor: '#f8faf9',
                      borderBottom: '1px solid #dce5e0',
                      color: '#3f524a',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      minWidth: column.minWidth,
                      px: comfortable ? 1.15 : 0.85,
                      py: 0.75,
                      whiteSpace: 'nowrap',
                      width: column.width,
                    },
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
          <TableBody
            sx={{
              opacity: loading && visibleRows.length > 0 ? 0.55 : 1,
              transition: 'opacity 120ms ease',
            }}
          >
            {loading && visibleRows.length === 0 ? (
              SKELETON_ROWS.map((rowIdx) => (
                <TableRow
                  key={`skeleton-${rowIdx}`}
                  sx={{
                    backgroundColor: rowIdx % 2 === 1 ? '#fafdfb' : '#ffffff',
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} sx={{ px: 0.85, py: 0.65 }}>
                      <Skeleton
                        variant="text"
                        height={16}
                        width="80%"
                        animation="wave"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : visibleRows.length ? (
              visibleRows.map((row, index) => (
                <MemoDataTableRow
                  key={getRowId(row)}
                  columns={columns}
                  comfortable={comfortable}
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
                  sx={{ color: 'text.secondary', fontSize: '0.78rem', py: 5 }}
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
            bgcolor: '#f8faf9',
            borderTop: '1px solid #e8eeea',
            overflow: 'hidden',
            px: { xs: 0.5, sm: 1.25 },
            '& .MuiTablePagination-toolbar': {
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 0.5, sm: 0.75 },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              minHeight: 40,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
              {
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: '0.7rem',
                fontVariantNumeric: 'tabular-nums',
                m: 0,
              },
          }}
        />
      ) : null}
    </Paper>
  )
}
