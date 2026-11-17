import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog } from './ui/dialog'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { toInputDate } from '@/lib/format'
import { LIST_CATEGORIES } from '@/lib/graphql/categories'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/lib/graphql/transactions'
import type { Category, Transaction } from '@/types'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().trim().min(1, 'Informe a descrição'),
  date: z.string().min(1, 'Informe a data'),
  amount: z.number().positive('Informe um valor maior que zero'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
})

type TransactionForm = z.infer<typeof transactionSchema>

type TransactionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
}

const emptyForm: TransactionForm = {
  type: 'expense',
  description: '',
  date: '',
  amount: 0,
  categoryId: '',
}

function formatAmount(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  const isEditing = !!transaction

  const { data: categoriesData } = useQuery<{ categories: Category[] }>(LIST_CATEGORIES, {
    skip: !open,
  })

  const refetchQueries = ['ListTransactions', 'GetSummary', 'ListCategories']
  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries,
  })
  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: emptyForm,
  })

  useEffect(() => {
    if (!open) return

    if (transaction) {
      reset({
        type: transaction.type,
        description: transaction.description,
        date: toInputDate(transaction.date),
        amount: transaction.amount,
        categoryId: transaction.categoryId ?? '',
      })
    } else {
      reset(emptyForm)
    }
  }, [open, transaction, reset])

  async function onSubmit(values: TransactionForm) {
    try {
      if (transaction) {
        await updateTransaction({ variables: { id: transaction.id, data: values } })
        toast.success('Transação atualizada')
      } else {
        await createTransaction({ variables: { data: values } })
        toast.success('Transação criada')
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar transação')
    }
  }

  const categoryOptions =
    categoriesData?.categories.map((category) => ({
      value: category.id,
      label: category.title,
    })) ?? []

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar transação' : 'Nova transação'}
      description="Registre sua despesa ou receita"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 p-2">
              <button
                type="button"
                onClick={() => field.onChange('expense')}
                className={cn(
                  'flex h-12 items-center justify-center gap-3 rounded-lg border border-transparent text-base text-gray-600',
                  field.value === 'expense' && 'border-red-base font-medium text-gray-800'
                )}
              >
                <CircleArrowDown
                  className={cn('size-4', field.value === 'expense' ? 'text-red-base' : 'text-gray-400')}
                />
                Despesa
              </button>
              <button
                type="button"
                onClick={() => field.onChange('income')}
                className={cn(
                  'flex h-12 items-center justify-center gap-3 rounded-lg border border-transparent text-base text-gray-600',
                  field.value === 'income' && 'border-green-base font-medium text-gray-800'
                )}
              >
                <CircleArrowUp
                  className={cn('size-4', field.value === 'income' ? 'text-green-base' : 'text-gray-400')}
                />
                Receita
              </button>
            </div>
          )}
        />

        <Input
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Data" type="date" error={errors.date?.message} {...register('date')} />

          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <Input
                label="Valor"
                prefix="R$"
                inputMode="numeric"
                value={formatAmount(field.value)}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, '')
                  field.onChange(Number(digits) / 100)
                }}
                error={errors.amount?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              label="Categoria"
              value={field.value || undefined}
              onValueChange={field.onChange}
              options={categoryOptions}
              error={errors.categoryId?.message}
            />
          )}
        />

        {categoriesData && categoryOptions.length === 0 && (
          <p className="text-xs text-gray-500">
            Você ainda não tem categorias. Crie uma na página de categorias.
          </p>
        )}

        <Button type="submit" className="mt-2" disabled={creating || updating}>
          {creating || updating ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Dialog>
  )
}
