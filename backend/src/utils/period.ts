import { badRequest } from './errors'

export function parsePeriod(period: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(period)
  if (!match) throw badRequest('Período inválido')

  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) throw badRequest('Período inválido')

  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  }
}

export function currentPeriod() {
  const now = new Date()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${now.getUTCFullYear()}-${month}`
}

export function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw badRequest('Data inválida')

  const date = new Date(`${value}T12:00:00.000Z`)
  if (Number.isNaN(date.getTime())) throw badRequest('Data inválida')

  return date
}
