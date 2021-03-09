import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth, firestore } from 'lib/firebase'

export function useUserData() {
  const [authState, loading] = useAuthState(auth)
  const [user, setUser] = useState({}) as any
  const [profile, setProfile] = useState({}) as any
  console.log('useUserData')

  useEffect(() => {
    let unsubscribe

    if (authState) {
      const ref = firestore.collection('users').doc(authState.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        setUser(doc.data())
      })
    } else {
      setUser({})
    }

    return unsubscribe
  }, [authState])

  useEffect(() => {
    let unsubscribe

    if (authState) {
      const ref = firestore.collection('profiles').doc(authState.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        setProfile(doc.data())
      })
    } else {
      setProfile({})
    }

    return unsubscribe
  }, [authState])

  return { authState, user, profile, loading }
}
