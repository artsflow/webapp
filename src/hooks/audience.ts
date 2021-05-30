import { useCollectionData } from 'react-firebase-hooks/firestore'

import { firestore } from 'lib/firebase'
import { useUserData } from './user'

export function useAudience() {
  const { user } = useUserData()
  const [audience, loading, error] = useCollectionData(
    user.id &&
      firestore.collection('audience').where('userId', '==', user.id).orderBy('createdAt', 'desc'),
    {
      idField: 'id',
    }
  ) as any

  return [audience, loading, error]
}
