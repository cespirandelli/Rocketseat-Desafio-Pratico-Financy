import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { TransactionModel } from '../models/transaction.model'
import { CategoryModel } from '../models/category.model'
import {
  CreateTransactionInput,
  PaginationInput,
  TransactionFilterInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { FinancialSummary, TransactionPage } from '../dtos/output/transaction.output'
import { TransactionService } from '../services/transaction.service'
import { prismaClient } from '../../prisma/prisma'
import { IsAuth } from '../middlewares/auth.middleware'
import { CurrentUserId } from '../graphql/decorators/user.decorator'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()

  @Query(() => TransactionPage)
  async transactions(
    @CurrentUserId() userId: string,
    @Arg('filter', () => TransactionFilterInput, { nullable: true })
    filter?: TransactionFilterInput,
    @Arg('pagination', () => PaginationInput, { nullable: true })
    pagination?: PaginationInput
  ) {
    return this.transactionService.list(userId, filter, pagination)
  }

  @Query(() => FinancialSummary)
  async summary(
    @CurrentUserId() userId: string,
    @Arg('period', () => String, { nullable: true }) period?: string
  ) {
    return this.transactionService.summary(userId, period)
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @CurrentUserId() userId: string
  ) {
    return this.transactionService.create(data, userId)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
    @CurrentUserId() userId: string
  ) {
    return this.transactionService.update(id, data, userId)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id', () => ID) id: string,
    @CurrentUserId() userId: string
  ) {
    return this.transactionService.delete(id, userId)
  }

  @FieldResolver(() => CategoryModel, { nullable: true })
  async category(@Root() transaction: TransactionModel) {
    if (!transaction.categoryId) return null
    return prismaClient.category.findUnique({ where: { id: transaction.categoryId } })
  }
}
