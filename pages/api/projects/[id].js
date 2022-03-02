

import {
  prismaClient
} from '../../../lib/server'

export default async function handle(req, res) {
  const { id } = req.query
  const project = await prismaClient.project.findFirst({
    where: {
      id: id
    },
    include: {
      contracts: true
    }
  })
  res.json(project);
}