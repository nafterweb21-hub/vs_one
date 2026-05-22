-- CreateTable
CREATE TABLE "FinishedGoodProfile" (
    "id" TEXT NOT NULL,
    "partNo" TEXT,
    "description" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinishedGoodProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinishedGoodProfile_partNo_key" ON "FinishedGoodProfile"("partNo");

-- CreateIndex
CREATE UNIQUE INDEX "FinishedGoodProfile_description_key" ON "FinishedGoodProfile"("description");
