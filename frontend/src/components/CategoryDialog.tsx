import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { Dialog } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { categoryColors, categoryIcons } from '@/lib/categories'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/lib/graphql/categories'
import type { Category } from '@/types'

const categorySchema = z.object({
  title: z.string().trim().min(1, 'Informe o título'),
  description: z.string().optional(),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.string().min(1, 'Selecione uma cor'),
})

type CategoryForm = z.infer<typeof categorySchema>

type CategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

const emptyForm: CategoryForm = {
  title: '',
  description: '',
  icon: 'briefcase-business',
  color: 'green',
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: ['ListCategories'],
  })
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: ['ListCategories', 'ListTransactions'],
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: emptyForm,
  })

  useEffect(() => {
    if (!open) return

    reset(
      category
        ? {
            title: category.title,
            description: category.description ?? '',
            icon: category.icon,
            color: category.color,
          }
        : emptyForm
    )
  }, [open, category, reset])

  async function onSubmit(values: CategoryForm) {
    const data = { ...values, description: values.description?.trim() || null }

    try {
      if (category) {
        await updateCategory({ variables: { id: category.id, data } })
        toast.success('Categoria atualizada')
      } else {
        await createCategory({ variables: { data } })
        toast.success('Categoria criada')
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar categoria')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={category ? 'Editar categoria' : 'Nova categoria'}
      description="Organize suas transações com categorias"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Título"
          placeholder="Ex. Alimentação"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          label="Descrição"
          placeholder="Descrição da categoria"
          helper="Opcional"
          {...register('description')}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Ícone</span>
              <div className="grid grid-cols-8 gap-2">
                {Object.entries(categoryIcons).map(([name, Icon]) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => field.onChange(name)}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100',
                      field.value === name && 'border-brand-base bg-gray-100 text-gray-800'
                    )}
                  >
                    <Icon className="size-5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Cor</span>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(categoryColors).map(([name, color]) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => field.onChange(name)}
                    className={cn(
                      'h-[30px] rounded-lg border border-gray-300 p-1 transition-colors',
                      field.value === name && 'border-brand-base'
                    )}
                  >
                    <span className={cn('block h-full w-full rounded', color.swatch)} />
                  </button>
                ))}
              </div>
            </div>
          )}
        />

        <Button type="submit" className="mt-2" disabled={creating || updating}>
          {creating || updating ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Dialog>
  )
}
