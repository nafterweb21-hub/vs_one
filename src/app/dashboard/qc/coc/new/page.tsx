import React from "react";
import { prisma } from "@/lib/prisma";
import NewCocForm from "./NewCocForm";

export const dynamic = "force-dynamic";

export default async function NewCocPage() {
  const [customers, deliveryOrders, workOrders, employees, machines, uoms, routingProcesses, cocTypes] = await Promise.all([
    prisma.customerProfile.findMany({ orderBy: { customerName: 'asc' } }),
    prisma.deliveryOrder.findMany({ where: { cocRequired: true, status: { not: 'Submitted' } }, orderBy: { doNo: 'asc' } }),
    prisma.workOrder.findMany({ include: { WorkOrderInProcess: { include: { RoutingProcess: true } } } }),
    prisma.employee.findMany({ orderBy: { name: 'asc' } }),
    prisma.machineProfile.findMany({ orderBy: { machineCode: 'asc' } }),
    prisma.uomProfile.findMany({ orderBy: { uomName: 'asc' } }),
    prisma.routingProcess.findMany({ include: { ProcessProfile: true } }),
    prisma.cocTypeProfile.findMany({ where: { status: 'Active' }, orderBy: { type: 'asc' } }),
  ]);

  return (
    <NewCocForm
      customers={JSON.parse(JSON.stringify(customers))}
      deliveryOrders={JSON.parse(JSON.stringify(deliveryOrders))}
      workOrders={JSON.parse(JSON.stringify(workOrders))}
      employees={JSON.parse(JSON.stringify(employees))}
      machines={JSON.parse(JSON.stringify(machines))}
      uoms={JSON.parse(JSON.stringify(uoms))}
      routingProcesses={JSON.parse(JSON.stringify(routingProcesses))}
      cocTypes={JSON.parse(JSON.stringify(cocTypes))}
    />
  );
}
