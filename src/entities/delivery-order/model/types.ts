export type DeliveryOrderKind = 'DELIVERY' | 'PICKUP'

export type DeliveryOrderSourceType = 'SPMS' | 'NON_SPMS'

export type DeliveryOrderStatus =
  | 'OPEN'
  | 'ON_PROGRESS'
  | 'NEED_UPLOAD_DO'
  | 'NEED_REVIEW_DO'
  | 'CLOSED'
  | 'REJECTED'

export type DeliveryOrderMaterialItem = {
  description: string
  partNumber: string
  qty: number
  serialNumber?: string
}

export type DeliveryOrderRecord = {
  id: string
  deliveryOrder: string
  kind: DeliveryOrderKind
  sourceType?: DeliveryOrderSourceType
  expedition: string
  dateRequest: string
  timeRequest: string
  statusDo: DeliveryOrderStatus
  service: string
  orderNumber?: string
  customer?: string
  ticketNumber?: string
  area?: string
  dop?: string
  siteName?: string
  severity?: string
  onDeliveryDate?: string
  origin: string
  originAddress: string
  originPic: string
  destination: string
  destinationAddress: string
  destinationPic: string
  awbTransfer?: string
  batch?: string
  datePickup?: string
  materials?: DeliveryOrderMaterialItem[]
  materialSerialNumbers?: string[]
  packaging?: string
  qtyBox?: string
  receiveDate?: string
  requestDate?: string
  reviewTime?: string
  sourceSpmsId?: string
  sourceSpmsIds?: string[]
  sourceSpmsOrderNumber?: string
  sourceSpmsOrderNumbers?: string[]
  sourceDeliveryOrder?: string
  sourceDeliveryOrders?: string[]
  statusCheck?: string
  ticketNumbers?: string[]
  uploadDoFileName?: string
  weight?: string
}
