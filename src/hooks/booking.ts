import { useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { UserContext } from 'lib/context'

import { firestore } from 'lib/firebase'

export function useBookings() {
  const { user } = useContext(UserContext)
  const [bookings, loading, error] = useCollectionData(
    user.id &&
      firestore
        .collection('bookings')
        .where('creativeId', '==', user.id)
        .orderBy('createdAt', 'desc'),
    {
      idField: 'id',
    }
  ) as any

  return [bookings, loading, error]
}
