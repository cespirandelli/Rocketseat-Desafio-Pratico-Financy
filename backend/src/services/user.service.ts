import { prismaClient } from '../../prisma/prisma'
import { UpdateProfileInput } from '../dtos/input/user.input'
import { badRequest, notFound } from '../utils/errors'

export class UserService {
  async findById(id: string) {
    const user = await prismaClient.user.findUnique({ where: { id } })
    if (!user) throw notFound('Usuário não encontrado')
    return user
  }

  async updateProfile(id: string, data: UpdateProfileInput) {
    const name = data.name.trim()
    if (!name) throw badRequest('Informe seu nome')

    return prismaClient.user.update({
      where: { id },
      data: { name },
    })
  }
}
