export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN_1'
  | 'ADMIN_2'
  | 'ADMIN_3'
  | 'REQUESTOR'
  | 'DRIVER'

export type User = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  gender?: string | null
  image?: string | null
  role?: UserRole | string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
