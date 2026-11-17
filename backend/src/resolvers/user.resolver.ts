import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { UserModel } from '../models/user.model'
import { UpdateProfileInput } from '../dtos/input/user.input'
import { UserService } from '../services/user.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { CurrentUserId } from '../graphql/decorators/user.decorator'

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  private userService = new UserService()

  @Query(() => UserModel)
  async me(@CurrentUserId() userId: string) {
    return this.userService.findById(userId)
  }

  @Mutation(() => UserModel)
  async updateProfile(
    @Arg('data', () => UpdateProfileInput) data: UpdateProfileInput,
    @CurrentUserId() userId: string
  ) {
    return this.userService.updateProfile(userId, data)
  }
}
