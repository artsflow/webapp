import { firebaseCallable } from 'lib/firebase'

export const getStripeAccountStatus = () => firebaseCallable('getStripeAccountStatus', {})
