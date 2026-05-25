import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.quotation.findMany({
  include: {
    customer: { select: { customerName: true } },
    salesperson: { select: { name: true } },
    currency: { select: { code: true } },
    taxType: { select: { taxType: true, taxRate: true } }
  },
  orderBy: [{ quotationNo: 'desc' }, { revision: 'desc' }]
}).then(console.log).catch(console.error).finally(() => prisma.$disconnect());
