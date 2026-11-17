import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import { LogOut, Mail, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ME, UPDATE_PROFILE } from '@/lib/graphql/auth'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function Profile() {
  const client = useApolloClient()
  const { user, setUser, logout } = useAuthStore()

  const { data } = useQuery<{ me: User }>(ME)
  const [updateProfile, { loading }] = useMutation<{ updateProfile: User }>(UPDATE_PROFILE)

  const me = data?.me ?? user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  })

  useEffect(() => {
    if (data?.me) reset({ name: data.me.name })
  }, [data, reset])

  async function onSubmit(values: ProfileForm) {
    try {
      const result = await updateProfile({ variables: { data: values } })
      if (result.data) {
        setUser(result.data.updateProfile)
        toast.success('Perfil atualizado')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar perfil')
    }
  }

  async function handleLogout() {
    logout()
    await client.clearStore()
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-xl border border-gray-200 bg-white p-8">
      <div className="flex flex-col items-center gap-6 border-b border-gray-200 pb-8">
        <Avatar name={me?.name} size="lg" />
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="text-xl font-semibold text-gray-800">{me?.name}</h1>
          <span className="text-gray-500">{me?.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nome completo"
          icon={UserRound}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="E-mail"
          icon={Mail}
          value={me?.email ?? ''}
          helper="O e-mail não pode ser alterado"
          disabled
          readOnly
        />

        <div className="mt-2 flex flex-col gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
          <Button type="button" variant="outline" onClick={handleLogout}>
            <LogOut className="text-danger" />
            Sair da conta
          </Button>
        </div>
      </form>
    </div>
  )
}
