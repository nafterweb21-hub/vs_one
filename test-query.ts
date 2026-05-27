const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();

async function test() {
  try {
    const workOrders = await prisma.workOrder.findMany({ 
        where: { 
          OR: [
            { status: "Proceed" },
            { status: "Pending For QC" },
            { qcAcceptance: "Rejected" }
          ] 
        }, 
        select: { 
          workOrderNo: true, 
          customerId: true, 
          quantity: true, 
          WorkOrderInProcess: { 
            select: { 
              id: true, 
              description: true, 
              RoutingProcess: { 
                select: { 
                  id: true, 
                  mainProcessId: true, 
                  routingProcessId: true, 
                  ProcessProfile: { select: { routingProcess: true } } 
                } 
              } 
            } 
          } 
        } 
      });
      console.log("Success, got", workOrders.length, "work orders");
  } catch (e) {
      console.error(e);
  }
}
test();
