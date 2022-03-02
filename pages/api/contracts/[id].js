

import {
  prismaClient
} from '../../../lib/server'

export default async function handle(req, res) {
  const { id } = req.query
  const data = req.body
  const contract = await prismaClient.contract.update({
    where: {
      id
    },
    data: data
  })

  res.json(contract);
}