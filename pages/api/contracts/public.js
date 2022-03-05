import {
  prismaClient
} from '../../../lib/server'

export default async function handle(_req, res) {
  const openSourceContracts = await prismaClient.contract.findMany({
    where: {
      opensource: true
    }
  })

  res.json(openSourceContracts);
}