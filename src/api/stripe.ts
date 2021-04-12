import { firebaseCallable } from 'lib/firebase'

export const getPayoutsData = () => firebaseCallable('getPayoutsData', {})
export const getStripeAccountStatus = () => firebaseCallable('getStripeAccountStatus', {})
export const addStripeExternalAccount = (account: any) =>
  firebaseCallable('addStripeExternalAccount', { account })
