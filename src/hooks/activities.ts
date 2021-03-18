import { useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { UserContext } from 'lib/context'

import { firestore } from 'lib/firebase'

export function useActivities() {
  const { user } = useContext(UserContext)
  const [activities, loading, error] = useCollectionData(
    user.id && firestore.collection('activities').where('userId', '==', user.id),
    {
      idField: 'id',
    }
  ) as any

  return [activities, loading, error]
}
