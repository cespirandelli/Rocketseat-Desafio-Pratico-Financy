import { Field, Float, GraphQLISODateTime, ID, Int, ObjectType } from 'type-graphql'

@ObjectType('Category')
export class CategoryModel {
  @Field(() => ID)
  id: string

  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String)
  icon: string

  @Field(() => String)
  color: string

  @Field(() => Int)
  transactionsCount?: number

  @Field(() => Float)
  totalAmount?: number

  @Field(() => GraphQLISODateTime)
  createdAt: Date

  @Field(() => GraphQLISODateTime)
  updatedAt: Date
}
