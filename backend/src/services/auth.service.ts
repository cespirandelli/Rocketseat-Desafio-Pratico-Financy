import { prismaClient } from '../../prisma/prisma'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'
import { badRequest } from '../utils/errors'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class AuthService {
  async register(data: RegisterInput) {
    const name = data.name.trim()
    const email = data.email.trim().toLowerCase()

    if (!name) throw badRequest('Informe seu nome')
    if (!EMAIL_REGEX.test(email)) throw badRequest('E-mail inválido')
    if (data.password.length < 8) {
      throw badRequest('A senha deve ter no mínimo 8 caracteres')
    }

    const existing = await prismaClient.user.findUnique({ where: { email } })
    if (existing) throw badRequest('Este e-mail já está cadastrado')

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: await hashPassword(data.password),
      },
    })

    return {
      token: signJwt({ id: user.id, email: user.email }),
      user,
    }
  }

  async login(data: LoginInput) {
    const email = data.email.trim().toLowerCase()
    const user = await prismaClient.user.findUnique({ where: { email } })

    const valid = user ? await comparePassword(data.password, user.password) : false
    if (!user || !valid) throw badRequest('E-mail ou senha inválidos')

    return {
      token: signJwt({ id: user.id, email: user.email }),
      user,
    }
  }
}
