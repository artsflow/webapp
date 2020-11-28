import { GraphQLClient } from 'graphql-request'

import { API_URL } from 'lib/config'

export const client = new GraphQLClient(`${API_URL}/graphql`, {
  credentials: 'include',
})

export const makeClient = (reqCookies: string) =>
  new GraphQLClient(`${API_URL}/graphql`, {
    credentials: 'include',
    headers: { cookie: reqCookies },
  })
