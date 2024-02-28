// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { setCookie } from 'nookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userExsits = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExsits) {
    return res.status(400).json({
      message: 'Username already exists',
    })
  }

  const user = await prisma.user.create({
    data: { name, username },
  })
  console.log('felip feliçfepifoe')
  setCookie(
    {
      res,
    },
    '@ignitecall:userId',
    user.id,
    {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    },
  )
  return res.status(201).json(user)
}
