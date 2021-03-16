import { firebaseCallable } from 'lib/firebase'

export const addActivity = (activityData: any) => firebaseCallable('addActivity', activityData)
