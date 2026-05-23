import { spmsRecords } from './mock'

export const getSpmsRecordById = (id: string | undefined) =>
  spmsRecords.find((record) => record.id === id) ?? null
