export type MasterCustomer = {
  id: string
  name: string
  requiresNeFe: boolean
  isActive: boolean
}

export type MasterDop = {
  id: string
  customerId: string
  customerName: string
  dop: string
  area: string
  regional: string
  remarks: string
  lspSupport: string
  isActive: boolean
}

export type MasterMaterial = {
  id: string
  description: string
  partNumber: string
  categoryMaterial: string
  typeMaterial: string
  isActive: boolean
}

export type MasterSeveritySla = {
  id: string
  severity: string
  slaHours: string
  defaultService: string
  isActive: boolean
}

export type MasterTransactionStatus = {
  id: string
  code: string
  name: string
  skipPickup: boolean
  isActive: boolean
}

export type MasterLocation = {
  id: string
  name: string
  type: 'ORIGIN' | 'DESTINATION' | 'BOTH'
  address: string
  pic: string
  isActive: boolean
}

export type MasterSimpleItem = {
  id: string
  name: string
  isActive: boolean
}
