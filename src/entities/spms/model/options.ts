export const customerOptions = ['Telkom', 'Telkomsel', 'IOH'] as const

export type CustomerOption = (typeof customerOptions)[number]

export type DopReference = {
  area: string
  dop: string
  regional: string
  remarks?: string
  lspSupport?: string
}

export const customerDopReferences: Record<CustomerOption, DopReference[]> = {
  Telkom: [
    { dop: 'AMBON', area: 'SUMALPUA', regional: 'TREG VII', remarks: 'Support DOP' },
    { dop: 'BALIKPAPAN', area: 'KALIMANTAN', regional: 'TREG VI', remarks: 'Support DOP' },
    { dop: 'BANGKA', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'BANJARMASIN', area: 'KALIMANTAN', regional: 'TREG VI', remarks: 'Support DOP' },
    { dop: 'BATURAJA', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'BELITUNG', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'BENGKULU', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'DENPASAR', area: 'BALI NUSRA', regional: 'TREG V', remarks: 'Support DOP' },
    { dop: 'GORONTALO', area: 'SUMALPUA', regional: 'TREG VII', remarks: 'Support DOP' },
    { dop: 'JAMBI', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'JAYAPURA', area: 'SUMALPUA', regional: 'TREG VII', remarks: 'Support DOP' },
    { dop: 'KENDARI', area: 'SUMALPUA', regional: 'TREG VII', remarks: 'Support DOP' },
    { dop: 'KUPANG', area: 'BALI NUSRA', regional: 'TREG V', remarks: 'Support DOP' },
    { dop: 'LAMPUNG', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'LUBUK LINGGAU', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'LUBUKLINGGAU', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'MANADO', area: 'SUMALPUA', regional: 'TREG VII', remarks: 'Support DOP' },
    { dop: 'MATARAM', area: 'BALI NUSRA', regional: 'TREG V', remarks: 'Support DOP' },
    { dop: 'MAUMERE', area: 'BALI NUSRA', regional: 'TREG V', remarks: 'Support DOP' },
    { dop: 'MUARA BUNGO', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'PALANGKARAYA', area: 'KALIMANTAN', regional: 'TREG VI', remarks: 'Support DOP' },
    { dop: 'PALEMBANG', area: 'SUMBAGSEL', regional: 'TREG I', remarks: 'Support DOP' },
    { dop: 'PALU', area: 'SUMALPUA', regional: 'TREG VII', remarks: 'Support DOP' },
    { dop: 'PONTIANAK', area: 'KALIMANTAN', regional: 'TREG VI', remarks: 'Support DOP' },
    { dop: 'SAMARINDA', area: 'KALIMANTAN', regional: 'TREG VI', remarks: 'Support DOP' },
    { dop: 'SORONG', area: 'SUMALPUA', regional: 'TREG VII', remarks: 'Support DOP' },
    { dop: 'TARAKAN', area: 'KALIMANTAN', regional: 'TREG VI', remarks: 'Support DOP' },
  ],
  Telkomsel: [
    { dop: 'AMBON', area: 'PUMA', regional: 'PUMA', remarks: 'Support DOP' },
    { dop: 'BALIKPAPAN', area: 'KALIMANTAN', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'BANGKA', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Support DOP' },
    { dop: 'BANJARMASIN', area: 'KALIMANTAN', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'BELITUNG', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Support DOP' },
    { dop: 'BENGKULU', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Support DOP' },
    { dop: 'DENPASAR', area: 'BALI NUSRA', regional: 'BALI NUSRA', remarks: 'Support DOP' },
    { dop: 'JAMBI', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Support DOP' },
    { dop: 'KENDARI', area: 'SULAWESI', regional: 'SULAWESI', remarks: 'Support DOP' },
    { dop: 'KUPANG', area: 'BALI NUSRA', regional: 'BALI NUSRA', remarks: 'Support DOP' },
    { dop: 'LAMPUNG', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Support DOP' },
    { dop: 'LUBUKLINGGAU', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Support DOP' },
    { dop: 'MANADO', area: 'SULAWESI', regional: 'SULAWESI', remarks: 'Support DOP' },
    { dop: 'MATARAM', area: 'BALI NUSRA', regional: 'BALI NUSRA', remarks: 'Support DOP' },
    { dop: 'MAUMERE', area: 'BALI NUSRA', regional: 'BALI NUSRA', remarks: 'Support DOP' },
    { dop: 'PALANGKARAYA', area: 'KALIMANTAN', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'PALEMBANG', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Support DOP' },
    { dop: 'PALU', area: 'SULAWESI', regional: 'SULAWESI', remarks: 'Support DOP' },
    { dop: 'PONTIANAK', area: 'KALIMANTAN', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'SORONG', area: 'PUMA', regional: 'PUMA', remarks: 'Support DOP' },
    { dop: 'TARAKAN', area: 'KALIMANTAN', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'LAHAT', area: 'SUMBAGSEL', regional: 'SUMBAGSEL', remarks: 'Remote DOP', lspSupport: 'PALEMBANG' },
    { dop: 'BAUBAU', area: 'SULAWESI', regional: 'SULAWESI', remarks: 'Remote DOP', lspSupport: 'KENDARI' },
    { dop: 'TERNATE', area: 'PUMA', regional: 'PUMA', remarks: 'Remote DOP', lspSupport: 'MANADO' },
    { dop: 'RUTENG', area: 'BALI NUSRA', regional: 'BALI NUSRA', remarks: 'Remote DOP', lspSupport: 'MATARAM' },
    { dop: 'MANOKWARI', area: 'PUMA', regional: 'PUMA', remarks: 'Remote DOP', lspSupport: 'SORONG' },
    { dop: 'MERAUKE', area: 'PUMA', regional: 'PUMA', remarks: 'Remote DOP', lspSupport: 'JAYAPURA' },
  ],
  IOH: [
    { dop: 'JAKARTA', area: 'JAKARTA', regional: 'JABODETABEK', remarks: 'Support DOP' },
    { dop: 'PALEMBANG', area: 'SS', regional: 'SUMATERA', remarks: 'Support DOP' },
    { dop: 'LAMPUNG', area: 'SS', regional: 'SUMATERA', remarks: 'Support DOP' },
    { dop: 'JAMBI', area: 'SS', regional: 'SUMATERA', remarks: 'Support DOP' },
    { dop: 'BALIKPAPAN', area: 'KAL', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'BANJARMASIN', area: 'KAL', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'PONTIANAK', area: 'KAL', regional: 'KALIMANTAN', remarks: 'Support DOP' },
    { dop: 'SURABAYA', area: 'EJ', regional: 'EAST JAVA & BALINUSRA', remarks: 'Support DOP' },
    { dop: 'JEMBER', area: 'EJ', regional: 'EAST JAVA & BALINUSRA', remarks: 'Support DOP' },
    { dop: 'KEDIRI', area: 'EJ', regional: 'EAST JAVA & BALINUSRA', remarks: 'Support DOP' },
    { dop: 'DENPASAR', area: 'BALNUS', regional: 'EAST JAVA & BALINUSRA', remarks: 'Support DOP' },
  ],
}

const uniqueValues = <T extends string>(values: T[]) =>
  Array.from(new Set(values)).sort((first, second) =>
    first.localeCompare(second),
  )

export const getDopReferencesForCustomer = (customer: string) =>
  customerDopReferences[customer as CustomerOption] ??
  Object.values(customerDopReferences).flat()

export const getDopReference = (customer: string, dop: string) =>
  getDopReferencesForCustomer(customer).find((item) => item.dop === dop)

export const getAreaOptionsForCustomer = (customer: string) =>
  uniqueValues(getDopReferencesForCustomer(customer).map((item) => item.area))

export const getDopOptionsForCustomer = (customer: string) =>
  uniqueValues(getDopReferencesForCustomer(customer).map((item) => item.dop))

export const getRegionalOptionsForCustomer = (customer: string) =>
  uniqueValues(getDopReferencesForCustomer(customer).map((item) => item.regional))

export const areaOptions = uniqueValues(
  Object.values(customerDopReferences)
    .flat()
    .map((item) => item.area),
)

export const dopOptions = uniqueValues(
  Object.values(customerDopReferences)
    .flat()
    .map((item) => item.dop),
)

export const categoryMaterialOptions = [
  'iPaso',
  'IPASOLINK',
  'Hybrid',
  'MW',
  'PDH',
] as const

export const typeMaterialOptions = ['PDH', 'MW'] as const

export const descriptionOptions = [
  'TRP-7G-2E SB G Low',
  'MODEM-EV',
  'iPaso400 IDU (16E1+2FE+2GBE) w/ 1 Modems (1+0) 100Mbps MDP-400MB-1AA',
  'TRP-7G-2E SB K High',
  'TRP-7G-2E SB K Low',
  'MODEM-A',
  'iPASO400 IDU (16E1+2FE+2GbE) w/ 2 Modems (1+1) 150Mbps MDP-400MB-1AA',
  'FAN-MV',
  'GbE4f-AV w/o SFP',
  'FAN-C',
  'PS-A4',
  'MODEM-EA',
  'TRP-8G-1E SB C High',
  'FAN-M',
  'TRP-15G-1E SB M High',
  'TRP-15G-1E SB M Low',
  'IPASO VR4 IDUMDP-1200MB-1AA',
  'TRP-6G-2F SB F HIGH (IAP3)',
  'IPASO VR 4 ADV, MDP-1200MB-1AA',
  'iPASO VR4 IDUMDP-1200MB-1AA',
  'IPASO VR10 MDP-1200MB-1BB',
  'Hybrid 7/8G',
  'TRP-32G-1E SB B Low, ANT Type',
  'MC-MV',
  'TRP-23G-1E SB C High, ANT Type',
] as const

export const partNumberOptions = [
  'NWA-084117',
  'NWA-A03700-102',
  'NWA-055268',
  'NWA-055300-202',
  'NWA-096329-002',
  'NWA-A02629-002',
  'NWA-055294-001',
  'NWA-055310-001',
  'NWA-074398-422',
  'NWA-078614',
  'NWA-061376',
  'NWA-078618',
  '00298B00016200002A',
  '002DBE000004000002',
  '002C3C0001F6000001',
  'NWA-033801-001',
  'NWA-078623',
  'NWA-096332-003',
  'NWA-078620',
] as const

export const supportOriginMaterialOptions = [
  'Palembang',
  'Jakarta',
  'Surabaya',
  'MS AVIAT MARUNDA',
  'MS AVIAT PALEMBANG',
  'MS AVIAT JAKARTA',
  'Warehouse Jakarta',
  'Warehouse Surabaya',
  'Warehouse Makassar',
  'Regional Stock',
  'Vendor Direct',
] as const

export const supportDestinationMaterialOptions = [...dopOptions] as const

export const severityOptions = ['NON CRITICAL', 'CRITICAL'] as const

export const regionalOptions = [
  ...uniqueValues(
    Object.values(customerDopReferences)
      .flat()
      .map((item) => item.regional),
  ),
  'SUMBAGSEL',
  'SUMBAGTENG',
  'SUMBAGUT',
  'JABODETABEK',
  'JAWA BARAT',
  'JAWA TENGAH',
  'JAWA TIMUR',
  'BALINUSRA',
  'KALIMANTAN',
  'SULAWESI',
  'MALUKU PAPUA',
] as const

export const requestorOptions = [
  'HD Mitratel',
  'Adi Pratama',
  'Insan Pryandi',
  'Mulyadi',
  'Mayda Manurung',
  'Toni Hutapea',
] as const

export const requestorContactMap: Record<
  string,
  { email: string; phone: string }
> = {
  'HD Mitratel': {
    email: '',
    phone: '',
  },
  'Adi Pratama': {
    email: 'adi.pratama@telkominfra.com',
    phone: '085268498420',
  },
  'Insan Pryandi': {
    email: 'insan.priyandi@telkominfra.com',
    phone: '085267190871',
  },
  Mulyadi: {
    email: 'mulyadi.tet@telkominfra.com',
    phone: '082185955989',
  },
  'Mayda Manurung': {
    email: 'mayida.manurung@ccsindo.com',
    phone: '08152523888',
  },
  'Toni Hutapea': {
    email: 'toni@persada.id',
    phone: '085211839768053',
  },
}

export const picKancabOptions = [
  'Ahmad Saepulloh',
  'Gairah Prabu',
  'Bambang',
  'Yogi',
  'Frid Gres',
  'Mahyudin Lubis',
  'Putu',
  'Dwi Anggoro',
  'Syahdianto',
  'Arief',
  'Abidin / Hendi',
] as const

export const picKancabContactMap: Record<
  string,
  { email: string; phone: string }
> = {
  'Ahmad Saepulloh': {
    email: 'ahmad.saepulloh@aviat.id',
    phone: '081200001001',
  },
  'Gairah Prabu': {
    email: 'gairah.prabu@aviat.id',
    phone: '081200001002',
  },
  Bambang: {
    email: 'bambang@aviat.id',
    phone: '081200001003',
  },
  Yogi: {
    email: 'yogi@aviat.id',
    phone: '081200001004',
  },
  'Frid Gres': {
    email: 'frid.gres@aviat.id',
    phone: '081200001005',
  },
  'Mahyudin Lubis': {
    email: 'mahyudin.lubis@aviat.id',
    phone: '081200001006',
  },
  Putu: {
    email: 'putu@aviat.id',
    phone: '081200001007',
  },
  'Dwi Anggoro': {
    email: 'dwi.anggoro@aviat.id',
    phone: '081200001008',
  },
  Syahdianto: {
    email: 'syahdianto@aviat.id',
    phone: '081200001009',
  },
  Arief: {
    email: 'arief@aviat.id',
    phone: '081200001010',
  },
  'Abidin / Hendi': {
    email: 'abidin.hendi@aviat.id',
    phone: '081200001011',
  },
}

export const statusTransactionOptions = ['OOW', 'ARF', 'Warr'] as const

export const lspOptions = [
  'MS AVIAT MARUNDA',
  'WAREHOUSE JAKARTA',
  'WAREHOUSE SURABAYA',
  'WAREHOUSE MAKASSAR',
  'REGIONAL STOCK',
  'VENDOR DIRECT',
  'JAKARTA',
  'BANDUNG',
  'SURABAYA',
  'MEDAN',
  'MAKASSAR',
  'SEMARANG',
  'BALI',
  'BALIKPAPAN',
  'PALEMBANG',
  'AMBON',
  'BATURAJA',
  'SAMARINDA',
  'SORONG',
  'BELITUNG',
  'BENGKULU',
  'GORONTALO',
  'JAMBI',
  'KUPANG',
  'LUBUK LINGGAU',
  'MUARA BUNGO',
  'BANDAR LAMPUNG',
  'BANGKA',
  'BANJARMASIN',
  'DENPASAR',
  'JAYAPURA',
  'KENDARI',
  'MATARAM',
  'MAUMERE',
  'PALANGKARAYA',
] as const

export const stockStatusOptions = [
  'READY',
  'WAITING APPROVAL',
  'IN USE',
  'DELIVERED',
  'RETURNED',
  'FAULTY',
] as const

export const systemLabelOptions = ['COMPLETE', 'NOT COMPLETE'] as const

export const reservationStatusOptions = [
  'DRAFT',
  'WAITING APPROVAL',
  'RESERVED',
  'ALLOCATED',
  'RELEASED',
] as const

export const approvalStatusOptions = [
  'DRAFT',
  'PENDING APPROVAL',
  'APPROVED',
  'REJECTED',
] as const

export const closedStatusOptions = ['PENDING CUSTOMER', 'CLOSED'] as const

export const deliveryStatusOptions = [
  'OPEN',
  'WAITING ADMIN APPROVAL',
  'WAITING PIC BA REGION',
  'READY FOR DELIVERY',
  'DELIVERY PROCESS',
  'DELIVERED',
  'FAULTY',
  'CLOSED',
] as const

export const defaultBaType = 'Material Delivery Note'

export const baTypeOptions = [
  defaultBaType,
  'MATERIAL DELIVERY NC',
  'MATERIAL DELIVERY RETURN',
  'MATERIAL SWAP',
  'MATERIAL BORROWING',
] as const

export const returnStatusOptions = [
  'OPEN',
  'UNRETURN',
  'ROK',
  'Faulty',
  'RETURN',
  'GOOD',
  'FAULTY',
  'PARTIAL',
  'NOT RETURNED',
] as const

export const pickupStatusOptions = ['ROK', 'FAULTY'] as const

export const slaHourOptions = ['02:00:00', '04:00:00', '24:00:00'] as const
