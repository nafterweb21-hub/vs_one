import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const processes = await prisma.mainProcess.findMany()
  console.log('Main Processes:', processes)
  
  const routing = await prisma.routingProcess.findMany({
    include: {
      mainProcess: true
    }
  })
  console.log('Routing Processes:', routing.length)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
