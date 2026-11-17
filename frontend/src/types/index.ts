export type User = {
  id: string
  name: string
  email: string
}

export type TransactionType = 'income' | 'expense'

export type Category = {
  id: string
  title: string
  description?: string | null
  icon: string
  color: string
  transactionsCount: number
  totalAmount: number
}

export type Transaction = {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  categoryId?: string | null
  category?: Pick<Category, 'id' | 'title' | 'icon' | 'color'> | null
}

export type TransactionPage = {
  items: Transaction[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export type Summary = {
  balance: number
  monthIncome: number
  monthExpense: number
}
