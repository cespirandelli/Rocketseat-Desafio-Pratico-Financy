import jwt from 'jsonwebtoken'

export type JwtPayload = {
  id: string
  email: string
}

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET não configurado')
  return secret
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyJwt(token: string) {
  return jwt.verify(token, getSecret()) as JwtPayload
}
