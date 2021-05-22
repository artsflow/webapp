import { useState, useEffect } from 'react'
import { subDays, eachDayOfInterval, format } from 'date-fns'

import { getActivityViews } from 'api'

const LENGTH = 6

interface DayCount {
  day: number
  count: number
}

const getDayViewsCount = (days: DayCount[], day: number) =>
  days.find((d) => d.day === day)?.count || 0

export function useActivityViews() {
  const [data, setData] = useState([]) as any
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    const res = await getActivityViews()
    const views = res?.data?.flat() || []

    const viewData = eachDayOfInterval({
      start: subDays(new Date(), LENGTH),
      end: new Date(),
    }).map((d) => ({
      x: format(d, 'dd MMM'),
      y: getDayViewsCount(views, Number(format(d, 'dd'))),
    }))

    setData(viewData)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return [data, loading]
}
