import { GraphQLError } from 'graphql'

export function badRequest(message: string) {
  return new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } })
}

export function notFound(message: string) {
  return new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } })
}

export function unauthorized(message = 'Usuário não autenticado') {
  return new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED' } })
}
