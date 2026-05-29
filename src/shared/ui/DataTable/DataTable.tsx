import type { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { type TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { SxProps, Theme } from '@mui/material/styles'

export type DataTableColumn<Row> = {
  key: string
  header: ReactNode
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
  minWidth?: number
}

const getStickySx = <Row,>(
  column: DataTableColumn<Row>,
  isHead = false,
): SxProps<Theme> => {
  if (!column.sticky) {
    return {}
  }

  const offset = column.stickyOffset ?? 0

  return (theme) => ({
    [theme.breakpoints.up('md')]: {
      background:
        theme.palette.mode === 'dark'
          ? isHead
            ? 'rgba(10, 42, 94, 0.92)'
            : 'rgba(7, 19, 35, 0.9)'
          : isHead
            ? 'rgba(231, 247, 255, 0.92)'
            : 'rgba(247, 252, 255, 0.9)',
      boxShadow:
        column.sticky === 'left'
          ? '8px 0 16px rgba(12, 67, 122, 0.06)'
          : '-8px 0 16px rgba(12, 67, 122, 0.06)',
      left: column.sticky === 'left' ? offset : undefined,
      position: 'sticky',
      right: column.sticky === 'right' ? offset : undefined,
      zIndex: isHead ? 4 : 3,
    },
  })
}

export function DataTable<Row>({
  rows,
  columns,
  emptyLabel = 'Data tidak ditemukan',
  getRowId,
  minWidth = 920,
}: DataTableProps<Row>) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(7,19,35,0.88), rgba(10,42,94,0.68))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(247,252,255,0.74))',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(128, 205, 255, 0.18)'
            : 'rgba(255, 255, 255, 0.58)',
        borderRadius: 1,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 14px 34px rgba(0, 8, 20, 0.28)'
            : '0 12px 30px rgba(12, 67, 122, 0.12)',
        display: 'block',
        maxHeight: {
          xs: 'calc(100svh - 286px)',
          sm: 'calc(100svh - 270px)',
          md: 'calc(100svh - 270px)',
        },
        maxWidth: '100%',
        overflow: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth, tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(10, 42, 94, 0.92)'
                    : 'rgba(231, 247, 255, 0.92)',
                fontSize: { xs: 12, sm: 13 },
                px: { xs: 1, sm: 1.5 },
                py: 1.45,
              },
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
                sx={[
                  {
                    minWidth: column.minWidth,
                    whiteSpace: 'nowrap',
                    width: column.width,
                  },
                  getStickySx(column, true),
                  ...(Array.isArray(column.headSx)
                    ? column.headSx
                    : [column.headSx]),
                ]}
              >
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                sx={{
                  '&:hover td': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(82, 197, 242, 0.08)'
                        : 'rgba(255, 255, 255, 0.64)',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    sx={[
                      {
                        maxWidth: column.width,
                        minWidth: column.minWidth,
                        overflow: 'hidden',
                        fontSize: { xs: 12, sm: 13 },
                        px: { xs: 1, sm: 1.5 },
                        py: 1.35,
                        textOverflow: 'ellipsis',
                        whiteSpace: column.nowrap === false ? 'normal' : 'nowrap',
                        width: column.width,
                      },
                      getStickySx(column),
                      ...(Array.isArray(column.cellSx)
                        ? column.cellSx
                        : [column.cellSx]),
                    ]}
                  >
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                {emptyLabel}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
