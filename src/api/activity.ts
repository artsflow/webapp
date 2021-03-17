import { firebaseCallable } from 'lib/firebase'

export const addActivity = (activityData: any) => firebaseCallable('addActivity', activityData)
export const setActivityStatus = (data: any) => firebaseCallable('setActivityStatus', data)
export const deleteActivity = (data: any) => firebaseCallable('deleteActivity', data)
export const editActivity = (data: any) => firebaseCallable('editActivity', data)
