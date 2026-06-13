import { deliveryOrderRecords } from './mock'
import { getSpmsRecordMaterials, type SpmsRecord } from '@entities/spms'
import type {
  DeliveryOrderKind,
  DeliveryOrderMaterialItem,
  DeliveryOrderRecord,
  DeliveryOrderStatus,
} from './types'

type SpmsDeliveryOrderInput = {
  awbTransfer: string
  expedition: string
  materialSerialNumbers: string[]
  service: string
  supportDestinationMaterial: string
  supportOriginMaterial: string
}

type StandaloneDeliveryOrderInput = SpmsDeliveryOrderInput & {
  area: string
  customer: string
  datePickup: string
  dop: string
  kind: DeliveryOrderKind
  materials: DeliveryOrderMaterialItem[]
  onDeliveryDate?: string
  orderNumber: string
  packaging: string
  qtyBox: string
  requestDate: string
  severity: string
  siteName: string
  ticketNumber: string
  weight: string
}

type DeliveryOrderUpdateInput = Partial<
  Omit<DeliveryOrderRecord, 'id' | 'deliveryOrder'>
>

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
  if (status === 'OPEN' || status === 'DRAFT' || status === 'NEW') {
    return 'OPEN'
  }

  if (
    status === 'ON_PROGRESS' ||
    status === 'ON_DELIVERY' ||
    status === 'WAITING_UPLOAD_DO'
  ) {
    return 'ON_PROGRESS'
  }

  if (status === 'NEED_UPLOAD_DO') {
    return 'NEED_UPLOAD_DO'
  }

  if (
    status === 'NEED_REVIEW_DO' ||
    status === 'DELIVERY PROCESS' ||
    status === 'WAITING_APPROVAL_DO'
  ) {
    return 'NEED_REVIEW_DO'
  }

  if (status === 'CLOSED') {
    return 'CLOSED'
  }

  if (status === 'REJECTED' || status === 'REVISI') {
    return 'REJECTED'
  }

  return 'OPEN'
}

const syncSerialNumbers = (materials: DeliveryOrderMaterialItem[] = []) =>
  materials.map((material) => material.serialNumber ?? '')

const normalizeOrder = (order: DeliveryOrderRecord): DeliveryOrderRecord => {
  const materials =
    order.materials ??
    (order.materialSerialNumbers?.length
      ? order.materialSerialNumbers.map((serialNumber, index) => ({
          description: `Material ${index + 1}`,
          partNumber: '-',
          qty: 1,
          serialNumber,
        }))
      : undefined)

  return {
    ...order,
    materialSerialNumbers:
      order.materialSerialNumbers ?? syncSerialNumbers(materials),
    materials,
    sourceType:
      order.sourceType ?? (order.sourceSpmsOrderNumber ? 'SPMS' : 'NON_SPMS'),
    sourceSpmsIds:
      order.sourceSpmsIds ?? (order.sourceSpmsId ? [order.sourceSpmsId] : undefined),
    sourceSpmsOrderNumbers:
      order.sourceSpmsOrderNumbers ??
      (order.sourceSpmsOrderNumber ? [order.sourceSpmsOrderNumber] : undefined),
    ticketNumbers:
      order.ticketNumbers ?? (order.ticketNumber ? [order.ticketNumber] : undefined),
    statusDo: normalizeDeliveryOrderStatus(order.statusDo),
  }
}

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

const uniqueText = (values: Array<string | undefined>) =>
  Array.from(
    new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]),
  )

const createSpmsSummary = (records: SpmsRecord[]) => {
  const firstRecord = records[0]
  const orderNumbers = records.map((record) => record.orderNumber)
  const ticketNumbers = records.map((record) => record.customerOrderNumber)

  return {
    area: uniqueText(records.map((record) => record.area)).join(', '),
    customer: uniqueText(records.map((record) => record.customer)).join(', '),
    dop: uniqueText(records.map((record) => record.dop)).join(', '),
    orderNumber: orderNumbers.join(', '),
    requestDate: firstRecord?.requestDate ?? '',
    severity: uniqueText(records.map((record) => record.severity)).join(', '),
    siteName: uniqueText(records.map((record) => record.siteName)).join(', '),
    sourceSpmsIds: records.map((record) => record.id),
    sourceSpmsOrderNumbers: orderNumbers,
    ticketNumber: ticketNumbers.join(', '),
    ticketNumbers,
  }
}

const createMaterialsFromSpmsRecords = (
  records: SpmsRecord[],
  serialNumbers: string[],
): DeliveryOrderMaterialItem[] => {
  let serialIndex = 0

  return records.flatMap((record) =>
    getSpmsRecordMaterials(record).map((material) => {
      const serialNumber =
        serialNumbers[serialIndex] ?? material.serialNumber ?? ''

      serialIndex += 1

      return {
        description:
          records.length > 1
            ? `${record.orderNumber} - ${material.description}`
            : material.description,
        partNumber: material.partNumber,
        qty: material.qty,
        serialNumber,
      }
    }),
  )
}

const normalizeStandaloneMaterials = (
  materials: DeliveryOrderMaterialItem[],
): DeliveryOrderMaterialItem[] => {
  const normalizedMaterials = materials
    .filter(
      (material) =>
        material.description || material.partNumber || material.serialNumber,
    )
    .map((material) => ({
      description: material.description || '-',
      partNumber: material.partNumber || '-',
      qty: Number(material.qty) > 0 ? Number(material.qty) : 1,
      serialNumber: material.serialNumber ?? '',
    }))

  return normalizedMaterials.length
    ? normalizedMaterials
    : [
        {
          description: '-',
          partNumber: '-',
          qty: 1,
          serialNumber: '',
        },
      ]
}

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
    return this.createFromSpmsBatch([record], values)
  },
  createFromSpmsBatch(
    records: SpmsRecord[],
    values: SpmsDeliveryOrderInput,
  ): DeliveryOrderRecord {
    const orders = this.getAll()
    const [record] = records

    if (!record) {
      throw new Error('SPMS record wajib dipilih')
    }

    const existing = orders.find(
      (order) =>
        order.kind === 'DELIVERY' &&
        records.length === 1 &&
        ((order.sourceSpmsIds?.includes(record.id) ??
          order.sourceSpmsId === record.id) ||
          (order.sourceSpmsOrderNumbers?.includes(record.orderNumber) ??
            order.sourceSpmsOrderNumber === record.orderNumber)),
    )

    if (existing) {
      return existing
    }

    const origin = getLocationInfo(values.supportOriginMaterial)
    const destination = getLocationInfo(
      values.supportDestinationMaterial || record.area,
    )
    const now = new Date().toISOString()
    const summary = createSpmsSummary(records)
    const nextOrder: DeliveryOrderRecord = {
      id: `do-${crypto.randomUUID()}`,
      deliveryOrder: createDeliveryOrderNumber(orders),
      kind: 'DELIVERY',
      sourceType: 'SPMS',
      expedition: values.expedition,
      dateRequest: formatDatePart(now),
      timeRequest: formatTimePart(now),
      statusDo: 'OPEN',
      service: values.service,
      area: summary.area,
      customer: summary.customer,
      dop: summary.dop,
      orderNumber: summary.orderNumber,
      requestDate: summary.requestDate,
      severity: summary.severity,
      siteName: summary.siteName,
      ticketNumber: summary.ticketNumber,
      ticketNumbers: summary.ticketNumbers,
      origin: origin.label,
      originAddress: origin.address,
      originPic: origin.pic,
      destination: destination.label,
      destinationAddress: destination.address,
      destinationPic: destination.pic,
      awbTransfer: values.awbTransfer,
      materialSerialNumbers: values.materialSerialNumbers,
      materials: createMaterialsFromSpmsRecords(
        records,
        values.materialSerialNumbers,
      ),
      sourceSpmsId: record.id,
      sourceSpmsIds: summary.sourceSpmsIds,
      sourceSpmsOrderNumber: record.orderNumber,
      sourceSpmsOrderNumbers: summary.sourceSpmsOrderNumbers,
    }

    saveOrders([nextOrder, ...orders])
    return nextOrder
  },
  createPickupFromSpms(
    record: SpmsRecord,
    values: SpmsDeliveryOrderInput,
  ): DeliveryOrderRecord {
    return this.createPickupFromSpmsBatch([record], values)
  },
  createPickupFromSpmsBatch(
    records: SpmsRecord[],
    values: SpmsDeliveryOrderInput,
  ): DeliveryOrderRecord {
    const orders = this.getAll()
    const [record] = records

    if (!record) {
      throw new Error('SPMS record wajib dipilih')
    }

    const existing = orders.find(
      (order) =>
        order.kind === 'PICKUP' &&
        records.length === 1 &&
        ((order.sourceSpmsIds?.includes(record.id) ??
          order.sourceSpmsId === record.id) ||
          (order.sourceSpmsOrderNumbers?.includes(record.orderNumber) ??
            order.sourceSpmsOrderNumber === record.orderNumber)),
    )

    if (existing) {
      return existing
    }

    const sourceDeliveryOrders = uniqueText(
      records.map((item) => item.deliveryOrderNumber),
    )
    const sourceDeliveryOrder = sourceDeliveryOrders[0]
    const origin = getLocationInfo(
      values.supportOriginMaterial ||
        record.supportDestinationMaterial ||
        record.area,
    )
    const destination = getLocationInfo(
      values.supportDestinationMaterial ||
        record.supportOriginMaterial ||
        'JAKARTA',
    )
    const now = new Date().toISOString()
    const summary = createSpmsSummary(records)
    const pickupOrder: DeliveryOrderRecord = {
      id: `do-${crypto.randomUUID()}`,
      deliveryOrder: createDeliveryOrderNumber(orders, 'MS-AVIAT-PU-26'),
      kind: 'PICKUP',
      sourceType: 'SPMS',
      expedition: values.expedition,
      dateRequest: formatDatePart(now),
      timeRequest: formatTimePart(now),
      statusDo: 'OPEN',
      service: values.service,
      area: summary.area,
      customer: summary.customer,
      dop: summary.dop,
      orderNumber: summary.orderNumber,
      requestDate: summary.requestDate,
      severity: summary.severity,
      siteName: summary.siteName,
      ticketNumber: summary.ticketNumber,
      ticketNumbers: summary.ticketNumbers,
      origin: origin.label,
      originAddress: origin.address,
      originPic: origin.pic,
      destination: destination.label,
      destinationAddress: destination.address,
      destinationPic: destination.pic,
      awbTransfer: values.awbTransfer,
      materialSerialNumbers: values.materialSerialNumbers,
      materials: createMaterialsFromSpmsRecords(
        records,
        values.materialSerialNumbers,
      ),
      sourceDeliveryOrder,
      sourceDeliveryOrders,
      sourceSpmsId: record.id,
      sourceSpmsIds: summary.sourceSpmsIds,
      sourceSpmsOrderNumber: record.orderNumber,
      sourceSpmsOrderNumbers: summary.sourceSpmsOrderNumbers,
    }

    saveOrders([pickupOrder, ...orders])
    return pickupOrder
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
      statusDo: 'OPEN',
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
  createStandalone(values: StandaloneDeliveryOrderInput): DeliveryOrderRecord {
    const orders = this.getAll()
    const origin = getLocationInfo(values.supportOriginMaterial)
    const destination = getLocationInfo(values.supportDestinationMaterial)
    const now = new Date().toISOString()
    const materials = normalizeStandaloneMaterials(values.materials)
    const nextOrder: DeliveryOrderRecord = {
      id: `do-${crypto.randomUUID()}`,
      deliveryOrder: createDeliveryOrderNumber(
        orders,
        values.kind === 'PICKUP' ? 'MS-AVIAT-PU-26' : 'MS-AVIAT-26',
      ),
      kind: values.kind,
      sourceType: 'NON_SPMS',
      expedition: values.expedition,
      dateRequest: formatDatePart(now),
      timeRequest: formatTimePart(now),
      statusDo: 'OPEN',
      service: values.service,
      area: values.area,
      customer: values.customer,
      datePickup: values.datePickup,
      dop: values.dop,
      onDeliveryDate: values.onDeliveryDate,
      orderNumber: values.orderNumber || 'NON-SPMS',
      packaging: values.packaging,
      qtyBox: values.qtyBox,
      requestDate: values.requestDate,
      severity: values.severity,
      siteName: values.siteName,
      ticketNumber: values.ticketNumber,
      weight: values.weight,
      origin: origin.label,
      originAddress: origin.address,
      originPic: origin.pic,
      destination: destination.label,
      destinationAddress: destination.address,
      destinationPic: destination.pic,
      awbTransfer: values.awbTransfer,
      materialSerialNumbers: syncSerialNumbers(materials),
      materials,
    }

    saveOrders([nextOrder, ...orders])
    return nextOrder
  },
  update(
    deliveryOrder: string,
    values: DeliveryOrderUpdateInput,
  ): DeliveryOrderRecord | null {
    const orders = this.getAll()
    const existing = orders.find((order) => order.deliveryOrder === deliveryOrder)

    if (!existing) {
      return null
    }

    const nextMaterials = values.materials
      ? normalizeStandaloneMaterials(values.materials)
      : existing.materials
    const nextOrder = normalizeOrder({
      ...existing,
      ...values,
      materialSerialNumbers:
        values.materialSerialNumbers ?? syncSerialNumbers(nextMaterials),
      materials: nextMaterials,
    })

    saveOrders(
      orders.map((order) =>
        order.deliveryOrder === deliveryOrder ? nextOrder : order,
      ),
    )

    return nextOrder
  },
}
