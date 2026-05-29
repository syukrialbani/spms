export type DeliveryOrderKind = 'DELIVERY' | 'PICKUP'

export type DeliveryOrderStatus =
  | 'GENERATED'
  | 'DELIVERY PROCESS'
  | 'PICKUP GENERATED'
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
  sourceSpmsOrderNumber?: string
  sourceDeliveryOrder?: string
}
