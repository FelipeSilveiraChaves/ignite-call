import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa conter 3 letras no mínimo' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode conter letras e hífens apenas',
    })
    .transform((username) => {
      const nameLowerCased = username.toLowerCase()

      return nameLowerCased
    }),
  name: z
    .string()
    .min(3, { message: 'O nome precisa conter 3 letras no mínimo' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    const queryUsername = router.query.username
    if (queryUsername) {
      setValue('username', String(queryUsername))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (e) {
      if (e instanceof AxiosError && e?.response?.data?.message) {
        alert(e.response.data.message)
      }

      console.error(e)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label htmlFor="">
          <Text size="sm">Nome do usuário</Text>
          {/* @ts-expect-error erro de versao do typescript */}
          <TextInput
            prefix="ignite.com/"
            placeholder={'Seu usuário'}
            {...register('username')}
          />
          {errors.username && <FormError>{errors.username.message}</FormError>}
        </label>

        <label htmlFor="">
          <Text size="sm">Nome Completo</Text>
          {/* @ts-expect-error erro de versao do typescript */}
          <TextInput placeholder={'Seu nome'} {...register('name')} />
          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
