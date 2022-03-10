

import {
  prismaClient
} from '../../../lib/server'

export default async function handle(req, res) {
  const { contractDeploymentId } = req.query
  const data = req.body
  const contract = await prismaClient.contract.update({
    where: {
      id: contractDeploymentId
    },
    data: data
  })

  res.json(contract);
}