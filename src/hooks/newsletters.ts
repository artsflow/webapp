import { useState, useEffect } from 'react'

import { useCollectionData } from 'react-firebase-hooks/firestore'

import { firestore } from 'lib/firebase'
import { getServerStats, getNewsletterEvents } from 'api'
import { useUserData } from './user'

export function useAudience() {
  const { user } = useUserData()
  const [audience = [], loading, error] = useCollectionData(
    user.id &&
      firestore.collection('audience').where('userId', '==', user.id).orderBy('createdAt', 'desc'),
    {
      idField: 'id',
    }
  ) as any

  return [audience, loading, error]
}

export function useSentNewsletters() {
  const { user } = useUserData()
  const [sent = [], loading, error] = useCollectionData(
    user.id &&
      firestore
        .collection('newsletters')
        .where('userId', '==', user.id)
        .orderBy('createdAt', 'desc'),
    {
      idField: 'id',
    }
  ) as any

  return [sent, loading, error]
}

export function useNewsletterEvents(id: string) {
  const [messages, setMessages] = useState([]) as any
  const [loading, setLoading] = useState(true)

  const run = async () => {
    const m = await getNewsletterEvents(id)
    if (m) setMessages(m.data || [])
    setLoading(false)
  }

  useEffect(() => {
    run()
  }, [])

  return [messages, loading]
}

export function useNewsletterStats() {
  const [stats, setStats] = useState([]) as any
  const [loading, setLoading] = useState(true)

  const getStats = async () => {
    const s = await getServerStats()
    if (s) setStats(s.data || [])
    setLoading(false)
  }

  useEffect(() => {
    getStats()
  }, [])

  return [stats, loading]
}
