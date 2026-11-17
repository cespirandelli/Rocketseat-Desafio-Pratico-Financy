import { createParameterDecorator, ResolverData } from 'type-graphql'
import { GraphqlContext } from '../context'
import { unauthorized } from '../../utils/errors'

export function CurrentUserId() {
  return createParameterDecorator(({ context }: ResolverData<GraphqlContext>) => {
    if (!context.userId) throw unauthorized()
    return context.userId
  })
}
