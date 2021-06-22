import { sumBy } from 'lodash'
import { subDays, fromUnixTime, eachDayOfInterval, format } from 'date-fns'

export interface BookingInfo {
  createdAt: {
    seconds: number
  }
  amount: string | number
  isCancelled?: boolean
}

const LENGTH = 6

export const getIncomeLast7d = (data: BookingInfo[]) => {
  const newData = data
    .filter((b: BookingInfo) => fromUnixTime(b.createdAt.seconds) >= subDays(Date.now(), LENGTH))
    .sort((a: BookingInfo, b: BookingInfo) => a.createdAt.seconds - b.createdAt.seconds)
    .map((b: BookingInfo) => ({
      amount: Number(b.amount) / 100,
      date: format(fromUnixTime(b.createdAt.seconds), 'dd MMM'),
      isCancelled: b.isCancelled,
    }))

  return eachDayOfInterval({
    start: subDays(Date.now(), LENGTH),
    end: Date.now(),
  }).map((d) => ({
    x: format(d, 'dd MMM'),
    y: sumBy(
      newData.filter((b) => !b.isCancelled && b.date === format(d, 'dd MMM')),
      'amount'
    ),
  }))
}
