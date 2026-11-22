export type StockUnitCategory = 'MODULE' | 'MODULAR' | 'SINGLE_UNIT'
export type StockSystemLabel = 'COMPLETE' | 'NOT_COMPLETE' | 'LOOSE_PART'
export type StockAvailability = 'AVAILABLE' | 'ALLOCATED' | 'USED' | 'FAULTY'

export type StockParentRef = {
  id: string
  serialNumber: string
  description: string
  lsp?: string
}

export type StockChildRef = {
  id: string
  serialNumber: string
  description: string
  systemLabel: StockSystemLabel
  stockStatus: StockAvailability
  remark?: string | null
}

export type StockMovement = {
  id: string
  stockItemId: string
  action: string
  fromParentSn?: string | null
  toParentSn?: string | null
  fromLsp?: string | null
  toLsp?: string | null
  referenceNumber?: string | null
  notes?: string | null
  performedBy?: string | null
  createdAt: string
}

export type StockItem = {
  id: string
  description: string
  partNumber?: string | null
  serialNumber: string
  unitCategory: StockUnitCategory
  lsp: string
  systemLabel: StockSystemLabel
  stockStatus: StockAvailability
  remark?: string | null
  stockDate?: string | null
  parentId?: string | null
  deliveryOrderNumber?: string | null
  createdAt: string
  updatedAt: string
  parent?: StockParentRef | null
  children?: StockChildRef[]
  movements?: StockMovement[]
}

export type StockOption = {
  id: string
  serialNumber: string
  description: string
  partNumber?: string | null
  unitCategory: StockUnitCategory
  lsp: string
  systemLabel: StockSystemLabel
  stockStatus: StockAvailability
  parentId?: string | null
  parent?: StockParentRef | null
}

export type StockListSummary = {
  total: number
  available: number
  allocated: number
  used: number
  faulty: number
  modules: number
  modulars: number
  singleUnits: number
}

export type StockListResponse = {
  data: StockItem[]
  total: number
  page: number
  limit: number
  summary: StockListSummary
}

export type StockListParams = {
  search?: string
  lsp?: string
  unitCategory?: string
  stockStatus?: string
  systemLabel?: string
  page?: number
  limit?: number
}

export type StockLspCount = {
  lsp: string
  count: number
}
