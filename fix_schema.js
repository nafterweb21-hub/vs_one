const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Replace Employee end
schema = schema.replace(/purchaseRequisitions\s+PurchaseRequisition\[\]\r?\n\}/, 
`purchaseRequisitions   PurchaseRequisition[]
  Employee_Ncr_cpaResponsibleStaffIdToEmployee       Ncr[] @relation("Ncr_cpaResponsibleStaffIdToEmployee")
  Employee_Ncr_requestorIdToEmployee                 Ncr[] @relation("Ncr_requestorIdToEmployee")
  Employee_Ncr_responsiblePartyIdToEmployee          Ncr[] @relation("Ncr_responsiblePartyIdToEmployee")
  Employee_Ncr_rootCauseResponsibleStaffIdToEmployee Ncr[] @relation("Ncr_rootCauseResponsibleStaffIdToEmployee")
  Employee_Ncr_verifiedConfirmedByIdToEmployee       Ncr[] @relation("Ncr_verifiedConfirmedByIdToEmployee")
}`);

// Replace CustomerProfile end
schema = schema.replace(/contactPersons\s+CustomerContactPerson\[\]\r?\n\}/, 
`contactPersons CustomerContactPerson[]
  Ncr CustomerProfile_Ncr[]
}`);

// Wait! In Ncr we used `CustomerProfile CustomerProfile @relation...`
// The back relation type should just be `Ncr[]`. The field name can be anything.
// Let's use `Ncr Ncr[]` for all of them!

schema = schema.replace(/contactPersons\s+CustomerContactPerson\[\]\r?\n\}/, 
`contactPersons CustomerContactPerson[]
  Ncr Ncr[]
}`);

schema = schema.replace(/routingProcesses\s+RoutingProcess\[\]\r?\n\s*@@unique\(\[workOrderNo, description\]\)\r?\n\}/,
`routingProcesses RoutingProcess[]
  WorkOrderInProcess_Ncr Ncr[]

  @@unique([workOrderNo, description])
}`);

schema = schema.replace(/routingProcesses\s+RoutingProcess\[\]\r?\n\}/,
`routingProcesses RoutingProcess[]
  MainProcess_Ncr Ncr[]
}`);

schema = schema.replace(/productionTimesheets\s+ProductionTimesheet\[\]\r?\n\s*@@unique\(\[inProcessId, sn\]\)\r?\n\}/,
`productionTimesheets ProductionTimesheet[]
  RoutingProcess_Ncr Ncr[]

  @@unique([inProcessId, sn])
}`);

schema = schema.replace(/purchaseRequisitions\s+PurchaseRequisition\[\]\r?\n\}/,
`purchaseRequisitions PurchaseRequisition[]
  WorkOrder_Ncr Ncr[]
}`);

schema = schema.replace(/updatedAt\s+DateTime\s+@updatedAt\r?\n\}/,
`updatedAt   DateTime @updatedAt
  NcrFailureMode NcrFailureMode[]
}`);

fs.writeFileSync('prisma/schema.prisma', schema, 'utf8');
console.log('Schema fixed successfully!');
