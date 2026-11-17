import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { TransactionDialog } from '@/components/TransactionDialog'
import { Tag } from '@/components/ui/tag'
import { currentPeriod, formatCurrency, formatDate } from '@/lib/format'
import { GET_SUMMARY, LIST_TRANSACTIONS } from '@/lib/graphql/transactions'
import { LIST_CATEGORIES } from '@/lib/graphql/categories'
import type { Category, Summary, TransactionPage } from '@/types'

export function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: summaryData } = useQuery<{ summary: Summary }>(GET_SUMMARY, {
    variables: { period: currentPeriod() },
  })
  const { data: transactionsData, loading } = useQuery<{ transactions: TransactionPage }>(
    LIST_TRANSACTIONS,
    { variables: { pagination: { page: 1, perPage: 5 } } }
  )
  const { data: categoriesData } = useQuery<{ categories: Category[] }>(LIST_CATEGORIES)

  const summary = summaryData?.summary
  const transactions = transactionsData?.transactions.items ?? []
  const categories = [...(categoriesData?.categories ?? [])]
    .sort((a, b) => b.transactionsCount - a.transactionsCount)
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<Wallet className="size-5 text-purple-base" />}
          label="Saldo total"
          value={summary?.balance}
        />
        <SummaryCard
          icon={<CircleArrowUp className="size-5 text-green-base" />}
          label="Receitas do mês"
          value={summary?.monthIncome}
        />
        <SummaryCard
          icon={<CircleArrowDown className="size-5 text-red-base" />}
          label="Despesas do mês"
          value={summary?.monthExpense}
        />
      </div>

      <div className="grid grid-cols-3 items-start gap-6">
        <section className="col-span-2 rounded-xl border border-gray-200 bg-white">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <h2 className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Transações recentes
            </h2>
            <Link
              to="/transacoes"
              className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline"
            >
              Ver todas
              <ChevronRight className="size-4" />
            </Link>
          </header>

          {loading && <p className="px-6 py-8 text-center text-sm text-gray-500">Carregando...</p>}

          {!loading && transactions.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-gray-500">
              Nenhuma transação cadastrada ainda.
            </p>
          )}

          <ul>
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="grid grid-cols-[1fr_auto_160px] items-center gap-4 border-b border-gray-200 px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <CategoryIcon icon={transaction.category?.icon} color={transaction.category?.color} />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{transaction.description}</span>
                    <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                  </div>
                </div>

                {transaction.category ? (
                  <Tag color={transaction.category.color}>{transaction.category.title}</Tag>
                ) : (
                  <Tag>Sem categoria</Tag>
                )}

                <span className="flex items-center justify-end gap-2 text-sm font-semibold text-gray-800">
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  {transaction.type === 'income' ? (
                    <CircleArrowUp className="size-4 text-green-base" />
                  ) : (
                    <CircleArrowDown className="size-4 text-red-base" />
                  )}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex w-full items-center justify-center gap-2 py-5 text-sm font-medium text-brand-base hover:underline"
          >
            <Plus className="size-4" />
            Nova transação
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <h2 className="text-xs font-medium tracking-wider text-gray-500 uppercase">Categorias</h2>
            <Link
              to="/categorias"
              className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline"
            >
              Gerenciar
              <ChevronRight className="size-4" />
            </Link>
          </header>

          <ul className="flex flex-col gap-5 px-6 py-6">
            {categories.length === 0 && (
              <li className="text-center text-sm text-gray-500">Nenhuma categoria cadastrada.</li>
            )}
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between gap-3">
                <Tag color={category.color} className="truncate">
                  {category.title}
                </Tag>
                <div className="flex items-center gap-4 text-sm">
                  <span className="whitespace-nowrap text-gray-600">
                    {category.transactionsCount}{' '}
                    {category.transactionsCount === 1 ? 'item' : 'itens'}
                  </span>
                  <span className="w-24 text-right font-semibold whitespace-nowrap text-gray-800">
                    {formatCurrency(category.totalAmount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

type SummaryCardProps = {
  icon: React.ReactNode
  label: string
  value?: number
}

function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">{label}</span>
      </div>
      <strong className="text-[28px] leading-8 font-bold text-gray-800">
        {formatCurrency(value ?? 0)}
      </strong>
    </div>
  )
}
