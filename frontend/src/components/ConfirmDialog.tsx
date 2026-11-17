import { Dialog } from './ui/dialog'
import { Button } from './ui/button'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  loading?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          size="sm"
          className="bg-danger hover:bg-red-dark"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </div>
    </Dialog>
  )
}
