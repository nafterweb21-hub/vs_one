const { PrismaClient } = require('./src/generated/prisma/client');
const prisma = new PrismaClient();
prisma.workOrder.findMany().then(r => console.log(r)).finally(() => prisma.$disconnect());
