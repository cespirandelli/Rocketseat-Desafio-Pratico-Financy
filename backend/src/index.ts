import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { buildSchema } from 'type-graphql'
import { buildContext, GraphqlContext } from './graphql/context'
import { AuthResolver } from './resolvers/auth.resolver'
import { UserResolver } from './resolvers/user.resolver'
import { CategoryResolver } from './resolvers/category.resolver'
import { TransactionResolver } from './resolvers/transaction.resolver'

async function bootstrap() {
  const app = express()
  const port = Number(process.env.PORT ?? 4000)

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') ?? true,
      credentials: true,
    })
  )

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    validate: false,
  })

  const server = new ApolloServer<GraphqlContext>({ schema })
  await server.start()

  app.use('/graphql', express.json(), expressMiddleware(server, { context: buildContext }))

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/graphql`)
  })
}

bootstrap()
