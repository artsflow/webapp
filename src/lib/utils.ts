import { omit, mapKeys, flow } from 'lodash/fp'
import { UserInfo, User } from 'lib/types'

export const transformUserInfo = (userInfo: UserInfo): User =>
  (flow(
    omit(['sub', 'sources', 'emailVerified', 'locale']),
    mapKeys((k: string) => {
      if (k === 'givenName') return 'firstName'
      if (k === 'familyName') return 'lastName'
      return k
    })
  ) as any)(userInfo)

export const isDev = () => process.env.NODE_ENV !== 'production'
