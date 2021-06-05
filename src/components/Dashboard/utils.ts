import { sumBy } from 'lodash'
import { subDays, fromUnixTime, eachDayOfInterval, format } from 'date-fns'

export interface BookingInfo {
  createdAt: {
    seconds: number
  }
  amount: string | number
}

export const getIncomeLast7d = (data: BookingInfo[]) => {
  const LENGTH = 6
  const newData = data
    .filter((b: BookingInfo) => fromUnixTime(b.createdAt.seconds) >= subDays(new Date(), LENGTH))
    .sort((a: BookingInfo, b: BookingInfo) => a.createdAt.seconds - b.createdAt.seconds)
    .map((b: BookingInfo) => ({
      amount: Number(b.amount) / 100,
      date: format(fromUnixTime(b.createdAt.seconds), 'dd MMM'),
    }))

  return eachDayOfInterval({
    start: subDays(new Date(), LENGTH),
    end: new Date(),
  }).map((d) => ({
    x: format(d, 'dd MMM'),
    y: sumBy(
      newData.filter((b) => b.date === format(d, 'dd MMM')),
      'amount'
    ),
  }))
}
