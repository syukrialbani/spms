export const getSlaHoursForSeverity = (severity: string) => {
  if (severity === 'CRITICAL') {
    return '04:00:00'
  }

  if (severity === 'NON CRITICAL') {
    return '24:00:00'
  }

  return ''
}

export const getAutoPickupStatus = (
  values: {
    deliveryStatus?: string
    pickupEvidenceFileName?: string
    statusReturn?: string
  },
  deliveryStatus = values.deliveryStatus,
) => {
  const selectedPickupStatus =
    values.statusReturn === 'FAULTY' || values.statusReturn === 'Faulty'
      ? 'FAULTY'
      : values.statusReturn === 'ROK'
        ? 'ROK'
        : ''

  if (values.pickupEvidenceFileName) {
    return selectedPickupStatus || 'UNRETURN'
  }

  if (deliveryStatus === 'DELIVERED') {
    return 'UNRETURN'
  }

  return 'OPEN'
}
