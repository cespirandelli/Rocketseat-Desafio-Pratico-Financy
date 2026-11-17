import { Prisma } from '@prisma/client'
import { prismaClient } from '../../prisma/prisma'
import {
  CreateTransactionInput,
  PaginationInput,
  TransactionFilterInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { TransactionType } from '../models/transaction.model'
import { badRequest, notFound } from '../utils/errors'
import { currentPeriod, parseDate, parsePeriod } from '../utils/period'

export class TransactionService {
  async list(userId: string, filter?: TransactionFilterInput, pagination?: PaginationInput) {
    const page = Math.max(1, pagination?.page ?? 1)
    const perPage = Math.min(100, Math.max(1, pagination?.perPage ?? 10))
    const where = this.buildWhere(userId, filter)

    const [items, total] = await prismaClient.$transaction([
      prismaClient.transaction.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prismaClient.transaction.count({ where }),
    ])

    return {
      items: items.map((item) => ({ ...item, type: item.type as TransactionType })),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    }
  }

  async summary(userId: string, period?: string) {
    const { start, end } = parsePeriod(period ?? currentPeriod())

    const [income, expense, monthIncome, monthExpense] = await prismaClient.$transaction([
      prismaClient.transaction.aggregate({
        where: { userId, type: 'income' },
        _sum: { amount: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: 'expense' },
        _sum: { amount: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: 'income', date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: 'expense', date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
    ])

    return {
      balance: (income._sum.amount ?? 0) - (expense._sum.amount ?? 0),
      monthIncome: monthIncome._sum.amount ?? 0,
      monthExpense: monthExpense._sum.amount ?? 0,
    }
  }

  async create(data: CreateTransactionInput, userId: string) {
    const description = data.description.trim()
    if (!description) throw badRequest('Informe a descrição')
    this.validateAmount(data.amount)
    await this.ensureCategory(data.categoryId, userId)

    const transaction = await prismaClient.transaction.create({
      data: {
        description,
        amount: data.amount,
        type: data.type,
        date: parseDate(data.date),
        categoryId: data.categoryId,
        userId,
      },
    })

    return { ...transaction, type: transaction.type as TransactionType }
  }

  async update(id: string, data: UpdateTransactionInput, userId: string) {
    await this.findOwned(id, userId)

    if (data.description !== undefined && !data.description.trim()) {
      throw badRequest('Informe a descrição')
    }
    if (data.amount !== undefined) this.validateAmount(data.amount)
    if (data.categoryId !== undefined) await this.ensureCategory(data.categoryId, userId)

    const transaction = await prismaClient.transaction.update({
      where: { id },
      data: {
        description: data.description?.trim(),
        amount: data.amount,
        type: data.type,
        date: data.date ? parseDate(data.date) : undefined,
        categoryId: data.categoryId,
      },
    })

    return { ...transaction, type: transaction.type as TransactionType }
  }

  async delete(id: string, userId: string) {
    await this.findOwned(id, userId)
    await prismaClient.transaction.delete({ where: { id } })
    return true
  }

  private async findOwned(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
    })
    if (!transaction) throw notFound('Transação não encontrada')
    return transaction
  }

  private async ensureCategory(categoryId: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    })
    if (!category) throw badRequest('Categoria inválida')
  }

  private validateAmount(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw badRequest('O valor deve ser maior que zero')
    }
  }

  private buildWhere(userId: string, filter?: TransactionFilterInput) {
    const where: Prisma.TransactionWhereInput = { userId }

    if (filter?.search?.trim()) {
      where.description = { contains: filter.search.trim() }
    }
    if (filter?.type) where.type = filter.type
    if (filter?.categoryId) where.categoryId = filter.categoryId
    if (filter?.period) {
      const { start, end } = parsePeriod(filter.period)
      where.date = { gte: start, lt: end }
    }

    return where
  }
}
