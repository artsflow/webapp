import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAqtqxeQK5-uLGC7iON1Ta-Q8QxXD0qIZ4',
  authDomain: 'artsflow-com.firebaseapp.com',
  projectId: 'artsflow-com',
  storageBucket: 'artsflow-com.appspot.com',
  messagingSenderId: '804828781243',
  appId: '1:804828781243:web:1e37a98f1384cfd1afa79e',
  measurementId: 'G-03GSHJRZVE',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// Auth exports
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

// Firestore exports
export const firestore = firebase.firestore()
export const { serverTimestamp } = firebase.firestore.FieldValue
export const { fromMillis } = firebase.firestore.Timestamp
export const { increment } = firebase.firestore.FieldValue

// Storage exports
export const storage = firebase.storage()
export const { STATE_CHANGED } = firebase.storage.TaskEvent

/// Helper functions
export async function getUserWithUsername(username: string) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

export function postToJSON(doc: any) {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}
