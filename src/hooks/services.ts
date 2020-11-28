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

const GET_SERVICE = gql`
  query getService($id: String!) {
    getService(id: $id) {
      id
      category
      title
      description
      address {
        streetNumber
        streetName
        municipality
        countrySubdivision
        postalCode
        country
        countryCode
        freeformAddress
        position {
          lat
          lon
        }
      }
    }
  }
`

export function useService(id: string) {
  const { data, isValidating } = useSWR(
    id && id !== 'add' ? [GET_SERVICE, id] : null,
    (q: string) => client.request(q, { id }),
    { revalidateOnFocus: false }
  )
  return { data: data?.getService, loading: isValidating }
}

const UPDATE_SERVICE = gql`
  mutation updateService($input: ServiceInput!) {
    updateService(input: $input)
  }
`

export async function updateService(ctx: any) {
  console.log('updateService:', ctx)
  const variables = { input: { ...ctx } }
  await client.request(UPDATE_SERVICE, variables)
}
