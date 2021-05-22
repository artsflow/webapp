import { firebaseCallable } from 'lib/firebase'

export const getActivityViews = () => firebaseCallable('getActivityViews', {})
