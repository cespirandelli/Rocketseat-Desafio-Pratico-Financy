import { Field, Float, InputType, Int } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model'

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  description: string

  @Field(() => Float)
  amount: number

  @Field(() => TransactionType)
  type: TransactionType

  @Field(() => String)
  date: string

  @Field(() => String)
  categoryId: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  date?: string

  @Field(() => String, { nullable: true })
  categoryId?: string
}

@InputType()
export class TransactionFilterInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => String, { nullable: true })
  period?: string
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number

  @Field(() => Int, { defaultValue: 10 })
  perPage: number
}
