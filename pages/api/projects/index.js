

import {
  supabaseClient
} from '../../../lib'

import {
  prismaClient
} from '../../../lib/server'

export default async function handle(req, res) {
  const { user, error  } = await supabaseClient.auth.api.getUserByCookie(req, res)

  if (error?.status === 400) {
    return res.status(400)
  }

  const projects = await prismaClient.project.findMany({
    where: {
      team: {
        profiles: {
          every: {
            user_id: user.id
          }
        }
      }  
    },
    select: {
      id: true,
      title: true,
      team: {
        select: {
          title: true
        }
      }
    }
  })

  // console.log('user', user)
  // const { data, error } = await supabaseClient.from('project').select('*')
  // res.json(data);
  res.json(projects);
}