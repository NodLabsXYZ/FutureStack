

import {
  prismaClient
} from '../../../lib/server'

export default async function handle(req, res) {
  const { contract } = req.body
  const project = await prismaClient.contract.create({
    data: contract
  })
  res.json(project);
}