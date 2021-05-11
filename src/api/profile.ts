import { firebaseCallable } from 'lib/firebase'

interface ProfileData {
  firstName: string
  lastName: string
  bio: string
}

export const updateProfile = (profileData: ProfileData) =>
  firebaseCallable('updateProfile', profileData)

export const updateAvatarUrl = (photoURL: string) =>
  firebaseCallable('updateAvatarUrl', { photoURL })
