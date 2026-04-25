/*
  Warnings:

  - A unique constraint covering the columns `[text_color,bg_color,border_color]` on the table `Relation_Status` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Relation_Status_text_color_bg_color_key` ON `relation_status`;

-- AlterTable
ALTER TABLE `relation_status` ADD COLUMN `border_color` CHAR(7) NULL;

-- CreateTable
CREATE TABLE `Subrelation_Status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subrelational` VARCHAR(191) NOT NULL,
    `relationsId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Main_Instagram_DataToSubrelation_Status` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Main_Instagram_DataToSubrelation_Status_AB_unique`(`A`, `B`),
    INDEX `_Main_Instagram_DataToSubrelation_Status_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Relation_Status_text_color_bg_color_border_color_key` ON `Relation_Status`(`text_color`, `bg_color`, `border_color`);

-- AddForeignKey
ALTER TABLE `Subrelation_Status` ADD CONSTRAINT `Subrelation_Status_relationsId_fkey` FOREIGN KEY (`relationsId`) REFERENCES `Relation_Status`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Main_Instagram_DataToSubrelation_Status` ADD CONSTRAINT `_Main_Instagram_DataToSubrelation_Status_A_fkey` FOREIGN KEY (`A`) REFERENCES `Main_Instagram_Data`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Main_Instagram_DataToSubrelation_Status` ADD CONSTRAINT `_Main_Instagram_DataToSubrelation_Status_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subrelation_Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
