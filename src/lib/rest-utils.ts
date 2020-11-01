import { NextApiRequest, NextApiResponse } from 'next'

interface Handlers {
  [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
}

export function createHandlers(handlers: Handlers) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method: string = req.method as string

    const handler = handlers[method]

    if (handler) {
      try {
        await handler(req, res)
      } catch (err) {
        res.status(err.status || 500).end(err.message)
      }
    } else {
      res.setHeader('Allow', Object.keys(handlers))
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
}
