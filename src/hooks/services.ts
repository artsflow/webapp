import { gql } from 'graphql-request'
import useSWR, { mutate } from 'swr'
import Router from 'next/router'
import { omit } from 'lodash'

import { client, makeClient } from 'services/client'
import { nextStep } from 'components/Service/config'

const LIST_SERVICES = gql`
  query {
    listServices {
      id
      title
      step
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
      images
      video
      duration
      frequency {
        rrules
        exdate
      }
      capacity
      price
      step
      published
    }
  }
`

export const fetchService = (id: string, reqCookies: any) => {
  const serverClient = makeClient(reqCookies)
  return serverClient.request(GET_SERVICE, { id })
}

export function useService(id: string, initialData = {}) {
  const { data, isValidating } = useSWR(
    id && id !== 'add' ? [GET_SERVICE, id] : null,
    (q: string) => client.request(q, { id }),
    { initialData, revalidateOnFocus: false }
  )

  return { data: data?.getService, loading: isValidating }
}

const UPDATE_SERVICE = gql`
  mutation updateService($input: ServiceInput!) {
    updateService(input: $input)
  }
`

export async function updateService(ctx: any) {
  console.log('updateService')
  if (!ctx.meta.isDirty) return false
  const variables = { input: { ...omit(ctx, ['meta']) } }
  return client.request(UPDATE_SERVICE, variables)
}

const ADD_SERVICE = gql`
  mutation addService($input: ServiceInput!) {
    addService(input: $input)
  }
`
export async function addService(ctx: any) {
  console.log('addService:', ctx)
  if (ctx.id) return

  const variables = { input: { ...omit(ctx, ['meta']), step: nextStep(ctx.step) } }
  const res = await client.request(ADD_SERVICE, variables)

  Router.replace(`/service/${res.addService}`)
}
