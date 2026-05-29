import type { DeliveryOrderRecord } from './types'

export const deliveryOrderRecords: DeliveryOrderRecord[] = [
  {
    id: 'do-001',
    deliveryOrder: 'MS-AVIAT-26-00001',
    kind: 'DELIVERY',
    expedition: 'ESATEL',
    dateRequest: '2026-01-01',
    timeRequest: '10:48',
    statusDo: 'DELIVERY PROCESS',
    service: 'HANDCARRY',
    origin: 'TELKOM, SAMARINDA',
    originAddress: 'JL. DAHLIA NO.65 SAMARINDA - KALTIM',
    originPic: 'INDRAWAN 08225247458',
    destination: 'SAMARINDA',
    destinationAddress:
      'MUGIREJO TEGAL REJO RT. 14, GANG 1, KEL. MUGIREJO, KEC. SUNGAI PINANG DALAM, KAB. SAMARINDA KOTA, 75119',
    destinationPic: 'FAJAR 0838-6787-2916',
  },
]
