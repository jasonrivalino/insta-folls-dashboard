/*
  Warnings:

  - Made the column `border_color` on table `relation_status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `relationsId` on table `subrelation_status` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `subrelation_status` DROP FOREIGN KEY `Subrelation_Status_relationsId_fkey`;

-- DropIndex
DROP INDEX `Subrelation_Status_relationsId_fkey` ON `subrelation_status`;

-- AlterTable
ALTER TABLE `relation_status` MODIFY `border_color` CHAR(7) NOT NULL;

-- AlterTable
ALTER TABLE `subrelation_status` MODIFY `relationsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Subrelation_Status` ADD CONSTRAINT `Subrelation_Status_relationsId_fkey` FOREIGN KEY (`relationsId`) REFERENCES `Relation_Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
