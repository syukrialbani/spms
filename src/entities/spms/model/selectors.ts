import { spmsStorage } from './storage'

export const getSpmsRecordById = (id: string | undefined) =>
  spmsStorage.getById(id)
