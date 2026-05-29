import { useCallback, useEffect, useState } from 'react'

export type DevRole = 'ADMIN_1' | 'ADMIN_2' | 'ADMIN_3' | 'REQUESTOR'

const storageKey = 'spms.devRole'
const eventName = 'spms.devRoleChanged'

export const devRoleOptions: Array<{
  description: string
  label: string
  value: DevRole
}> = [
  {
    description: 'Approval 1',
    label: 'Admin 1',
    value: 'ADMIN_1',
  },
  {
    description: 'Approval 2',
    label: 'Admin 2',
    value: 'ADMIN_2',
  },
  {
    description: 'Closed in Customer',
    label: 'Admin 3',
    value: 'ADMIN_3',
  },
  {
    description: 'Upload BA only',
    label: 'Requestor',
    value: 'REQUESTOR',
  },
]

export const devRoleLabels = devRoleOptions.reduce(
  (result, option) => ({
    ...result,
    [option.value]: option.label,
  }),
  {} as Record<DevRole, string>,
)

const isDevRole = (value: string | null): value is DevRole =>
  value === 'ADMIN_1' ||
  value === 'ADMIN_2' ||
  value === 'ADMIN_3' ||
  value === 'REQUESTOR'

export const getDevRole = (): DevRole | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const role = window.localStorage.getItem(storageKey)

  return isDevRole(role) ? role : null
}

export const setDevRole = (role: DevRole | null) => {
  if (typeof window === 'undefined') {
    return
  }

  if (role) {
    window.localStorage.setItem(storageKey, role)
  } else {
    window.localStorage.removeItem(storageKey)
  }

  window.dispatchEvent(new CustomEvent(eventName))
}

export const useDevRole = () => {
  const [role, setRoleState] = useState<DevRole | null>(() => getDevRole())

  useEffect(() => {
    const syncRole = () => setRoleState(getDevRole())

    window.addEventListener(eventName, syncRole)
    window.addEventListener('storage', syncRole)

    return () => {
      window.removeEventListener(eventName, syncRole)
      window.removeEventListener('storage', syncRole)
    }
  }, [])

  const updateRole = useCallback((nextRole: DevRole | null) => {
    setDevRole(nextRole)
    setRoleState(nextRole)
  }, [])

  return {
    clearRole: () => updateRole(null),
    role,
    setRole: updateRole,
  }
}
