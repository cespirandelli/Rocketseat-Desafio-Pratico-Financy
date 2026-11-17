import { Field, Float, Int, ObjectType } from 'type-graphql'
import { TransactionModel } from '../../models/transaction.model'

@ObjectType()
export class TransactionPage {
  @Field(() => [TransactionModel])
  items: TransactionModel[]

  @Field(() => Int)
  total: number

  @Field(() => Int)
  page: number

  @Field(() => Int)
  perPage: number

  @Field(() => Int)
  totalPages: number
}

@ObjectType()
export class FinancialSummary {
  @Field(() => Float)
  balance: number

  @Field(() => Float)
  monthIncome: number

  @Field(() => Float)
  monthExpense: number
}
