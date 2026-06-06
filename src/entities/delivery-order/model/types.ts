export type DeliveryOrderKind = 'DELIVERY' | 'PICKUP'

export type DeliveryOrderStatus =
  | 'WAITING_UPLOAD_DO'
  | 'WAITING_APPROVAL_DO'
  | 'PICKUP_GENERATED'
  | 'CLOSED'

export type DeliveryOrderRecord = {
  id: string
  deliveryOrder: string
  kind: DeliveryOrderKind
  expedition: string
  dateRequest: string
  timeRequest: string
  statusDo: DeliveryOrderStatus
  service: string
  origin: string
  originAddress: string
  originPic: string
  destination: string
  destinationAddress: string
  destinationPic: string
  awbTransfer?: string
  materialSerialNumbers?: string[]
  sourceSpmsId?: string
  sourceSpmsOrderNumber?: string
  sourceDeliveryOrder?: string
}
