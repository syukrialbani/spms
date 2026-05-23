const idrFormatter = new Intl.NumberFormat('id-ID', {
  currency: 'IDR',
  maximumFractionDigits: 0,
  style: 'currency',
})

export const formatCurrency = (value: number) => idrFormatter.format(value)
