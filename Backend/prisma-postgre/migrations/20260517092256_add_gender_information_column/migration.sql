/*
  Warnings:

  - A unique constraint covering the columns `[subrelational,relationsId]` on the table `Subrelation_Status` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Main_Instagram_Data" ADD COLUMN     "gender" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subrelation_Status_subrelational_relationsId_key" ON "Subrelation_Status"("subrelational", "relationsId");
