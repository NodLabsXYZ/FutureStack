

import {
  supabaseClient
} from '../../../lib'

import {
  prismaClient
} from '../../../lib/server'

export default async function handle(req, res) {
  const { user, error  } = await supabaseClient.auth.api.getUserByCookie(req, res)

  if (error?.status === 400) {
    return res.status(400).json({ message: error.message })
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, user)
    case 'POST':
      return handlePost(req, res, user)
  }
}

const handleGet = async (req, res, user) => {
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

  res.json(projects);
}

const handlePost = async (req, res, user) => {
  let team = await prismaClient.team.findFirst({
    where: {
      profiles: {
        every: {
          user_id: user.id
        }
      }
    },
    select: {
      id: true
    }
  })

  if (!team) {
    let profile = await prismaClient.profile.findFirst({
      where: {
        user_id: user.id
      }
    })

    if (!profile) {
      profile = await prismaClient.profile.create({
        data: {
          user_id: user.id,
        }
      })
    }

    team = await prismaClient.team.create({
      data: {
        title: 'My Team',
        profiles: {
          connect: [
            { id: profile.id }
          ]
        }
      }
    })
  }    

  const projectData = req.body;
  projectData.team_id = team.id;

  const project = await prismaClient.project.create({
    data: projectData
  })

  res.json(project);
}