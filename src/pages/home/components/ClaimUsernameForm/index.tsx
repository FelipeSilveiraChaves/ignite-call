import { Button, Text, TextInput } from '@ignite-ui/react'
import { Form, FormAnnation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

const claimUsernameSchema = z.object({
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
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data
    console.log(data)

    await router.push(`/register?username=${username}`)
  }
  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu usuário"
          required={false}
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado.'}
        </Text>
      </FormAnnation>
    </>
  )
}
