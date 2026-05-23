-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApprovalLevelProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "module" TEXT NOT NULL,
    "actionButton" TEXT,
    "minRange" DECIMAL,
    "maxRange" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApprovalPerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "approvalLevelProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApprovalPerson_approvalLevelProfileId_fkey" FOREIGN KEY ("approvalLevelProfileId") REFERENCES "ApprovalLevelProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApprovalPerson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "processParameterWeldingId" TEXT,
    CONSTRAINT "MaterialType_processParameterWeldingId_fkey" FOREIGN KEY ("processParameterWeldingId") REFERENCES "ProcessParameterWelding" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exchangeRate" DECIMAL NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nricFin" TEXT NOT NULL,
    "designation" TEXT,
    "email" TEXT NOT NULL,
    "mobileNo" TEXT,
    "gender" TEXT,
    "contactNo" TEXT,
    "employmentType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TaxProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taxType" TEXT NOT NULL,
    "taxRate" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerCode" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CustomerContactPerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "telNo" TEXT,
    "mobileNo" TEXT,
    "faxNo" TEXT,
    "email" TEXT,
    "designation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomerContactPerson_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MaterialProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partNo" TEXT,
    "description" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "size" TEXT,
    "categoryId" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MaterialProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MaterialCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeldingTypeProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "processParameterWeldingId" TEXT,
    CONSTRAINT "WeldingTypeProfile_processParameterWeldingId_fkey" FOREIGN KEY ("processParameterWeldingId") REFERENCES "ProcessParameterWelding" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaintingMethodProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "method" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MainProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "process" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProcessProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mainProcessId" TEXT NOT NULL,
    "routingProcess" TEXT NOT NULL,
    "welding" BOOLEAN NOT NULL DEFAULT false,
    "sprayPainting" BOOLEAN NOT NULL DEFAULT false,
    "machining" BOOLEAN NOT NULL DEFAULT false,
    "costPerMinute" DECIMAL NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessProfile_mainProcessId_fkey" FOREIGN KEY ("mainProcessId") REFERENCES "MainProcess" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupplierProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierCode" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierContactPerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "telNo" TEXT,
    "mobileNo" TEXT,
    "faxNo" TEXT,
    "email" TEXT,
    "designation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupplierContactPerson_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupplierAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupplierAddress_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinishedGoodProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partNo" TEXT,
    "description" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UomProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uomName" TEXT NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ElcometerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serialNo" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MachineProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "machineCode" TEXT NOT NULL,
    "machineNo" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "current" TEXT,
    "serialNo" TEXT,
    "machineType" TEXT,
    "operationType" TEXT,
    "remark" TEXT,
    "uploadUrl" TEXT,
    "machineCategory" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PaymentTermProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SalesOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNo" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "date" DATETIME NOT NULL,
    "salespersonId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerPoRef" TEXT,
    "projectCode" TEXT,
    "paymentTermId" TEXT NOT NULL,
    "otherPaymentDetail" TEXT,
    "refContract" TEXT,
    "currencyId" TEXT NOT NULL,
    "exchangeRate" DECIMAL NOT NULL,
    "amountBeforeTax" DECIMAL NOT NULL,
    "taxTypeId" TEXT,
    "taxRate" REAL,
    "taxAmount" DECIMAL,
    "amountAfterTax" DECIMAL NOT NULL,
    "contactPersonId" TEXT,
    "fax" TEXT,
    "tel" TEXT,
    "email" TEXT,
    "deliverToId" TEXT,
    "billToId" TEXT,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "uploadUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SalesOrder_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "PaymentTermProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_taxTypeId_fkey" FOREIGN KEY ("taxTypeId") REFERENCES "TaxProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "CustomerContactPerson" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_deliverToId_fkey" FOREIGN KEY ("deliverToId") REFERENCES "CustomerAddress" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES "CustomerAddress" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesOrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "salesOrderId" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL NOT NULL DEFAULT 0,
    "uomId" TEXT NOT NULL,
    "internalQuotationNo" TEXT NOT NULL,
    "vendorMaterialNo" TEXT,
    "materialSpecification" TEXT,
    "estimateNo" TEXT,
    "remark" TEXT,
    "uploadUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SalesOrderItem_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SalesOrderItem_partId_fkey" FOREIGN KEY ("partId") REFERENCES "FinishedGoodProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesOrderItem_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "UomProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesOrderItemBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "salesOrderItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "workOrderNo" TEXT,
    "remark" TEXT,
    "noRoutingProcess" BOOLEAN NOT NULL DEFAULT false,
    "uploadUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SalesOrderItemBatch_salesOrderItemId_fkey" FOREIGN KEY ("salesOrderItemId") REFERENCES "SalesOrderItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JointProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "joint" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FailureModeProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "failureMode" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "workOrderNo" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "customerId" TEXT NOT NULL,
    "internalQuotationNo" TEXT,
    "customerPoRef" TEXT,
    "projectCode" TEXT,
    "deliveryDate" DATETIME,
    "jobDescription" TEXT,
    "quantity" DECIMAL,
    "uom" TEXT,
    "amount" DECIMAL,
    "remark" TEXT,
    "qcAcceptance" TEXT,
    "qcById" TEXT,
    "qcDate" DATETIME,
    "labelExpiryDate" DATETIME,
    "labelQty" DECIMAL,
    "labelUomId" TEXT,
    "uploadUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkOrder_qcById_fkey" FOREIGN KEY ("qcById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WorkOrder_labelUomId_fkey" FOREIGN KEY ("labelUomId") REFERENCES "UomProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkOrderInProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workOrderNo" TEXT NOT NULL,
    "sn" INTEGER,
    "description" TEXT NOT NULL,
    "conditionalSnId" TEXT,
    "allFlag" BOOLEAN NOT NULL DEFAULT false,
    "targetCompletionDate" DATETIME NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "uploadUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkOrderInProcess_workOrderNo_fkey" FOREIGN KEY ("workOrderNo") REFERENCES "WorkOrder" ("workOrderNo") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkOrderInProcess_conditionalSnId_fkey" FOREIGN KEY ("conditionalSnId") REFERENCES "WorkOrderInProcess" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoutingProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inProcessId" TEXT NOT NULL,
    "sn" TEXT NOT NULL,
    "mainProcessId" TEXT,
    "routingProcessId" TEXT,
    "targetCompletionDate" DATETIME NOT NULL,
    "fullyReceived" BOOLEAN NOT NULL DEFAULT false,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "uploadUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RoutingProcess_inProcessId_fkey" FOREIGN KEY ("inProcessId") REFERENCES "WorkOrderInProcess" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoutingProcess_mainProcessId_fkey" FOREIGN KEY ("mainProcessId") REFERENCES "MainProcess" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RoutingProcess_routingProcessId_fkey" FOREIGN KEY ("routingProcessId") REFERENCES "ProcessProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionTimesheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routingProcessId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "timeIn" DATETIME,
    "timeOut" DATETIME,
    "totalMinutes" DECIMAL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedQty" DECIMAL,
    "machineCodes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductionTimesheet_routingProcessId_fkey" FOREIGN KEY ("routingProcessId") REFERENCES "RoutingProcess" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductionTimesheet_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessParameterWelding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timesheetId" TEXT NOT NULL,
    "weldingMachineId" TEXT,
    "typeOfJointId" TEXT,
    "electrodeType" TEXT,
    "weldingPosition" TEXT,
    "weldingJoint" DECIMAL,
    "weldingSizeMm" DECIMAL,
    "voltageVolts" DECIMAL,
    "currentAmp" DECIMAL,
    "coolingTimeMins" DECIMAL,
    "preHeatingC" DECIMAL,
    "postHeatingC" DECIMAL,
    "heatTreatmentHrc" DECIMAL,
    "remark" TEXT,
    "status" TEXT,
    "confirmedById" TEXT,
    "confirmedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessParameterWelding_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "ProductionTimesheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessParameterWelding_weldingMachineId_fkey" FOREIGN KEY ("weldingMachineId") REFERENCES "MachineProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessParameterWelding_typeOfJointId_fkey" FOREIGN KEY ("typeOfJointId") REFERENCES "JointProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessParameterWelding_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessParameterSprayPainting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timesheetId" TEXT NOT NULL,
    "paintTankPressurePsi" DECIMAL NOT NULL,
    "sprayNozzleSize" DECIMAL NOT NULL,
    "typeOfPaint" TEXT NOT NULL,
    "remark" TEXT,
    "surfaceStartDatetime" DATETIME,
    "surfaceEndDatetime" DATETIME,
    "surfaceGeneralWeather" TEXT,
    "surfaceEnvTemperature" TEXT,
    "surfaceRelativeHumidity" TEXT,
    "surfaceAbrasiveType" TEXT,
    "surfaceSandpaperGrit" TEXT,
    "primerStartDatetime" DATETIME,
    "primerEndDatetime" DATETIME,
    "primerGeneralWeather" TEXT,
    "primerEnvTemperature" TEXT,
    "primerRelativeHumidity" TEXT,
    "primerPaintBatchNo" TEXT,
    "primerExpiryDate" DATETIME,
    "primerDftMeasurement" TEXT,
    "topcoatStartDatetime" DATETIME,
    "topcoatEndDatetime" DATETIME,
    "topcoatGeneralWeather" TEXT,
    "topcoatEnvTemperature" TEXT,
    "topcoatRelativeHumidity" TEXT,
    "topcoatAbrasiveType" TEXT,
    "topcoatSandpaperGrit" TEXT,
    "topcoatStartDatetime2" DATETIME,
    "topcoatEndDatetime2" DATETIME,
    "topcoatGeneralWeather2" TEXT,
    "topcoatEnvTemperature2" TEXT,
    "topcoatRelativeHumidity2" TEXT,
    "topcoatPaintBatchNo" TEXT,
    "topcoatExpiryDate" DATETIME,
    "topcoatDftMeasurement" TEXT,
    "topcoatAdhesiveTestResult" TEXT,
    "additionalRemark" TEXT,
    "status" TEXT,
    "elcometerName" TEXT,
    "elcometerSerialNoId" TEXT,
    "confirmedById" TEXT,
    "confirmedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessParameterSprayPainting_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "ProductionTimesheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessParameterSprayPainting_elcometerSerialNoId_fkey" FOREIGN KEY ("elcometerSerialNoId") REFERENCES "ElcometerProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessParameterSprayPainting_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessParameterMachining" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timesheetId" TEXT NOT NULL,
    "machineSerialNoId" TEXT NOT NULL,
    "cncProgramNo" TEXT,
    "testRun" TEXT,
    "specialTooling" TEXT,
    "partRuntimeHr" DECIMAL,
    "partRuntimeMins" DECIMAL,
    "remark" TEXT,
    "status" TEXT,
    "confirmedById" TEXT,
    "confirmedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessParameterMachining_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "ProductionTimesheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessParameterMachining_machineSerialNoId_fkey" FOREIGN KEY ("machineSerialNoId") REFERENCES "MachineProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessParameterMachining_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MachiningToolList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "machiningParamId" TEXT NOT NULL,
    "toolValue" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MachiningToolList_machiningParamId_fkey" FOREIGN KEY ("machiningParamId") REFERENCES "ProcessParameterMachining" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "faxNo" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "rocNo" TEXT,
    "gstRegistrationNo" TEXT NOT NULL,
    "uploadUrl" TEXT NOT NULL,
    "logoName" TEXT NOT NULL,
    "footerName" TEXT NOT NULL,
    "allowPoForWo" BOOLEAN NOT NULL DEFAULT false,
    "as9100RequirementNote" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalPerson_approvalLevelProfileId_userId_key" ON "ApprovalPerson"("approvalLevelProfileId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialType_type_key" ON "MaterialType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_name_key" ON "Currency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_code_key" ON "Employee"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_nricFin_key" ON "Employee"("nricFin");

-- CreateIndex
CREATE UNIQUE INDEX "TaxProfile_taxType_key" ON "TaxProfile"("taxType");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_customerCode_key" ON "CustomerProfile"("customerCode");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_customerName_key" ON "CustomerProfile"("customerName");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialCategory_name_key" ON "MaterialCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialProfile_partNo_key" ON "MaterialProfile"("partNo");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialProfile_description_key" ON "MaterialProfile"("description");

-- CreateIndex
CREATE UNIQUE INDEX "WeldingTypeProfile_type_key" ON "WeldingTypeProfile"("type");

-- CreateIndex
CREATE UNIQUE INDEX "PaintingMethodProfile_method_key" ON "PaintingMethodProfile"("method");

-- CreateIndex
CREATE UNIQUE INDEX "MainProcess_process_key" ON "MainProcess"("process");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessProfile_routingProcess_key" ON "ProcessProfile"("routingProcess");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_supplierCode_key" ON "SupplierProfile"("supplierCode");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_supplierName_key" ON "SupplierProfile"("supplierName");

-- CreateIndex
CREATE UNIQUE INDEX "FinishedGoodProfile_partNo_key" ON "FinishedGoodProfile"("partNo");

-- CreateIndex
CREATE UNIQUE INDEX "FinishedGoodProfile_description_key" ON "FinishedGoodProfile"("description");

-- CreateIndex
CREATE UNIQUE INDEX "UomProfile_uomName_key" ON "UomProfile"("uomName");

-- CreateIndex
CREATE UNIQUE INDEX "ElcometerProfile_serialNo_key" ON "ElcometerProfile"("serialNo");

-- CreateIndex
CREATE UNIQUE INDEX "MachineProfile_machineCode_key" ON "MachineProfile"("machineCode");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTermProfile_name_key" ON "PaymentTermProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SalesOrder_orderNo_key" ON "SalesOrder"("orderNo");

-- CreateIndex
CREATE UNIQUE INDEX "JointProfile_joint_key" ON "JointProfile"("joint");

-- CreateIndex
CREATE UNIQUE INDEX "FailureModeProfile_failureMode_key" ON "FailureModeProfile"("failureMode");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrderInProcess_workOrderNo_description_key" ON "WorkOrderInProcess"("workOrderNo", "description");

-- CreateIndex
CREATE UNIQUE INDEX "RoutingProcess_inProcessId_sn_key" ON "RoutingProcess"("inProcessId", "sn");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessParameterWelding_timesheetId_key" ON "ProcessParameterWelding"("timesheetId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessParameterSprayPainting_timesheetId_key" ON "ProcessParameterSprayPainting"("timesheetId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessParameterMachining_timesheetId_key" ON "ProcessParameterMachining"("timesheetId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_companyName_key" ON "CompanyProfile"("companyName");
