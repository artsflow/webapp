import { firebaseCallable } from 'lib/firebase'

interface ProfileData {
  firstName: string
  lastName: string
  address: string
  bio: string
}

export const updateProfile = (profileData: ProfileData) =>
  firebaseCallable('updateProfile', profileData)
