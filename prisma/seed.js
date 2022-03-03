

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.profile.upsert({
    where: { email: 'alice@test.com' },
    update: {},
    create: {
      user_id: '3950d1fa-5386-4499-b2fa-b3e27af55b97',
      email: 'alice@test.com',
      username: "Alice",
      teams: {
        create: [{
          title: "Nod Labs",
          projects: {
            create: [{
              title: "SimpleURIAndPriceNFTWithWithdrawalRoyalty"
            }]
          }  
        }]
      },
    },
  })

  const bob = await prisma.profile.upsert({
    where: { email: 'bob@test.com' },
    update: {},
    create: {
      user_id: '3950d1fa-5386-4499-b2fa-b3e27af55b98',
      email: 'bob@test.com',
      username: "Bob",
      teams: {
        create: [{
          title: "FutureStack",
          projects: {
            create: [{
              title: "FutureStack"
            }]
          }  
        }]
      },
    },
  })
  console.log({ alice, bob })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })