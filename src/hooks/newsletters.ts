import { useState, useEffect } from 'react'

import { useCollectionData } from 'react-firebase-hooks/firestore'

import { firestore } from 'lib/firebase'
import { getServerStats, getSentMessages, getSentMessage } from 'api'
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

export function useSentMessages() {
  const [messages, setMessages] = useState([]) as any
  const [loading, setLoading] = useState(true)

  const run = async () => {
    const m = await getSentMessages()
    if (m) setMessages(m.data || [])
    setLoading(false)
  }

  useEffect(() => {
    run()
  }, [])

  return [messages, loading]
}

export function useSentMessage(id: string) {
  const [message, setMessage] = useState() as any
  const [loading, setLoading] = useState(true)

  const run = async () => {
    const m = await getSentMessage(id)
    if (m) setMessage(m.data || [])
    setLoading(false)
  }

  useEffect(() => {
    run()
  }, [])

  return [message, loading]
}
