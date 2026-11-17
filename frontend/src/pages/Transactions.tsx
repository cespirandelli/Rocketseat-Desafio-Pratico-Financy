import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { ChevronLeft, ChevronRight, Plus, Search, SquarePen, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tag } from '@/components/ui/tag'
import { CategoryIcon } from '@/components/CategoryIcon'
import { TransactionType } from '@/components/TransactionType'
import { TransactionDialog } from '@/components/TransactionDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate, getLastPeriods } from '@/lib/format'
import { DELETE_TRANSACTION, LIST_TRANSACTIONS } from '@/lib/graphql/transactions'
import { LIST_CATEGORIES } from '@/lib/graphql/categories'
import type { Category, Transaction, TransactionPage } from '@/types'

const PER_PAGE = 10
const ALL = 'all'

const typeOptions = [
  { value: ALL, label: 'Todos' },
  { value: 'income', label: 'Entrada' },
  { value: 'expense', label: 'Saída' },
]

const periodOptions = [{ value: ALL, label: 'Todos os períodos' }, ...getLastPeriods(12)]

export function Transactions() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [type, setType] = useState(ALL)
  const [categoryId, setCategoryId] = useState(ALL)
  const [period, setPeriod] = useState(ALL)
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, type, categoryId, period])

  const { data, loading } = useQuery<{ transactions: TransactionPage }>(LIST_TRANSACTIONS, {
    variables: {
      filter: {
        search: debouncedSearch || undefined,
        type: type === ALL ? undefined : type,
        categoryId: categoryId === ALL ? undefined : categoryId,
        period: period === ALL ? undefined : period,
      },
      pagination: { page, perPage: PER_PAGE },
    },
  })

  const { data: categoriesData } = useQuery<{ categories: Category[] }>(LIST_CATEGORIES)

  const [deleteTransaction, { loading: deletingLoading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ['ListTransactions', 'GetSummary', 'ListCategories'],
  })

  const result = data?.transactions
  const transactions = result?.items ?? []
  const total = result?.total ?? 0
  const totalPages = result?.totalPages ?? 1
  const start = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const end = Math.min(page * PER_PAGE, total)

  const categoryOptions = [
    { value: ALL, label: 'Todas' },
    ...(categoriesData?.categories.map((category) => ({
      value: category.id,
      label: category.title,
    })) ?? []),
  ]

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(transaction: Transaction) {
    setEditing(transaction)
    setDialogOpen(true)
  }

  async function handleDelete() {
    if (!deleting) return

    try {
      await deleteTransaction({ variables: { id: deleting.id } })
      toast.success('Transação excluída')
      if (transactions.length === 1 && page > 1) setPage(page - 1)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir transação')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-gray-600">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          Nova transação
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 rounded-xl border border-gray-200 bg-white px-6 pt-5 pb-6">
        <Input
          label="Buscar"
          icon={Search}
          placeholder="Buscar por descrição"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select label="Tipo" value={type} onValueChange={setType} options={typeOptions} />
        <Select
          label="Categoria"
          value={categoryId}
          onValueChange={setCategoryId}
          options={categoryOptions}
        />
        <Select label="Período" value={period} onValueChange={setPeriod} options={periodOptions} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-medium tracking-wider text-gray-500 uppercase">
              <th className="px-6 py-5 text-left font-medium">Descrição</th>
              <th className="px-4 py-5 text-center font-medium">Data</th>
              <th className="px-4 py-5 text-center font-medium">Categoria</th>
              <th className="px-4 py-5 text-center font-medium">Tipo</th>
              <th className="px-4 py-5 text-right font-medium">Valor</th>
              <th className="px-6 py-5 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                  Carregando...
                </td>
              </tr>
            )}

            {!loading && transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}

            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-200">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-4">
                    <CategoryIcon
                      icon={transaction.category?.icon}
                      color={transaction.category?.color}
                    />
                    <span className="font-medium text-gray-800">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-3 text-center">
                  {transaction.category ? (
                    <Tag color={transaction.category.color}>{transaction.category.title}</Tag>
                  ) : (
                    <Tag>Sem categoria</Tag>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <TransactionType type={transaction.type} />
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-gray-800">
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-3">
                  <div className="flex justify-end gap-2">
                    <IconButton variant="danger" title="Excluir" onClick={() => setDeleting(transaction)}>
                      <Trash />
                    </IconButton>
                    <IconButton title="Editar" onClick={() => openEdit(transaction)}>
                      <SquarePen />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-sm text-gray-700">
            <strong className="font-medium">
              {start} a {end}
            </strong>{' '}
            | {total} {total === 1 ? 'resultado' : 'resultados'}
          </span>

          <div className="flex items-center gap-2">
            <PageButton disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="size-4" />
            </PageButton>
            {getPages(page, totalPages).map((pageNumber) => (
              <PageButton
                key={pageNumber}
                active={pageNumber === page}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PageButton>
            ))}
            <PageButton disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="size-4" />
            </PageButton>
          </div>
        </div>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editing} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${deleting?.description ?? ''}"?`}
        loading={deletingLoading}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function getPages(current: number, total: number) {
  const size = Math.min(5, total)
  let first = Math.max(1, current - 2)
  if (first + size - 1 > total) first = total - size + 1

  return Array.from({ length: size }, (_, index) => first + index)
}

type PageButtonProps = {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

function PageButton({ active, disabled, onClick, children }: PageButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50',
        active && 'border-brand-base bg-brand-base text-white hover:bg-brand-dark'
      )}
    >
      {children}
    </button>
  )
}
