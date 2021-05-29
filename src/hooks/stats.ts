import { useState, useEffect } from 'react'

import { getServerStats } from 'api'

export function useNewsletterStats() {
  const [stats, setStats] = useState({ verified: true }) as any
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
