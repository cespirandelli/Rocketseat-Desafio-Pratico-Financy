import { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { verifyJwt } from '../../utils/jwt'

export type GraphqlContext = {
  userId?: string
}

export async function buildContext({
  req,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) return {}

  try {
    const payload = verifyJwt(authorization.slice('Bearer '.length))
    return { userId: payload.id }
  } catch {
    return {}
  }
}
