import { GraphQLClient } from 'graphql-request'

import { API_URL } from 'lib/config'
import { uploadXhr } from 'lib/xhr'

export const client = new GraphQLClient(`${API_URL}/graphql`, {
  credentials: 'include',
})

export const clientWithProgressUpload = (onProgress: any) =>
  new GraphQLClient(`${API_URL}/graphql`, {
    credentials: 'include',
    fetch: uploadXhr,
    // @ts-ignore
    onProgress,
  })

export const makeClient = (reqCookies: string) =>
  new GraphQLClient(`${API_URL}/graphql`, {
    credentials: 'include',
    headers: { cookie: reqCookies },
  })
