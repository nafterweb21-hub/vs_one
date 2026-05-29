import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();
async function main() {
  const processes = await prisma.mainProcess.findMany();
  console.log("Main Processes:", processes.map(p => p.process));
  
  const routing = await prisma.routingProcess.groupBy({
    by: ["mainProcessId"],
    _count: {
      id: true
    }
  });
  
  const processDict = Object.fromEntries(processes.map(p => [p.id, p.process]));
  console.log("Distribution:", routing.map(r => ({ process: processDict[r.mainProcessId], count: r._count.id })));
}
main().finally(() => process.exit(0));
