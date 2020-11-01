import faunadb from 'faunadb'

const FAUNADB_SECRET_KEY: string = process.env.FAUNADB_SECRET_KEY as string

export const q = faunadb.query

export function getClient(secret: string) {
  return new faunadb.Client({ secret })
}

export const adminClient = getClient(FAUNADB_SECRET_KEY)
