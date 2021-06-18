import { useState, useEffect } from 'react'
import { subDays, eachDayOfInterval, format } from 'date-fns'

import { getActivityViews } from 'api'

const LENGTH = 6

interface DayCount {
  date: { value: string }
  count: number
}

const getDayViewsCount = (days: DayCount[], day: string) =>
  days.find((d) => format(new Date(d.date.value), 'dd MMM') === day)?.count || 0

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
      y: getDayViewsCount(views, format(d, 'dd MMM')),
    }))

    setData(viewData)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return [data, loading]
}
