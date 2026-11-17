import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { ArrowUpDown, Plus, SquarePen, Tag as TagIcon, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Tag } from '@/components/ui/tag'
import { CategoryIcon } from '@/components/CategoryIcon'
import { CategoryDialog } from '@/components/CategoryDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { getCategoryColor, getCategoryIcon } from '@/lib/categories'
import { DELETE_CATEGORY, LIST_CATEGORIES } from '@/lib/graphql/categories'
import type { Category } from '@/types'

export function Categories() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const { data, loading } = useQuery<{ categories: Category[] }>(LIST_CATEGORIES)
  const [deleteCategory, { loading: deletingLoading }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: ['ListCategories', 'ListTransactions'],
  })

  const categories = data?.categories ?? []
  const totalTransactions = categories.reduce((sum, category) => sum + category.transactionsCount, 0)
  const mostUsed = categories.reduce<Category | null>(
    (top, category) =>
      category.transactionsCount > (top?.transactionsCount ?? 0) ? category : top,
    null
  )
  const MostUsedIcon = getCategoryIcon(mostUsed?.icon)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setDialogOpen(true)
  }

  async function handleDelete() {
    if (!deleting) return

    try {
      await deleteCategory({ variables: { id: deleting.id } })
      toast.success('Categoria excluída')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir categoria')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatCard
          icon={<TagIcon className="size-6 text-gray-700" />}
          value={categories.length}
          label="Total de categorias"
        />
        <StatCard
          icon={<ArrowUpDown className="size-6 text-purple-base" />}
          value={totalTransactions}
          label="Total de transações"
        />
        <StatCard
          icon={<MostUsedIcon className={`size-6 ${getCategoryColor(mostUsed?.color).text}`} />}
          value={mostUsed?.title ?? '-'}
          label="Categoria mais utilizada"
        />
      </div>

      {loading && !data && <p className="text-center text-sm text-gray-500">Carregando...</p>}

      {!loading && categories.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Você ainda não criou nenhuma categoria.
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <CategoryIcon icon={category.icon} color={category.color} />
              <div className="flex gap-2">
                <IconButton variant="danger" title="Excluir" onClick={() => setDeleting(category)}>
                  <Trash />
                </IconButton>
                <IconButton title="Editar" onClick={() => openEdit(category)}>
                  <SquarePen />
                </IconButton>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <h3 className="font-semibold text-gray-800">{category.title}</h3>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <Tag color={category.color} className="truncate">
                {category.title}
              </Tag>
              <span className="text-sm whitespace-nowrap text-gray-600">
                {category.transactionsCount} {category.transactionsCount === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editing} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir categoria"
        description={
          deleting?.transactionsCount
            ? `As ${deleting.transactionsCount} transações de "${deleting.title}" ficarão sem categoria. Deseja continuar?`
            : `Tem certeza que deseja excluir "${deleting?.title ?? ''}"?`
        }
        loading={deletingLoading}
        onConfirm={handleDelete}
      />
    </div>
  )
}

type StatCardProps = {
  icon: React.ReactNode
  value: string | number
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6">
      {icon}
      <div className="flex min-w-0 flex-col gap-2">
        <strong className="truncate text-[28px] leading-8 font-bold text-gray-800">{value}</strong>
        <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">{label}</span>
      </div>
    </div>
  )
}
