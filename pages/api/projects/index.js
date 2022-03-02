

import {
  prismaClient
} from '../../../lib/server'

export default async function handle(_req, res) {
  const projects = await prismaClient.project.findMany({})
  res.json(projects);
}