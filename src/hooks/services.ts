import { gql } from 'graphql-request'
import useSWR, { mutate } from 'swr'

import { client } from 'services/client'

const LIST_SERVICES = gql`
  query {
    listServices {
      id
      title
      description
      published
    }
  }
`

const TOGGLE_SERVICE = gql`
  mutation toggleService($id: String!) {
    toggleService(id: $id)
  }
`

async function toggleService(id: string) {
  const res = await client.request(TOGGLE_SERVICE, { id })
  await mutate(LIST_SERVICES)
  return res
}

export function useServices() {
  const { data, isValidating } = useSWR(LIST_SERVICES)
  return { data: data?.listServices, loading: isValidating, toggleService }
}
