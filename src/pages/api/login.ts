import { NextApiRequest, NextApiResponse } from 'next'
import { magic } from 'lib/magic'
import { omit } from 'lodash'

import { createSession } from 'lib/auth-cookies'
import { createHandlers } from 'lib/rest-utils'
import * as userModel from 'lib/models/user'
import { UserInfo } from 'lib/types'

const handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    const authorization: string = req.headers.authorization as string

    const didToken = magic.utils.parseAuthorizationHeader(authorization)
    const { email, issuer } = await magic.users.getMetadataByToken(didToken)

    if (!email) {
      return res.status(401).end('Unauthorized')
    }

    const userInfo: UserInfo | undefined = req.body.userInfo
      ? (omit(req.body.userInfo, ['sub', 'sources']) as UserInfo)
      : undefined

    const user =
      (await userModel.getUserByEmail(email)) ?? (await userModel.createUser(email, userInfo))
    const token = await userModel.obtainFaunaDBToken(user)

    if (!token) {
      return res.status(401).end('Unauthorized')
    }

    await createSession(res, { token, email, issuer })

    return res.status(200).send({ done: true })
  },
}

export default function login(req: NextApiRequest, res: NextApiResponse) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
