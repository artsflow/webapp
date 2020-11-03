export interface AuthData {
  token: string
  email: string
  issuer: string | null
}

export interface UserInfo {
  emailVerified: boolean
  familyName: string
  givenName: string
  picture: string
  locale: string
  name: string
}

export enum UserRole {
  USER = 'USER',
  PRACTITIONER = 'PRACTITIONER',
}

export interface User {
  firstName?: string
  lastName?: string
  picture?: string
  name?: string
  role: UserRole
}
