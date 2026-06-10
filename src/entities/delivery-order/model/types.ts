export type DeliveryOrderKind = 'DELIVERY' | 'PICKUP'

export type DeliveryOrderSourceType = 'SPMS' | 'NON_SPMS'

export type DeliveryOrderStatus =
  | 'WAITING_UPLOAD_DO'
  | 'WAITING_APPROVAL_DO'
  | 'PICKUP_GENERATED'
  | 'CLOSED'

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
  sourceSpmsOrderNumber?: string
  sourceDeliveryOrder?: string
  statusCheck?: string
  uploadDoFileName?: string
  weight?: string
}
