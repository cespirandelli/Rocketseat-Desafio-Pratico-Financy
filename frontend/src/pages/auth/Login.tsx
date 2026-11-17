import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@apollo/client/react'
import { Lock, Mail, UserRoundPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LOGIN } from '@/lib/graphql/auth'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'
import { AuthLayout, Divider } from './AuthLayout'
import { PasswordToggle } from './PasswordToggle'

const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean(),
})

type LoginForm = z.infer<typeof loginSchema>

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const setSession = useAuthStore((state) => state.setSession)
  const [login, { loading }] = useMutation<{ login: { token: string; user: User } }>(LOGIN)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  async function onSubmit({ remember, ...values }: LoginForm) {
    try {
      const { data } = await login({ variables: { data: values } })
      if (data) {
        setSession(data.login.token, data.login.user, remember)
        toast.success(`Bem-vindo(a), ${data.login.user.name.split(' ')[0]}!`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login')
    }
  }

  return (
    <AuthLayout title="Fazer login" subtitle="Entre na sua conta para continuar">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          icon={Mail}
          placeholder="mail@exemplo.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder="Digite sua senha"
          autoComplete="current-password"
          error={errors.password?.message}
          rightElement={
            <PasswordToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          }
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="size-4 rounded border-gray-300 accent-brand-base"
              {...register('remember')}
            />
            Lembrar-me
          </label>

          <button
            type="button"
            className="text-sm font-medium text-brand-base hover:underline"
            onClick={() => toast.info('Recuperação de senha ainda não está disponível')}
          >
            Recuperar senha
          </button>
        </div>

        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <Divider />

      <div className="flex flex-col gap-4">
        <p className="text-center text-sm text-gray-600">Ainda não tem uma conta?</p>
        <Button variant="outline" asChild>
          <Link to="/cadastro">
            <UserRoundPlus />
            Criar conta
          </Link>
        </Button>
      </div>
    </AuthLayout>
  )
}
