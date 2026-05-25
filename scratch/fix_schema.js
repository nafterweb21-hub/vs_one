import fs from 'fs';

const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

// Insert inverse relations for Employee
const employeeRelations = `
  purchaseRequisitions           PurchaseRequisition[]
  purchaseOrdersAsApproval1      PurchaseOrder[] @relation("PoApproval1")
  purchaseOrdersAsApproval2      PurchaseOrder[] @relation("PoApproval2")
  purchaseOrdersAsPurchaser      PurchaseOrder[] @relation("PoPurchaser")
`;
schema = schema.replace(/(model Employee \{[\s\S]*?)(^\})/m, `$1${employeeRelations}$2`);

// Insert inverse relations for UomProfile
const uomRelations = `
  purchaseRequisitionItems       PurchaseRequisitionItem[]
  purchaseOrderItemsAsPoUom      PurchaseOrderItem[] @relation("PoUom")
  purchaseOrderItemsAsInternalUom PurchaseOrderItem[] @relation("InternalUom")
`;
schema = schema.replace(/(model UomProfile \{[\s\S]*?)(^\})/m, `$1${uomRelations}$2`);

// Insert inverse relations for CompanyProfile
const companyRelations = `
  purchaseRequisitions PurchaseRequisition[]
  purchaseOrders       PurchaseOrder[]
`;
schema = schema.replace(/(model CompanyProfile \{[\s\S]*?)(^\})/m, `$1${companyRelations}$2`);

// Insert inverse relations for SupplierProfile
const supplierRelations = `
  purchaseOrders PurchaseOrder[]
`;
schema = schema.replace(/(model SupplierProfile \{[\s\S]*?)(^\})/m, `$1${supplierRelations}$2`);

// Insert inverse relations for WorkOrder
const workOrderRelations = `
  purchaseRequisitions PurchaseRequisition[]
  purchaseOrders       PurchaseOrder[]
`;
schema = schema.replace(/(model WorkOrder \{[\s\S]*?)(^\})/m, `$1${workOrderRelations}$2`);

// Insert inverse relations for Currency
const currencyRelations = `
  purchaseOrders PurchaseOrder[]
`;
schema = schema.replace(/(model Currency \{[\s\S]*?)(^\})/m, `$1${currencyRelations}$2`);

// Insert inverse relations for TaxProfile
const taxProfileRelations = `
  purchaseOrders PurchaseOrder[]
`;
schema = schema.replace(/(model TaxProfile \{[\s\S]*?)(^\})/m, `$1${taxProfileRelations}$2`);

// Insert inverse relations for SupplierContactPerson
const supplierContactPersonRelations = `
  purchaseOrders PurchaseOrder[]
`;
schema = schema.replace(/(model SupplierContactPerson \{[\s\S]*?)(^\})/m, `$1${supplierContactPersonRelations}$2`);

// Insert inverse relations for MaterialProfile
const materialProfileRelations = `
  purchaseRequisitionItems PurchaseRequisitionItem[]
  purchaseOrderItems       PurchaseOrderItem[]
`;
schema = schema.replace(/(model MaterialProfile \{[\s\S]*?)(^\})/m, `$1${materialProfileRelations}$2`);


// Append Models
const models = `
// ==========================================
// Purchase Requisition Module
// ==========================================
model PurchaseRequisition {
  id       String   @id @default(cuid())
  prNo     String // PRYYXXXXX (e.g. PR1700003) - shared across revisions
  revision Int      @default(0) // Revision count (starts at 0)
  date     DateTime // Entry Date (default today, forward allowed, no backdate)
  status   String   @default("Draft") // Draft / Void / Submitted
  poStatus String   @default("N/A") // N/A / Partially Issued / Fully Issued / Cancelled
  remark   String?

  companyId String
  company   CompanyProfile @relation(fields: [companyId], references: [id])

  workOrderNo String?
  workOrder   WorkOrder? @relation(fields: [workOrderNo], references: [workOrderNo])

  requestedById String
  requestedBy   Employee @relation(fields: [requestedById], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  items          PurchaseRequisitionItem[]
  purchaseOrders PurchaseOrder[]

  @@unique([prNo, revision])
}

model PurchaseRequisitionItem {
  id                    String              @id @default(cuid())
  purchaseRequisitionId String
  purchaseRequisition   PurchaseRequisition @relation(fields: [purchaseRequisitionId], references: [id], onDelete: Cascade)

  fromMaterialProfile Boolean    @default(false)
  material            String? // Input material text or code
  description         String // Description (from profile or user input)
  shape               String?
  size                String?
  uomId               String
  uom                 UomProfile @relation(fields: [uomId], references: [id])

  quantity       Decimal // Decimal (2 decimals)
  cancelQuantity Decimal  @default(0) // Decimal (2 decimals)
  prQuantity     Decimal // System calculated: quantity - cancelQuantity
  deliveryDate   DateTime // Required
  remark         String?

  poQuantityIssued       Decimal @default(0) // System calculated based on issued POs
  balanceRequirePurchase Decimal // System calculated: prQuantity - poQuantityIssued

  materialProfileId String?
  materialProfile   MaterialProfile? @relation(fields: [materialProfileId], references: [id])

  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  purchaseOrderItems PurchaseOrderItem[]
}

// ==========================================
// Purchase Order Module
// ==========================================
model PurchaseOrder {
  id       String   @id @default(cuid())
  poNo     String // POYYXXXXX (e.g. PO1700003) - shared across revisions
  revision Int      @default(0)
  date     DateTime

  companyId String
  company   CompanyProfile @relation(fields: [companyId], references: [id])

  supplierId String
  supplier   SupplierProfile @relation(fields: [supplierId], references: [id])

  workOrderNo String?
  workOrder   WorkOrder? @relation(fields: [workOrderNo], references: [workOrderNo])

  purchaseRequisitionId String?
  purchaseRequisition   PurchaseRequisition? @relation(fields: [purchaseRequisitionId], references: [id])

  currencyId   String
  currency     Currency @relation(fields: [currencyId], references: [id])
  exchangeRate Decimal

  taxTypeId String
  taxType   TaxProfile @relation(fields: [taxTypeId], references: [id])
  taxRate   Float

  amountBeforeTax Decimal
  taxAmount       Decimal
  amountAfterTax  Decimal

  millCertificate   Boolean @default(false)
  certOfConformance Boolean @default(false)

  contactPersonId String
  contactPerson   SupplierContactPerson @relation(fields: [contactPersonId], references: [id])
  telNo           String?
  faxNo           String?
  mobileNo        String?
  email           String

  approval1ById String?
  approval1By   Employee? @relation("PoApproval1", fields: [approval1ById], references: [id])
  approval1Date DateTime?

  approval2ById String?
  approval2By   Employee? @relation("PoApproval2", fields: [approval2ById], references: [id])
  approval2Date DateTime?

  receiveStatus String @default("NA")

  purchaserId String
  purchaser   Employee @relation("PoPurchaser", fields: [purchaserId], references: [id])

  remark String?
  status String  @default("Draft")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  items PurchaseOrderItem[]

  @@unique([poNo, revision])
}

model PurchaseOrderItem {
  id              String        @id @default(cuid())
  purchaseOrderId String
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)

  fromMaterialProfile Boolean @default(false)
  material            String?
  description         String
  supplierMaterialNo  String?
  shape               String?
  size                String?

  quantity Decimal

  poUomId String
  poUom   UomProfile @relation("PoUom", fields: [poUomId], references: [id])

  unitPrice Decimal
  amount    Decimal

  conversion Decimal @default(1)

  internalUomId String?
  internalUom   UomProfile? @relation("InternalUom", fields: [internalUomId], references: [id])

  internalQuantity Decimal

  totalReceived Decimal @default(0)
  totalReturned Decimal @default(0)
  nettReceived  Decimal @default(0)

  deliveryDate DateTime
  remark       String?

  materialProfileId String?
  materialProfile   MaterialProfile? @relation(fields: [materialProfileId], references: [id])

  purchaseRequisitionItemId String?
  purchaseRequisitionItem   PurchaseRequisitionItem? @relation(fields: [purchaseRequisitionItemId], references: [id])

  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

schema += models;

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Schema updated successfully');
