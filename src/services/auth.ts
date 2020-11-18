import { gql } from 'graphql-request'
import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'
import { pick } from 'lodash'

import { client } from 'services/client'

const NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string = process.env
  .NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string

const LOGIN = gql`
  mutation login($userInfo: UserInfo) {
    login(userInfo: $userInfo) {
      ok
      error
    }
  }
`

export async function loginWithEmail(email: string) {
  const magic = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)

  const didToken = (await magic.auth.loginWithMagicLink({ email })) as string
  client.setHeaders({ authorization: `Bearer ${didToken}` })

  return client.request(LOGIN)
}

export async function loginWithGoogle() {
  const magic = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
    extensions: [new OAuthExtension()],
  })

  const result = await magic.oauth.getRedirectResult()

  client.setHeaders({ authorization: `Bearer ${result.magic.idToken}` })

  const userInfo = pick(result.oauth.userInfo, [
    'emailVerified',
    'familyName',
    'givenName',
    'picture',
    'locale',
    'name',
  ])

  return client.request(LOGIN, { userInfo })
}

const LOGOUT = gql`
  mutation {
    logout
  }
`

export function logout() {
  return client.request(LOGOUT)
}
