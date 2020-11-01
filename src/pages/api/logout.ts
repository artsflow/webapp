import { NextApiRequest, NextApiResponse } from 'next'
import { magic } from 'lib/magic'
import { getSession, removeSession } from 'lib/auth-cookies'
import { createHandlers } from 'lib/rest-utils'
import * as userModel from 'lib/models/user'

const handlers = {
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req)

    if (!session) {
      res.writeHead(302, { Location: '/' })
      res.end()
    } else {
      const { token, issuer } = session

      await Promise.all([
        magic.users.logoutByIssuer(issuer),
        userModel.invalidateFaunaDBToken(token),
      ])

      removeSession(res)

      res.writeHead(302, { Location: '/' })
      res.end()
    }
  },
}

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
