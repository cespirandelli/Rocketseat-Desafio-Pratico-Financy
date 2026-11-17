import { MiddlewareFn } from 'type-graphql'
import { GraphqlContext } from '../graphql/context'
import { unauthorized } from '../utils/errors'

export const IsAuth: MiddlewareFn<GraphqlContext> = async ({ context }, next) => {
  if (!context.userId) throw unauthorized()
  return next()
}
