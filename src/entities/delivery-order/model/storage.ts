import { deliveryOrderRecords } from './mock'
import type { SpmsRecord } from '@entities/spms'
import type { DeliveryOrderRecord, DeliveryOrderStatus } from './types'

type SpmsDeliveryOrderInput = {
  awbTransfer: string
  expedition: string
  materialSerialNumbers: string[]
  service: string
  supportDestinationMaterial: string
  supportOriginMaterial: string
}

const storageKey = 'spms.deliveryOrders'

const addressBook: Record<
  string,
  {
    address: string
    pic: string
  }
> = {
  BALI: {
    address: 'Jl. By Pass Ngurah Rai No. 88, Denpasar, Bali',
    pic: 'MADE ARYA 0812-3300-8811',
  },
  BALIKPAPAN: {
    address: 'Jl. MT Haryono No. 21, Balikpapan, Kalimantan Timur',
    pic: 'AGUS RIYANTO 0812-5566-3310',
  },
  BANDUNG: {
    address: 'Jl. Soekarno Hatta No. 590, Bandung, Jawa Barat',
    pic: 'RIDWAN 0812-2209-7781',
  },
  BELITUNG: {
    address: 'Jl. Jenderal Sudirman, Tanjung Pandan, Belitung',
    pic: 'ARI WIBOWO 0812-7001-2210',
  },
  JAKARTA: {
    address: 'MS Aviat Marunda, Jakarta Utara',
    pic: 'ADMIN MARUNDA 0812-1000-2026',
  },
  JAMBI: {
    address: 'Jl. Kolonel Abunjani, Kota Baru, Jambi',
    pic: 'ANDRIANSYAH 0812-4500-7788',
  },
  MAKASSAR: {
    address: 'Jl. Perintis Kemerdekaan, Makassar, Sulawesi Selatan',
    pic: 'FIRMAN 0821-8822-1199',
  },
  MEDAN: {
    address: 'Jl. Sisingamangaraja No. 47, Medan, Sumatera Utara',
    pic: 'HENDRA 0813-6022-4419',
  },
  PALEMBANG: {
    address:
      'PERUM BUKIT SEJAHTERA POLIGON BLOK EI NO 2, KEL. BUKIT LAMA, KEC. ILIR BARAT I, PALEMBANG',
    pic: 'SAEPULLOH 0821-7770-8337',
  },
  SEMARANG: {
    address: 'Jl. Majapahit No. 112, Semarang, Jawa Tengah',
    pic: 'BAGUS 0812-2922-8800',
  },
  SURABAYA: {
    address: 'Jl. Rungkut Industri Raya, Surabaya, Jawa Timur',
    pic: 'YUDHA 0821-3301-9090',
  },
}

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

const readPersistedOrders = () => {
  const raw = getStorage()?.getItem(storageKey)

  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (Array.isArray(parsed)) {
      return parsed as DeliveryOrderRecord[]
    }
  } catch {
    getStorage()?.removeItem(storageKey)
  }

  return null
}

const saveOrders = (orders: DeliveryOrderRecord[]) => {
  getStorage()?.setItem(storageKey, JSON.stringify(orders))
}

const normalizeDeliveryOrderStatus = (
  status: string,
): DeliveryOrderStatus => {
  if (status === 'CLOSED') {
    return 'CLOSED'
  }

  if (status === 'PICKUP GENERATED' || status === 'PICKUP_GENERATED') {
    return 'PICKUP_GENERATED'
  }

  if (status === 'DELIVERY PROCESS' || status === 'WAITING_APPROVAL_DO') {
    return 'WAITING_APPROVAL_DO'
  }

  return 'WAITING_UPLOAD_DO'
}

const normalizeOrder = (order: DeliveryOrderRecord): DeliveryOrderRecord => ({
  ...order,
  statusDo: normalizeDeliveryOrderStatus(order.statusDo),
})

const normalizeLocation = (value: string) => {
  const cleaned = value.trim()

  if (!cleaned) {
    return 'JAKARTA'
  }

  return cleaned.toUpperCase().replace(/^MS AVIAT\s+/, '')
}

const getLocationInfo = (location: string) => {
  const normalized = normalizeLocation(location)

  return {
    label: normalized,
    ...(addressBook[normalized] ?? {
      address: `${normalized} delivery point`,
      pic: 'PIC FIELD 0812-0000-2026',
    }),
  }
}

const formatDatePart = (value: string) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10)
  }

  return value.slice(0, 10)
}

const formatTimePart = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    return value.slice(11, 16)
  }

  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getNextSequence = (orders: DeliveryOrderRecord[]) => {
  const numbers = orders
    .map((order) => order.deliveryOrder.match(/(\d+)$/)?.[1])
    .filter(Boolean)
    .map((value) => Number(value))

  return Math.max(0, ...numbers) + 1
}

const createDeliveryOrderNumber = (
  orders: DeliveryOrderRecord[],
  prefix = 'MS-AVIAT-26',
) => `${prefix}-${String(getNextSequence(orders)).padStart(5, '0')}`

export const deliveryOrderStorage = {
  getAll(): DeliveryOrderRecord[] {
    const persistedOrders = readPersistedOrders()

    if (persistedOrders) {
      const normalizedOrders = persistedOrders.map(normalizeOrder)

      saveOrders(normalizedOrders)
      return normalizedOrders
    }

    const normalizedOrders = deliveryOrderRecords.map(normalizeOrder)

    saveOrders(normalizedOrders)
    return normalizedOrders
  },
  getByDeliveryOrder(deliveryOrder: string): DeliveryOrderRecord | null {
    return (
      this.getAll().find((order) => order.deliveryOrder === deliveryOrder) ??
      null
    )
  },
  createFromSpms(
    record: SpmsRecord,
    values: SpmsDeliveryOrderInput,
  ): DeliveryOrderRecord {
    const orders = this.getAll()
    const existing = orders.find(
      (order) =>
        order.kind === 'DELIVERY' &&
        (order.sourceSpmsId === record.id ||
          order.sourceSpmsOrderNumber === record.orderNumber),
    )

    if (existing) {
      return existing
    }

    const origin = getLocationInfo(values.supportOriginMaterial)
    const destination = getLocationInfo(
      values.supportDestinationMaterial || record.area,
    )
    const now = new Date().toISOString()
    const nextOrder: DeliveryOrderRecord = {
      id: `do-${crypto.randomUUID()}`,
      deliveryOrder: createDeliveryOrderNumber(orders),
      kind: 'DELIVERY',
      expedition: values.expedition,
      dateRequest: formatDatePart(now),
      timeRequest: formatTimePart(now),
      statusDo: 'WAITING_UPLOAD_DO',
      service: values.service,
      origin: origin.label,
      originAddress: origin.address,
      originPic: origin.pic,
      destination: destination.label,
      destinationAddress: destination.address,
      destinationPic: destination.pic,
      awbTransfer: values.awbTransfer,
      materialSerialNumbers: values.materialSerialNumbers,
      sourceSpmsId: record.id,
      sourceSpmsOrderNumber: record.orderNumber,
    }

    saveOrders([nextOrder, ...orders])
    return nextOrder
  },
  createPickupDraft(sourceDeliveryOrder: string): DeliveryOrderRecord | null {
    const orders = this.getAll()
    const source = orders.find(
      (order) => order.deliveryOrder === sourceDeliveryOrder,
    )

    if (!source || source.kind === 'PICKUP') {
      return null
    }

    const existingPickup = orders.find(
      (order) =>
        order.kind === 'PICKUP' &&
        order.sourceDeliveryOrder === source.deliveryOrder,
    )

    if (existingPickup) {
      return existingPickup
    }

    const pickupDraft: DeliveryOrderRecord = {
      ...source,
      id: `do-preview-${source.id}`,
      deliveryOrder: createDeliveryOrderNumber(orders, 'MS-AVIAT-PU-26'),
      kind: 'PICKUP',
      statusDo: 'PICKUP_GENERATED',
      service: 'PICKUP RETURN',
      origin: source.destination,
      originAddress: source.destinationAddress,
      originPic: source.destinationPic,
      destination: source.origin,
      destinationAddress: source.originAddress,
      destinationPic: source.originPic,
      sourceDeliveryOrder: source.deliveryOrder,
    }

    return pickupDraft
  },
  generatePickup(sourceDeliveryOrder: string): DeliveryOrderRecord | null {
    const orders = this.getAll()
    const pickupDraft = this.createPickupDraft(sourceDeliveryOrder)

    if (!pickupDraft) {
      return null
    }

    const existingPickup = orders.find(
      (order) =>
        order.kind === 'PICKUP' &&
        order.sourceDeliveryOrder === sourceDeliveryOrder,
    )

    if (existingPickup) {
      return existingPickup
    }

    const pickupOrder: DeliveryOrderRecord = {
      ...pickupDraft,
      id: `do-${crypto.randomUUID()}`,
    }

    saveOrders([pickupOrder, ...orders])
    return pickupOrder
  },
}
