import { ExprArg } from 'faunadb'
import { q, adminClient, getClient } from '../faunadb'

export const createUser = async (email: string) =>
  adminClient.query(
    q.Create(q.Collection('users'), {
      data: { email },
    })
  )

export const getUserByEmail = async (email: string) =>
  adminClient.query(q.Get(q.Match(q.Index('users_by_email'), email))).catch(() => undefined)

interface Response {
  secret?: string
}

export const obtainFaunaDBToken = async (user: ExprArg) =>
  adminClient
    .query(q.Create(q.Tokens(), { instance: q.Select('ref', user) }))
    .then((res: Response) => res?.secret)
    .catch(() => undefined)

export const invalidateFaunaDBToken = async (token: string) =>
  getClient(token).query(q.Logout(true))
