const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const formatDate = (value: string) => dateFormatter.format(new Date(value))
