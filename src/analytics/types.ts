export interface UserProps {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  name: string
  provider: string
}

export interface ProfileProps {
  firstName: string
  lastName: string
  name: string
  bio: string
}
