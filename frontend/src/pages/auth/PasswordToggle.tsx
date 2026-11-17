import { Eye, EyeClosed } from 'lucide-react'

type PasswordToggleProps = {
  visible: boolean
  onToggle: () => void
}

export function PasswordToggle({ visible, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-gray-700"
      title={visible ? 'Ocultar senha' : 'Mostrar senha'}
    >
      {visible ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
    </button>
  )
}
