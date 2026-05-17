/*
  Warnings:

  - Made the column `border_color` on table `Relation_Status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `relationsId` on table `Subrelation_Status` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subrelation_Status" DROP CONSTRAINT "Subrelation_Status_relationsId_fkey";

-- AlterTable
ALTER TABLE "Relation_Status" ALTER COLUMN "border_color" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subrelation_Status" ALTER COLUMN "relationsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Subrelation_Status" ADD CONSTRAINT "Subrelation_Status_relationsId_fkey" FOREIGN KEY ("relationsId") REFERENCES "Relation_Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
