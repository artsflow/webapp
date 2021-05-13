import { firebaseCallable } from 'lib/firebase'

export const updateUserVerification = () => firebaseCallable('updateUserVerification', {})
export const checkUserFirstTime = () => firebaseCallable('checkUserFirstTime', {})
