const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value).replace(/ /g, ' ')
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-')
  return `${day}/${month}/${year.slice(2)}`
}

export function toInputDate(iso: string) {
  return iso.slice(0, 10)
}

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function currentPeriod() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getLastPeriods(amount = 12) {
  const now = new Date()
  const periods = []

  for (let i = 0; i < amount; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    periods.push({
      value: `${date.getFullYear()}-${month}`,
      label: `${MONTHS[date.getMonth()]} / ${date.getFullYear()}`,
    })
  }

  return periods
}
