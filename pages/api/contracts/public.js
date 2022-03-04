import {
  prismaClient
} from '../../../lib/server'

export default async function handle(_req, res) {
  const publicContracts = await prismaClient.contract.findMany({
    where: {
      public: true
    }
  })

  res.json(publicContracts);
}