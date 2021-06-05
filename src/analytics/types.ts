export interface UserProps {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  displayName: string
  provider: string
}

export interface ProfileProps {
  firstName: string
  lastName: string
  displayName: string
  bio: string
}
