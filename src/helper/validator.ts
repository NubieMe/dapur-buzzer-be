import { Prisma } from "@prisma/client"

export function orderValidator(order: string): Prisma.InfluencerOrderByWithRelationInput {
  const constraints = Object.values(Prisma.InfluencerScalarFieldEnum)
  const sortOrder = ['asc', 'desc']

  const [orderField, orderDirection] = order.split('-')
  if (
    !orderField ||
    !orderDirection ||
    !sortOrder.includes(orderDirection) ||
    !constraints.includes(orderField as keyof Prisma.InfluencerOrderByWithRelationInput)
  ) {
    return {
      'created_at': 'desc'
    }
  }

  return {
    [orderField]: orderDirection
  }
}

