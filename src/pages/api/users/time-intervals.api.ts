import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const timeINtervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOption(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeINtervalsBodySchema.parse(req.body)

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          weekDay: interval.weekDay,
          timeStartInMinutes: interval.startTimeInMinutes,
          timeEndInMinutes: interval.endTimeInMinutes,
          userId: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
