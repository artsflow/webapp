import { firebaseCallable } from 'lib/firebase'

export const sendNewsletter = (data: any) => firebaseCallable('sendNewsletter', data)
export const getServerStats = () => firebaseCallable('getServerStats', {})
export const giveConsent = () => firebaseCallable('giveConsent', {})
export const importCSV = (list: any) => firebaseCallable('importCSV', list)
export const getSentMessages = () => firebaseCallable('getSentMessages', {})
export const getSentMessage = (id: string) => firebaseCallable('getSentMessage', id)
