import Iron from '@hapi/iron'

import { AuthData } from './types'

const ENCRYPTION_SECRET: string = process.env.ENCRYPTION_SECRET as string

export async function encrypt(data: AuthData) {
  return data && Iron.seal(data, ENCRYPTION_SECRET, Iron.defaults)
}

export async function decrypt(data: string) {
  return data && Iron.unseal(data, ENCRYPTION_SECRET, Iron.defaults)
}
