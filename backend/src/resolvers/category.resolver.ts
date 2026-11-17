import {
  Arg,
  FieldResolver,
  Float,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { CategoryModel } from '../models/category.model'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { CategoryService } from '../services/category.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { CurrentUserId } from '../graphql/decorators/user.decorator'

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Query(() => [CategoryModel])
  async categories(@CurrentUserId() userId: string) {
    return this.categoryService.list(userId)
  }

  @Query(() => CategoryModel)
  async category(
    @Arg('id', () => ID) id: string,
    @CurrentUserId() userId: string
  ) {
    return this.categoryService.findOwned(id, userId)
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @CurrentUserId() userId: string
  ) {
    return this.categoryService.create(data, userId)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @CurrentUserId() userId: string
  ) {
    return this.categoryService.update(id, data, userId)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id', () => ID) id: string,
    @CurrentUserId() userId: string
  ) {
    return this.categoryService.delete(id, userId)
  }

  @FieldResolver(() => Int)
  async transactionsCount(@Root() category: CategoryModel) {
    return this.categoryService.countTransactions(category.id)
  }

  @FieldResolver(() => Float)
  async totalAmount(@Root() category: CategoryModel) {
    return this.categoryService.sumTransactions(category.id)
  }
}
