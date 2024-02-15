import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, Header } from './styles'
import { ArrowRight } from 'phosphor-react'

export default function Register() {
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

      <Form as="form">
        <label htmlFor="">
          <Text size="sm">Nome do usuário</Text>
          <TextInput prefix="ignite.com/" placeholder={'Seu usuário'} />
        </label>
        <label htmlFor="">
          <Text size="sm">Nome Completo</Text>
          <TextInput placeholder={'Seu nome'} />
        </label>

        <Button type="submit">
          Próximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}