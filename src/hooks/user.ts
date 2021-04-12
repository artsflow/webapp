import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth, firestore } from 'lib/firebase'

export function useUserData() {
  const [authState, authLoading] = useAuthState(auth)
  const [user, setUser] = useState({}) as any
  const [userLoading, setUserLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profile, setProfile] = useState({}) as any

  const loading = authLoading || userLoading || profileLoading

  console.log('useUserData', authLoading, userLoading, profileLoading)

  useEffect(() => {
    let unsubscribe
    setUserLoading(true)

    if (authState) {
      const ref = firestore.collection('users').doc(authState.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        setUser({ ...doc.data(), id: authState.uid })
        setUserLoading(false)
      })
    } else {
      setUser({})
      setUserLoading(false)
    }

    return unsubscribe
  }, [authState])

  useEffect(() => {
    let unsubscribe
    setProfileLoading(true)

    if (authState) {
      const ref = firestore.collection('profiles').doc(authState.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        setProfile(doc.data())
        setProfileLoading(false)
      })
    } else {
      setProfile({})
      setProfileLoading(false)
    }

    return unsubscribe
  }, [authState])

  return { authState, user, profile, loading }
}
