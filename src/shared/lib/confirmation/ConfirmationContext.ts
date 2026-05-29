import { createContext } from 'react'

export type ConfirmationOptions = {
  cancelLabel?: string
  confirmLabel?: string
  description?: string
  title: string
  tone?: 'primary' | 'danger'
}

export type ConfirmationContextValue = {
  confirm: (options: ConfirmationOptions) => Promise<boolean>
}

export const ConfirmationContext =
  createContext<ConfirmationContextValue | null>(null)
