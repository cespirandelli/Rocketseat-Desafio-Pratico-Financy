import { Arg, Mutation, Resolver } from 'type-graphql'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { AuthOutput } from '../dtos/output/auth.output'
import { AuthService } from '../services/auth.service'

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Mutation(() => AuthOutput)
  async register(@Arg('data', () => RegisterInput) data: RegisterInput) {
    return this.authService.register(data)
  }

  @Mutation(() => AuthOutput)
  async login(@Arg('data', () => LoginInput) data: LoginInput) {
    return this.authService.login(data)
  }
}
