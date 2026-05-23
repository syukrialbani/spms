import type { SpmsRecord } from './types'

export type SpmsAnalyticsMetric = 'orders' | 'qty'

export type MonthlySpmsAnalytics = {
  month: string
  orders: number
  qty: number
}

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const getMonthlySpmsAnalytics = (
  records: SpmsRecord[],
): MonthlySpmsAnalytics[] => {
  const monthlyData = monthLabels.map((month) => ({
    month,
    orders: 0,
    qty: 0,
  }))

  records.forEach((record) => {
    const monthIndex = new Date(record.requestDate).getMonth()

    if (monthlyData[monthIndex]) {
      monthlyData[monthIndex].orders += 1
      monthlyData[monthIndex].qty += record.qty
    }
  })

  return monthlyData
}
