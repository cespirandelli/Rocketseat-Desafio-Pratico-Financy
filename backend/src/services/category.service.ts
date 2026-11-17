import { prismaClient } from '../../prisma/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/category-options'
import { badRequest, notFound } from '../utils/errors'

export class CategoryService {
  async list(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
      orderBy: { title: 'asc' },
    })
  }

  async findOwned(id: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!category) throw notFound('Categoria não encontrada')
    return category
  }

  async create(data: CreateCategoryInput, userId: string) {
    const title = data.title.trim()
    if (!title) throw badRequest('Informe o título da categoria')
    this.validateIcon(data.icon)
    this.validateColor(data.color)

    return prismaClient.category.create({
      data: {
        title,
        description: data.description?.trim() || null,
        icon: data.icon,
        color: data.color,
        userId,
      },
    })
  }

  async update(id: string, data: UpdateCategoryInput, userId: string) {
    await this.findOwned(id, userId)

    if (data.title !== undefined && !data.title.trim()) {
      throw badRequest('Informe o título da categoria')
    }
    if (data.icon !== undefined) this.validateIcon(data.icon)
    if (data.color !== undefined) this.validateColor(data.color)

    return prismaClient.category.update({
      where: { id },
      data: {
        title: data.title?.trim(),
        description:
          data.description === undefined ? undefined : data.description?.trim() || null,
        icon: data.icon,
        color: data.color,
      },
    })
  }

  async delete(id: string, userId: string) {
    await this.findOwned(id, userId)
    await prismaClient.category.delete({ where: { id } })
    return true
  }

  async countTransactions(categoryId: string) {
    return prismaClient.transaction.count({ where: { categoryId } })
  }

  async sumTransactions(categoryId: string) {
    const result = await prismaClient.transaction.aggregate({
      where: { categoryId },
      _sum: { amount: true },
    })
    return result._sum.amount ?? 0
  }

  private validateIcon(icon: string) {
    if (!CATEGORY_ICONS.includes(icon)) throw badRequest('Ícone inválido')
  }

  private validateColor(color: string) {
    if (!CATEGORY_COLORS.includes(color)) throw badRequest('Cor inválida')
  }
}
