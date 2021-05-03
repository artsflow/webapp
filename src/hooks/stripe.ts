import { useState, useEffect } from 'react'

import { getStripeAccountStatus, getPayoutsData, getBalance } from 'api'

export function useAccountStatus() {
  const [status, setStatus] = useState({ verified: true }) as any
  const [loading, setLoading] = useState(true)

  const getStatus = async () => {
    const s = await getStripeAccountStatus()
    if (s) setStatus(s.data || {})
    setLoading(false)
  }

  useEffect(() => {
    getStatus()
  }, [])

  return [status, loading]
}

export function usePayoutsData() {
  const [data, setData] = useState({}) as any
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    const res = await getPayoutsData()
    if (res) setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return [data, loading]
}

export function useBalance() {
  const [data, setData] = useState({}) as any
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    const res = await getBalance()
    if (res) setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return [data, loading]
}
