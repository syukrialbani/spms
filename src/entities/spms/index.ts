export { spmsRecords } from './model/mock'
export { spmsStorage } from './model/storage'
export { getMonthlySpmsAnalytics } from './model/analytics'
export { getSpmsRecordById } from './model/selectors'
export {
  getReturnStatusColor,
  getSeverityColor,
  getSpmsStatusColor,
  spmsStatuses,
} from './model/status'
export type {
  ReturnStatus,
  Severity,
  SpmsRecord,
  SpmsStatus,
  WorkflowApprovalStatus,
  WorkflowClosedStatus,
} from './model/types'
export type {
  MonthlySpmsAnalytics,
  SpmsAnalyticsMetric,
} from './model/analytics'
