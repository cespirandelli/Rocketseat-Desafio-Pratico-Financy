import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@apollo/client/react'
import { Lock, LogIn, Mail, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { REGISTER } from '@/lib/graphql/auth'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'
import { AuthLayout, Divider } from './AuthLayout'
import { PasswordToggle } from './PasswordToggle'

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome'),
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type SignupForm = z.infer<typeof signupSchema>

export function Signup() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const setSession = useAuthStore((state) => state.setSession)
  const [signup, { loading }] = useMutation<{ register: { token: string; user: User } }>(REGISTER)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(values: SignupForm) {
    try {
      const { data } = await signup({ variables: { data: values } })
      if (data) {
        setSession(data.register.token, data.register.user)
        toast.success('Conta criada com sucesso!')
        navigate('/')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta')
    }
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a controlar suas finanças ainda hoje">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nome completo"
          icon={UserRound}
          placeholder="Seu nome completo"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

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
          autoComplete="new-password"
          helper="A senha deve ter no mínimo 8 caracteres"
          error={errors.password?.message}
          rightElement={
            <PasswordToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          }
          {...register('password')}
        />

        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>

      <Divider />

      <div className="flex flex-col gap-4">
        <p className="text-center text-sm text-gray-600">Já tem uma conta?</p>
        <Button variant="outline" asChild>
          <Link to="/">
            <LogIn />
            Fazer login
          </Link>
        </Button>
      </div>
    </AuthLayout>
  )
}
