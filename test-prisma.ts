import { prisma } from './src/lib/prisma';
async function run() {
  const c = await prisma.companyProfile.findFirst();
  console.log(JSON.stringify(c, null, 2));
}
run();
