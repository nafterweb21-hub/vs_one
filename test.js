const { PrismaClient } = require('./src/generated/prisma');
const p = new PrismaClient();
console.log(Object.keys(p).filter(k => !k.startsWith('_')));
