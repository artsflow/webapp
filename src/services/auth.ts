import { GraphQLClient, gql } from 'graphql-request'
import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'
import { pick } from 'lodash'

import { API_URL } from 'lib/config'

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

  const client = new GraphQLClient(`${API_URL}/graphql`, {
    credentials: 'include',
    headers: {
      authorization: `Bearer ${didToken}`,
    },
  })

  return client.request(LOGIN)
}

export async function loginWithGoogle() {
  const magic = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
    extensions: [new OAuthExtension()],
  })

  const result = await magic.oauth.getRedirectResult()

  const client = new GraphQLClient(`${API_URL}/graphql`, {
    credentials: 'include',
    headers: {
      authorization: `Bearer ${result.magic.idToken}`,
    },
  })

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
  console.log('logout')
  const client = new GraphQLClient(`${API_URL}/graphql`, {
    credentials: 'include',
  })

  return client.request(LOGOUT)
}
